import Link from "next/link"
import PacchettiPrezzi from "@/components/cardsanimazione";
import ServiziIcone from "@/components/ServiziAnimazione";
import VantaggiPromo from "@/components/vantaggi";
import FormContatti from "@/components/FormContatti";

export default function Animazione() {
  return (
    <div className="w-full flex flex-col">
      
      {/* --- SEZIONE HERO PRINCIPALE --- */}
 <section className="relative h-[350px] md:h-[500px] w-full flex items-center justify-center overflow-hidden bg-slate-200">
    
    {/* Sfondo con Blur */}
    <div className="absolute inset-0 z-0">
      <img 
        src="/main_animazioni.png" 
        alt="Sfondo Animazione Caristia"
        className="w-full h-full object-cover blur-[4px]" 
      />
      {/* Overlay per leggibilità */}
      <div className="absolute inset-0 bg-white/40 backdrop-blur-[4px] z-1" />
    </div>

    {/* UNICO CONTENITORE TESTUALE (Centra tutto verticalmente) */}
    <div className="relative z-10 px-4 flex flex-col items-center justify-center text-center">
      
      <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-blue-700 tracking-tighter  drop-shadow-sm">
        Animazione
      </h1>

      <h4 className="mt-4 text-xl md:text-3xl lg:text-4xl font-extrabold max-w-4xl leading-tight">
        Rendiamo ogni festa <span className="text-green-500 text-bold">indimenticabile</span> con le nostre animazioni nel Calatino!
      </h4>
      
  <Link 
  href="#contatti" 
  className="mt-8 bg-[#8cc665] hover:bg-[#1e73be] text-white font-black py-4 px-10 rounded-full uppercase tracking-widest transition-all shadow-lg hover:shadow-green-500/20 active:scale-95 inline-block"
>
  Prenota la tua animazione
</Link>
    </div>
</section>

      <div className="w-full my-6 px-4 container mx-auto"> 
        <img 
          src="/divider_servizi.png" 
          alt="Promozione Giocattoli"
          className="w-full h-auto"
          style={{ maxHeight: "300px" }} 
        />
      </div>

      {/* --- SEZIONE ICONE --- */}
      <section className="bg-white py-4 px-2"> 
        <ServiziIcone />
      </section>

      {/* --- IMMAGINE SEPARATRICE 1 --- */}
      <div className="w-full my-6 px-4 container mx-auto"> 
        <img 
          src="/divider_pacchetti.png" 
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
          src="/divider_prenotazioni.png" 
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