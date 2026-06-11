import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabase/supabaseAdmin'; 
import { generateSecureGiftCode } from '@/lib/utils/giftcard-utils';
import { LoopsClient } from 'loops';

// 💡 Forza Vercel a non usare la cache e a mantenere il runtime Node standard
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const loops = new LoopsClient(process.env.LOOPS_API_KEY!);
const ENDPOINT_SECRET = process.env.STRIPE_WEBHOOK_SECRET!;
const LOOPS_GIFT_TEMPLATE_ID = 'cmpd289y200do0jzntezank2n';

export async function POST(req: Request) {
  // 1. Lettura flessibile case-insensitive della firma
  const signature = req.headers.get('stripe-signature') || req.headers.get('Stripe-Signature');

  if (!signature) {
    console.error("❌ Errore Webhook: Manca l'header stripe-signature.");
    return NextResponse.json({ error: 'Firma mancante' }, { status: 400 });
  }

  let event;

  try {
    // 2. Trasformiamo la richiesta in un ArrayBuffer e poi in un Buffer grezzo.
    // Questo impedisce a Vercel di alterare i dati crittografici di Stripe.
    const arrayBuffer = await req.arrayBuffer();
    const rawBody = Buffer.from(arrayBuffer);

    event = stripe.webhooks.constructEvent(rawBody, signature, ENDPOINT_SECRET);
  } catch (err: any) {
    console.error(`❌ Errore firma Webhook: ${err.message}`);
    return NextResponse.json({ error: `Firma non valida: ${err.message}` }, { status: 400 });
  }

  // Intercettiamo il pagamento andato a buon fine
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as any;
    const metadata = session.metadata;
    const customerEmail = session.customer_details?.email;

    // =========================================================================
    // CASO 1: IL PAGAMENTO RIGUARDA UNA GIFT CARD
    // =========================================================================
    if (metadata?.type === 'giftcard_purchase') {
      try {
        const newGiftCode = generateSecureGiftCode();
        const amount = parseFloat(metadata.amount || '0');

        const { error: dbError } = await supabaseAdmin
          .from('gift_cards')
          .insert([
            {
              code: newGiftCode,
              initial_balance: amount,
              current_balance: amount,
              is_active: true,      
              is_physical: false,   
            }
          ]);

        if (dbError) throw dbError;

        const emailDestinatario = metadata.recipient_email || customerEmail;

        await loops.sendTransactionalEmail({
          email: emailDestinatario,
          transactionalId: LOOPS_GIFT_TEMPLATE_ID, 
          dataVariables: {
            giftCode: newGiftCode,
            amount: `€${amount.toFixed(2)}`,
            buyerName: metadata.buyer_name || 'Un amico',
            giftMessage: metadata.gift_message || 'Ecco un regalo per te!',
            qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${newGiftCode}`
          }
        });

        console.log(`✅ Gift Card ${newGiftCode} creata e mail inviata a ${emailDestinatario}`);
        return NextResponse.json({ received: true, type: 'giftcard' });

      } catch (err: any) {
        console.error("❌ Errore durante l'elaborazione del webhook Gift Card:", err.message);
        return NextResponse.json({ error: "Errore interno elaborazione card" }, { status: 500 });
      }
    }

    // =========================================================================
    // CASO 2: IL PAGAMENTO RIGUARDA UN ORDINE STANDARD DEL CARRELLO
    // =========================================================================
    // Logica dello shop...
  }

  return NextResponse.json({ received: true });
}