import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Novità in Arrivo",
  description: "Stiamo preparando qualcosa di veramente magico! Iscriviti alla newsletter per ricevere gli aggiornamenti in anteprima da Giocattoli Caristia.",
};

export default function ComingSoonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
