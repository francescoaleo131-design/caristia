"use client"
import React from "react"
import { CheckCircle2, UserCheck, Shirt } from "lucide-react"

const pacchetti = [
  {
    id: "solo_abito",
    nome: "Solo Abito",
    prezzo: 30,
    desc: "Il noleggio del costume per 24 ore",
    icon: <Shirt className="text-blue-500" size={32} />,
    features: [
      "Lavaggio incluso",
      "Ritiro in negozio",
      "Riconsegna entro 24h",
      "Vasta scelta di personaggi"
    ],
    btnText: "Prenota Abito",
    color: "border-blue-100 bg-blue-50/30"
  },
  {
    id: "assistente_integrato",
    nome: "Assistente Integrato",
    prezzo: 50,
    desc: "Costume + operatore che lo indossa",
    icon: <UserCheck className="text-[#8cc665]" size={32} />,
    features: [
      "Operatore specializzato",
      "Durata: 1 ora circa",
      "Momento foto e torta",
      "Trasporto incluso (Calatino)",
      "Zero pensieri per te"
    ],
    btnText: "Prenota con Assistente",
    color: "border-green-100 bg-green-50/30 shadow-xl scale-105"
  }
]

interface MascottePackagesProps {
  onSelect: (pkg: typeof pacchetti[0]) => void
}

export default function MascottePackages({ onSelect }: MascottePackagesProps) {
  return (
    <section id="prenota" className="py-5 md:py-20 bg-white">
      <div className="container mx-auto px-4 text-center">
        <p className="text-slate-500 font-bold mb-16 max-w-2xl mx-auto">
          Scegli la soluzione più adatta alle tue esigenze. Dal semplice noleggio all'animazione completa.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {pacchetti.map((p) => (
            <div 
              key={p.id} 
              className={`flex flex-col p-8 rounded-[3rem] border-4 transition-all hover:translate-y-[-8px] ${p.color}`}
            >
              <div className="mb-6 flex justify-center">{p.icon}</div>
              
              <h3 className="text-2xl font-black text-slate-800 uppercase mb-2">{p.nome}</h3>
              <div className="text-5xl font-black text-slate-900 mb-4">
                €{p.prezzo}
              </div>
              <p className="text-slate-500 font-bold italic mb-8 h-12">{p.desc}</p>

              <ul className="space-y-4 mb-10 text-left flex-grow">
                {p.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-3 font-bold text-slate-700">
                    <CheckCircle2 className="text-[#8cc665] shrink-0 mt-1" size={20} />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <button 
                onClick={() => onSelect(p)}
                className="w-full bg-slate-900 text-white font-black py-5 rounded-2xl uppercase tracking-widest hover:bg-[#1e73be] transition-all shadow-lg active:scale-95"
              >
                {p.btnText}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
