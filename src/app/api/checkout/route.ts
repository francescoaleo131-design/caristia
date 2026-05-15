import { stripe } from '@/lib/stripe';
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { items, email, useBalance } = body;

    console.log("🛒 Richiesta checkout ricevuta. Uso del saldo portafoglio:", useBalance);

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const supabase = await createClient();

    // Recupera l'utente corrente per motivi di sicurezza
    const { data: { user } } = await supabase.auth.getUser();

    // Calcola il totale del carrello
    const orderTotal = items.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);
    
    let discount = 0;
    let walletBalance = 0;

    // Se l'utente vuole usare il suo saldo ed è loggato
    if (useBalance && user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('gift_card_balance')
        .eq('id', user.id)
        .single();

      if (profile && profile.gift_card_balance > 0) {
        walletBalance = profile.gift_card_balance;
        discount = Math.min(walletBalance, orderTotal);
      }
    }

    const totaleDaPagare = orderTotal - discount;

    // =========================================================
    // CASO A: IL SALDO COPRE TUTTO (Stripe viene bypassato)
    // =========================================================
    if (discount >= orderTotal && user) {
      const nuovoSaldoPortafoglio = walletBalance - orderTotal;

      // Scala il saldo direttamente dal profilo
      await supabase
        .from('profiles')
        .update({ gift_card_balance: nuovoSaldoPortafoglio })
        .eq('id', user.id);

      // TODO: Inserisci l'ordine nella tua tabella 'orders' (Stato: 'paid')

      console.log("🎁 Ordine interamente pagato con credito portafoglio. Stripe saltato!");
      return NextResponse.json({ url: `${baseUrl}/success?type=wallet` });
    }

    // =========================================================
    // CASO B: COPERTURA PARZIALE O NESSUN CREDITO (Stripe)
    // =========================================================
    let stripeDiscounts: any[] = [];

    if (discount > 0) {
      // Crea un coupon Stripe istantaneo pari al credito prelevato dal portafoglio
      const coupon = await stripe.coupons.create({
        amount_off: Math.round(discount * 100),
        currency: 'eur',
        duration: 'once',
        name: 'Credito Portafoglio Virtuale',
      });
      stripeDiscounts.push({ coupon: coupon.id });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'klarna', 'paypal'],
      line_items: items.map((item: any) => ({
        price_data: {
          currency: 'eur',
          product_data: { name: item.name },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      })),
      discounts: stripeDiscounts.length > 0 ? stripeDiscounts : undefined,
      mode: 'payment',
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/cart`,
      customer_email: email || undefined,
      phone_number_collection: { enabled: true },
      shipping_address_collection: { allowed_countries: ['IT'] },
      metadata: {
        type: 'shop_order',
        user_id: user?.id || '', // Passato per il webhook
        credito_portafoglio_usato: discount.toString(), // Passato per il webhook
        items: JSON.stringify(items.map((i: any) => ({
          id: i.id,
          name: i.name,
          quantity: i.quantity,
          price: i.price
        }))),
      }
    });

    return NextResponse.json({ url: session.url });

  } catch (err: any) {
    console.error("❌ ERRORE CHECKOUT:", err.message);
    return NextResponse.json({ error: err.message || "Errore interno" }, { status: 500 });
  }
}