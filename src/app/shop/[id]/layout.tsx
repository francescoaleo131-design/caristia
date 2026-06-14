import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";

interface Props {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Omit<Props, "children">): Promise<Metadata> {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const { data: prodotto } = await supabase
      .from("prodotti")
      .select("name, category")
      .eq("id", id)
      .single();

    if (!prodotto) {
      return {
        title: "Prodotto non trovato",
      };
    }

    return {
      title: prodotto.name,
      description: `Acquista ${prodotto.name} (${prodotto.category || "Giocattoli"}) su Giocattoli Caristia. Consegna rapida in 24/48h e originale garantito!`,
    };
  } catch (error) {
    return {
      title: "Dettaglio Prodotto",
    };
  }
}

export default function ProdottoLayout({ children }: Props) {
  return <>{children}</>;
}
