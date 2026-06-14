import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Diritto di Recesso e Politica di Reso",
  description: "Scopri come effettuare un reso, esercitare il diritto di recesso e richiedere un rimborso su Giocattoli Caristia.",
};

export default function ReturnPolicyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
