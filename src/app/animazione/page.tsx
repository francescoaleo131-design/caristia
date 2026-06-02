import Link from "next/link"
import PacchettiPrezzi from "@/components/cardsanimazione";
import ServiziIcone from "@/components/ServiziAnimazione";
import VantaggiPromo from "@/components/vantaggi";
import FormContatti from "@/components/FormContatti";

export default function Animazione() {
  return (
    <div className="w-full flex flex-col">
      
  {/* --- SEZIONE HERO PRINCIPALE --- */}
<section className="relative h-[450px] md:h-[500px] w-full flex items-center justify-center overflow-hidden bg-slate-100">
  
  {/* Sfondo con Blur e Posizionamento Ottimizzato */}
<div className="absolute inset-0 z-0">
  <picture>
    {/* Immagine per Mobile (Verticale o Quadrata) */}
    <source 
      media="(max-width: 768px)" 
      srcSet="/main_animazioni_mobile.png" 
    />
    {/* Immagine per Desktop */}
    <img 
      src="/main_animazioni.png" 
      alt="Sfondo Animazione"
      className="absolute inset-0 w-full h-full object-cover object-center blur-[4px]" 
    />
  </picture>
  <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] z-1" />
</div>

  {/* CONTENITORE TESTUALE */}
  <div className="relative z-10 px-6 flex flex-col items-center justify-center text-center w-full max-w-4xl">
    
    <h1 className="text-5xl md:text-7xl font-black text-blue-700 tracking-tighter drop-shadow-sm uppercase">
      Animazione
    </h1>

    <div className="mt-4 space-y-2">
      <h4 className="text-2xl md:text-4xl font-extrabold leading-tight text-slate-800">
        Rendiamo ogni festa <span className="text-[#8cc665]">indimenticabile</span>
      </h4>
      <p className="text-lg md:text-2xl font-bold text-slate-700 pt-2">
        con le nostre animazioni nel Calatino!
      </p>
    </div>
    
    <Link 
      href="#contatti" 
      className="mt-8 bg-[#8cc665] text-white font-black py-4 px-10 rounded-full uppercase tracking-widest transition-all"
    >
      Prenota ora
    </Link>
    </div>
</section>

      <div className="w-full my-6 px-4 container mx-auto"> 
        <picture>
          <source media="(max-width: 768px)" srcSet="/mobile_divider_servizi.webp" />
        <img 
          src="/divider_servizi.webp"
          alt="Promozione Giocattoli"
          className="w-full h-auto"
        style={{ maxHeight: "300px" }} 
        />
         </picture>
      </div>
     

      {/* --- SEZIONE ICONE --- */}
      <section className="bg-white py-4 px-2"> 
        <ServiziIcone />
      </section>

      {/* --- IMMAGINE SEPARATRICE 1 --- */}
      <div className="w-full my-6 px-4 container mx-auto"> 
        <img 
          src="/divider_pacchetti.webp" 
          alt="Promozione Giocattoli"
          className="w-full h-auto"
          style={{ maxHeight: "300px" }} 
        />
      </div>

      {/* --- SEZIONE 2: PACCHETTI E PROMO --- */}
      <section className="bg-white py-4 px-4"> 
        <div className="container mx-auto">
          <PacchettiPrezzi />
          <div className="mt-8"> 
            <VantaggiPromo />
          </div>
        </div>
      </section>

      {/* --- IMMAGINE SEPARATRICE 2 --- */}
      <div className="w-full mt-6 mb-12 px-4 container mx-auto">
        <img 
          src="/divider_prenotazioni.webp" 
          alt="Promozione Giocattoli"
          className="w-full h-auto"
          style={{ maxHeight: "300px" }}
        />
      </div>

      {/* --- SEZIONE CONTATTI --- */}
      <div id="contatti" className="bg-white py-4 px-4">
        <FormContatti />
      </div>
    
            <div className="w-full my-12 px-4 container mx-auto">
          <img 
            src="/divider_4.png" 
            alt="Promozione Giocattoli"
            className="w-full h-auto"
            style={{ maxHeight: "400px" }}
          />
        </div>
          <div className="pb-20"></div>
        </div>
  )
}