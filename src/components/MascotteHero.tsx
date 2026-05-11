import React from "react"
import Link from "next/link"
import Img from "next/image"
export default function MascotteHero() {
  return (
    <section className="relative h-[350px] md:h-[500px] w-full flex items-center justify-center overflow-hidden bg-slate-200">
      {/* Sfondo con Blur (Placeholder per immagine) */}
 <div className="absolute inset-0 z-0">
  {/* Sfondo di fallback mentre l'immagine carica */}
  <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-purple-100" />
  
  <img
    src="/main_mascotte.png"
    alt="Mascotte Caristia"
    // object-cover riempie tutto lo spazio, object-center la tiene centrata
    className="relative w-full h-full object-cover object-center shadow-inner"
    // Se usi Next.js "Image", aggiungi 'priority' per caricarla subito
  />
  
  {/* Overlay opzionale se vuoi che il testo sopra si legga meglio */}
  <div className="absolute inset-0 bg-white/20 backdrop-blur-[2px]" />
</div>

      {/* CONTENITORE TESTUALE */}
      <div className="relative z-10 px-4 flex flex-col items-center justify-center text-center">
        <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-blue-700 tracking-tighter drop-shadow-sm uppercase">
          Mascotte Caristia
        </h1>

        <h4 className="mt-4 text-xl md:text-3xl lg:text-4xl font-extrabold max-w-4xl leading-tight">
          Porta la magia dei tuoi personaggi preferiti direttamente alla tua festa!
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
