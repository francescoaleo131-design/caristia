import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe';
import { createClient } from '@supabase/supabase-js';
import { generateSecureGiftCode } from '@/lib/utils/giftcard-utils';
import { LoopsClient } from 'loops';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn("⚠️ Attenzione: Variabili d'ambiente Supabase mancanti durante la build.");
}

const supabaseAdmin = createClient(
  supabaseUrl || 'https://placeholder-url.supabase.co',
  supabaseServiceKey || 'placeholder-key'
);

const loops = new LoopsClient(process.env.LOOPS_API_KEY?.trim() || 'placeholder-key');
const LOOPS_GIFT_TEMPLATE_ID = 'cmpd289y200do0jzntezank2n'; 
const LOOPS_SHOP_TEMPLATE_ID = 'cmobxq8sk01a6015v4az96aze'; 
const LOOPS_FAILED_TEMPLATE_ID = 'cmpviptqb00mc0j2nmvav7vt1'; 
const LOOPS_WISHLIST_TEMPLATE_ID = 'cmw_placeholder_wishlist_id'; // 🚀 Sostituisci questo ID con il tuo reale template Loops se vuoi inviare mail per le liste

export async function POST(req: Request) {
  const headersList = await headers();
  const signature = headersList.get('stripe-signature') || headersList.get('Stripe-Signature');

  if (!signature) {
    console.error("❌ Errore Webhook: Manca l'header stripe-signature.");
    return NextResponse.json({ error: 'Firma mancante' }, { status: 400 });
  }

  let event;
  try {
    const arrayBuffer = await req.arrayBuffer();
    const rawBody = Buffer.from(arrayBuffer);
    
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret!);
    console.log(`✅ Webhook verificato con successo! Evento: ${event.type}`);
  } catch (err: any) {
    console.error(`❌ Errore firma Webhook: ${err.message}`);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  const session = (event.data.object || {}) as any;

  // ----------------------------------------------------
  // GESTIONE PAGAMENTO RIUSCITO (checkout.session.completed)
  // ----------------------------------------------------
  if (event.type === 'checkout.session.completed') {
    const metadata = session.metadata;
    const customerEmail = session.customer_details?.email;
    const customerName = session.customer_details?.name;

    // CASO A: ACQUISTO PRODOTTI SHOP (shop_order)
    if (metadata?.type === 'shop_order') {
      console.log('📦 Processing order for:', customerEmail);
      let dbSuccess = false;
      const userId = metadata.user_id;

      const shippingDetails = session.shipping_details;
      const billingDetails = session.customer_details;
      let formattedAddress = null;

      if (shippingDetails && shippingDetails.address?.line1) {
        const { line1, line2, city, postal_code, state, country } = shippingDetails.address;
        const streetInfo = line2 ? `${line1} - ${line2}` : line1;
        formattedAddress = `${streetInfo}, ${postal_code || ''} ${city || ''} (${state || country || ''})`;
      } else if (billingDetails && billingDetails.address?.line1) {
        const { line1, line2, city, postal_code, state, country } = billingDetails.address;
        const streetInfo = line2 ? `${line1} - ${line2}` : line1;
        formattedAddress = `${streetInfo}, ${postal_code || ''} ${city || ''} (${state || country || ''}) [Fatturazione]`;
      } else {
        formattedAddress = "Ritiro in negozio / Indirizzo non fornito";
      }

      try {
        const items = JSON.parse(metadata.items || '[]');
        const { error: orderError } = await supabaseAdmin
          .from('orders')
          .insert([
            {
              stripe_session_id: session.id,
              customer_email: customerEmail,
              customer_name: customerName || null, 
              shipping_address: formattedAddress,  
              items: items,
              total_amount: session.amount_total / 100, 
              status: 'paid',
            },
          ]);

        if (orderError) throw orderError;

        const creditoDaScalare = parseFloat(metadata.credito_portafoglio_usato || '0');
        if (userId && creditoDaScalare > 0) {
          const { data: profile, error: profileFetchError } = await supabaseAdmin
            .from('profiles')
            .select('gift_card_balance')
            .eq('id', userId)
            .single();

          if (!profileFetchError && profile) {
            const nuovoSaldo = Math.max(0, profile.gift_card_balance - creditoDaScalare);
            await supabaseAdmin
              .from('profiles')
              .update({ gift_card_balance: nuovoSaldo })
              .eq('id', userId);
          }
        }

        if (userId) {
          await supabaseAdmin
            .from('cart_items')
            .delete()
            .eq('user_id', userId);
        }

        dbSuccess = true;
      } catch (dbError: any) {
        console.error('❌ Errore reale Database (ordini/carrello):', dbError.message);
        return NextResponse.json({ error: 'Database error' }, { status: 500 });
      }

      if (dbSuccess && process.env.LOOPS_API_KEY && customerEmail) {
        try {
          await loops.sendTransactionalEmail({
            email: customerEmail,
            transactionalId: LOOPS_SHOP_TEMPLATE_ID,
            dataVariables: {
              customerName: customerName || 'Cliente',
              amount: `€${(session.amount_total / 100).toFixed(2)}`,
              orderId: session.id
            },
          });
        } catch (loopsFetchError: any) {
          console.error(`❌ Errore SDK Loops (Shop Transazionale):`, loopsFetchError.message || loopsFetchError);
        }
      }
    }
    
    // CASO B: ACQUISTO GIFT CARD (giftcard_purchase)
    else if (metadata?.type === 'giftcard_purchase') {
      let dbGiftSuccess = false;
      const amount = session.amount_total / 100;
      const giftCode = generateSecureGiftCode();
      const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(giftCode)}`;

      try {
        const { error: giftCardError } = await supabaseAdmin
          .from('gift_cards')
          .insert([
            {
              code: giftCode,
              initial_balance: amount,
              current_balance: amount,
              is_active: true,
              buyer_email: customerEmail,
              activated_at: new Date().toISOString(),
              recipient_email: metadata.recipient_email || customerEmail,
              stripe_session_id: session.id,
              qr_code_url: qrCodeUrl
            }
          ]);

        if (giftCardError) throw giftCardError;
        dbGiftSuccess = true;

      } catch (dbError: any) {
        console.error('❌ Database error (giftcard_purchase):', dbError.message);
        return NextResponse.json({ error: 'Database error' }, { status: 500 });
      }

      if (dbGiftSuccess && process.env.LOOPS_API_KEY) {
        const targetEmail = metadata.recipient_email || customerEmail;
        try {
          await loops.sendTransactionalEmail({
            email: targetEmail,
            transactionalId: LOOPS_GIFT_TEMPLATE_ID,
            dataVariables: {
              giftCode: giftCode,
              amount: `€${amount.toFixed(2)}`,
              qrCodeUrl: qrCodeUrl,
              buyerName: metadata.buyer_name || 'Un amico',
              giftMessage: metadata.gift_message || 'Ecco un regalo per te!' 
            },
          });
          console.log(`✅ Gift Card ${giftCode} creata e mail inviata a ${targetEmail}`);
        } catch (loopsGiftError: any) {
          console.error(`❌ Errore SDK Loops (Gift Card):`, loopsGiftError.message || loopsGiftError);
        }
      }
    }

    // 🚀 CASO C: NUOVO! INSERIMENTO CONTRIBUTO SALVADANAIO WISHLIST (wishlist_contribution)
    else if (metadata?.type === 'wishlist_contribution') {
      console.log('💰 Elaborazione Quota Salvadanaio per Wishlist ID:', metadata.wishlist_id);
      let dbWishlistSuccess = false;
      const amount = parseFloat(metadata.amount_contributed || '0');

      try {
        const { error: wishlistInsertError } = await supabaseAdmin
          .from('wishlist_contributions')
          .insert([
            {
              wishlist_id: metadata.wishlist_id,
              amount: amount,
              customer_name: metadata.customer_name,
              customer_message: metadata.customer_message || null,
            }
          ]);

        if (wishlistInsertError) throw wishlistInsertError;
        dbWishlistSuccess = true;
        console.log(`✅ Quota di €${amount} salvata nel DB per l'invitato: ${metadata.customer_name}`);

      } catch (dbError: any) {
        console.error('❌ Errore salvataggio quota su Supabase:', dbError.message);
        return NextResponse.json({ error: 'Database error' }, { status: 500 });
      }

      // Invio email transazionale facoltativa all'invitato tramite Loops
      if (dbWishlistSuccess && process.env.LOOPS_API_KEY && customerEmail && LOOPS_WISHLIST_TEMPLATE_ID !== 'cmw_placeholder_wishlist_id') {
        try {
          await loops.sendTransactionalEmail({
            email: customerEmail,
            transactionalId: LOOPS_WISHLIST_TEMPLATE_ID,
            dataVariables: {
              customerName: metadata.customer_name || 'Invitato',
              amount: `€${amount.toFixed(2)}`,
              message: metadata.customer_message || 'Auguri!'
            },
          });
        } catch (loopsWishlistError: any) {
          console.error(`❌ Errore SDK Loops (Wishlist Transazionale):`, loopsWishlistError.message || loopsWishlistError);
        }
      }
    }
  }

  // ----------------------------------------------------
  // GESTIONE PAGAMENTO FALLITO (charge.failed)
  // ----------------------------------------------------
  else if (event.type === 'charge.failed') {
    const customerEmail = session.billing_details?.email || session.customer;
    const customerName = session.billing_details?.name || 'Cliente';
    const amountFormatted = `€${(session.amount / 100).toFixed(2)}`;
    const orderId = session.payment_intent || session.id;

    if (customerEmail && process.env.LOOPS_API_KEY) {
      let motivoItaliano = "Errore generico o transazione rifiutata dal circuito bancario.";
      
      const failureCode = session.failure_code;
      const failureMessage = session.failure_message;

      if (failureCode === 'insufficient_funds') {
        motivoItaliano = "Fondi insufficienti sulla carta utilizzata.";
      } else if (failureCode === 'expired_card') {
        motivoItaliano = "La carta di credito o debito inserita risulta scaduta.";
      } else if (failureCode === 'incorrect_cvc') {
        motivoItaliano = "Il codice di sicurezza a 3 cifre (CVC/CVV) sul retro della carta non è corretto.";
      } else if (failureCode === 'incorrect_number') {
        motivoItaliano = "Il numero di carta inserito non è corretto.";
      } else if (failureCode === 'card_declined') {
        motivoItaliano = "La transazione è stata rifiutata direttamente dalla tua banca. Controlla i limites della carta.";
      } else if (failureMessage) {
        motivoItaliano = failureMessage; 
      }

      try {
        console.log(`⚠️ Rilevato pagamento fallito per ${customerEmail}. Motivo: ${motivoItaliano}`);
        
        await loops.sendTransactionalEmail({
          email: customerEmail,
          transactionalId: LOOPS_FAILED_TEMPLATE_ID,
          dataVariables: {
            customerName: customerName,
            amount: amountFormatted,
            orderId: orderId,
            motivoErrore: motivoItaliano 
          },
        });
        
        console.log(`✉️ Email di notifica pagamento fallito inviata con successo a ${customerEmail}`);
      } catch (loopsFailedError: any) {
        console.error(`❌ Errore SDK Loops durante l'invio del pagamento fallito:`, loopsFailedError.message || loopsFailedError);
      }
    }
  }

  return NextResponse.json({ received: true }, { status: 200 });
}