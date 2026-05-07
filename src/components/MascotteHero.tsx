import React from "react"
import Link from "next/link"

export default function MascotteHero() {
  return (
    <section className="relative h-[350px] md:h-[500px] w-full flex items-center justify-center overflow-hidden bg-slate-200">
      {/* Sfondo con Blur (Placeholder per immagine) */}
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 animate-pulse flex items-center justify-center">
          <span className="text-slate-400 font-bold uppercase tracking-widest opacity-30">Spazio per Immagine Mascotte</span>
        </div>
        {/* Overlay per leggibilità */}
        <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] z-1" />
      </div>

      {/* CONTENITORE TESTUALE */}
      <div className="relative z-10 px-4 flex flex-col items-center justify-center text-center">
        <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-blue-700 tracking-tighter drop-shadow-sm uppercase">
          Mascotte Caristia
        </h1>

        <h4 className="mt-4 text-xl md:text-3xl lg:text-4xl font-extrabold max-w-4xl leading-tight">
          Porta la magia dei tuoi <span className="text-pink-500">personaggi preferiti</span> direttamente alla tua festa!
        </h4>
        
        <Link 
          href="#prenota" 
          className="mt-8 bg-[#8cc665] hover:bg-[#1e73be] text-white font-black py-4 px-10 rounded-full uppercase tracking-widest transition-all shadow-lg hover:shadow-green-500/20 active:scale-95 inline-block"
        >
          Scegli la tua Mascotte
        </Link>
      </div>
    </section>
  )
}
