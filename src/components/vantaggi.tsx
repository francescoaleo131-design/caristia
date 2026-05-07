import React from "react"
import { Gift, Ticket, ArrowRight } from "lucide-react"
import Link from "next/link" // Importante per la navigazione in Next.js

export default function VantaggiPromo() {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          
          {/* Promo Lista Compleanno con Bottone */}
          <div className="bg-white p-6 rounded-3xl flex flex-col justify-between shadow-lg border-b-4 border-[#8cc665]">
            <div className="flex items-center gap-5 mb-4">
              <div className="bg-[#8cc665]/10 p-4 rounded-2xl shrink-0">
                <Gift className="text-[#8cc665]" size={40} />
              </div>
              <div>
                <h4 className="text-[#1e73be] font-black uppercase text-lg leading-none mb-1">Lista Compleanno</h4>
                <p className="text-gray-600 text-sm leading-tight">
                  Aprila ora e ricevi la <span className="font-bold text-[#8cc665]">Sacca Sponsorizzata</span> + un <span className="font-bold text-[#8cc665]">Buono del 10%</span>!
                </p>
              </div>
            </div>
            
            {/* Bottone per la creazione della lista */}
            <Link 
              href="/lista-compleanno" 
              className="flex items-center justify-center gap-2 w-full py-3 bg-[#8cc665] hover:bg-[#7ab356] text-white font-bold rounded-xl transition-all uppercase text-sm tracking-wider group"
            >
              Crea la tua Lista
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Promo Tessera VIP (Semplice) */}
          <div className="bg-white p-6 rounded-3xl flex items-center gap-5 shadow-lg border-b-4 border-yellow-400">
            <div className="bg-yellow-400/10 p-4 rounded-2xl shrink-0">
              <Ticket className="text-yellow-500" size={40} />
            </div>
            <div>
              <h4 className="text-[#1e73be] font-black uppercase text-lg leading-none mb-1">Tessera VIP</h4>
              <p className="text-gray-600 text-sm leading-tight">
                Tua a soli <span className="font-bold">10€</span>. Ottieni subito sconti fino al <span className="font-bold text-yellow-600">30%</span> su tutti i servizi!
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}