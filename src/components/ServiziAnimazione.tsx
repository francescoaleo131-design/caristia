import React from "react"

const servizi = [
  { nome: "Giochi a tema", img: "/clown.png" },
  { nome: "Giocolieri", img: "/giocolieri.png" },
  { nome: "Baby Dance", img: "/baby_dance.png" },
  { nome: "Karaoke", img: "/karaoke.png" },
  { nome: "Bolle Di Sapone", img: "/bolle.png" },
  { nome: "Mascotte", img: "/mascotte.png" },
  { nome: "Palloncini Modellabili", img: "/palloncini.png" },
]

export default function ServiziIcone() {
  return (
    <section className="py-10 bg-white">
      <div className="container mx-auto px-4">
        
   
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-8 items-start justify-center">
          {servizi.map((servizio, index) => (
            <div key={index} className="flex flex-col items-center text-center group">
              
              {/* Contenitore con ALTEZZA e LARGHEZZA fissa per uniformare */}
              <div className="mb-4 h-24 w-24 md:h-28 md:w-28 flex items-center justify-center transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110">
                <img 
                  src={servizio.img} 
                  alt={servizio.nome}
                  className="h-full w-full object-contain"
                />
              </div>
              
              <h3 className="text-[#1e73be] font-black text-sm md:text-base leading-tight uppercase tracking-tighter max-w-[120px]">
                {servizio.nome}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}