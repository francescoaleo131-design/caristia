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

      // 1. Recupera la testata della lista tramite lo slug
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

      // 2. Recupera lo storico dei contributi (quote o regali fisici)
      const { data: contribData } = await supabase
        .from('wishlist_contributions')
        .select('*')
        .eq('wishlist_id', wishlistData.id)
        .order('created_at', { ascending: false });
      
      setContributions(contribData || []);

      // 3. Recupera i prodotti fisici SOLO se non è un salvadanaio
      if (wishlistData.list_type !== 'money') {
        const { data: itemsData, error: iError } = await supabase
          .from('wishlist_items')
          .select(`
            id,
            quantity_requested,
            quantity_purchased,
            prodotti (
              id,
              nome,
              prezzo,
              immagine_url
            )
          `)
          .eq('wishlist_id', wishlistData.id);

        if (!iError) {
          setItems(itemsData || []);
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
    const guestUrl = `${window.location.origin}/regala/${slug}`; 
    navigator.clipboard.writeText(guestUrl);
    toast.success("Link copiato! Invialo a parenti e amici su WhatsApp.");
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-[#1e73be] border-t-transparent rounded-full animate-spin"></div>
        <p className="font-black text-slate-400 uppercase tracking-widest text-xs">Caricamento la tua lista...</p>
      </div>
    </div>
  );

  if (!wishlist) return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <h2 className="text-2xl font-black text-slate-900 mb-4 uppercase">Lista non trovata</h2>
      <Link href="/liste" className="text-blue-600 font-bold underline">Torna alle tue liste</Link>
    </div>
  );

  // Calcolo del totale raccolto in caso di salvadanaio
  const totalRaised = contributions.reduce((acc, curr) => acc + (curr.amount || 0), 0);

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      
      {/* HEADER DELLA LISTA */}
      <div className="bg-white border-b border-slate-100 pt-12 pb-8 px-6">
        <div className="max-w-5xl mx-auto">
          <Link href="/liste" className="inline-flex items-center gap-2 text-slate-400 hover:text-blue-600 font-bold mb-6 transition-colors group">
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            Torna al tuo pannello liste
          </Link>

          <div className="flex flex-col md:flex-row justify-between items-end gap-6">
            <div>
              <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${wishlist.list_type === 'money' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                {wishlist.list_type === 'money' ? 'Il tuo salvadanaio quote' : 'La tua lista regali fisici'}
              </span>
              <h1 className="text-5xl md:text-6xl font-black text-slate-900 mt-4 leading-tight uppercase tracking-tighter">
                Lista di <span className="text-[#1e73be]">{wishlist.child_name}</span>
              </h1>
              <div className="flex items-center gap-6 mt-6 text-slate-500 font-bold">
                <div className="flex items-center gap-2">
                  <Calendar size={20} className="text-[#8cc665]" />
                  <span>{new Date(wishlist.event_date).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>
                {wishlist.list_type !== 'money' && (
                  <div className="flex items-center gap-2">
                    <Gift size={20} className="text-pink-500" />
                    <span>{items.length} Articoli inseriti</span>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={copyLink}
              className="w-full md:w-auto bg-[#8cc665] text-white px-8 py-5 rounded-[2rem] font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 hover:bg-[#7ab554] transition-all shadow-xl shadow-green-100 active:scale-95"
            >
              <Share2 size={20} /> Copia e Condividi Link
            </button>
          </div>
        </div>
      </div>

      {/* REGISTRO INVITATI PRIVATO (Valido sia per regali che per salvadanaio) */}
      <div className="max-w-5xl mx-auto px-6 mt-12">
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-6">
            <Users className="text-[#1e73be]" size={24} />
            <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">Chi ha partecipato (Privato)</h2>
          </div>
          
          {contributions.length === 0 ? (
            <p className="text-sm text-slate-400 font-medium py-2">Nessun invitato ha ancora inviato quote o regali. Condividi il link per iniziare!</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {contributions.map((contrib, i) => (
                <div key={i} className="bg-slate-50 p-4 rounded-2xl flex justify-between items-center border border-slate-100">
                  <div>
                    <p className="font-bold text-slate-800">{contrib.customer_name || 'Invitato Anonimo'}</p>
                    <p className="text-xs text-slate-400 font-semibold">{contrib.customer_email}</p>
                    {contrib.gift_name && (
                      <p className="text-xs text-zinc-500 font-medium mt-1">Regalo: <span className="font-bold text-[#1e73be]">{contrib.gift_name}</span></p>
                    )}
                    {contrib.customer_message && (
                      <p className="text-xs italic text-slate-500 bg-white p-2 rounded-lg mt-2 border border-slate-100">"{contrib.customer_message}"</p>
                    )}
                  </div>
                  <span className="bg-green-50 text-green-600 px-3 py-1.5 rounded-xl text-xs font-black self-start">
                    + €{contrib.amount.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* BLOCCO CONTENUTO IN BASE AL TIPO DI LISTA */}
      <div className="max-w-5xl mx-auto px-6 mt-12">
        
        {/* CASO A: LISTA ARTICOLI FISICI */}
        {wishlist.list_type !== 'money' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map((item) => {
              const product = item.prodotti;
              if (!product) return null;
              const isPurchased = item.quantity_purchased >= item.quantity_requested;

              return (
                <div key={item.id} className="bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm relative group">
                  <div className="aspect-square bg-white p-6 border-b border-slate-50 flex items-center justify-center relative">
                    <img
                      src={product.immagine_url || '/placeholder.png'}
                      alt={product.nome}
                      className="w-full h-full object-contain"
                    />
                    {isPurchased && (
                      <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center p-6">
                        <div className="bg-green-500 text-white px-5 py-2 rounded-full font-black uppercase text-[10px] tracking-widest flex items-center gap-2 shadow-lg">
                          <CheckCircle size={14} /> Ricevuto!
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="p-8 text-center">
                    <h3 className="font-black text-slate-800 text-lg leading-tight mb-3 line-clamp-2 uppercase tracking-tight">
                      {product.nome}
                    </h3>
                    <p className="text-3xl font-black text-[#1e73be] mb-6">
                      {product.prezzo.toFixed(2)}€
                    </p>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="w-full text-red-400 hover:bg-red-50 font-black text-xs uppercase tracking-widest py-4 rounded-2xl border border-dashed border-red-200 hover:border-red-400 transition-all flex items-center justify-center gap-2 active:scale-95"
                    >
                      <Trash2 size={14} /> Rimuovi Regalo
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          
          /* CASO B: IL SALVADANAIO QUOTE IN VISIONE GENITORE */
          <div className="max-w-xl mx-auto bg-white p-8 sm:p-12 rounded-[3rem] border border-slate-100 shadow-xl text-center">
            <div className="w-20 h-20 bg-amber-50 rounded-3xl flex items-center justify-center text-amber-500 mx-auto mb-6">
              <Coins size={36} />
            </div>
            <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Salvadanaio di {wishlist.child_name}</h2>
            
            {/* Contatore cumulativo del denaro ricevuto */}
            <div className="my-6 p-6 bg-slate-50 rounded-2xl border border-slate-100 text-center">
              <p className="text-xs font-black text-slate-400 uppercase tracking-wider mb-1">Totale Accumulato</p>
              <p className="text-4xl font-black text-green-600">€{totalRaised.toFixed(2)}</p>
            </div>

            <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100 text-left">
              <p className="text-xs text-blue-700 font-medium leading-relaxed text-center">
                Gli invitati che usano il tuo link trovano un modulo sicuro per versare quote libere e scriverti un messaggio d'auguri. Trovi i singoli dettagli nel pannello sopra.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}