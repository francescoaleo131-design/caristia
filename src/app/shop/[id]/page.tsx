import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import AddToCartButton from '@/components/addToCart';
import AddToWishlistButton from '@/components/addToWishlist';
import { Heart, Truck, CheckCircle2, Gift, ListChecks, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

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

  // Funzione helper per renderizzare le specifiche tecniche
  const renderSpecs = () => {
    if (!prodotto.specs) return null;

    // Caso 1: Le specifiche sono salvate come oggetto JSON (Consigliato per Danea)
    if (typeof prodotto.specs === 'object' && !Array.isArray(prodotto.specs)) {
      return Object.entries(prodotto.specs).map(([key, value]) => (
        <div key={key} className="flex justify-between py-3 border-b border-slate-100 text-sm">
          <span className="text-slate-500 font-medium capitalize">{key.replace(/_/g, ' ')}</span>
          <span className="text-slate-900 font-bold">{String(value)}</span>
        </div>
      ));
    }

    // Caso 2: Le specifiche sono salvate come stringa semplice
    return <p className="text-sm text-slate-600 leading-relaxed">{prodotto.specs}</p>;
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-6 py-12 lg:py-20">
        
        {/* Navigazione superiore */}
        <nav className="mb-10 flex items-center justify-between">
          <Link 
            href="/shop" 
            className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-blue-600 transition-colors group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Torna allo Shop
          </Link>
          <div className="text-sm font-medium text-slate-400">
            <span className="capitalize">{prodotto.category}</span>
          </div>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* COLONNA SINISTRA: Visualizzazione Prodotto */}
          <div className="space-y-6">
            <div className="bg-slate-50 rounded-[2.5rem] p-8 md:p-12 flex items-center justify-center border border-slate-100 shadow-sm overflow-hidden">
              <img
                src={prodotto.image_url}
                alt={prodotto.name}
                className="w-full h-auto max-h-[500px] object-contain hover:scale-105 transition-transform duration-700"
              />
            </div>
            
            {/* Badge spedizione rapida sotto l'immagine per mobile */}
            <div className="hidden lg:flex items-center justify-center gap-8 py-4 px-8 bg-slate-50 rounded-2xl border border-slate-100">
               <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
                  <Truck size={16} className="text-blue-500" />
                  Consegna 24/48h
               </div>
               <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
                  <CheckCircle2 size={16} className="text-green-500" />
                  Originale Garantito
               </div>
            </div>
          </div>

          {/* COLONNA DESTRA: Dettagli e Acquisto */}
          <div className="flex flex-col">
            <div className="mb-6">
              <span className="bg-blue-600 text-white font-black uppercase tracking-widest text-[10px] px-3 py-1 rounded-md">
                {prodotto.category}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 leading-tight tracking-tight uppercase">
              {prodotto.name}
            </h1>

            <div className="text-4xl font-black text-blue-600 mb-8 tracking-tighter">
              {prodotto.price.toFixed(2)}€
            </div>

            <div className="h-px bg-slate-100 w-full mb-8"></div>

            {/* Descrizione */}
            <div className="mb-10">
               <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Descrizione</h3>
               <p className="text-lg text-slate-600 leading-relaxed">
                 {prodotto.description || "Un prodotto esclusivo selezionato con cura da Giocattoli Caristia per garantire il massimo del divertimento e della qualità."}
               </p>
            </div>

            {/* SPECIFICHE TECNICHE (Specs da Danea) */}
            {prodotto.specs && (
              <div className="mb-10 bg-slate-50/80 rounded-3xl p-6 border border-slate-100">
                <div className="flex items-center gap-2 mb-4 text-slate-900 font-black uppercase text-[10px] tracking-[0.2em]">
                  <ListChecks size={18} className="text-blue-600" />
                  Specifiche Tecniche
                </div>
                <div className="space-y-1">
                  {renderSpecs()}
                </div>
              </div>
            )}

            {/* AREA ACQUISTO */}
            <div className="space-y-4">
              <div className="flex gap-4 items-center">
                <div className="flex-grow">
                  <AddToCartButton prodotto={prodotto} />
                </div>
                <button className="p-5 border-2 border-slate-100 rounded-2xl hover:bg-red-50 hover:border-red-100 group transition-all">
                  <Heart size={24} className="text-slate-300 group-hover:text-red-500 transition-colors" />
                </button>
              </div>

              <AddToWishlistButton
                productId={prodotto.id}
                productName={prodotto.name}
              />
            </div>

            {/* Promozione Compleanno */}
            <div className="mt-8 p-6 bg-blue-50 rounded-3xl border border-blue-100 flex gap-5 items-center">
              <div className="bg-white p-3 rounded-2xl shadow-sm text-blue-600 shrink-0">
                <Gift size={28} />
              </div>
              <div>
                <p className="text-sm font-black text-slate-800 uppercase tracking-tight">Regalo di compleanno?</p>
                <p className="text-xs text-slate-600 mt-1">Aggiungilo alla lista del festeggiato e sblocca vantaggi esclusivi!</p>
              </div>
            </div>

            {/* Stock info */}
            <div className="mt-8 flex items-center text-sm text-slate-500 font-medium">
               <div className={`h-2 w-2 rounded-full mr-3 ${prodotto.stock_quantity > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
               Disponibilità: <span className="text-slate-900 ml-1 font-bold">{prodotto.stock_quantity} pezzi a magazzino</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}