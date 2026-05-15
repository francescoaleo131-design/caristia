"use client"
import { useState, useEffect, useTransition } from "react"
import { Wallet, Ticket, Info, CheckCircle2, AlertCircle, Loader2 } from "lucide-react"
import { redeemCodeAction } from "@/lib/wallet" 
import { createClient } from "@/lib/supabase/client" // <-- Assicurati che questo percorso punti al tuo client di Supabase

export default function ProfiloGiftCardPage() {
  const [code, setCode] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  
  // Stato per salvare i dati del profilo caricati dal database
  const [profile, setProfile] = useState<any>(null)
  const [isLoadingProfile, setIsLoadingProfile] = useState(true)

  const supabase = createClient()

  // 1. CARICAMENTO DEL SALDO REALE ALL'AVVIO
  useEffect(() => {
    async function fetchProfileBalance() {
      try {
        setIsLoadingProfile(true)
        // Recupera l'utente loggato correntemente
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        
        if (authError || !user) {
          setError("Devi effettuare l'accesso per vedere il tuo saldo.")
          return
        }

        // Interroga la tabella profiles per estrarre il saldo
        const { data, error: dbError } = await supabase
          .from("profiles")
          .select("gift_card_balance")
          .eq("id", user.id)
          .single()

        if (dbError) throw dbError;

        if (data) {
          setProfile(data)
        }
      } catch (err: any) {
        console.error("❌ Errore nel caricamento del saldo:", err.message)
      } finally {
        setIsLoadingProfile(false)
      }
    }

    fetchProfileBalance()
  }, [supabase])

  // Valore dinamico calcolato in tempo reale
  const currentBalance = profile?.gift_card_balance ?? 0.00

  // 2. GESTIONE DEL RISCATTO DEL CODICE
  const handleRedeem = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!code.trim()) {
      setError("Inserisci un codice valido.")
      return
    }

    startTransition(async () => {
      const res = await redeemCodeAction(code)

      if (res?.error) {
        setError(res.error)
      } else if (res?.success) {
        setSuccess(`Ottimo! Hai riscattato €${res.amount?.toFixed(2)} nel tuo portafoglio.`)
        setCode("")
        
        // 🔥 AGGIORNAMENTO ISTANTANEO: Somma il credito riscattato al saldo visibile nella UI
        setProfile((prev: any) => ({
          ...prev,
          gift_card_balance: (prev?.gift_card_balance ?? 0) + (res.amount ?? 0)
        }))
      }
    })
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      
      {/* Intestazione Pagina */}
      <div className="space-y-4">
        <div className="bg-white w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto shadow-xl shadow-[#1e73be]/10 border border-zinc-100">
          <Wallet className="text-[#1e73be]" size={36} />
        </div>
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-black uppercase tracking-tighter text-zinc-800">
            Portafoglio <span className="text-[#1e73be]">Gift Card</span>
          </h1>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">
            Gestisci il tuo credito e riscatta i codici
          </p>
        </div>
      </div>

      {/* Grid Principale */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Card Saldo Attuale */}
        <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl shadow-zinc-200/50 border border-white flex flex-col items-center justify-center text-center space-y-4 md:col-span-1 min-h-[220px]">
          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Credito Disponibile</p>
          
          {isLoadingProfile ? (
            <Loader2 className="animate-spin text-zinc-300 my-2" size={32} />
          ) : (
            <div className="text-5xl font-black text-zinc-800 tracking-tight">
              €{currentBalance.toFixed(2)}
            </div>
          )}
          
          <p className="text-xs text-zinc-400 font-medium max-w-[180px]">
            Questo credito verrà applicato automaticamente al tuo prossimo checkout.
          </p>
        </div>

        {/* Card Riscatta Codice */}
        <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl shadow-zinc-200/50 border border-white md:col-span-2 space-y-6">
          <div className="flex items-center gap-3 border-b border-zinc-100 pb-4">
            <Ticket className="text-[#8cc665]" size={24} />
            <h3 className="font-black uppercase text-zinc-800 tracking-tight text-sm">
              Hai un newline codice da riscattare?
            </h3>
          </div>

          <form onSubmit={handleRedeem} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="ES. XXX-XXXX-XXXX-XXXX"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                disabled={isPending || isLoadingProfile}
                className="flex-1 bg-zinc-50 border border-zinc-200 px-5 py-4 rounded-2xl text-sm font-bold uppercase tracking-wider placeholder:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-[#1e73be] focus:bg-white transition-all disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={isPending || isLoadingProfile}
                className="bg-[#8cc665] text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-102 active:scale-98 transition-all shadow-lg shadow-[#8cc665]/20 flex items-center justify-center gap-2 whitespace-nowrap disabled:opacity-70 disabled:hover:scale-100"
              >
                {isPending ? (
                  <>
                    <Loader2 className="animate-spin" size={16} />
                    Attendere...
                  </>
                ) : (
                  "Riscatta Credito"
                )}
              </button>
            </div>
          </form>

          {/* Feedback Messaggi */}
          {error && (
            <div className="flex items-center gap-3 p-4 bg-red-50 text-red-700 rounded-2xl border border-red-100 text-sm font-medium animate-in fade-in zoom-in-95">
              <AlertCircle size={18} className="shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {success && (
            <div className="flex items-center gap-3 p-4 bg-green-50 text-green-700 rounded-2xl border border-green-100 text-sm font-medium animate-in fade-in zoom-in-95">
              <CheckCircle2 size={18} className="shrink-0" />
              <p>{success}</p>
            </div>
          )}
        </div>
      </div>

      {/* Box Informazioni Condizioni */}
      <div className="bg-zinc-50/50 rounded-[2.5rem] p-8 border border-zinc-100 flex gap-4 items-start">
        <Info className="text-[#1e73be] shrink-0 mt-0.5" size={20} />
        <div className="space-y-1">
          <h4 className="font-bold text-zinc-700 text-sm uppercase tracking-tight">Informazioni importanti sulle Gift Card</h4>
          <ul className="text-xs text-zinc-500 font-medium space-y-2 list-disc list-inside pt-1">
            <li>Una volta riscattato, il valore del codice viene caricato permanentemente sul tuo account.</li>
            <li>Le Gift Card hanno una validità di <span className="font-bold text-zinc-700">3 mesi</span> a partire dalla loro data di attivazione. Assicurati di riscattarle prima della scadenza.</li>
            <li>Il credito nel portafoglio non è scalabile o rimborsabile in denaro contante ed è utilizzabile per qualsiasi prodotto presente sullo shop.</li>
          </ul>
        </div>
      </div>

    </div>
  )
}