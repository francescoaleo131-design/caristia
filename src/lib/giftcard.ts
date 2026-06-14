'use server'
import { createClient } from '@/lib/supabase/server' 

export async function validateGiftCard(code: string, orderTotal: number) {
  const supabase = await createClient()
  
  const { data: card, error } = await supabase
    .from('gift_cards')
    .select('*')
    .eq('code', code.toUpperCase().trim())
    .single()

  if (error || !card) {
    return { error: "Gift Card non trovata o codice errato." }
  }

  if (!card.activated_at) {
    return { error: "Questa Gift Card non è ancora stata attivata." }
  }

  const oggi = new Date()
  const scadenza = new Date(card.expire_date)
  if (oggi > scadenza) {
    return { error: `Questa Gift Card è scaduta il ${scadenza.toLocaleDateString('it-IT')}` }
  }

  if (card.balance <= 0) {
    return { error: "Il saldo di questa Gift Card è esaurito." }
  }

  const scontoApplicato = Math.min(card.balance, orderTotal)
  const totaleResiduo = orderTotal - scontoApplicato

  return {
    success: true,
    cardCode: card.code,
    scontoApplicato,
    totaleResiduo,
    fullCoverage: totaleResiduo === 0 
  }
}