import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mascotte",
  description: "Scegli la tua mascotte preferita per rendere unica la tua festa con Giocattoli Caristia.",
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