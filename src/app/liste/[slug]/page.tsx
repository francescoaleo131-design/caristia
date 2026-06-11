"use client";
import { useState, useEffect, use } from 'react';
import { supabase } from '@/lib/supabase/supabase';
import { Gift, Calendar, Share2, Trash2, CheckCircle, ArrowLeft, Coins, Users } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function WishlistOwnerPage({ params }: PageProps) {
  const { slug } = use(params);

  const [wishlist, setWishlist] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [contributions, setContributions] = useState<any[]>([]); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWishlistData() {
      setLoading(true);

      const { data: wishlistData, error: wError } = await supabase
        .from('wishlists')
        .select('*')
        .eq('slug', slug)
        .single();

      if (wError || !wishlistData) {
        console.error("❌ Errore recupero testata lista:", wError?.message);
        setLoading(false);
        return;
      }

      setWishlist(wishlistData);

      const { data: contribData } = await supabase
        .from('wishlist_contributions')
        .select('*')
        .eq('wishlist_id', wishlistData.id)
        .order('created_at', { ascending: false });
      
      setContributions(contribData || []);

      if (wishlistData.list_type !== 'money') {
        const { data: itemsData, error: iError } = await supabase
          .from('wishlist_items')
          .select(`
            id,
            quantity_requested,
            quantity_purchased,
            product_id,
            prodotti:product_id ( id, name, price, image_url )
          `)
          .eq('wishlist_id', wishlistData.id);

        if (!iError) {
          const normalizedItems = (itemsData || []).map((item: any) => ({
            id: item.id,
            quantity_requested: item.quantity_requested,
            quantity_purchased: item.quantity_purchased,
            prodotto: item.prodotti
          }));
          setItems(normalizedItems);
        }
      }
      setLoading(false);
    }
    fetchWishlistData();
  }, [slug]);

  const removeItem = async (itemId: string) => {
    const { error } = await supabase.from('wishlist_items').delete().eq('id', itemId);
    if (error) {
      toast.error("Errore durante la rimozione");
    } else {
      toast.success("Prodotto rimosso con successo");
      setItems(items.filter(item => item.id !== itemId));
    }
  };

  const copyLink = () => {
    const guestUrl = `https://giocattolicaristia.it/regala/${slug}`; 
    navigator.clipboard.writeText(guestUrl);
    toast.success("Link copiato!");
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50">Caricamento...</div>;

  const totalRaised = contributions.reduce((acc, curr) => acc + (curr.amount || 0), 0);

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="bg-white border-b border-slate-100 pt-12 pb-8 px-6">
        <div className="max-w-5xl mx-auto">
          <Link href="/liste" className="inline-flex items-center gap-2 text-slate-400 font-bold mb-6">
            <ArrowLeft size={18} /> Torna alle tue liste
          </Link>
          <div className="flex justify-between items-end">
            <h1 className="text-5xl font-black text-slate-900 uppercase">Lista di {wishlist.child_name}</h1>
            <button onClick={copyLink} className="bg-[#8cc665] text-white px-8 py-5 rounded-[2rem] font-black uppercase text-sm flex items-center gap-3">
              <Share2 size={20} /> Condividi Link
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 mt-12">
        {wishlist.list_type !== 'money' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map((item) => {
              const product = item.prodotto;
              if (!product) return null;
              const isPurchased = item.quantity_purchased >= item.quantity_requested;

              return (
                <div key={item.id} className="bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm relative">
                  <div className="aspect-square p-6 flex items-center justify-center relative">
                    <img src={product.image_url || '/placeholder.png'} className="w-full h-full object-contain" />
                    {isPurchased && (
                      <div className="absolute inset-0 bg-white/80 backdrop-blur-[2px] flex items-center justify-center">
                        <div className="bg-green-500 text-white px-5 py-2 rounded-full font-black uppercase text-[10px] flex items-center gap-2">
                          <CheckCircle size={14} /> Ricevuto!
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-8 text-center">
                    <h3 className="font-black text-slate-800 text-lg mb-6 uppercase tracking-tight">{product.name}</h3>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                       Stato: {isPurchased ? "Già ricevuto" : "In attesa di regalo"}
                    </div>
                    <button onClick={() => removeItem(item.id)} className="w-full text-red-400 hover:bg-red-50 font-black text-xs uppercase py-4 rounded-2xl border border-dashed border-red-200">
                      <Trash2 size={14} /> Rimuovi
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="max-w-xl mx-auto bg-white p-12 rounded-[3rem] shadow-xl text-center">
            <Coins size={36} className="text-amber-500 mx-auto mb-6" />
            <h2 className="text-3xl font-black text-slate-900 uppercase">Totale Accumulato</h2>
            <p className="text-5xl font-black text-green-600 my-6">€{totalRaised.toFixed(2)}</p>
          </div>
        )}
      </div>
    </div>
  );
}