import Link from "next/link" // 1. Importa Link
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function Card1() {
  return (
    <Card className="relative mx-auto w-full max-w-sm pt-0 flex flex-col h-full">
      <div className="absolute inset-0 z-30 pointer-events-none" />
      <img
        src="negozio.png"
        alt="Event cover"
        className="relative z-20 w-full"
      />
      <CardHeader>
        <CardTitle>Giochi per tutti i gusti!</CardTitle>
        <CardDescription>
            Scopri i nostri giochi, pensati per intrattenere, far divertire e imparare bambini di tutte le età.
        </CardDescription>
      </CardHeader>
      <CardFooter className= "mt-auto">
        {/* Uso asChild per trasformare il Button in un Link mantenendo lo stile */}
        <Button asChild className="w-full">
          <Link href="/shop">Vai al negozio</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

export function Card2() {
  return (
    <Card className="relative mx-auto w-full max-w-sm pt-0 flex flex-col h-full">
      <div className="absolute inset-0 z-30 pointer-events-none" />
      <img
        src="animazioni.png"
        alt="Event cover"
        className="relative z-20 "
      />
      <CardHeader>
        <CardTitle>Animiamo i tuoi compleanni!</CardTitle>
        <CardDescription>
          Da anni rendiamo le feste di compleanno indimenticabili con animazione, giochi e tanto divertimento per bambini di tutte le età.
        </CardDescription>
      </CardHeader>
      <CardFooter className="mt-auto">
        <Button asChild className="w-full">
          <Link href="/animazione">Prenota la tua animazione</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

export function Card3() {
  return (
    <Card className="relative mx-auto w-full max-w-sm pt-0 flex flex-col h-full">
      <div className="absolute inset-0 z-30 pointer-events-none" />
      <img
        src="lista_compleanno.png"
        alt="Event cover"
        className="relative z-20"
      />
      <CardHeader>
        <CardTitle>Scopri le nostre liste per compleanni!</CardTitle>
        <CardDescription>
          Le nostre liste sono pensate per rendere più semplice e divertente la scelta dei regali di compleanno, e la possibilità di condividere la tua lista con amici e parenti.
        </CardDescription>
      </CardHeader>
      <CardFooter className="mt-auto">
        <Button asChild className="w-full">
          <Link href="/liste">Scopri di più</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}