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
        title: "Lista non trovata",
        robots: { index: false },
      };
    }

    return {
      title: `Gestione Lista di ${wishlist.child_name}`,
      robots: { index: false },
    };
  } catch (error) {
    return {
      title: "Gestione Lista Regalo",
      robots: { index: false },
    };
  }
}

export default function ListeSlugLayout({ children }: Props) {
  return <>{children}</>;
}
