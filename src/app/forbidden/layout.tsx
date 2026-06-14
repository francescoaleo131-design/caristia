import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Accesso Negato (403)",
  description: "Non hai l'autorizzazione necessaria per visualizzare questa pagina.",
  robots: { index: false },
};

export default function ForbiddenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
