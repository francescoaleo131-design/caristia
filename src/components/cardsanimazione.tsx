import React from "react"
import { CheckCircle2, PlusCircle } from "lucide-react"

const pacchetti = [
  {
    nome: "Speciale Compleanno",
    prezzo: "da 150€",
    desc: "Durata: 2 ore",
    img: "/card_compleanno.png",
    features: ["2/3 Animatori inclusi", "Giochi a tema", "Karaoke", "Giochi a percorso", "Bolle di sapone", "Baby Dance", "Musica"],
    extra: ["Composizioni di palloncini", "Mascotte", "Gonfiabili", "Zucchero filato", "Popcorn"],
    accentColor: "text-[#8cc665]",
    btnBg: "bg-[#1e73be] hover:bg-[#8cc665]"
  },
  {
    nome: "Matrimonio Silver",
    prezzo: "da 290€",
    desc: "Durata: 3 ore",
    img: "/card_matrimonio_3.png",
    features: ["Giochi a tema", "Giochi a percorso", "Laboratori creativi", "Proiettore", "Baby Dance", "Trucca Bimbi", "Palloncini modellabili", "Musica e Karaoke", "Foto con cornice"],
    extra: ["Gonfiabili", "Zucchero filato", "Popcorn", "Giocoliere", "Mascotte"],
    accentColor: "text-[#1e73be]",
    btnBg: "bg-[#1e73be] hover:bg-[#165a94]"
  },
  {
    nome: "Matrimonio Gold",
    prezzo: "da 390€",
    desc: "Durata: 4 ore",
    img: "/card_matrimonio_4.png", 
    features: ["Giochi a tema", "Giochi a percorso", "Laboratori creativi", "Proiettore", "Baby Dance", "Trucca Bimbi", "Palloncini modellabili", "Musica e Karaoke", "Foto con cornice"],
    extra: ["Gonfiabili", "Zucchero filato", "Popcorn", "Giocoliere", "Mascotte"],
    accentColor: "text-[#1e73be]",
    btnBg: "bg-[#8cc665] hover:bg-[#7ab354]" 
  }
]

export default function PacchettiPrezzi() {
  return (
    <section className="py-10 bg-white">
      <div className="container mx-auto text-center px-4">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {pacchetti.map((p, i) => (
            <div key={i} className="flex flex-col bg-white rounded-[2.5rem] shadow-2xl overflow-hidden transition-all hover:scale-[1.02] duration-300 border border-gray-50">

              <div className="h-40 w-full overflow-hidden relative">
                <img src={p.img} alt={p.nome} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent"></div>
              </div>

              <div className="p-6 flex flex-col flex-grow">
                <div className="flex flex-col mb-4 text-left">
                  <h3 className="text-xl font-black uppercase text-gray-800 leading-tight mb-1">{p.nome}</h3>
                  <span className={`text-2xl font-black ${p.accentColor}`}>{p.prezzo}</span>
                </div>

                <p className="font-bold text-gray-500 mb-6 italic text-left text-sm">{p.desc}</p>

                <ul className="space-y-2 mb-8 flex-grow">
                  {p.features.map((f, idx) => (
                    <li key={idx} className="flex items-start gap-2 font-medium text-gray-700 text-left text-xs md:text-sm">
                      <CheckCircle2 className="text-[#8cc665] shrink-0 mt-0.5" size={16} />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto pt-6 border-t border-gray-100 mb-6 text-left">
                  <p className="text-[10px] font-black uppercase text-gray-400 mb-3 tracking-widest flex items-center gap-2">
                    <PlusCircle size={12} /> Extra Disponibili
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {p.extra.map((ex, idx) => (
                      <span key={idx} className="bg-gray-50 text-gray-500 text-[9px] font-bold px-2 py-1 rounded-md border border-gray-100 uppercase">
                        {ex}
                      </span>
                    ))}
                  </div>
                </div>

                <a href="#contatti" className={`w-full ${p.btnBg} text-white font-black py-4 rounded-xl transition-all uppercase tracking-widest shadow-lg text-center text-sm`}>
                  Richiedi ora
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}