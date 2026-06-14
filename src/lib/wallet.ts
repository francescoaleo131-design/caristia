'use server'
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function redeemCodeAction(code: string) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return { error: "Devi essere loggato per riscattare una Gift Card." };

    if (!code || code.trim().length === 0) return { error: "Inserisci un codice valido." };

    const { data: amountRedeemed, error: rpcError } = await supabase.rpc('redeem_gift_card', {
      card_code: code.toUpperCase().trim(),
      user_id: user.id
    });

    if (rpcError) {
      return { error: rpcError.message };
    }

    revalidatePath('/profilo');
    return { success: true, amount: amountRedeemed };

  } catch (err: any) {
    return { error: err.message || "Errore sconosciuto durante il riscatto." };
  }
}

export async function getUserGiftCardBalance() {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return 0;

    const { data, error: dbError } = await supabase
      .from('profiles')
      .select('gift_card_balance')
      .eq('id', user.id)
      .single();

    if (dbError || !data) return 0;

    return Number(data.gift_card_balance) || 0;
  } catch (err) {
    console.error("❌ Errore nel recupero del saldo della Gift Card:", err);
    return 0;
  }
}

export async function deductGiftCardBalanceAction(amountToDeduct: number) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return { error: "Utente non autorizzato o sessione scaduta." };

    if (amountToDeduct <= 0) return { error: "Importo di addebito non valido." };

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('gift_card_balance')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) return { error: "Profilo utente non trovato." };
    
    const currentBalance = Number(profile.gift_card_balance) || 0;

    if (currentBalance < amountToDeduct) {
      return { error: "Credito insufficiente nel portafoglio per completare l'operazione." };
    }

    const newBalance = currentBalance - amountToDeduct;

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ gift_card_balance: newBalance })
      .eq('id', user.id);

    if (updateError) return { error: updateError.message };

    revalidatePath('/profilo');
    revalidatePath('/carrello');

    return { success: true, newBalance };

  } catch (err: any) {
    return { error: err.message || "Errore durante l'addebito sul portafoglio." };
  }
}