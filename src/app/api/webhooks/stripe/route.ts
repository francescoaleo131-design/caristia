import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe';
import { createClient } from '@supabase/supabase-js';

// Supabase admin client
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

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
    
    if (metadata?.type === 'shop_order') {
      console.log('📦 Processing order for:', session.customer_details?.email);
      
      try {
        const items = JSON.parse(metadata.items || '[]');
        
        // 1. SALVATAGGIO DELL'ORDINE
        // Nota: session.amount_total indica la cifra realmente transata su Stripe (già scontata dal coupon)
        const { error: orderError } = await supabaseAdmin
          .from('orders')
          .insert([
            {
              stripe_session_id: session.id,
              customer_email: session.customer_details?.email,
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

          // Recuperiamo il saldo corrente dell'utente dal suo profilo
          const { data: profile, error: profileFetchError } = await supabaseAdmin
            .from('profiles')
            .select('gift_card_balance')
            .eq('id', userId)
            .single();

          if (profileFetchError || !profile) {
            console.error(`❌ Impossibile trovare il profilo dell'utente ${userId} per scalare il saldo:`, profileFetchError?.message);
          } else {
            // Calcoliamo il nuovo saldo (protezione per evitare valori negativi)
            const nuovoSaldo = Math.max(0, profile.gift_card_balance - creditoDaScalare);

            // Aggiorniamo la tabella profiles con il credito residuo
            const { error: profileUpdateError } = await supabaseAdmin
              .from('profiles')
              .update({ gift_card_balance: nuovoSaldo })
              .eq('id', userId);

            if (profileUpdateError) {
              console.error(`❌ Errore durante l'aggiornamento del saldo portafoglio utente:`, profileUpdateError.message);
            } else {
              console.log(`✅ Portafoglio utente ${userId} aggiornato. Nuovo saldo residuo: €${nuovoSaldo}`);
            }
          }
        }

      } catch (dbError: any) {
        console.error('❌ Database error:', dbError.message);
        return NextResponse.json({ error: 'Database error' }, { status: 500 });
      }
    }
  }

  return NextResponse.json({ received: true }, { status: 200 });
}