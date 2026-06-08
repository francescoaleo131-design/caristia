import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function POST(req: Request) {
  try {
    const { amount, wishlistId, wishlistSlug, childName } = await req.json();

    if (!amount || !wishlistId || !wishlistSlug) {
      return NextResponse.json({ error: "Dati mancanti" }, { status: 400 });
    }

    // Configura la sessione di Stripe per una donazione libera (quota)
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `Quota Regalo per il compleanno di ${childName || 'un amico'}`,
              description: `Contributo libero al salvadanaio digitale`,
            },
            unit_amount: Math.round(amount * 100), // Stripe vuole i centesimi
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      // Se il pagamento va a buon fine, torna alla lista con un parametro di successo
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/liste/${wishlistSlug}?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/liste/${wishlistSlug}`,
      // Passiamo i metadata fondamentali che leggerà il Webhook di Stripe dopo il pagamento
      metadata: {
        type: 'wishlist_contribution',
        wishlist_id: wishlistId,
        amount_contributed: amount.toString(),
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("❌ Errore creazione sessione Stripe Wishlist:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}