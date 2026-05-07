"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image"; // Passiamo a Next Image per stabilità

const slides = [
  {
    title: "Ci occupiamo dei tuoi compleanni!",
    btnText: "Scopri di più",
    link: "/animazione",
    color: "text-blue-600",
    image: "/banner_animazioni.png" 
  },
  {
    title: "Giocattoli per lui e per lei!",
    btnText: "Vai allo Shop",
    link: "/shop",
    color: "text-pink-500",
    image: "/banner_negozio.png"
  },
  {
    title: "Crea la tua Lista Compleanno!",
    btnText: "Crea ora",
    link: "/liste",
    color: "text-yellow-600",
    image: "/banner_liste.png"
  }
];

export default function DynamicHero() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 4000); 
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-[400px] md:h-[500px] w-full overflow-hidden bg-slate-200">
      
      {/* --- LIVELLO 1: IMMAGINI DI SFONDO --- */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={slides[index].image}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 w-full h-full"
          >
            <Image
              src={slides[index].image}
              alt="Sfondo"
              fill
              priority
              sizes="200vw"
              unoptimized
              className="object-cover object-center" // Forza il riempimento proporzionale
            />
          </motion.div>
        </AnimatePresence>
        
        {/* Overlay fisso */}
        <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-[1]" />
      </div>

      {/* --- LIVELLO 2: CONTENUTO (Testo e Bottone) --- */}
      <div className="absolute inset-0 z-10 flex items-center justify-center">
        <div className="w-full max-w-4xl px-6 text-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center"
            >
              <h1 className={`text-3xl md:text-5xl lg:text-7xl font-black ${slides[index].color} leading-tight drop-shadow-sm`}>
                {slides[index].title}
              </h1>

              <div className="mt-10">
                <Link href={slides[index].link}>
                  <button className="bg-[#8cc665] hover:bg-[#7ab554] text-white text-lg md:text-xl font-bold py-4 px-10 rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95">
                    {slides[index].btnText}
                  </button>
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* --- LIVELLO 3: DECORAZIONI (Opzionali) --- */}
      <div className="absolute inset-0 pointer-events-none z-[5]">
        <motion.div 
          animate={{ x: [0, 20, 0], opacity: [0.2, 0.3, 0.2] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-[-10%] left-[-5%] w-64 h-64 bg-blue-200 rounded-full blur-[80px]"
        />
        <motion.div 
          animate={{ x: [0, -20, 0], opacity: [0.2, 0.3, 0.2] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute bottom-[-10%] right-[-5%] w-80 h-80 bg-pink-200 rounded-full blur-[90px]"
        />
      </div>
    </section>
  );
}