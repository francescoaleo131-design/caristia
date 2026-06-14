import { supabaseAdmin } from '@/lib/supabase/supabaseAdmin';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.json();

  try {
    if (!supabaseAdmin) throw new Error("Supabase Admin non inizializzato");

    const { error } = await supabaseAdmin
      .from('mascotte_bookings')
      .insert([{
        ...body,
        status: 'confirmed' 
      }]);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
