'use server'
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

/**
 * 1. Riscatta un codice Gift Card e aggiunge l'importo al saldo dell'utente
 */
export async function redeemCodeAction(code: string) {
  try {
    const supabase = await createClient();
    
    // Recupera l'utente loggato
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return { error: "Devi essere loggato per riscattare una Gift Card." };

    if (!code || code.trim().length === 0) return { error: "Inserisci un codice valido." };

    // Esegui la funzione RPC atomica su Supabase
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

/**
 * 2. Recupera in modo sicuro il saldo attuale della Gift Card dal server
 */
export async function getUserGiftCardBalance() {
  try {
    const supabase = await createClient();
    
    // Recupera l'utente loggato
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return 0;

    // Estrae la colonna gift_card_balance dal profilo dell'utente
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

/**
 * 3. Sottrae l'importo utilizzato dal portafoglio dell'utente al momento del checkout
 */
export async function deductGiftCardBalanceAction(amountToDeduct: number) {
  try {
    const supabase = await createClient();
    
    // Recupera l'utente loggato
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return { error: "Utente non autorizzato o sessione scaduta." };

    if (amountToDeduct <= 0) return { error: "Importo di addebito non valido." };

    // Controlla il saldo attuale sul server per evitare manomissioni lato client
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('gift_card_balance')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) return { error: "Profilo utente non trovato." };
    
    const currentBalance = Number(profile.gift_card_balance) || 0;

    // Controllo di sicurezza: l'utente ha davvero quel credito?
    if (currentBalance < amountToDeduct) {
      return { error: "Credito insufficiente nel portafoglio per completare l'operazione." };
    }

    // Calcola il saldo residuo
    const newBalance = currentBalance - amountToDeduct;

    // Aggiorna il database con il nuovo saldo decrementato
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ gift_card_balance: newBalance })
      .eq('id', user.id);

    if (updateError) return { error: updateError.message };

    // Invalida la cache per forzare Next.js a mostrare i dati aggiornati ovunque
    revalidatePath('/profilo');
    revalidatePath('/carrello');

    return { success: true, newBalance };

  } catch (err: any) {
    return { error: err.message || "Errore durante l'addebito sul portafoglio." };
  }
}