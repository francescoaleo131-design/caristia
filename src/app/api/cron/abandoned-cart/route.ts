import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const LOOPS_EVENT_NAME = 'abandoned_cart';

export async function GET(req: Request) {
  // Protezione della route tramite Secret Token nelle query
  const { searchParams } = new URL(req.url);
  const cronSecret = searchParams.get('secret');
  
  if (cronSecret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const adesso = new Date();
    const dueOreFa = new Date(adesso.getTime() - 2 * 60 * 60 * 1000).toISOString();
    const treOreFa = new Date(adesso.getTime() - 3 * 60 * 60 * 1000).toISOString();

    // 1. RECUPERA GLI ARTICOLI DEGLI UTENTI REGISTRATI
    // Utilizziamo 'profiles!inner' per costringere la query a restituire SOLO 
    // i record che hanno una corrispondenza (ovvero dove user_id non è null ed esiste il profilo)
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
      .not('user_id', 'is', null) // Ulteriore sicurezza: esclude i carrelli guest
      .gte('created_at', treOreFa)
      .lte('created_at', dueOreFa);

    if (fetchError) throw fetchError;

    if (!abandonedItems || abandonedItems.length === 0) {
      return NextResponse.json({ message: 'Nessun carrello registrato abbandonato in questa finestra.' }, { status: 200 });
    }

    // 2. RAGGRUPPA GLI ARTICOLI PER UTENTE
    // Se un utente ha più prodotti nel carrello, generiamo un'unica mail cumulativa
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

    // 3. INVIA I DATI A LOOPS E AGGIORNA IL DB
    for (const userId in cartsByUser) {
      const userCart = cartsByUser[userId];

      if (!userCart.email) continue;

      if (process.env.LOOPS_API_KEY) {
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
              cartUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/cart`, // Link alla pagina del carrello dell'utente loggato
            },
          }),
        });

        if (loopsResponse.ok) {
          // Aggiorna il flag così non riceveranno la stessa mail al prossimo controllo cron
          await supabaseAdmin
            .from('cart_item')
            .update({ recovery_email_sent: true })
            .in('id', userCart.itemIds);
            
          console.log(`✉️ Email di recupero inviata con successo a ${userCart.email}`);
        } else {
          const errorText = await loopsResponse.text();
          console.error(`❌ Errore Loops per l'utente ${userId}:`, errorText);
        }
      }
    }

    return NextResponse.json({ success: true, processedUsers: Object.keys(cartsByUser).length }, { status: 200 });

  } catch (error: any) {
    console.error('❌ Errore durante l\'esecuzione del Cron:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}