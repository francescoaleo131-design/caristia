"use client";
import { useState, useEffect, use } from 'react';
import { supabase } from '@/lib/supabase/supabase';
import { Gift, Calendar, Share2, Trash2, CheckCircle, ArrowLeft, Coins, Users, MessageSquare } from 'lucide-react';
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
        setLoading(false);
        return;
      }
      setWishlist(wishlistData);

      // Recupero contributi
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
          setItems(itemsData.map(item => ({
            id: item.id,
            quantity_requested: item.quantity_requested,
            quantity_purchased: item.quantity_purchased,
            prodotto: item.prodotti
          })));
        }
      }
      setLoading(false);
    }
    fetchWishlistData();
  }, [slug]);

  const removeItem = async (itemId: string) => {
    await supabase.from('wishlist_items').delete().eq('id', itemId);
    setItems(items.filter(item => item.id !== itemId));
    toast.success("Rimosso");
  };

  if (loading) return <div className="p-20 text-center">Caricamento...</div>;

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* HEADER */}
      <div className="bg-white border-b p-12">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-5xl font-black uppercase">Lista di {wishlist.child_name}</h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 mt-12 space-y-12">
        
        {/* SEZIONE CONTRIBUTI (CHI HA REGALATO) */}
        <div className="bg-white p-8 rounded-[2rem] border shadow-sm">
          <div className="flex items-center gap-3 mb-8">
            <Users className="text-[#1e73be]" />
            <h2 className="text-xl font-black uppercase">Chi ha partecipato</h2>
          </div>
          
          {contributions.length === 0 ? (
            <p className="text-slate-400 font-bold">Ancora nessuna partecipazione.</p>
          ) : (
            <div className="space-y-4">
              {contributions.map((contrib, i) => (
                <div key={i} className="bg-slate-50 p-6 rounded-2xl border flex flex-col md:flex-row justify-between md:items-center gap-4">
                  <div>
                    <p className="font-bold text-lg">{contrib.customer_name}</p>
                    <p className="text-xs text-slate-500 uppercase tracking-widest font-black">
                      {contrib.gift_name || "Contributo Libero"}
                    </p>
                    {contrib.customer_message && (
                      <div className="mt-3 flex gap-2 items-start bg-white p-3 rounded-xl text-sm italic">
                        <MessageSquare size={16} className="text-blue-400 mt-1" />
                        <span>"{contrib.customer_message}"</span>
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-black text-sm">
                      + €{contrib.amount.toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* LISTA REGALI */}
        {wishlist.list_type !== 'money' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {items.map((item) => (
              <div key={item.id} className="bg-white p-6 rounded-[2rem] border shadow-sm text-center">
                <img src={item.prodotto?.image_url} className="w-32 h-32 mx-auto object-contain mb-4" />
                <h3 className="font-black uppercase mb-4">{item.prodotto?.name}</h3>
                <button onClick={() => removeItem(item.id)} className="text-red-400 text-xs font-black uppercase underline">Rimuovi</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}