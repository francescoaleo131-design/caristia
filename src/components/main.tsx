"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";

const slides = [
  {
    title: "Ci occupiamo dei tuoi compleanni!",
    btnText: "Scopri di più",
    link: "/animazione",
    color: "text-blue-600"
  },
  {
    title: "Giocattoli per lui e per lei!",
    btnText: "Vai allo Shop",
    link: "/shop",
    color: "text-pink-500"
  },
  {
    title: "Crea la tua Lista Compleanno!",
    btnText: "Crea ora",
    link: "/lista_compleanno",
    color: "text-yellow-600"
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
    /* 1. Ridotta l'altezza a h-[450px] per un look più compatto e alto nella pagina */
    /* 2. mt-0 assicura che sia attaccato all'header */
    <section className="relative h-[400px] md:h-[450px] w-full flex flex-col items-center justify-center bg-blue-50 overflow-hidden mt-0">
      
      {/* ANIMAZIONE TESTO E PULSANTE */}
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 15 }} // y ridotto per un'animazione più scattante
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="text-center px-4 z-10"
        >
          {/* TITOLO DINAMICO: Ridotto leggermente il margine mb-6 */}
          <h1 className={`text-3xl md:text-5xl font-black mb-6 ${slides[index].color} leading-tight`}>
            {slides[index].title}
          </h1>

          {/* PULSANTE DINAMICO */}
          <Link href={slides[index].link}>
            <button className="bg-[#8cc665] hover:bg-[#7ab554] text-lg md:text-xl font-bold py-3 px-8 md:py-4 md:px-10 rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95">
              {slides[index].btnText}
            </button>
          </Link>
        </motion.div>
      </AnimatePresence>

      {/* DECORAZIONI: Riposizionate per l'altezza ridotta */}
      <motion.div 
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute top-10 left-5 w-24 h-24 bg-blue-200 rounded-full opacity-30 blur-xl"
      />
      <motion.div 
        animate={{ y: [0, 15, 0] }}
        transition={{ duration: 5, repeat: Infinity }}
        className="absolute bottom-10 right-5 w-32 h-32 bg-pink-200 rounded-full opacity-30 blur-xl"
      />
    </section>
  );
}