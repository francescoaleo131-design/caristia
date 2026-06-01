import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe';
import { createClient } from '@supabase/supabase-js';
import { generateSecureGiftCode } from '@/lib/utils/giftcard-utils'; // Assicurati che il path sia corretto

// Supabase admin client
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY! // Cambiato in SERVICE_ROLE_KEY per sicurezza backend
);

const LOOPS_TEMPLATE_ID = 'cmpd289y200do0jzntezank2n';

export async function POST(req: Request) {
  // 1. LEGGI IL BODY COME TESTO (RAW)
  const body = await req.text(); 
  
  // 2. PRENDI LA FIRMA DAI HEADERS
  const headersList = await headers();
  const signature = headersList.get('stripe-signature') as string;

  let event;

  try {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    
    // 3. PASSA IL BODY "TEXT" A STRIPE
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
    
    // ----------------------------------------------------
    // CASO A: ACQUISTO PRODOTTI SHOP (shop_order)
    // ----------------------------------------------------
    if (metadata?.type === 'shop_order') {
      console.log('📦 Processing order for:', customerEmail);
      
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

        // 2. GESTIONE SCALO SALDO PORTAFOGLIO UTENTE (STORE CREDIT)
        const userId = metadata.user_id;
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

      } catch (dbError: any) {
        console.error('❌ Database error (shop_order):', dbError.message);
        return NextResponse.json({ error: 'Database error' }, { status: 500 });
      }
    }
    
    // ----------------------------------------------------
    // CASO B: ACQUISTO GIFT CARD (giftcard_purchase)
    // ----------------------------------------------------
    else if (metadata?.type === 'giftcard_purchase') {
      console.log('🎁 Processing gift card purchase for:', customerEmail);

      try {
        const amount = session.amount_total / 100; // Importo della gift card
        const giftCode = generateSecureGiftCode(); // Generazione codice sicuro univoco
        
        // Generazione del link per il QR Code (es: punta a una pagina di riscatto o verifica)
        const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(giftCode)}`;

        // 1. SALVATAGGIO NEL DATABASE (Subito attiva)
        const { error: giftCardError } = await supabaseAdmin
          .from('gift_cards')
          .insert([
            {
              code: giftCode,
              initial_amount: amount,
              current_amount: amount,
              is_active: true,
              buyer_email: customerEmail,
              recipient_email: metadata.recipient_email || customerEmail, // Se c'è un destinatario specifico nei metadata
              stripe_session_id: session.id,
              qr_code_url: qrCodeUrl
            }
          ]);

        if (giftCardError) throw giftCardError;
        console.log('✅ Gift card saved and activated in DB');

        // 2. INVIO EMAIL CON LOOPS
        if (process.env.LOOPS_API_KEY) {
          const targetEmail = metadata.recipient_email || customerEmail;
          
          const loopsResponse = await fetch('https://events.loops.so/v1/send', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${process.env.LOOPS_API_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: targetEmail,
              transactionalId: LOOPS_TEMPLATE_ID,
              dataVariables: {
                giftCode: giftCode,
                amount: `€${amount.toFixed(2)}`,
                qrCodeUrl: qrCodeUrl,
                buyerName: metadata.buyer_name || 'Un amico',
                message: metadata.gift_message || ''
              },
            }),
          });

          if (!loopsResponse.ok) {
            const errorText = await loopsResponse.text();
            console.error(`❌ Errore invio email Loops: ${errorText}`);
          } else {
            console.log(`✉️ Email inviata con successo a ${targetEmail} tramite Loops`);
          }
        } else {
          console.warn('⚠️ LOOPS_API_KEY non configurata. Salto invio email.');
        }

      } catch (dbError: any) {
        console.error('❌ Database error (giftcard_purchase):', dbError.message);
        return NextResponse.json({ error: 'Database error' }, { status: 500 });
      }
    }
  }

  return NextResponse.json({ received: true }, { status: 200 });
}