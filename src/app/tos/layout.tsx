import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Termini e Condizioni di Servizio",
  description: "Termini e condizioni generali d'uso del sito ufficiale e condizioni di vendita di Giocattoli Caristia.",
};

export default function TosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
