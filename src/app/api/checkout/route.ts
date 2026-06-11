import { stripe } from '@/lib/stripe';
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { loops } from '@/lib/loops/loops';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CheckoutRequestBody {
  items?: CartItem[];
  email?: string;
  useBalance?: boolean;
  isGiftCard?: boolean; 
  giftCardAmount?: number;
  // 🚀 Nuovi campi per i dettagli del regalo passati dal frontend
  buyerName?: string;
  recipientEmail?: string;
  giftMessage?: string;
}

const LOOPS_ID_RIUSCITO = process.env.LOOPS_ID_PAGAMENTO_RIUSCITO!;

export async function POST(req: Request) {
  try {
    const body = await req.json() as CheckoutRequestBody;
    const { items, email, useBalance, isGiftCard, giftCardAmount, buyerName, recipientEmail, giftMessage } = body;

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    // =========================================================
    // FLUSSO SPECIFICO: ACQUISTO DI UNA GIFT CARD
    // =========================================================
    if (isGiftCard) {
      if (!giftCardAmount || giftCardAmount <= 0) {
        return NextResponse.json({ error: "Importo della Gift Card non valido" }, { status: 400 });
      }

      console.log(`🎁 Richiesta checkout ricevuta per una Gift Card da €${giftCardAmount}`);

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card', 'klarna', 'paypal'],
        line_items: [{
          price_data: {
            currency: 'eur',
            product_data: {
              name: `Gift Card Caristia - Valore €${giftCardAmount}`,
              description: "Buono regalo digitale spedito via email con QR Code",
            },
            unit_amount: Math.round(giftCardAmount * 100), 
          },
          quantity: 1,
        }],
        mode: 'payment',
        success_url: `${baseUrl}/success?type=giftcard&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${baseUrl}/giftcard`,
        customer_email: user?.email || email || undefined,
        // 🚀 Ora passiamo tutti i metadati che il webhook leggerà in background
        metadata: {
          type: 'giftcard_purchase',
          amount: giftCardAmount.toString(),
          buyer_id: user?.id || 'anon',
          buyer_name: buyerName ? String(buyerName).trim() : 'Un amico',
          recipient_email: recipientEmail ? String(recipientEmail).trim().toLowerCase() : '',
          gift_message: giftMessage ? String(giftMessage).trim() : 'Ecco un regalo per te!'
        }
      });

      return NextResponse.json({ url: session.url });
    }

    // =========================================================
    // FLUSSO REGOLARE: ACQUISTO PRODOTTI DELLO SHOP
    // =========================================================
    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Il carrello è vuoto" }, { status: 400 });
    }

    console.log("🛒 Richiesta checkout ricevuta per Giocattoli Caristia. Uso saldo:", useBalance);

    const orderTotal = items.reduce((acc: number, item: CartItem) => acc + (item.price * item.quantity), 0);
    let discount = 0;
    let walletBalance = 0;

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

    if (discount >= orderTotal && user) {
      const nuovoSaldoPortafoglio = walletBalance - orderTotal;

      const { error: profileError } = await supabase
        .from('profiles')
        .update({ gift_card_balance: nuovoSaldoPortafoglio })
        .eq('id', user.id);

      if (profileError) throw new Error(`Errore aggiornamento saldo: ${profileError.message}`);

      const fakeOrderId = `ORD-WAL-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

      const customerEmail = user.email || email;
      if (customerEmail) {
        await loops.sendTransactionalEmail({
          transactionalId: LOOPS_ID_RIUSCITO,
          email: customerEmail,
          addToAudience: true,
          dataVariables: {
            customerName: user.user_metadata?.full_name || 'Cliente',
            orderId: fakeOrderId,
            amount: `€${orderTotal.toFixed(2)} (Pagato con Portafoglio)`,
            dashboardUrl: `${baseUrl}/dashboard`,
          },
        });
      }

      console.log("🎁 Ordine interamente pagato con credito portafoglio. Email Loops Inviata!");
      return NextResponse.json({ url: `${baseUrl}/success?type=wallet` });
    }

    let stripeDiscounts: any[] = [];
    if (discount > 0) {
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
      line_items: items.map((item: CartItem) => ({
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
      customer_email: user?.email || email || undefined,
      phone_number_collection: { enabled: true },
      shipping_address_collection: { allowed_countries: ['IT'] },
      metadata: {
        type: 'shop_order',
        user_id: user?.id || '', 
        credito_portafoglio_usato: discount.toString(),
        items: JSON.stringify(items.map((i: CartItem) => ({
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