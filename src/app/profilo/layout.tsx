import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Area Riservata | Profilo Utente",
  description: "Gestisci la tua area riservata, traccia i tuoi ordini e controlla il saldo delle tue Gift Card su Giocattoli Caristia.",
  robots: { index: false },
};

export default function ProfiloLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}