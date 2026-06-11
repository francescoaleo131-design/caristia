import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabase/supabaseAdmin'; // Usa il client admin per bypassare le RLS in scrittura
import { generateSecureGiftCode } from '@/lib/utils/giftcard-utils';
import { LoopsClient } from 'loops';

const loops = new LoopsClient(process.env.LOOPS_API_KEY!);
const ENDPOINT_SECRET = process.env.STRIPE_WEBHOOK_SECRET!;
const LOOPS_GIFT_TEMPLATE_ID = 'cmpd289y200do0jzntezank2n'; // 👈 Il tuo codice Loops configurato

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature')!;

  let event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, ENDPOINT_SECRET);
  } catch (err: any) {
    console.error(`❌ Errore firma Webhook: ${err.message}`);
    return NextResponse.json({ error: 'Firma non valida' }, { status: 400 });
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
        // 1. Sforna il codice sicuro usando la tua utility
        const newGiftCode = generateSecureGiftCode();
        const amount = parseFloat(metadata.amount || '0');

        // 2. Registra la Gift Card attiva sul database Supabase
        const { error: dbError } = await supabaseAdmin
          .from('gift_cards')
          .insert([
            {
              code: newGiftCode,
              initial_balance: amount,
              current_balance: amount,
              is_active: true,      // Attiva subito perché i soldi sono stati incassati
              is_physical: false,   // Generata digitalmente via e-commerce
            }
          ]);

        if (dbError) throw dbError;

        // 3. Identifica a chi mandare la mail (destinatario dedicato o acquirente)
        const emailDestinatario = metadata.recipient_email || customerEmail;

        // 4. Invia l'email transazionale con il tuo template Loops
        await loops.sendTransactionalEmail({
          email: emailDestinatario,
          transactionalId: LOOPS_GIFT_TEMPLATE_ID, // 💡 Iniettato qui!
          dataVariables: {
            giftCode: newGiftCode,
            amount: `€${amount.toFixed(2)}`,
            buyerName: metadata.buyer_name || 'Un amico',
            giftMessage: metadata.gift_message || 'Ecco un regalo per te!',
            // Genera il QR Code dinamico scansionabile in cassa a partire dal codice generato
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
    // Qui andrà la logica classica che già usi per salvare i prodotti in 'orders' 
    // e popolare la colonna 'total_amount' e 'shipping_address' di cui parlavamo prima.
  }

  return NextResponse.json({ received: true });
}