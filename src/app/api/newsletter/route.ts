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

    if (!supabaseAdmin) {
      return NextResponse.json({ error: "Configurazione server errata" }, { status: 500 });
    }

    // 1. Salva nel DB (Supabase)
    const { error: dbError } = await supabaseAdmin
      .from('newsletter_subscribers')
      .insert([{ email, source }]);

    // Ignoriamo l'errore se è un duplicato (codice 23505)
    if (dbError && dbError.code !== '23505') { 
        console.error("Errore DB:", dbError);
        return NextResponse.json({ error: "Errore nel salvataggio locale" }, { status: 500 });
    }

    // 2. Invia a Loops
    const loopsResponse = await fetch("https://app.loops.so/api/v1/contacts/create", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.LOOPS_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, source }),
    });

    // 3. LOGICA TOLERANTE:
    // Se Loops restituisce un errore (es: 409 Conflict se l'utente esiste già),
    // non blocchiamo l'utente, logghiamo solo l'errore.
    if (!loopsResponse.ok) {
      const loopsData = await loopsResponse.json().catch(() => ({}));
      console.warn("Avviso da Loops (potrebbe essere già iscritto):", loopsData);
      // NON ritorniamo errore 500, perché il dato è già stato salvato nel DB locale!
    }

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error("Errore Generale:", err);
    return NextResponse.json({ error: "Errore di rete" }, { status: 500 });
  }
}