import {Metadata} from "next";

export const metadata: Metadata = {
  title: "Animazione",
  description: "Scopri le nostre animazioni uniche per rendere la tua festa indimenticabile.",
};

export default function AnimazioneLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="animazione-wrapper">

      
      {children}
    </section>
  );
}