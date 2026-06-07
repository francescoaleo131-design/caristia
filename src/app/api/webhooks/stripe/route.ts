import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe';
import { createClient } from '@supabase/supabase-js';
import { generateSecureGiftCode } from '@/lib/utils/giftcard-utils';
import { LoopsClient } from 'loops'; // 👈 Importa l'SDK ufficiale

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY;

// Protezione di sicurezza per evitare crash durante il comando "npm run build" su Vercel
if (!supabaseUrl || !supabaseServiceKey) {
  console.warn("⚠️ Attenzione: Variabili d'ambiente Supabase mancanti durante la build.");
}

const supabaseAdmin = createClient(
  supabaseUrl || 'https://placeholder-url.supabase.co',
  supabaseServiceKey || 'placeholder-key'
);

// Inizializzazione del client Loops con fallback per evitare blocchi in fase di build
const loops = new LoopsClient(process.env.LOOPS_API_KEY?.trim() || 'placeholder-key');

// ID Modelli Transazionali di Loops
const LOOPS_GIFT_TEMPLATE_ID = 'cmpd289y200do0jzntezank2n'; // ID per Gift Card
const LOOPS_SHOP_TEMPLATE_ID = 'cmobxq8sk01a6015v4az96aze'; // ID transazionale per lo Shop

