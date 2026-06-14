import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';

interface Prodotto {
  id: string;
  name: string;
  price: number;
  category: string | null;
  image_url: string;
}

interface NegozioPageProps {
  searchParams: Promise<{ search?: string }>;
}

export default async function NegozioPage({ searchParams }: NegozioPageProps) {
  const { search } = await searchParams;

  const supabase = await createClient();
  
  let query = supabase
    .from('prodotti')
    .select('*');

  if (search) {
    query = query.ilike('name', `%${search}%`);
  }

  const { data: prodotti, error } = await query;

  if (error) {
    return (
      <div className="p-20 text-center">
        <h2 className="text-2xl font-bold text-red-600">Errore Database</h2>
        <p className="text-slate-500">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="w-full bg-white border-b"> 
        <div className="container mx-auto px-4 py-6">
          <img 
            src="/divider_negozio.webp" 
            alt="Promozione Giocattoli"
            className="w-full h-auto rounded-xl"
            style={{ maxHeight: "300px", objectFit: "cover" }} 
          />
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row gap-12">
          
          <aside className="w-full md:w-64 shrink-0">
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6">Categorie</h3>
            <ul className="space-y-4 text-lg font-medium">
              <li className="cursor-pointer text-blue-600 border-l-2 border-blue-600 pl-4">Tutti</li>
              <li className="cursor-pointer hover:text-blue-600 border-l-2 border-transparent hover:border-blue-600 pl-4 transition-all text-slate-500">Costruzioni</li>
              <li className="cursor-pointer hover:text-blue-600 border-l-2 border-transparent hover:border-blue-600 pl-4 transition-all text-slate-500">Società</li>
              <li className="cursor-pointer hover:text-blue-600 border-l-2 border-transparent hover:border-blue-600 pl-4 transition-all text-slate-500">Veicoli</li>
            </ul>
          </aside>

          <main className="flex-grow">
            {search && (
              <div className="mb-6">
                <p className="text-sm text-slate-500">
                  Risultati della ricerca per: <span className="font-bold text-slate-800">"{search}"</span>
                </p>
              </div>
            )}

            {prodotti && prodotti.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                {prodotti.map((p: Prodotto) => (
                  <Link href={`/shop/${p.id}`} key={p.id} className="group cursor-pointer">
                    <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden mb-4 transition-shadow group-hover:shadow-xl group-hover:shadow-slate-100/50">
                      <div className="aspect-square relative overflow-hidden bg-slate-50">
                        <img 
                          src={p.image_url} 
                          alt={p.name}
                          className="object-contain w-full h-full p-4 transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                        {p.category || 'Generale'}
                      </p>
                      <h2 className="text-xl font-semibold text-slate-800 group-hover:text-blue-600 transition-colors leading-tight">
                        {p.name}
                      </h2>
                      <div className="flex items-center justify-between pt-2">
                        <span className="text-2xl font-bold text-slate-900">
                          {p.price.toFixed(2)}€
                        </span>
                        <span className="text-blue-600 text-sm font-bold group-hover:underline">
                          Dettagli →
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="border-2 border-dashed border-slate-200 rounded-3xl p-20 text-center">
                <p className="text-slate-400 font-medium italic">
                  {search 
                    ? `Nessun prodotto corrisponde alla ricerca "${search}".` 
                    : "Nessun prodotto disponibile in questa categoria."}
                </p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}