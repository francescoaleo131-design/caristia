"use client";
import { useState, useEffect, use } from 'react';
import { supabase } from '@/lib/supabase/supabase';
import { Gift, Calendar, ShoppingBag, CheckCircle, Heart, Star } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import { useCart } from '@/app/shop/useCart';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function GuestWishlistPage({ params }: PageProps) {
  const { slug } = use(params);
  const [wishlist, setWishlist] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const addItem = useCart((state) => state.addItem);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      
      // 1. Recupera la testata della wishlist pubblica
      const { data: wishlistData } = await supabase
        .from('wishlists')
        .select('*')
        .eq('slug', slug)
        .single();

      if (!wishlistData) {
        setLoading(false);
        return;
      }
      setWishlist(wishlistData);

      // 2. Recupera gli articoli agganciati usando i campi corretti del DB (nome, prezzo, immagine_url)
      const { data: itemsData } = await supabase
        .from('wishlist_items')
        .select(`
          id,
          quantity_requested,
          quantity_purchased,
          prodotti (
            id,
            nome,
            prezzo,
            immagine_url,
            slug
          )
        `)
        .eq('wishlist_id', wishlistData.id);

      setItems(itemsData || []);
      setLoading(false);
    }
    fetchData();
  }, [slug]);

  const handleRegalaOra = (product: any) => {
    // Passiamo le info al carrello globale includendo il wishlist_id per tracciare l'acquisto
    addItem({
      id: product.id,
      wishlist_id: wishlist.id,
      name: product.nome,
      price: product.prezzo,
      image_url: product.immagine_url
    });
    toast.success(`${product.nome} aggiunto al carrello!`);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!wishlist) return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <h2 className="text-2xl font-black text-slate-900 mb-4 uppercase">Lista non trovata</h2>
      <Link href="/shop" className="text-blue-600 font-bold underline">Vai allo shop</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fcfcfd]">

      {/* Header Premium per l'Invitato */}
      <header className="bg-white border-b border-slate-100 pt-16 pb-12 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-[#1e73be] px-4 py-2 rounded-full mb-6 animate-bounce">
            <Star size={16} className="fill-current" />
            <span className="font-black text-[10px] uppercase tracking-widest">Scegli un regalo speciale</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-tight uppercase tracking-tighter mb-4">
            Il Compleanno di <span className="text-[#1e73be]">{wishlist.child_name}</span>
          </h1>

          <div className="flex items-center justify-center gap-6 text-slate-400 font-bold">
            <div className="flex items-center gap-2">
              <Calendar size={18} />
              <span>{new Date(wishlist.event_date).toLocaleDateString('it-IT', { day: 'numeric', month: 'long' })}</span>
            </div>
            <div className="w-1.5 h-1.5 bg-slate-200 rounded-full"></div>
            <div className="flex items-center gap-2 text-[#8cc665]">
              <Gift size={18} />
              <span>{items.length} desideri</span>
            </div>
          </div>
        </div>
      </header>

      {/* LISTA PRODOTTI (Layout a Lista Pulito) */}
      <main className="max-w-3xl mx-auto px-6 py-12">
        <div className="space-y-6">
          {items.map((item) => {
            const product = item.prodotti;
            if (!product) return null;
            
            const isPurchased = item.quantity_purchased >= item.quantity_requested;

            return (
              <div
                key={item.id}
                className={`bg-white rounded-[2rem] p-6 border border-slate-100 flex flex-col sm:flex-row items-center gap-8 transition-all hover:shadow-xl hover:shadow-slate-100/50 ${isPurchased ? 'opacity-60 grayscale' : ''}`}
              >
                {/* Immagine */}
                <div className="w-32 h-32 flex-shrink-0 bg-slate-50 rounded-2xl p-4 flex items-center justify-center">
                  <img 
                    src={product.immagine_url || '/placeholder.png'} 
                    alt={product.nome} 
                    className="max-w-full max-h-full object-contain" 
                  />
                </div>

                {/* Info Prodotto */}
                <div className="flex-grow text-center sm:text-left">
                  <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight mb-1">{product.nome}</h3>
                  <p className="text-2xl font-black text-[#1e73be] mb-4">{product.prezzo.toFixed(2)}€</p>

                  {isPurchased ? (
                    <div className="inline-flex items-center gap-2 bg-green-50 text-green-600 px-4 py-2 rounded-full text-xs font-black uppercase">
                      <CheckCircle size={14} /> Già regalato
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Ancora disponibile</p>
                  )}
                </div>

                {/* Azione di inserimento nel carrello dello shop */}
                {!isPurchased && (
                  <button
                    onClick={() => handleRegalaOra(product)}
                    className="w-full sm:w-auto bg-slate-900 text-white px-8 py-5 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-[#1e73be] transition-all shadow-lg active:scale-95 whitespace-nowrap"
                  >
                    <ShoppingBag size={18} /> Regala ora
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {items.length === 0 && (
          <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
            <p className="text-slate-400 font-bold uppercase tracking-widest">Nessun prodotto in lista al momento.</p>
          </div>
        )}

        {/* Banner di ringraziamento emotivo */}
        <div className="mt-20 p-8 bg-[#1e73be] rounded-[2.5rem] text-white text-center shadow-2xl relative overflow-hidden">
          <Heart className="absolute -top-10 -left-10 w-40 h-40 text-white/10" />
          <h4 className="text-2xl font-black mb-4 uppercase">Grazie per il tuo pensiero!</h4>
          <p className="text-blue-100 font-medium">Scegliendo un regalo da questa lista, aiuterai i genitori a ricevere esattamente ciò che serve, evitando doppioni e completando il set perfetto per {wishlist.child_name}.</p>
        </div>
      </main>

      {/* Footer Brand */}
      <footer className="py-12 text-center text-slate-300 text-[10px] font-black uppercase tracking-[0.3em]">
        Giocattoli Caristia
      </footer>
    </div>
  );
}