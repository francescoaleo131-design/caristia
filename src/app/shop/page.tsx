import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { SHOP_CATEGORIES } from '@/config/categories';

interface Prodotto {
  id: string;
  name: string;
  price: number;
  category: string | null;
  image_url: string | null;
  sku: string | null; 
}

interface NegozioPageProps {
  searchParams: Promise<{ search?: string; cat?: string; sub?: string }>;
}

const getCloudinaryImageUrl = (sku: string | null, fallbackUrl: string | null) => {
  const CLOUD_NAME = 'tuo-cloud-name';

  if (sku) {
    return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/w_400,f_auto,q_auto/${sku}`;
  }

  return fallbackUrl || '/images/placeholder.jpg';
};

export default async function NegozioPage({ searchParams }: NegozioPageProps) {
  const { search, cat, sub } = await searchParams;

  const supabase = await createClient();

  let query = supabase
    .from('prodotti')
    .select('*');

  if (search) {
    query = query.ilike('name', `%${search}%`);
  }

  if (cat) {
    const selectedCategoryObj = SHOP_CATEGORIES.find((c) => c.slug === cat);
    const categoryTitle = selectedCategoryObj?.title || cat;
    query = query.or(`category.ilike.%${categoryTitle}%,name.ilike.%${categoryTitle}%`);
  }

  if (sub) {
    query = query.or(`category.ilike.%${sub}%,name.ilike.%${sub}%`);
  }

  const { data: prodotti, error } = await query;

  const currentCatObj = SHOP_CATEGORIES.find((c) => c.slug === cat);

  return (
    <div className="min-h-screen bg-white">
      <div className="w-full bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <img
            src="/negozio.png"
            alt="Promozione Giocattoli"
            className="w-full h-auto rounded-xl"
            style={{ maxHeight: "300px", objectFit: "cover" }}
          />
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row gap-12">

          {/* Sidebar */}
          <aside className="w-full md:w-72 shrink-0 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Categorie Shop</h3>
              {(cat || sub || search) && (
                <Link href="/shop" className="text-[11px] font-bold text-[#1e73be] hover:underline uppercase">
                  Azzera filtri
                </Link>
              )}
            </div>

            <ul className="space-y-2 text-sm font-semibold">
              <li>
                <Link
                  href="/shop"
                  className={`block px-4 py-2.5 rounded-xl transition-all ${
                    !cat && !sub && !search
                      ? "bg-[#1e73be] text-white font-bold shadow-md shadow-[#1e73be]/20"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  Tutti i Prodotti
                </Link>
              </li>

              {SHOP_CATEGORIES.map((c) => {
                const isSelected = cat === c.slug;
                return (
                  <li key={c.slug} className="space-y-1">
                    <Link
                      href={`/shop?cat=${c.slug}`}
                      className={`block px-4 py-2.5 rounded-xl transition-all ${
                        isSelected
                          ? "bg-[#1e73be] text-white font-bold shadow-md shadow-[#1e73be]/20"
                          : "text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {c.title}
                    </Link>

                    {isSelected && (
                      <ul className="pl-4 pr-2 py-1 space-y-1 border-l-2 border-[#8cc665] ml-4 my-1">
                        {c.subcategories.map((s) => (
                          <li key={s.name}>
                            <Link
                              href={`/shop?cat=${c.slug}&sub=${encodeURIComponent(s.name)}`}
                              className={`block text-xs py-1 px-2 rounded-lg transition-colors ${
                                sub === s.name
                                  ? "text-[#1e73be] font-extrabold bg-blue-50"
                                  : "text-slate-500 hover:text-slate-900"
                              }`}
                            >
                              {s.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          </aside>

          {/* Main content */}
          <main className="flex-grow">
            {/* Active filter summary */}
            {(search || cat || sub) && (
              <div className="mb-6 p-4 bg-slate-50 border border-slate-100 rounded-2xl flex flex-wrap items-center gap-2 text-xs font-bold text-slate-700">
                <span>Filtri attivi:</span>
                {cat && (
                  <span className="bg-[#1e73be]/10 text-[#1e73be] px-3 py-1 rounded-full">
                    Categoria: {currentCatObj?.title || cat}
                  </span>
                )}
                {sub && (
                  <span className="bg-[#8cc665]/20 text-slate-800 px-3 py-1 rounded-full">
                    Sottocategoria: {sub}
                  </span>
                )}
                {search && (
                  <span className="bg-amber-100 text-amber-900 px-3 py-1 rounded-full">
                    Ricerca: "{search}"
                  </span>
                )}
              </div>
            )}

            {error ? (
              <div className="p-12 text-center bg-rose-50 border border-rose-100 rounded-2xl">
                <h2 className="text-xl font-bold text-rose-600">Errore Database</h2>
                <p className="text-slate-500 text-sm mt-1">{error.message}</p>
              </div>
            ) : prodotti && prodotti.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                {prodotti.map((p: Prodotto) => {
                  // Genera l'URL dell'immagine usando lo SKU su Cloudinary
                  const imageUrl = getCloudinaryImageUrl(p.sku, p.image_url);

                  return (
                    <Link href={`/shop/${p.id}`} key={p.id} className="group cursor-pointer">
                      <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden mb-4 transition-all group-hover:shadow-xl group-hover:shadow-slate-100/80">
                        <div className="aspect-square relative overflow-hidden bg-slate-50">
                          <img
                            src={imageUrl}
                            alt={p.name}
                            className="object-contain w-full h-full p-4 transition-transform duration-500 group-hover:scale-110"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <p className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                          {p.category || 'Generale'}
                        </p>
                        <h2 className="text-lg font-bold text-slate-800 group-hover:text-[#1e73be] transition-colors leading-tight">
                          {p.name}
                        </h2>
                        <div className="flex items-center justify-between pt-2">
                          <span className="text-2xl font-black text-slate-900">
                            {p.price.toFixed(2)}€
                          </span>
                          <span className="text-[#1e73be] text-xs font-black uppercase tracking-wider group-hover:underline">
                            Dettagli →
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="border-2 border-dashed border-slate-200 rounded-3xl p-16 text-center space-y-3">
                <p className="text-slate-500 font-bold">
                  Nessun prodotto trovato con i filtri selezionati.
                </p>
                <Link
                  href="/shop"
                  className="inline-block px-5 py-2.5 bg-[#1e73be] text-white font-black uppercase text-xs tracking-widest rounded-xl hover:bg-blue-700 transition"
                >
                  Mostra Tutti i Prodotti
                </Link>
              </div>
            )}
          </main>

        </div>
      </div>
    </div>
  );
}