"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const phrases = [
  "I migliori giocattoli per i tuoi figli",
  "Organizza il compleanno perfetto",
  "Crea la tua Lista Regali online",
  "Spedizione gratuita sopra i 50€"
];

export default function AnimatedText() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % phrases.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="h-6 overflow-hidden flex items-center">
      <AnimatePresence mode="wait">
        <motion.span
          key={phrases[index]}
          initial={{ y: 20, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }}  
          exit={{ y: -20, opacity: 0 }}   
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="text-sm font-medium text-blue-100 block"
        >
          {phrases[index]}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}