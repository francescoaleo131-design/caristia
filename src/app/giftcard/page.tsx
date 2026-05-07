"use client"
import { useState } from "react"
import { Gift, CheckCircle2, Send, Smartphone } from "lucide-react"

const TAGLI = [
  { amount: 20, image: "/card20.jpeg" },
  { amount: 50, image: "/card50.jpeg" },
  { amount: 100, image: "/card100.jpeg" },
];

export default function GiftCardPage() {
  const [selectedTaglio, setSelectedTaglio] = useState(TAGLI[1]);

  return (
    <div className="min-h-screen bg-zinc-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-[#1e73be] uppercase italic tracking-tight">
            Gift Card <span className="text-[#8cc665]">Caristia</span>
          </h1>
          <p className="text-gray-500 mt-2 font-medium">Il regalo perfetto, pronto in un secondo.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">

          <div className="relative group">
            <div
              className="w-full aspect-[1.6/1] rounded-[2rem] p-8 text-white shadow-2xl transition-all duration-500 overflow-hidden relative"
              style={{
                backgroundImage: `url(${selectedTaglio.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              {/* Overlay for readability */}
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors duration-500"></div>

              <div className="relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-start">
                  <Gift size={40} className="opacity-90" />
                  <span className="text-4xl font-black italic">€{selectedTaglio.amount}</span>
                </div>

                <div className="mt-12">
                  <p className="text-xs uppercase tracking-[0.2em] opacity-90 font-bold">Codice Regalo</p>
                  <p className="text-xl font-mono font-bold tracking-widest mt-1">CAR-XXXX-XXXX</p>
                </div>

                <div className="mt-auto flex justify-between items-end border-t border-white/20 pt-4">
                  <p className="text-[10px] uppercase font-bold tracking-widest">Valida in negozio e online</p>
                  <img src="/icon.jpg" alt="Logo" className="h-8 w-auto brightness-0 invert opacity-70" />
                </div>
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-[#8cc665]/10 rounded-full blur-3xl -z-10"></div>
          </div>

          <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-gray-100">
            <h3 className="text-lg font-black text-gray-800 uppercase mb-6">Scegli l'importo</h3>

            <div className="grid grid-cols-2 gap-4 mb-8">
              {TAGLI.map((taglio) => (
                <button
                  key={taglio.amount}
                  onClick={() => setSelectedTaglio(taglio)}
                  className={`py-4 rounded-2xl font-black transition-all ${selectedTaglio.amount === taglio.amount
                      ? "bg-[#1e73be] text-white shadow-lg scale-105"
                      : "bg-gray-50 text-gray-400 hover:bg-gray-100"
                    }`}
                >
                  €{taglio.amount}
                </button>
              ))}
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3 text-sm text-gray-600 font-medium">
                <CheckCircle2 size={18} className="text-[#8cc665]" />
                Consegna istantanea via Email
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600 font-medium">
                <Smartphone size={18} className="text-[#8cc665]" />
                QR Code incluso per uso in negozio
              </div>
            </div>

            <button className="w-full bg-[#8cc665] hover:bg-[#76b054] text-white font-black py-5 rounded-2xl uppercase tracking-widest transition-all shadow-lg active:scale-95">
              Acquista Ora
            </button>
          </div>

        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-md text-[#1e73be]">1</div>
            <h4 className="font-bold text-gray-800 uppercase text-sm mb-2">Scegli e paga</h4>
            <p className="text-xs text-gray-500">Seleziona l'importo e completa l'acquisto in sicurezza.</p>
          </div>
          <div>
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-md text-[#1e73be]">2</div>
            <h4 className="font-bold text-gray-800 uppercase text-sm mb-2">Ricevi il QR Code</h4>
            <p className="text-xs text-gray-500">Ricevi subito il codice via email pronto da stampare o girare.</p>
          </div>
          <div>
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-md text-[#1e73be]">3</div>
            <h4 className="font-bold text-gray-800 uppercase text-sm mb-2">Usa dove vuoi</h4>
            <p className="text-xs text-gray-500">Inserisci il codice sul sito o mostralo in negozio a Caltagirone.</p>
          </div>
        </div>
      </div>
    </div>
  )
}