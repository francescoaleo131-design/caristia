import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Informativa sulla Privacy (Privacy Policy)",
  description: "Leggi come raccogliamo, trattiamo e proteggiamo i dati personali degli utenti sul sito di Giocattoli Caristia.",
};

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
