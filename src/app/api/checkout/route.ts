import { stripe } from '@/lib/stripe';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { items, email } = body;

    console.log("🛒 Dati ricevuti nel checkout:", items?.length, "oggetti");

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'klarna', 'paypal'],
      line_items: items.map((item: any) => ({
        price_data: {
          currency: 'eur',
          product_data: {
            name: item.name,
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/cart`,
      customer_email: email || undefined,
      phone_number_collection: {
        enabled: true,
      },
      shipping_address_collection: {
        allowed_countries: ['IT'],
      },
      metadata: {
        type: 'shop_order',
        items: JSON.stringify(items.map((i: any) => ({
          id: i.id,
          name: i.name,
          quantity: i.quantity,
          price: i.price
        }))),
      }
    });

    console.log("✅ Sessione Stripe creata con successo!");
    return NextResponse.json({ url: session.url });

  } catch (err: any) {
    // QUESTO LOG APPARIRÀ NEL TERMINALE DI VS CODE (NERO)
    console.error("❌ ERRORE CRITICO API CHECKOUT:", err.message);

    // Restituiamo un JSON anche in caso di errore per non far crashare il frontend
    return NextResponse.json(
      { error: err.message || "Errore interno del server" },
      { status: 500 }
    );
  }
}