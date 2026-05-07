import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const mascot = searchParams.get('mascot');

  if (!mascot) {
    return NextResponse.json({ error: "Specificare una mascotte" }, { status: 400 });
  }

  try {
    // Recuperiamo tutte le prenotazioni per la mascotte specifica che sono pagate o in corso
    const { data, error } = await supabase
      .from('mascotte_bookings')
      .select('booking_date')
      .eq('mascot_name', mascot)
      .in('status', ['paid', 'preparing', 'delivered', 'returned', 'confirmed']);

    if (error) throw error;

    const bookedDates = data.map(b => b.booking_date);
    return NextResponse.json({ bookedDates });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
