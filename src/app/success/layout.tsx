import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ordine Confermato",
  description: "Grazie per il tuo acquisto! Il tuo ordine su Giocattoli Caristia è stato confermato con successo.",
  robots: { index: false },
};

export default function SuccessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
