import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Informativa sui Cookie (Cookie Policy)",
  description: "Informativa estesa sull'uso dei cookie e delle altre tecnologie di tracciamento sul sito di Giocattoli Caristia.",
};

export default function CookiesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
