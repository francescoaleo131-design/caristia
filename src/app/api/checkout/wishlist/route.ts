import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function POST(req: Request) {
  try {
    // Riceviamo i nuovi campi dal frontend
    const { 
      amount, 
      wishlistId, 
      wishlistSlug, 
      childName, 
      guestName, 
      guestMessage, 
      giftName, 
      wishlistItemId,
      productId
    } = await req.json();

    if (!amount || !wishlistId || !wishlistSlug || !guestName) {
      return NextResponse.json({ error: "Dati mancanti" }, { status: 400 });
    }

    // Determiniamo il tipo di contributo
    const contributionType = wishlistItemId ? 'physical_product' : 'money';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: giftName || `Regalo per ${childName}`,
              description: `Da parte di ${guestName}${guestMessage ? ': ' + guestMessage : ''}`,
            },
            unit_amount: Math.round(amount * 100), 
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/regala/${wishlistSlug}`,
      metadata: {
        type: 'wishlist_contribution',
        wishlist_id: wishlistId,
        wishlist_slug: wishlistSlug,
        amount_contributed: amount.toString(),
        customer_name: guestName,
        customer_message: guestMessage || '',
        product_id: productId || '',
        gift_name: giftName || '',
        wishlist_item_id: wishlistItemId || '', // Fondamentale per aggiornare quantity_purchased
        contribution_type: contributionType     // Il nuovo campo che abbiamo creato
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("❌ Errore creazione sessione Stripe:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}