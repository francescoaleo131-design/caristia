import { supabaseAdmin } from '@/lib/supabase/supabaseAdmin';
import { NextResponse } from 'next/server';

export async function PATCH(req: Request) {
  const { id, status } = await req.json();

  try {
    if (!supabaseAdmin) throw new Error("Supabase Admin non inizializzato");

    const { error } = await supabaseAdmin
      .from('mascotte_bookings')
      .update({ status })
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
