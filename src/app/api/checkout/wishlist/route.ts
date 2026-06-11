import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function POST(req: Request) {
  try {
    // Aggiungiamo guestName e guestMessage dal body della richiesta
    const { amount, wishlistId, wishlistSlug, childName, guestName, guestMessage } = await req.json();

    if (!amount || !wishlistId || !wishlistSlug || !guestName) {
      return NextResponse.json({ error: "Dati mancanti" }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'], // Puoi aggiungere 'paypal' qui se attivo su Stripe
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `Quota Regalo - Compleanno di ${childName || 'un amico'}`,
              description: `Contributo al salvadanaio da parte di ${guestName}`,
            },
            unit_amount: Math.round(amount * 100), 
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      // Reindirizziamo l'invitato alla pagina pubblica corretta con un parametro di successo
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/liste/${wishlistSlug}/regala?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/liste/${wishlistSlug}/regala`,
      metadata: {
        type: 'wishlist_contribution',
        wishlist_id: wishlistId,
        amount_contributed: amount.toString(),
        customer_name: guestName,          // Indispensabile per il Webhook
        customer_message: guestMessage || '', // Indispensabile per il Webhook
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("❌ Errore creazione sessione Stripe Wishlist:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}