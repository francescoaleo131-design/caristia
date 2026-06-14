import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Accedi",
  description: "Accedi alla tua area personale su Giocattoli Caristia per gestire i tuoi ordini e le tue liste regalo.",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
