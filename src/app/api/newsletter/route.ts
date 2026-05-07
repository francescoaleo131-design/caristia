export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// 1. Inizializzazione sicura dentro la Route per evitare crash in Build
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''; // Usa la Service Role per bypassare RLS

// Creiamo il client admin solo se le chiavi esistono
const supabaseAdmin = (supabaseUrl && supabaseServiceKey) 
  ? createClient(supabaseUrl, supabaseServiceKey) 
  : null;

export async function POST(req: Request) {
  try {
    const { email, source = 'website' } = await req.json();

    if (!email) return NextResponse.json({ error: "Email mancante" }, { status: 400 });

    // Controllo di sicurezza: se il client non è partito (chiavi mancanti)
    if (!supabaseAdmin) {
      console.error("Client Supabase non inizializzato - Verificare variabili d'ambiente");
      return NextResponse.json({ error: "Configurazione server errata" }, { status: 500 });
    }

    // PASSAGGIO 1: Salva nel tuo Database (Supabase)
    const { error: dbError } = await supabaseAdmin
      .from('newsletter_subscribers')
      .insert([{ email, source }]);

    // Nota: Ignoriamo l'errore se l'email esiste già (duplicate key), procedendo con Loops
    if (dbError && dbError.code !== '23505') { 
        console.error("Errore DB:", dbError);
    }

    // PASSAGGIO 2: Invia a Loops
    const loopsResponse = await fetch("https://app.loops.so/api/v1/contacts/create", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.LOOPS_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, source }),
    });

    if (loopsResponse.ok) {
      return NextResponse.json({ success: true });
    } else {
      const loopsData = await loopsResponse.json();
      console.error("Errore Loops:", loopsData);
      return NextResponse.json({ error: "Errore Loops" }, { status: 500 });
    }

  } catch (err) {
    console.error("Errore Generale:", err);
    return NextResponse.json({ error: "Errore di rete" }, { status: 500 });
  }
}