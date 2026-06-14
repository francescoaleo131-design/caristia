import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/supabase";

import { generateSecureGiftCode } from "@/lib/utils/giftcard-utils";

export async function POST(req: Request) {
  try {
    const { amount, customer_email } = await req.json();

    const newCode = generateSecureGiftCode();

   const { data, error } = await supabase
  .from('gift_cards')
  .insert([
    {
      code: newCode,
      initial_balance: amount,
      current_balance: amount,
      is_active: true 
    }
  ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, code: newCode, data });

  } catch (error: any) {
    console.error("Errore:", error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}