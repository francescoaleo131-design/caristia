import React from "react"
import { Gift, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function VantaggiPromo() {
  return (
    <section className="py-4">
      <div className="container mx-auto px-4 flex justify-center">
        
        {/* Card centrata orizzontalmente con max-w-md */}
        <div className="bg-white p-6 rounded-3xl flex flex-col justify-between shadow-lg border-b-4 border-[#8cc665] w-full max-w-md">
          <div className="flex items-center gap-5 mb-6">
            <div className="bg-[#8cc665]/10 p-4 rounded-2xl shrink-0">
              <Gift className="text-[#8cc665]" size={40} />
            </div>
            <div>
              <h4 className="text-[#1e73be] font-black uppercase text-lg leading-none mb-1">
                Lista Compleanno
              </h4>
              <p className="text-gray-600 text-sm leading-tight">
                Aprila ora e ricevi la <span className="font-bold text-[#8cc665]">Sacca Sponsorizzata</span> + un <span className="font-bold text-[#8cc665]">Buono del 10%</span>!
              </p>
            </div>
          </div>
          
          <Link 
            href="/lista-compleanno" 
            className="flex items-center justify-center gap-2 w-full py-3 bg-[#8cc665] hover:bg-[#7ab356] text-white font-bold rounded-xl transition-all uppercase text-sm tracking-wider group"
          >
            Crea la tua Lista
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

      </div>
    </section>
  )
}