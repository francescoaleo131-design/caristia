import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gift Card Regalo Online | Bronze, Silver e Gold",
  description: "Fai il regalo perfetto con le Gift Card di Giocattoli Caristia. Disponibili in vari tagli, pronte da stampare o inviare via email in pochi istanti!",
};

export default function GiftcardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
