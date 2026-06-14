import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Affitto e Noleggio Mascotte per Feste",
  description: "Noleggia le mascotte dei personaggi più amati dai bambini. Scopri i nostri costumi e pacchetti completi per rendere unica la tua festa.",
};

export default function MascotteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="mascotte-wrapper">

      
      {children}
    </section>
  );
}