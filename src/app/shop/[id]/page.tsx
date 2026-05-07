import { createClient } from '@/lib/server';
import { notFound } from 'next/navigation';
import AddToCartButton from '@/components/addToCart';
import AddToWishlistButton from '@/components/addToWishlist'; // Importa il nuovo componente
import { Heart, Truck, CheckCircle2, Gift } from 'lucide-react';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ProdottoPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: prodotto, error } = await supabase
    .from('prodotti')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !prodotto) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-6 py-12 lg:py-24">

        {/* Breadcrumb discreto */}
        <nav className="mb-8 text-sm font-medium text-slate-400">
          <a href="/shop" className="hover:text-blue-600 transition-colors">Negozio</a>
          <span className="mx-2">/</span>
          <span className="capitalize text-slate-600">{prodotto.category}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 items-start">

          {/* Box Immagine */}
          <div className="bg-slate-50 rounded-[3rem] p-8 lg:p-16 flex items-center justify-center border border-slate-100 shadow-sm sticky top-24">
            <img
              src={prodotto.image_url}
              alt={prodotto.name}
              className="w-full h-auto max-h-[550px] object-contain hover:scale-105 transition-transform duration-500"
            />
          </div>

          {/* Dati Prodotto */}
          <div className="flex flex-col pt-4">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-blue-50 text-blue-600 font-bold uppercase tracking-widest text-[10px] px-3 py-1 rounded-full">
                {prodotto.category}
              </span>
            </div>

            <h1 className="text-4xl lg:text-6xl font-black text-slate-900 mb-6 leading-tight tracking-tight uppercase">
              {prodotto.name}
            </h1>

            <div className="text-5xl font-black text-blue-600 mb-8 tracking-tighter">
              {prodotto.price.toFixed(2)}€
            </div>

            <div className="h-px bg-slate-100 w-full mb-8"></div>

            <p className="text-lg text-slate-500 leading-relaxed mb-10">
              {prodotto.description || "Un'aggiunta magica alla collezione di ogni bambino, selezionata con cura da Giocattoli Caristia."}
            </p>

            {/* AREA AZIONI - Carrello e Lista Regalo */}
            <div className="space-y-4">
              <div className="flex gap-4 items-center">
                <div className="flex-grow">
                  <AddToCartButton prodotto={prodotto} />
                </div>
                <button className="p-5 border-2 border-slate-100 rounded-2xl hover:bg-red-50 hover:border-red-100 group transition-all">
                  <Heart size={24} className="text-slate-300 group-hover:text-red-500 transition-colors" />
                </button>
              </div>

              {/* Tasto Lista Regalo */}
              <AddToWishlistButton
                productId={prodotto.id}
                productName={prodotto.name}
              />
            </div>

            {/* Banner Marketing Lista Regalo */}
            <div className="mt-6 p-5 bg-[#1e73be]/5 rounded-3xl border border-[#1e73be]/10 flex gap-4 items-center">
              <div className="bg-white p-3 rounded-2xl shadow-sm text-[#1e73be]">
                <Gift size={24} />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">Questo è un regalo di compleanno?</p>
                <p className="text-xs text-slate-500">Aggiungilo alla lista e ricevi un buono del 10% sul totale!</p>
              </div>
            </div>

            {/* Info Spedizione/Stock */}
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center p-4 bg-slate-50 rounded-2xl text-sm text-slate-600">
                <CheckCircle2 className="text-green-500 mr-3" size={20} />
                <span>Disponibilità: <strong>{prodotto.stock_quantity} pezzi</strong></span>
              </div>
              <div className="flex items-center p-4 bg-slate-50 rounded-2xl text-sm text-slate-600">
                <Truck className="text-blue-500 mr-3" size={20} />
                <span>Consegna rapida in 24/48h</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}