export async function POST(req: Request) {
  const body = await req.text(); 
  
  const headersList = await headers();
  const signature = headersList.get('stripe-signature') as string;

  let event;

  try {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret!);
    console.log("✅ Webhook verificato con successo!");
  } catch (err: any) {
    console.error(`❌ Errore firma: ${err.message}`);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  const session = (event.data.object || {}) as any;

  if (event.type === 'checkout.session.completed') {
    const metadata = session.metadata;
    const customerEmail = session.customer_details?.email;
    const customerName = session.customer_details?.name;
    
    console.log("🔍 [DEBUG WEBHOOK] Metadata ricevuti da Stripe:", metadata);
    console.log("🔍 [DEBUG WEBHOOK] Valore di metadata.type:", metadata?.type);
    console.log("🔍 [DEBUG WEBHOOK] Verifica LOOPS_API_KEY presente?:", !!process.env.LOOPS_API_KEY);
    
    // ----------------------------------------------------
    // CASO A: ACQUISTO PRODOTTI SHOP (shop_order)
    // ----------------------------------------------------
    if (metadata?.type === 'shop_order') {
      console.log('📦 Processing order for:', customerEmail);
      
      let dbSuccess = false;
      const userId = metadata.user_id;

      try {
        const items = JSON.parse(metadata.items || '[]');
        
        // 1. SALVATAGGIO DELL'ORDINE
        const { error: orderError } = await supabaseAdmin
          .from('orders')
          .insert([
            {
              stripe_session_id: session.id,
              customer_email: customerEmail,
              items: items,
              total_amount: session.amount_total / 100, 
              status: 'paid',
            },
          ]);
          
        if (orderError) throw orderError;
        console.log('✅ Order saved successfully');

        // 2. GESTIONE SCALO SALDO PORTAFOGLIO UTENTE
        const creditoDaScalare = parseFloat(metadata.credito_portafoglio_usato || '0');

        if (userId && creditoDaScalare > 0) {
          console.log(`👤 Rilevato uso portafoglio per utente: ${userId}, importo da scalare: €${creditoDaScalare}`);

          const { data: profile, error: profileFetchError } = await supabaseAdmin
            .from('profiles')
            .select('gift_card_balance')
            .eq('id', userId)
            .single();

          if (profileFetchError || !profile) {
            console.error(`❌ Impossibile trovare il profilo dell'utente ${userId}:`, profileFetchError?.message);
          } else {
            const nuovoSaldo = Math.max(0, profile.gift_card_balance - creditoDaScalare);

            const { error: profileUpdateError } = await supabaseAdmin
              .from('profiles')
              .update({ gift_card_balance: nuovoSaldo })
              .eq('id', userId);

            if (profileUpdateError) {
              console.error(`❌ Errore aggiornamento saldo portafoglio:`, profileUpdateError.message);
            } else {
              console.log(`✅ Portafoglio utente aggiornato. Nuovo saldo: €${nuovoSaldo}`);
            }
          }
        }

        // 3. SVUOTA IL CARRELLO DELL'UTENTE DA SUPABASE (cart_items al plurale)
        if (userId) {
          const { error: clearCartError } = await supabaseAdmin
            .from('cart_items')
            .delete()
            .eq('user_id', userId);

          if (clearCartError) {
            console.error(`❌ Errore svuotamento carrello per utente ${userId}:`, clearCartError.message);
          } else {
            console.log(`🗑️ Carrello svuotato con successo dal DB per l'utente ${userId}`);
          }
        }

        dbSuccess = true;

      } catch (dbError: any) {
        console.error('❌ Errore reale Database (ordini/carrello):', dbError.message);
        return NextResponse.json({ error: 'Database error' }, { status: 500 });
      }

      // 4. INVIO EMAIL TRANSAZIONALE CONFERMA ACQUISTO SHOP VIA SDK
      if (dbSuccess && process.env.LOOPS_API_KEY && customerEmail) {
        console.log(`🚀 Invio email transazionale Shop a: ${customerEmail}`);
        
        try {
          const resp = await loops.sendTransactionalEmail({
            email: customerEmail,
            transactionalId: LOOPS_SHOP_TEMPLATE_ID,
            dataVariables: {
              customerName: customerName || 'Cliente',
              amount: `€${(session.amount_total / 100).toFixed(2)}`,
              orderId: session.id
            },
          });

          if (resp.success) {
            console.log(`✉️ Email conferma ordine inviata con successo via SDK a ${customerEmail}`);
          } else {
            console.error(`❌ Loops ha rifiutato l'invio dell'email transazionale:`, resp);
          }
        } catch (loopsFetchError: any) {
          console.error(`❌ Errore SDK Loops (Shop Transazionale):`, loopsFetchError.message || loopsFetchError);
        }
      } else if (!process.env.LOOPS_API_KEY) {
        console.warn('⚠️ LOOPS_API_KEY non configurata su Vercel. Salto la notifica.');
      }
    }
    
    // ----------------------------------------------------
    // CASO B: ACQUISTO GIFT CARD (giftcard_purchase)
    // ----------------------------------------------------
    else if (metadata?.type === 'giftcard_purchase') {
      console.log('🎁 Processing gift card purchase for:', customerEmail);

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
              initial_amount: amount,
              current_amount: amount,
              is_active: true,
              buyer_email: customerEmail,
              recipient_email: metadata.recipient_email || customerEmail,
              stripe_session_id: session.id,
              qr_code_url: qrCodeUrl
            }
          ]);

        if (giftCardError) throw giftCardError;
        console.log('✅ Gift card saved and activated in DB');
        dbGiftSuccess = true;

      } catch (dbError: any) {
        console.error('❌ Database error (giftcard_purchase):', dbError.message);
        return NextResponse.json({ error: 'Database error' }, { status: 500 });
      }

      // 5. INVIO EMAIL TRANSAZIONALE GIFT CARD VIA SDK
      if (dbGiftSuccess && process.env.LOOPS_API_KEY) {
        const targetEmail = metadata.recipient_email || customerEmail;
        console.log(`🚀 Invio email transazionale Gift Card a: ${targetEmail}`);
        
        try {
          const resp = await loops.sendTransactionalEmail({
            email: targetEmail,
            transactionalId: LOOPS_GIFT_TEMPLATE_ID,
            dataVariables: {
              giftCode: giftCode,
              amount: `€${amount.toFixed(2)}`,
              qrCodeUrl: qrCodeUrl,
              buyerName: metadata.buyer_name || 'Un amico',
              message: metadata.gift_message || ''
            },
          });

          if (resp.success) {
            console.log(`✉️ Email Gift Card inviata con successo via SDK a ${targetEmail}`);
          } else {
            console.error(`❌ Errore risposta SDK Loops Gift Card:`, resp);
          }
        } catch (loopsGiftError: any) {
          console.error(`❌ Errore SDK Loops (Gift Card):`, loopsGiftError.message || loopsGiftError);
        }
      }
    }
  }

  return NextResponse.json({ received: true }, { status: 200 });
}