import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error("❌ ERRORE: Variabili Supabase mancanti in supabaseAdmin.ts");
}

export const supabaseAdmin = createClient(
  supabaseUrl || '',
  supabaseServiceRoleKey || ''
);