import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY;

// Protezione per la fase di build di Next.js
if (!supabaseUrl || !supabaseServiceKey) {
  console.warn("⚠️ Attenzione: Variabili d'ambiente Supabase mancanti durante la build.");
}

const supabaseAdmin = createClient(
  supabaseUrl || 'https://placeholder-url.supabase.co',
  supabaseServiceKey || 'placeholder-key'
);

const LOOPS_EVENT_NAME = 'abandoned_cart';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const cronSecret = searchParams.get('secret');
  
  if (cronSecret !== process.env.CRON_SECRET) {
    console.error("❌ Tentativo di accesso non autorizzato al Cron. Secret errato o mancante.");
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const adesso = new Date();
    const dueOreFa = new Date(adesso.getTime() - 2 * 60 * 60 * 1000).toISOString();
    const treOreFa = new Date(adesso.getTime() - 3 * 60 * 60 * 1000).toISOString();

    const { data: abandonedItems, error: fetchError } = await supabaseAdmin
      .from('cart_item')
      .select(`
        id,
        user_id,
        quantity,
        created_at,
        profiles!inner (
          email,
          name
        ),
        products!inner (
          name
        )
      `)
      .eq('recovery_email_sent', false)
      .not('user_id', 'is', null)
      .gte('created_at', treOreFa)
      .lte('created_at', dueOreFa);

    if (fetchError) throw fetchError;

    if (!abandonedItems || abandonedItems.length === 0) {
      console.log("ℹ️ Controllo completato: nessun carrello abbandonato trovato in questa finestra temporale.");
      return NextResponse.json({ message: 'Nessun carrello registrato abbandonato in questa finestra.' }, { status: 200 });
    }

    const cartsByUser = abandonedItems.reduce((acc: any, item: any) => {
      const userId = item.user_id;
      if (!acc[userId]) {
        acc[userId] = {
          email: item.profiles.email,
          name: item.profiles.name,
          items: [],
          itemIds: []
        };
      }
      acc[userId].items.push(`${item.quantity}x ${item.products.name}`);
      acc[userId].itemIds.push(item.id);
      return acc;
    }, {});

    console.log(`🛒 Trovati ${Object.keys(cartsByUser).length} utenti con carrelli abbandonati da elaborare.`);

    // --- BLOCCO COMPLETO DI INVIO E DEBUG DI LOOPS ---
    for (const userId in cartsByUser) {
      const userCart = cartsByUser[userId];

      if (!userCart.email) {
        console.warn(`⚠️ L'utente ${userId} non ha una mail valida nel profilo. Salto.`);
        continue;
      }

      // 1. VERIFICA SE VERCEL LEGGE LA CHIAVE API
      console.log("🔍 Verifica LOOPS_API_KEY su Vercel... Presente?", !!process.env.LOOPS_API_KEY);

      if (process.env.LOOPS_API_KEY) {
        console.log(`🚀 Tentativo di invio evento '${LOOPS_EVENT_NAME}' a Loops per: ${userCart.email}`);

        const loopsResponse = await fetch('https://events.loops.so/v1/events/send', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.LOOPS_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: userCart.email,
            eventName: LOOPS_EVENT_NAME,
            contactProperties: {
              firstName: userCart.name || '',
            },
            eventProperties: {
              cartItems: userCart.items.join(', '),
              cartUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/cart`,
            },
          }),
        });

        // 2. VERIFICA LA RISPOSTA ESATTA DEI SERVER DI LOOPS
        if (loopsResponse.ok) {
          console.log(`✅ Loops ha ACCETTATO l'evento per ${userCart.email}. Stato: ${loopsResponse.status}`);
          
          // Aggiorna il DB solo se Loops risponde con successo
          await supabaseAdmin
            .from('cart_item')
            .update({ recovery_email_sent: true })
            .in('id', userCart.itemIds);
        } else {
          const errorText = await loopsResponse.text();
          console.error(`❌ Loops ha RIFIUTATO la richiesta. Status: ${loopsResponse.status}. Dettaglio errore:`, errorText);
        }
      } else {
        console.error("⚠️ ERRORE CRITICO: Il codice non vede la LOOPS_API_KEY nelle variabili d'ambiente di Vercel. Il blocco di invio è stato saltato.");
      }
    }
    // --- FINE BLOCCO LOOPS ---

    return NextResponse.json({ success: true, processedUsers: Object.keys(cartsByUser).length }, { status: 200 });

  } catch (error: any) {
    console.error('❌ Errore generale durante l\'esecuzione del Cron:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}