"use client"
import Link from "next/link"
import { Home, Search, Ghost } from "lucide-react"

export default function NotFound() {
  return (
    /* Aggiunto pt-40 per spingere tutto il contenuto sotto la Navbar */
    <div className="min-h-screen flex flex-col items-center justify-start pt-10 pb-12 px-4 bg-white font-sans">
      <div className="max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in-95 duration-700">
        
        {/* ICONA GIOCOSA */}
        <div className="relative inline-block">
          {/* Contenitore cerchio azzurro */}
          <div className="bg-[#1e73be]/5 w-32 h-32 rounded-[3rem] flex items-center justify-center mx-auto rotate-6">
            <Ghost size={64} className="text-[#1e73be] animate-bounce" />
          </div>
          
          {/* Label "Oops!" - Abbassata e centrata leggermente meglio */}
          <div className="absolute -bottom-2 right-0 bg-[#8cc665] text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg shadow-green-100 border-2 border-white">
            Oops!
          </div>
        </div>

        {/* TESTO */}
        <div className="space-y-3 pt-4">
          <h1 className="text-7xl font-black italic tracking-tighter text-zinc-100 leading-none">404</h1>
          <h2 className="text-2xl font-black uppercase italic tracking-tighter text-zinc-800">
            Pagina   <span className="text-[#1e73be]">Smarrita!</span>
          </h2>
          <p className="text-zinc-400 font-bold uppercase tracking-widest text-[10px] leading-relaxed max-w-[250px] mx-auto">
            Sembra che questa pagina non esista! ma non preoccuparti!
          </p>
        </div>

        {/* AZIONI */}
        <div className="flex flex-col gap-3 pt-4">
          <Link 
            href="/"
            className="flex items-center justify-center gap-3 bg-[#1e73be] text-white py-5 rounded-[2rem] font-black uppercase italic tracking-widest text-xs hover:scale-105 transition-all shadow-xl shadow-blue-200"
          >
            <Home size={18} /> Torna alla Home
          </Link>

        </div>

        {/* FOOTER DECORATIVO */}
        <div className="pt-12 opacity-20">
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-400">Giocattoli Caristia</p>
        </div>
      </div>
    </div>
  )
}