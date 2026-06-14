import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Registrazione",
  description: "Registrati su Giocattoli Caristia per salvare le tue preferenze, tracciare i tuoi acquisti e creare le tue liste regalo.",
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
