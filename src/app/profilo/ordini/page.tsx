"use client"
import React, { useEffect, useState } from "react"
import { Package, ShoppingBag, Archive, Calendar, Euro, CreditCard } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

export default function OrdiniPage() {
  const supabase = createClient()
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchOrders() {
      try {
        setLoading(true)
        
        // 1. Recupera la sessione attiva dell'utente nel client
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError) throw sessionError
        
        const userEmail = session?.user?.email

        // Se l'utente è loggato e ha un'email valida, eseguiamo la query
        if (userEmail) {
          console.log("👤 Tentativo di recupero ordini per l'email:", userEmail)

          const { data, error } = await supabase
            .from("orders")
            .select("*")
            .eq("customer_email", userEmail) // Cerca la corrispondenza esatta con la colonna del DB
            .order("created_at", { ascending: false })

          if (error) throw error

          setOrders(data || [])
        } else {
          console.warn("⚠️ Nessuna sessione utente attiva trovata.")
        }
      } catch (error) {
        console.error("❌ Errore durante il caricamento degli ordini:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [supabase])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <div className="w-12 h-12 border-4 border-[#1e73be] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-black uppercase tracking-widest text-zinc-400">Caricamento ordini...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      
      {/* Intestazione */}
      <div>
        <div className="bg-white w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto shadow-xl shadow-[#1e73be]/10 border border-zinc-100 mb-4">
          <Archive className="text-[#1e73be]" size={36} />
        </div>
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-black uppercase tracking-tighter text-zinc-800">
            I Miei <span className="text-[#1e73be]">Ordini</span>
          </h1>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Traccia i tuoi acquisti e le spedizioni</p>
        </div>
      </div>

      {/* Vista se l'utente non ha ordini nel database */}
      {orders.length === 0 ? (
        <div className="bg-white rounded-[2.5rem] p-12 shadow-2xl shadow-zinc-200/50 border border-white flex flex-col items-center justify-center text-center space-y-6">
          <div className="bg-zinc-50 w-24 h-24 rounded-[2rem] flex items-center justify-center shadow-inner">
            <ShoppingBag className="text-zinc-200" size={48} />
          </div>
          
          <div className="space-y-2">
            <h3 className="font-black uppercase text-zinc-800 tracking-tight">Ancora nessun ordine</h3>
            <p className="text-sm text-zinc-400 font-medium max-w-xs mx-auto">
              Sembra che tu non abbia ancora effettuato acquisti. Corri a scoprire le ultime novità in negozio!
            </p>
          </div>

          <a href="/shop" className="bg-[#8cc665] text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-lg shadow-[#8cc665]/20 inline-block">
            Inizia lo Shopping 
          </a>
        </div>
      ) : (
        /* Vista dinamica degli ordini estratti */
        <div className="space-y-4">
          {orders.map((ordine) => (
            <div key={ordine.id} className="bg-white rounded-3xl p-6 shadow-xl shadow-zinc-100 border border-zinc-100 hover:border-zinc-200 transition-all">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-100 pb-4 mb-4">
                
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-zinc-400 uppercase tracking-wider">Ordine ID:</span>
                    <span className="text-xs font-bold text-zinc-700 truncate max-w-[180px] md:max-w-xs">
                      {ordine.stripe_session_id ? ordine.stripe_session_id.substring(0, 15) + '...' : ordine.id}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-zinc-500 font-medium">
                    <span className="flex items-center gap-1">
                      <Calendar size={14} className="text-zinc-400" /> 
                      {new Date(ordine.created_at).toLocaleDateString('it-IT')}
                    </span>
                    <span className="flex items-center gap-1 font-bold text-zinc-800">
                      <Euro size={14} className="text-zinc-400" /> 
                      {ordine.total_amount?.toFixed(2) || "0.00"}
                    </span>
                  </div>
                </div>

                <div>
                  <span className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider inline-flex items-center gap-1.5 ${
                    ordine.status === 'paid' 
                      ? 'bg-green-50 text-green-600' 
                      : 'bg-amber-50 text-amber-600'
                  }`}>
                    <CreditCard size={12} />
                    {ordine.status === 'paid' ? 'Pagato' : ordine.status || 'In attesa'}
                  </span>
                </div>
              </div>

              {/* Prodotti dell'ordine */}
              <div className="space-y-3">
                {Array.isArray(ordine.items) && ordine.items.map((item: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between text-sm bg-zinc-50 p-3 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="bg-white p-1.5 rounded-lg border border-zinc-200">
                        <Package size={16} className="text-zinc-400" />
                      </div>
                      <div>
                        <p className="font-bold text-zinc-800">{item.name || item.title || 'Prodotto'}</p>
                        <p className="text-xs text-zinc-400 font-medium">Quantità: {item.quantity || 1}</p>
                      </div>
                    </div>
                    <span className="font-black text-zinc-600">
                      €{((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Indirizzo di Spedizione */}
              {ordine.shipping_address && (
                <div className="mt-4 pt-3 border-t border-zinc-100 text-left">
                  <p className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">Spedito a:</p>
                  <p className="text-xs font-medium text-zinc-500 truncate">{ordine.shipping_address}</p>
                </div>
              )}

            </div>
          ))}
        </div>
      )}
    </div>
  )
}