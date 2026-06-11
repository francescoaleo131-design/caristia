"use client"
import React, { useEffect, useState } from "react"
import { Receipt, FileText, Download, CreditCard, BookOpen, Calendar, Euro } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

export default function FatturazionePage() {
  const supabase = createClient()
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchBillingData() {
      try {
        setLoading(true)
        
        // 1. Recupera la sessione dell'utente attualmente loggato
        const { data: { session } } = await supabase.auth.getSession()
        const user = session?.user
        
        if (user && user.email) {
          // 2. Recupera solo gli ordini pagati con successo per mostrare i documenti fiscali
          const { data, error } = await supabase
            .from("orders")
            .select("*")
            .eq("customer_email", user.email)
            .eq("status", "paid")
            .order("created_at", { ascending: false })

          if (error) throw error
          setOrders(data || [])
        }
      } catch (error) {
        console.error("Errore nel recupero dei dati di fatturazione:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchBillingData()
  }, [supabase])

  // Funzione di cortesia per stampare o salvare i dettagli della ricevuta
  const handleDownloadReceipt = (ordine: any) => {
    // Se salvi la ricevuta di Stripe puoi fare il redirect, altrimenti apri la finestra di stampa dell'ordine
    if (ordine.stripe_session_id) {
      window.open(`https://dashboard.stripe.com/receipts/invoices/`, "_blank")
    } else {
      window.print()
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <div className="w-12 h-12 border-4 border-[#8cc665] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-black uppercase tracking-widest text-zinc-400">Caricamento documenti...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      
      {/* Icona e Intestazione */}
      <div>
        <div className="bg-white w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto shadow-xl shadow-[#1e73be]/10 border border-zinc-100 mb-4">
          <BookOpen className="text-[#1e73be]" size={36} />
        </div>
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-black uppercase tracking-tighter text-zinc-800">
            Dati <span className="text-[#8cc665]">Fatturazione</span>
          </h1>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Ricevute, fatture e metodi di pagamento</p>
        </div>
      </div>

      {/* Grid delle Statistiche Dinamiche */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-[2rem] shadow-xl shadow-zinc-200/40 border border-white flex items-center gap-4">
          <div className="bg-[#1e73be]/10 p-4 rounded-2xl text-[#1e73be]">
            <Receipt size={24} />
          </div>
          <div>
            <p className="text-[9px] font-black uppercase text-zinc-400 tracking-widest">Documenti disponibili</p>
            <p className="text-xl font-black text-zinc-800">
              {orders.length} {orders.length === 1 ? "Ricevuta" : "Ricevute"}
            </p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-[2rem] shadow-xl shadow-zinc-200/40 border border-white flex items-center gap-4">
          <div className="bg-[#8cc665]/10 p-4 rounded-2xl text-[#8cc665]">
            <CreditCard size={24} />
          </div>
          <div>
            <p className="text-[9px] font-black uppercase text-zinc-400 tracking-widest">Metodo Predefinito</p>
            <p className="text-xl font-black text-zinc-800">
              {orders.length > 0 ? "Carta di Credito" : "Nessuno"}
            </p>
          </div>
        </div>
      </div>

      {/* Contenitore Storico Documenti */}
      <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-2xl shadow-zinc-200/50 border border-white">
        <div className="p-6 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Storico Documenti</span>
          <FileText size={16} className="text-zinc-300" />
        </div>
        
        {orders.length === 0 ? (
          /* Stato Vuoto Reale */
          <div className="p-12 text-center space-y-4">
            <p className="text-zinc-300 font-bold">Nessuna fattura emessa al momento.</p>
            <div className="w-full h-px bg-zinc-50"></div>
            <p className="text-[9px] font-black uppercase text-zinc-400 tracking-[0.2em]">
              Le fatture verranno generate automaticamente dopo ogni acquisto.
            </p>
          </div>
        ) : (
          /* Tabella / Lista Documenti Dinamica */
          <div className="divide-y divide-zinc-100">
            {orders.map((ordine) => (
              <div key={ordine.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-zinc-50/50 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="bg-zinc-100 p-3 rounded-xl text-zinc-500 mt-1">
                    <FileText size={20} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-black text-zinc-800 uppercase tracking-tight">
                      Ricevuta d'acquisto
                    </p>
                    <p className="text-xs text-zinc-400 font-bold">
                      ID: <span className="text-zinc-600 font-medium">{ordine.stripe_session_id ? ordine.stripe_session_id.substring(0, 15) + '...' : ordine.id}</span>
                    </p>
                    <div className="flex items-center gap-3 text-xs text-zinc-500 pt-1 font-medium">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} className="text-zinc-400" />
                        {new Date(ordine.created_at).toLocaleDateString('it-IT')}
                      </span>
                      <span className="flex items-center gap-1 font-bold text-zinc-800">
                        <Euro size={12} className="text-zinc-400" />
                        {ordine.total_amount.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottone Scarica Documento */}
                <button 
                  onClick={() => handleDownloadReceipt(ordine)}
                  className="bg-zinc-50 hover:bg-[#8cc665] text-zinc-600 hover:text-white border border-zinc-200 hover:border-[#8cc665] px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all group active:scale-95 self-start sm:self-center"
                >
                  <Download size={14} className="group-hover:animate-bounce" />
                  Visualizza
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}