import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ripristina Password",
  description: "Reimposta la password della tua area riservata su Giocattoli Caristia.",
  robots: { index: false },
};

export default function ResetPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
