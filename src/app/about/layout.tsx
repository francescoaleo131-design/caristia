import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chi Siamo | Storia e Passione dal 1978",
  description: "Scopri la storia di Giocattoli Caristia a Caltagirone. Dal 1978, portiamo gioia alle famiglie con i migliori giocattoli e spettacoli ricchi di allegria.",
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
