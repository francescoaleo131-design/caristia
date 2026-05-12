import React from "react"

const mascotte = [
  { nome: "Minnie & Topolino", img: "/icon_mascotte_topolino.webp" },
  { nome: "Puffo", img: "/icon_mascotte_puffo.webp" },
  { nome: "Peppa pig", img: "/icon_mascotte_peppa.webp" },
  { nome: "Stich", img: "/icon_mascotte_stich.webp" },
  { nome: "Angel", img: "/icon_mascotte_angel.webp" },
  { nome: "Bing", img: "/icon_mascotte_bing.webp" },
]

interface MascotteDisponibiliProps {
  onSelectMascot: (name: string) => void
}

export default function MascotteDisponibili({ onSelectMascot }: MascotteDisponibiliProps) {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        {/* Usiamo justify-items-center per allineare perfettamente le colonne */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-6 justify-items-center">
          {mascotte.map((item, index) => (
            <button 
              key={index} 
              onClick={() => onSelectMascot(item.nome)}
              className="flex flex-col items-center text-center group cursor-pointer border-none bg-transparent outline-none w-full"
            >
              
              {/* CONTENITORE FISSO: h-32 w-32 garantisce che siano tutti quadrati uguali */}
              <div className="mb-4 h-24 w-24 sm:h-32 sm:w-32 flex items-center justify-center bg-slate-50 rounded-2xl p-3 transition-all duration-300 group-hover:bg-pink-50 group-hover:shadow-md">
                <img 
                  src={item.img} 
                  alt={item.nome}
                  // w-full h-full + object-contain fa sì che l'immagine si adatti senza mai superare i bordi
                  className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
                  onError={(e: any) => {
                    e.target.style.display = 'none';
                    if (e.target.nextSibling) e.target.nextSibling.style.display = 'block';
                  }}
                />
                <div className="hidden text-[10px] font-bold text-slate-300 uppercase">
                  {item.nome}
                </div>
              </div>
              
              <h3 className="text-[#1e73be] font-black text-xs md:text-sm leading-tight uppercase tracking-tighter group-hover:text-pink-500 transition-colors">
                {item.nome}
              </h3>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}