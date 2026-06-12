export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { loops } from '@/lib/loops/loops';

// 1. Inizializzazione sicura dentro la Route per evitare crash in Build
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''; // Usa la Service Role per bypassare RLS

// Creiamo il client admin solo se le chiavi esistono
const supabaseAdmin = (supabaseUrl && supabaseServiceKey) 
  ? createClient(supabaseUrl, supabaseServiceKey) 
  : null;

export async function POST(req: Request) {
  try {
    const { email, name, source = 'website' } = await req.json();

    if (!email) return NextResponse.json({ error: "Email mancante" }, { status: 400 });

    if (!supabaseAdmin) {
      return NextResponse.json({ error: "Configurazione server errata" }, { status: 500 });
    }

    // 1. Salva nel DB (Supabase)
    const { error: dbError } = await supabaseAdmin
      .from('newsletter_subscribers')
      .insert([{ email, name, source }]);

    if (dbError && dbError.code !== '23505') { 
        console.error("Errore DB:", dbError);
    }

    // 2. Invia Email Transazionale
    // Invece di /contacts/create, usiamo l'endpoint /transactional
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
          firstName: name || "Amico" // Passiamo il nome qui per il template
        }
      }),
    });

    if (!loopsResponse.ok) {
      const errorText = await loopsResponse.text();
      console.error("Errore Invio Transazionale Loops:", errorText);
    }

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error("Errore Generale:", err);
    return NextResponse.json({ error: "Errore di rete" }, { status: 500 });
  }
}