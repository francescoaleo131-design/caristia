import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Liste Regalo e Salvadanai di Compleanno Online",
  description: "Crea la lista regalo o una raccolta fondi online per il compleanno del tuo bambino. Semplice, veloce e gratis con Giocattoli Caristia.",
};

export default function ListeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
