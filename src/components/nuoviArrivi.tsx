"use client"

import * as React from "react"
import Autoplay from "embla-carousel-autoplay" // Importa il plugin
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel"

export default function CaroselloProdotti() {
  const [api, setApi] = React.useState<CarouselApi>()
  
  // Plugin per l'autoplay: 3 secondi, si ferma se l'utente interagisce
  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true })
  )

  // Dati di esempio dei prodotti
  const prodotti = [
    { id: 1, nome: "Lego Technic", prezzo: "49.99€", img: "/giocattolo1.jpg" },
    { id: 2, nome: "Barbie Dreamhouse", prezzo: "89.00€", img: "/giocattolo2.jpg" },
    { id: 3, nome: "Cicciobello", prezzo: "35.00€", img: "/giocattolo3.jpg" },
    { id: 4, nome: "Puzzle Ravensburger", prezzo: "15.50€", img: "/giocattolo4.jpg" },
    { id: 5, nome: "Hot Wheels Track", prezzo: "25.00€", img: "/giocattolo5.jpg" },
  ]

  return (
    <div className="mx-auto w-full max-w-5xl px-10 py-10">
      <h2 className="text-4xl text-center font-black uppercase tracking-tighter text-[#5c59ff] pb-5">prodotti piu' venduti</h2>
      
      <Carousel
        setApi={setApi}
        plugins={[plugin.current]}
        onMouseEnter={plugin.current.stop} 
        onMouseLeave={plugin.current.reset}
        className="w-full"
        opts={{
          align: "start",
          loop: true,
        }}
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {prodotti.map((prodotto) => (
            <CarouselItem key={prodotto.id} className="pl-2 md:pl-4 md:basis-1/3 lg:basis-1/4">
              <div className="p-1">
                {/* Effetto Hover: la classe group serve a controllare i figli */}
                <Card className="relative overflow-hidden group border-none shadow-lg rounded-2xl">
                  <CardContent className="flex aspect-square items-center justify-center p-0">
                    {/* Immagine del Prodotto */}
                    <img 
                      src={prodotto.img} 
                      alt={prodotto.nome}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />

                    {/* OVERLAY INFORMAZIONI: Appare al passaggio del mouse */}
                    <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 text-center">
                      <h3 className="font-bold text-lg">{prodotto.nome}</h3>
                      <p className="text-[#8cc665] font-black text-xl mt-2">{prodotto.prezzo}</p>
                      <button className="mt-4 bg-[#1e73be] text-white px-4 py-2 rounded-full text-xs font-bold uppercase hover:bg-blue-600 transition-colors">
                        Dettagli
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex" />
        <CarouselNext className="hidden md:flex" />
      </Carousel>
    </div>
  )
}