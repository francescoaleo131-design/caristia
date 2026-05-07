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
      } catch (dbError: any) {
        console.error('❌ Database error:', dbError.message);
        return NextResponse.json({ error: 'Database error' }, { status: 500 });
      }
    }
  }

  return NextResponse.json({ received: true }, { status: 200 });
}