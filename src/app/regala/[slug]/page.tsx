"use client";
import { useState, useEffect, use } from 'react';
import { supabase } from '@/lib/supabase/supabase';
import { Gift, Calendar, ShoppingBag, CheckCircle, Heart, Star, Coins, User, MessageSquare, Loader2 } from 'lucide-react';
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
  const [stripeLoading, setStripeLoading] = useState(false);
  
  // Stati per il form del Salvadanaio / Quota Libera
  const [quotaAmount, setQuotaAmount] = useState<string>('');
  const [guestName, setGuestName] = useState<string>('');
  const [guestMessage, setGuestMessage] = useState<string>('');
  
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

      // 2. Se è una lista di regali fisici, recupera gli articoli
      if (wishlistData.list_type !== 'money') {
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
      }
      
      setLoading(false);
    }
    fetchData();
  }, [slug]);

  // Gestione Regalo Fisico: Aggiunge l'articolo al carrello globale dello shop
  const handleRegalaOra = (product: any) => {
    addItem({
      id: product.id,
      wishlist_id: wishlist.id,
      name: product.nome,
      price: product.prezzo,
      image_url: product.immagine_url
    });
    toast.success(`${product.nome} aggiunto al carrello! Completa l'ordine per regalarlo.`);
  };

  // Gestione Salvadanaio: Reindirizza istantaneamente a Stripe Checkout
  const handleInviaQuotaDirectlyToStripe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const parsedAmount = parseFloat(quotaAmount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      toast.error("Inserisci un importo valido per il regalo");
      return;
    }

    if (!guestName.trim()) {
      toast.error("Inserisci il tuo nome per farti riconoscere");
      return;
    }

    try {
      setStripeLoading(true);

      // Chiamata alla tua API con tutti i dati necessari per i metadata di Stripe
      const response = await fetch('/api/checkout/wishlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: parsedAmount,
          wishlistId: wishlist.id,
          wishlistSlug: slug,
          childName: wishlist.child_name,
          guestName: guestName,
          guestMessage: guestMessage,
        }),
      });

      const data = await response.json();

      if (data.url) {
        // Redirezione immediata al Checkout sicuro di Stripe
        window.location.href = data.url;
      } else {
        throw new Error(data.error || "Impossibile generare il pagamento");
      }

    } catch (err: any) {
      toast.error(err.message || "Errore durante il collegamento a Stripe");
      setStripeLoading(false);
    }
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
            <span className="font-black text-[10px] uppercase tracking-widest">
              {wishlist.list_type === 'money' ? 'Partecipa alla raccolta' : 'Scegli un regalo speciale'}
            </span>
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
              {wishlist.list_type === 'money' ? (
                <>
                  <Coins size={18} className="text-amber-500" />
                  <span className="text-amber-600 font-black uppercase text-xs tracking-wider">Salvadanaio quote</span>
                </>
              ) : (
                <>
                  <Gift size={18} />
                  <span>{items.length} desideri</span>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* CONTENUTO PRINCIPALE */}
      <main className="max-w-3xl mx-auto px-6 py-12">
        
        {/* CASO A: MODALITÀ SALVADANAIO (QUOTA LIBERA DIRETTA SU STRIPE) */}
        {wishlist.list_type === 'money' ? (
          <div className="bg-white rounded-[3rem] p-8 sm:p-12 border border-slate-100 shadow-xl shadow-slate-100/70">
            <div className="text-center max-w-md mx-auto mb-10">
              <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500 mx-auto mb-4">
                <Coins size={32} />
              </div>
              <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Lascia il tuo Pensiero</h2>
              <p className="text-slate-400 text-sm mt-2 font-medium">
                I genitori hanno attivato una raccolta quote. Scegli quanto donare e lascia un messaggio speciale per il piccolo!
              </p>
            </div>

            <form onSubmit={handleInviaQuotaDirectlyToStripe} className="space-y-6 max-w-md mx-auto">
              
              {/* Campo Importo */}
              <div>
                <label className="block text-xs font-black uppercase text-slate-400 tracking-widest mb-2">Quanto vuoi regalare? (€)</label>
                <div className="relative">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-2xl font-black text-slate-400">€</span>
                  <input
                    type="number"
                    min="1"
                    step="0.01"
                    required
                    disabled={stripeLoading}
                    value={quotaAmount}
                    onChange={(e) => setQuotaAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-5 pl-12 pr-6 text-2xl font-black text-slate-800 focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-[#1e73be] transition-all outline-none"
                  />
                </div>
              </div>

              {/* Campo Nome */}
              <div>
                <label className="block text-xs font-black uppercase text-slate-400 tracking-widest mb-2">Il tuo Nome e Cognome</label>
                <div className="relative">
                  <User size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    disabled={stripeLoading}
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="Es. Nonna Maria o Famiglia Rossi"
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-6 font-bold text-slate-800 focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-[#1e73be] transition-all outline-none"
                  />
                </div>
              </div>

              {/* Campo Messaggio */}
              <div>
                <label className="block text-xs font-black uppercase text-slate-400 tracking-widest mb-2">Messaggio d'Auguri (Facoltativo)</label>
                <div className="relative">
                  <MessageSquare size={18} className="absolute left-5 top-5 text-slate-400" />
                  <textarea
                    rows={4}
                    disabled={stripeLoading}
                    value={guestMessage}
                    onChange={(e) => setGuestMessage(e.target.value)}
                    placeholder="Scrivi un pensiero dolce per il festeggiato..."
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-6 font-medium text-slate-800 focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-[#1e73be] transition-all outline-none resize-none"
                  />
                </div>
              </div>

              {/* Bottone di Conferma con Loader integrato */}
              <button
                type="submit"
                disabled={stripeLoading}
                className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 hover:bg-[#1e73be] transition-all shadow-xl active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {stripeLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" /> Connessione a Stripe sicuro...
                  </>
                ) : (
                  <>
                    <ShoppingBag size={18} /> Procedi al pagamento
                  </>
                )}
              </button>
            </form>
          </div>
        ) : (
          
          /* CASO B: MODALITÀ LISTA DI REGALI FISICI SELEZIONATI */
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
                  {/* Immagine Giocattolo */}
                  <div className="w-32 h-32 flex-shrink-0 bg-slate-50 rounded-2xl p-4 flex items-center justify-center">
                    <img 
                      src={product.immagine_url || '/placeholder.png'} 
                      alt={product.nome} 
                      className="max-w-full max-h-full object-contain" 
                    />
                  </div>

                  {/* Informazioni Articolo */}
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

                  {/* Inserimento nel carrello */}
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

            {items.length === 0 && (
              <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
                <p className="text-slate-400 font-bold uppercase tracking-widest">La lista è attualmente vuota.</p>
              </div>
            )}
          </div>
        )}

        {/* Banner Emozionale Unificato di Chiusura */}
        <div className="mt-20 p-8 bg-[#1e73be] rounded-[2.5rem] text-white text-center shadow-2xl relative overflow-hidden">
          <Heart className="absolute -top-10 -left-10 w-40 h-40 text-white/10" />
          <h4 className="text-2xl font-black mb-4 uppercase">Grazie per il tuo pensiero!</h4>
          <p className="text-blue-100 font-medium">
            Scegliendo un regalo da questa lista, aiuterai i genitori a ricevere esattamente ciò che serve, evitando doppioni e completando il set perfetto per il divertimento di {wishlist.child_name}.
          </p>
        </div>
      </main>

      {/* Footer Istituzionale */}
      <footer className="py-12 text-center text-slate-300 text-[10px] font-black uppercase tracking-[0.3em]">
        Giocattoli Caristia
      </footer>
    </div>
  );
}