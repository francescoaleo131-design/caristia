"use client"
import React from "react"
import { Phone, Mail, MessageCircle, MapPin, ExternalLink } from "lucide-react"

export default function ChiSiamoPage() {
  
  // Coordinate e link per Via Madonna della Via 74C, Caltagirone
  const googleMapsUrl = "https://www.google.com/maps/search/?api=1&query=Giocattoli+Caristia+Via+Madonna+della+Via+74C+Caltagirone"
  
  // URL statico di un rettangolo di mappa centrato su Caltagirone (puoi sostituirlo con uno screenshot reale di Maps se preferisci)
  const mapPreviewUrl = "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=80"

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-800">
      
      {/* --- HERO HEADER --- */}
      <div className="bg-[#1e73be] text-white py-20 px-4 text-center border-b-8 border-[#8cc665]">
        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-wide mb-4">
          Chi Siamo
        </h1>
        <p className="text-lg md:text-xl font-medium max-w-2xl mx-auto opacity-90">
          Una storia di famiglia, passione e felicità che dura dal 1978.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* --- COLONNA SINISTRA: LA STORIA (Prende 2 colonne su 3 su schermi grandi) --- */}
        <div className="lg:col-span-2 space-y-8 bg-white p-8 md:p-12 rounded-[2.5rem] shadow-xl border border-zinc-100">
          <div className="border-b-4 border-[#8cc665] pb-4">
            <h2 className="text-2xl md:text-3xl font-black text-[#1e73be] uppercase tracking-tight">
              La Storia di Giocattoli Caristia
            </h2>
            <p className="text-[#8cc665] font-bold uppercase tracking-widest text-sm mt-1">
              Dove i Sogni Prendono Forma
            </p>
          </div>

          <div className="prose prose-zinc max-w-none text-zinc-600 font-medium space-y-6 leading-relaxed">
            <p>
              C’era una volta, nel cuore della città, una piccola bottega che profumava di magia. 
              Era il <strong>1978</strong> quando <strong>Giacomo Caristia</strong>, un uomo dal sorriso semplice 
              e dagli occhi pieni di futuro, decise di trasformare la sua passione per il gioco in un luogo speciale.
              Quel negozio non era solo quattro mura colme di giocattoli: era un rifugio di buonumore, 
              una porta segreta verso la fantasia, un luogo in cui ogni bambino poteva sentirsi protagonista della propria favola.
            </p>

            <p>
              Giacomo, meglio conosciuto da tutti come il <em>“Signor Caristia”</em>, accoglieva chiunque con un gesto 
              gentile e un consiglio sempre sincero. Ogni giocattolo che entrava in negozio veniva scelto con cura, 
              come se dovesse finire tra le mani del bambino più importante del mondo. Ed era proprio questa attenzione, 
              questo amore per il dettaglio, che fece di Giocattoli Caristia un’icona della città: un punto fermo, 
              una tradizione che cresceva insieme alle generazioni.
            </p>

            <p>
              Col passare degli anni, tra il luccichio delle vetrine e le risate dei clienti, un bambino in particolare 
              osservava tutto con ammirazione: <strong>Angelo</strong>, il primogenito di Giacomo. Per lui quel negozio 
              non era solo un luogo di lavoro: era una seconda casa, uno scrigno di ricordi, una scuola silenziosa in 
              cui ogni giorno imparava la lezione più preziosa di tutte... la passione.
            </p>

            <p>
              Con il tempo Angelo è cresciuto, e insieme a lui il desiderio di continuare ciò che il padre aveva costruito. 
              Nel nuovo decennio, con orgoglio e rispetto, ha iniziato a camminare sulle sue orme. Ha osservato, ascoltato 
              e imparato. E Giacomo, con la pazienza di chi conosce i segreti del mestiere, gli ha trasmesso il suo più 
              grande tesoro: il know-how, l’arte del saper fare.
            </p>

            <p>
              Ma Angelo, noto anche come <strong>“Il Giocattolaio Matto”</strong>, dal gennaio 2019 è diventato titolare del 
              negozio e non si è limitato a custodire ciò che aveva ricevuto. Ci ha messo del suo: energia, creatività e allegria. 
              Ha introdotto nuove idee, nuovi servizi e nuove forme di contatto con i bambini. Le sue animazioni, cariche di 
              vitalità, hanno portato gioia in feste, eventi e momenti speciali, rafforzando ancora di più il legame storico 
              del negozio con le famiglie del territorio.
            </p>

            <div className="bg-blue-50 p-6 rounded-2xl border-l-4 border-[#1e73be] my-8">
              <p className="text-[#1e73be] font-black uppercase text-sm mb-2 tracking-wider">Oggi Giocattoli Caristia è:</p>
              <ul className="list-disc list-inside space-y-1 text-zinc-700 font-bold">
                <li>Una storia di famiglia.</li>
                <li>Una promessa mantenuta.</li>
                <li>Il sorriso di un bambino che abbraccia il suo primo giocattolo.</li>
                <li>La continuità di un sogno che, dal 1978, non ha mai smesso di brillare.</li>
              </ul>
            </div>

            <p className="font-semibold italic text-zinc-700">
              E finché ci saranno mani piccole pronte a scartare un dono, Giacomo, Angelo e l’intera famiglia Caristia 
              continueranno a costruire ciò che sanno fare meglio: felicità.
            </p>
          </div>
        </div>

        {/* --- COLONNA DESTRA: MAPPA E CONTATTI (1 colonna su 3) --- */}
        <div className="space-y-8">
          
  {/* SCHEDA DOVE TROVARCI + MAPPA */}
