import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/supabaseAdmin";

export async function GET() {
  try {
    if (!supabaseAdmin) {
      console.error("❌ Errore: supabaseAdmin non inizializzato");
      return NextResponse.json({ error: "DB non configurato" }, { status: 500 });
    }

    const { data, error } = await supabaseAdmin
      .from("mascotte_bookings")
      .select("*")
      .order("booking_date", { ascending: false });

    if (error) {
      console.error("❌ Errore Supabase:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ bookings: data || [] });

  } catch (err: any) {
    console.error("❌ Errore interno API:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}