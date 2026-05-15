"use client";
import { useState, useEffect, use } from 'react'; // Aggiunto use
import { supabase } from '@/lib/supabase/supabase';
import { Gift, Calendar, Share2, Trash2, ShoppingBag, CheckCircle, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import { useCart } from '@/app/shop/useCart';

// Definiamo correttamente il tipo dei props per Next.js 15+
interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function WishlistDetailPage({ params }: PageProps) {
  // Sblocchiamo lo slug dalla Promise dei params
  const { slug } = use(params);

  const [wishlist, setWishlist] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);
  const addItem = useCart((state) => state.addItem);

  // Caricamento dati
  useEffect(() => {
    async function fetchWishlistData() {
      setLoading(true);

      // 1. Recupera la testata della wishlist tramite lo slug
      const { data: wishlistData, error: wError } = await supabase
        .from('wishlists')
        .select('*')
        .eq('slug', slug)
        .single();

      if (wError || !wishlistData) {
        setLoading(false);
        return;
      }

      setWishlist(wishlistData);

      // 2. Controlla se l'utente loggato è il proprietario
      const { data: { user } } = await supabase.auth.getUser();
      if (user && user.id === wishlistData.owner_id) {
        setIsOwner(true);
      }

      // 3. Recupera i prodotti (con join sulla tabella prodotti)
      const { data: itemsData, error: iError } = await supabase
        .from('wishlist_items')
        .select(`
          id,
          quantity_requested,
          quantity_purchased,
          prodotti (
            id,
            name,
            price,
            image_url
          )
        `)
        .eq('wishlist_id', wishlistData.id);

      if (!iError) {
        setItems(itemsData || []);
      }

      setLoading(false);
    }

    fetchWishlistData();
  }, [slug]); // Ora lo slug è stabile

  const removeItem = async (itemId: string) => {
    const { error } = await supabase.from('wishlist_items').delete().eq('id', itemId);
    if (error) toast.error("Errore durante la rimozione");
    else {
      toast.success("Prodotto rimosso");
      setItems(items.filter(item => item.id !== itemId));
    }
  };

  const copyLink = () => {
    const guestUrl = `${window.location.origin}/regala/${slug}`;
    navigator.clipboard.writeText(guestUrl);
    toast.success("Link per gli invitati copiato! Invialo su WhatsApp.");
  };

  const handleRegalaOra = (product: any) => {
    addItem({
      id: product.id,
      name: product.nome,
      price: product.prezzo,
      image_url: product.immagine_url
    });
    toast.success(`${product.nome} aggiunto al carrello!`);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="font-black text-slate-400 uppercase tracking-widest text-xs">Caricamento Lista...</p>
      </div>
    </div>
  );

  if (!wishlist) return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <h2 className="text-2xl font-black text-slate-900 mb-4 uppercase">Lista non trovata</h2>
      <Link href="/shop" className="text-blue-600 font-bold underline">Torna allo shop</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* HEADER DELLA LISTA */}
      <div className="bg-white border-b border-slate-100 pt-12 pb-8 px-6">
        <div className="max-w-5xl mx-auto">
          <Link href="/liste" className="inline-flex items-center gap-2 text-slate-400 hover:text-blue-600 font-bold mb-6 transition-colors group">
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            Torna alle mie liste
          </Link>

          <div className="flex flex-col md:flex-row justify-between items-end gap-6">
            <div>
              <span className="bg-[#1e73be]/10 text-[#1e73be] px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                Lista Compleanno Speciale
              </span>
              <h1 className="text-5xl md:text-6xl font-black text-slate-900 mt-4 leading-tight uppercase tracking-tighter">
                I Desideri di <span className="text-[#1e73be]">{wishlist.child_name}</span>
              </h1>
              <div className="flex items-center gap-6 mt-6 text-slate-500 font-bold">
                <div className="flex items-center gap-2">
                  <Calendar size={20} className="text-[#8cc665]" />
                  <span>{new Date(wishlist.event_date).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Gift size={20} className="text-pink-500" />
                  <span>{items.length} Regali scelti</span>
                </div>
              </div>
            </div>

            <button
              onClick={copyLink}
              className="w-full md:w-auto bg-[#8cc665] text-white px-8 py-5 rounded-[2rem] font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 hover:bg-[#7ab554] transition-all shadow-xl shadow-green-100 active:scale-95"
            >
              <Share2 size={20} /> Condividi Lista
            </button>
          </div>
        </div>
      </div>

      {/* GRIGLIA PRODOTTI */}
      <div className="max-w-5xl mx-auto px-6 mt-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item) => {
            const product = item.prodotti;
            const isPurchased = item.quantity_purchased >= item.quantity_requested;

            return (
              <div key={item.id} className={`bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm transition-all group ${isPurchased ? 'opacity-75 grayscale-[0.5]' : 'hover:shadow-2xl hover:-translate-y-2'}`}>
                {/* Immagine Prodotto */}
                <div className="aspect-square bg-white p-6 relative overflow-hidden border-b border-slate-50">
                  <img
                    src={product.image_url || '/placeholder.png'}
                    alt={product.name}
                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700"
                  />
                  {isPurchased && (
                    <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] flex items-center justify-center p-6 text-center">
                      <div className="bg-green-500 text-white px-5 py-2 rounded-full font-black uppercase text-[10px] tracking-widest flex items-center gap-2 shadow-lg">
                        <CheckCircle size={14} /> Già Regalato!
                      </div>
                    </div>
                  )}
                </div>

                {/* Info Prodotto */}
                <div className="p-8 text-center">
                  <h3 className="font-black text-slate-800 text-lg leading-tight mb-3 line-clamp-2 uppercase tracking-tight">
                    {product.name}
                  </h3>
                  <p className="text-3xl font-black text-[#1e73be] mb-8">
                    {product.price.toFixed(2)}€
                  </p>

                  <div className="space-y-3">
                    {!isPurchased ? (
                      <button
                        onClick={() => handleRegalaOra(product)}
                        className="w-full bg-slate-900 text-white font-black uppercase tracking-widest text-xs py-5 rounded-2xl flex items-center justify-center gap-3 hover:bg-[#1e73be] transition-all shadow-lg active:scale-95"
                      >
                        <ShoppingBag size={18} /> Regala ora
                      </button>
                    ) : (
                      <div className="w-full bg-slate-100 text-slate-400 font-black uppercase tracking-widest text-xs py-5 rounded-2xl flex items-center justify-center gap-2 cursor-not-allowed">
                        Completato
                      </div>
                    )}

                    {isOwner && (
                      <button
                        onClick={() => removeItem(item.id)}
                        className="w-full text-red-400 font-bold text-[10px] uppercase tracking-[0.2em] py-2 hover:text-red-600 transition-colors flex items-center justify-center gap-1 mt-2"
                      >
                        <Trash2 size={12} /> Elimina
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {items.length === 0 && (
          <div className="text-center py-32 bg-white rounded-[3rem] border-4 border-dashed border-slate-100">
            <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <Gift className="text-slate-200" size={48} />
            </div>
            <h3 className="text-slate-900 font-black uppercase text-2xl">La lista è vuota</h3>
            <p className="text-slate-400 font-medium mt-2 max-w-xs mx-auto">Non ci sono ancora regali in questa lista. Inizia subito a scegliere!</p>
            <Link href="/shop" className="inline-block mt-10 bg-[#1e73be] text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-sm hover:scale-105 transition-all shadow-xl shadow-blue-100">
              Sfoglia i giocattoli
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}