<div className="bg-white p-6 rounded-[2.5rem] shadow-xl border border-zinc-100 flex flex-col">
  <h3 className="text-xl font-black text-[#1e73be] uppercase tracking-tight mb-4 flex items-center gap-2">
    <MapPin className="w-5 h-5 text-[#8cc665]" /> Dove Trovarci
  </h3>
  
  <p className="text-zinc-600 text-sm font-semibold mb-4 leading-relaxed">
    Via Madonna della Via 74C,<br />
    95041, Caltagirone, Sicilia, Italia
  </p>

  {/* BOX MAPPA CLICCABILE CON LA TUA ANTEPRIMA REALE */}
  <a 
    href="https://www.google.com/maps/search/?api=1&query=Via+Madonna+della+Via+74C,+Caltagirone" 
    target="_blank" 
    rel="noopener noreferrer"
    className="relative group w-full h-48 rounded-2xl overflow-hidden shadow-inner border border-zinc-200 block bg-zinc-100"
  >
    <img 
      src="/mappa-maps.webp" // <-- La tua immagine reale salvata in public/
      alt="Mappa della posizione di Giocattoli Caristia" 
      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
    />
    
    {/* Overlay che appare al passaggio del mouse */}
    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      <span className="text-white text-xs font-black uppercase tracking-widest bg-[#1e73be] px-4 py-2 rounded-xl flex items-center gap-2 shadow-lg">
        Apri in Google Maps <ExternalLink className="w-3 h-3" />
      </span>
    </div>
  </a>
</div>

          {/* SCHEDA CONTATTI DIRECT-LINK */}
          <div className="bg-white p-6 rounded-[2.5rem] shadow-xl border border-zinc-100">
            <h3 className="text-xl font-black text-[#1e73be] uppercase tracking-tight mb-4">
              I Nostri Contatti
            </h3>
            
            <div className="space-y-3">
              {/* Telefono */}
              <a 
                href="tel:+39093326865"
                className="flex items-center gap-4 p-4 rounded-2xl bg-zinc-50 border hover:border-[#1e73be] hover:bg-blue-50/50 transition-all group"
              >
                <div className="p-3 rounded-xl bg-blue-100 text-[#1e73be] group-hover:bg-[#1e73be] group-hover:text-white transition-colors">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-black text-zinc-400 tracking-wider">Telefono Fisso</p>
                  <p className="text-sm font-bold text-zinc-700">+39 0933 26865</p>
                </div>
              </a>

              {/* WhatsApp */}
              <a 
                href="https://wa.me/393384083646" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 rounded-2xl bg-zinc-50 border hover:border-green-500 hover:bg-green-50/30 transition-all group"
              >
                <div className="p-3 rounded-xl bg-green-100 text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-black text-zinc-400 tracking-wider">WhatsApp</p>
                  <p className="text-sm font-bold text-zinc-700">+39 338 408 3646</p>
                </div>
              </a>

              {/* Email */}
              <a 
                href="mailto:info@giocattolicaristia.it"
                className="flex items-center gap-4 p-4 rounded-2xl bg-zinc-50 border hover:border-[#8cc665] hover:bg-green-50/30 transition-all group"
              >
                <div className="p-3 rounded-xl bg-emerald-100 text-emerald-600 group-hover:bg-[#8cc665] group-hover:text-white transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-black text-zinc-400 tracking-wider">Email</p>
                  <p className="text-sm font-bold text-zinc-700 break-all">info@giocattolicaristia.it</p>
                </div>
              </a>
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}