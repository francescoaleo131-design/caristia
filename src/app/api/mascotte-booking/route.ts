import { stripe } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabase/supabaseAdmin';
import { NextResponse } from 'next/server';
import { logError } from '@/lib/logger';

export async function POST(req: Request) {
  const body = await req.json();
  const {
    personaggio,
    data,
    orario,
    luogo,
    nome,
    telefono,
    note,
    packageId,
    packageName,
    price
  } = body;

  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'eur',
          product_data: {
            name: `Servizio Mascotte: ${packageName}`,
            description: `Personaggio: ${personaggio} - Data: ${data}`
          },
          unit_amount: Math.round(price * 100),
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}&type=mascotte`,
      cancel_url: `${baseUrl}/mascotte`,
      customer_email: undefined, 
      metadata: {
        type: 'mascotte_bookings',
        customer_name: nome,
        customer_phone: telefono,
        mascot_name: personaggio,
        booking_date: data,
        booking_time: orario,
        location: luogo,
        package_type: packageId,
        note: note || ''
      }
    });

    if (supabaseAdmin) {
      const { error } = await supabaseAdmin
        .from('mascotte_bookings')
        .insert([{
          customer_name: nome,
          customer_phone: telefono,
          mascot_name: personaggio,
          booking_date: data,
          booking_time: orario,
          location: luogo,
          package_type: packageId,
          total_price: price,
          status: 'pending',
          stripe_session_id: session.id,
          note: note || ''
        }]);

      if (error) {
        console.error("Errore salvataggio DB:", error);
        logError("MascotteBooking_DB_Insert", error);
      }
    }

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("Stripe Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
