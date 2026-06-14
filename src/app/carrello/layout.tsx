import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Carrello",
  description: "Visualizza i prodotti selezionati e completa il tuo ordine in totale sicurezza su Giocattoli Caristia.",
  robots: { index: false },
};

export default function CarrelloLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
