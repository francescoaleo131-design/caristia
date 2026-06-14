import {Metadata} from "next";

export const metadata: Metadata = {
  title: "Animazione Feste di Compleanno ed Eventi",
  description: "Organizza una festa indimenticabile! Offriamo servizi di animazione professionali per compleanni, eventi e feste per bambini a Caltagirone e dintorni.",
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