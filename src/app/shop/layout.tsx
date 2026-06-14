import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Negozio di Giocattoli Online | Costruzioni, Giochi e Modellismo",
  description: "Esplora il catalogo online di Giocattoli Caristia. Costruzioni, giochi di società, veicoli e tante idee regalo per bambini con spedizione rapida 24/48h!",
};

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
