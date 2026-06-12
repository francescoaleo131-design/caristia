import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Forza la dinamicità per evitare problemi con Vercel
export const dynamic = 'force-dynamic';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabaseAdmin = (supabaseUrl && supabaseServiceKey) ? createClient(supabaseUrl, supabaseServiceKey) : null;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, name, source = 'website' } = body;
    console.log("API Ricevuta:", { email, name });

    if (!email) return NextResponse.json({ error: "Email mancante" }, { status: 400 });
    if (!supabaseAdmin) return NextResponse.json({ error: "Configurazione server errata" }, { status: 500 });

    // 1. Salva nel DB
    const { error: dbError } = await supabaseAdmin
      .from('newsletter_subscribers')
      .insert([{ email, name, source }]);

    if (dbError && dbError.code !== '23505') { 
        console.error("Errore DB:", dbError);
    }

    // 2. Invia Email Transazionale tramite Loops
    console.log("Tentativo invio a Loops...");
    const loopsResponse = await fetch("https://app.loops.so/api/v1/transactional", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.LOOPS_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        transactionalId: "cmqa80x83001x0jz4im9snmc2",
        email: email,
        dataVariables: {
          firstName: name || "Amico"
        }
      }),
    });

    const result = await loopsResponse.json();
    console.log("Risposta Loops:", result);

    if (!loopsResponse.ok) {
      return NextResponse.json({ error: "Errore invio email" }, { status: 500 });
    }

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error("Errore Generale:", err);
    return NextResponse.json({ error: "Errore di rete" }, { status: 500 });
  }
}