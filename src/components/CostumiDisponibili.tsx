import React from "react"

const Costumi = [
  { nome: "Batman", img: "/icon_mascotte_batman.webp" },
  { nome: "Spiderman", img: "/icon_mascotte_spiderman.webp" },
  { nome: "Superman", img: "/icon_mascotte_superman.webp" },
  { nome: "Elsa", img: "/icon_mascotte_frozen.webp" },
  { nome: "Anna", img: "/icon_mascotte_anna.webp" },
]

interface CostumiDisponibiliProps {
  onSelectCostume: (name: string) => void
}

export default function CostumiDisponibili({ onSelectCostume }: CostumiDisponibiliProps) {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-8 items-start justify-center">
          {Costumi.map((item, index) => (
            <button 
              key={index} 
              onClick={() => onSelectCostume(item.nome)}
              className="flex flex-col items-center text-center group cursor-pointer border-none bg-transparent outline-none"
            >
              
              {/* Contenitore Immagine con Placeholder */}
              <div className="mb-4 h-24 w-24 md:h-32 md:w-32 flex items-center justify-center transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110">
                <img 
                  src={item.img} 
                  alt={item.nome}
                  className="h-full w-full object-contain"
                  onError={(e: any) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
                <div className="hidden text-[10px] font-bold text-slate-300 uppercase">Immagine</div>
              </div>
              
              <h3 className="text-[#1e73be] font-black text-sm md:text-base leading-tight uppercase tracking-tighter max-w-[120px] group-hover:text-pink-500 transition-colors">
                {item.nome}
              </h3>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
