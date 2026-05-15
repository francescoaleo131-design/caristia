'use server'
import { createClient } from '@/lib/supabase/server' // Sostituisci con il tuo import del client server di Supabase

export async function validateGiftCard(code: string, orderTotal: number) {
  const supabase = await createClient()
  
  // 1. Recupera la card (pulendo l'input da spazi o minuscole)
  const { data: card, error } = await supabase
    .from('gift_cards')
    .select('*')
    .eq('code', code.toUpperCase().trim())
    .single()

  if (error || !card) {
    return { error: "Gift Card non trovata o codice errato." }
  }

  // 2. Controllo Attivazione
  if (!card.activated_at) {
    return { error: "Questa Gift Card non è ancora stata attivata." }
  }

  // 3. Controllo Scadenza
  const oggi = new Date()
  const scadenza = new Date(card.expire_date)
  if (oggi > scadenza) {
    return { error: `Questa Gift Card è scaduta il ${scadenza.toLocaleDateString('it-IT')}` }
  }

  // 4. Controllo Saldo
  if (card.balance <= 0) {
    return { error: "Il saldo di questa Gift Card è esaurito." }
  }

  // 5. Calcolo dello sconto applicabile
  const scontoApplicato = Math.min(card.balance, orderTotal)
  const totaleResiduo = orderTotal - scontoApplicato

  return {
    success: true,
    cardCode: card.code,
    scontoApplicato,
    totaleResiduo,
    fullCoverage: totaleResiduo === 0 // true se la carta copre tutto l'importo
  }
}