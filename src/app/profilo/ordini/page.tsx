"use client"
import { Package, Search, ShoppingBag, Archive } from "lucide-react"

export default function OrdiniPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
     <div className="bg-white w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto shadow-xl shadow-[#1e73be]/10 border border-zinc-100">
                  <Archive className="text-[#1e73be]" size={36} />
                </div>
      <div className="text-center md:text-left space-y-2">
        <h1 className="text-3xl font-black uppercase tracking-tighter text-zinc-800 text-center">
          I Miei <span className="text-[#1e73be]">Ordini</span>
        </h1>
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 text-center">Traccia i tuoi acquisti e le spedizioni</p>
      </div>

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

        <button className="bg-[#8cc665] text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-lg shadow-[#8cc665]/20">
          Inizia lo Shopping 
        </button>
      </div>
    </div>
  )
}