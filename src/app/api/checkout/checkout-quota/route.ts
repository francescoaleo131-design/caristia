import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16' as any, // Adatta alla versione del tuo pacchetto
});

export async function POST(req: Request) {
  try {
    const { amount, guestName, guestMessage, wishlistId, childName, slug } = await req.json();

    // Validazione base
    if (!amount || amount <= 0 || !guestName) {
      return NextResponse.json({ error: 'Dati mancanti o non validi' }, { status: 400 });
    }

    // Crea la sessione di Stripe Checkout al volo con l'importo dinamico dell'invitato
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'paypal'], // o i metodi attivi sul tuo Stripe
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `Quota Regalo per il Compleanno di ${childName}`,
              description: `Regalo da parte di ${guestName}`,
            },
            unit_amount: Math.round(amount * 100), // Stripe vuole i centesimi
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      // Passiamo i dati nei metadata così il webhook Supabase sa esattamente cosa fare dopo
      metadata: {
        wishlist_id: wishlistId,
        customer_name: guestName,
        customer_message: guestMessage,
        amount: amount.toString(),
        is_quota: 'true'
      },
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/liste/${slug}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/liste/${slug}/regala`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Errore Stripe Session:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}