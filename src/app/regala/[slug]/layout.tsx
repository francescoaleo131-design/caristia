import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";

interface Props {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Omit<Props, "children">): Promise<Metadata> {
  try {
    const { slug } = await params;
    const supabase = await createClient();

    const { data: wishlist } = await supabase
      .from("wishlists")
      .select("child_name")
      .eq("slug", slug)
      .single();

    if (!wishlist) {
      return {
        title: "Lista Regalo non trovata",
        robots: { index: false },
      };
    }

    return {
      title: `Partecipa alla Lista Regalo di ${wishlist.child_name}`,
      description: `Partecipa alla lista regalo o al salvadanaio di ${wishlist.child_name} su Giocattoli Caristia. Scegli un giocattolo o invia una quota regalo in pochi click!`,
    };
  } catch (error) {
    return {
      title: "Contribuisci alla Lista Regalo",
    };
  }
}

export default function RegalaLayout({ children }: Props) {
  return <>{children}</>;
}
