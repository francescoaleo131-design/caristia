"use client";
import { useState, useEffect, use } from 'react';
import { supabase } from '@/lib/supabase/supabase';
import { Gift, Calendar, ShoppingBag, CheckCircle, Heart, Star, Coins, User, MessageSquare, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function GuestWishlistPage({ params }: PageProps) {
  const { slug } = use(params);
  const [wishlist, setWishlist] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stripeLoading, setStripeLoading] = useState<string | null>(null);
  
  const [quotaAmount, setQuotaAmount] = useState<string>('');
  const [guestName, setGuestName] = useState<string>('');
  const [guestMessage, setGuestMessage] = useState<string>('');

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      
      // 1. Recupera la testata della wishlist
      const { data: wishlistData, error: wError } = await supabase
        .from('wishlists')
        .select('*')
        .eq('slug', slug)
        .single();

      if (wError || !wishlistData) {
        console.error("❌ Errore testata lista:", wError?.message);
        setLoading(false);
        return;
      }
      setWishlist(wishlistData);

      // 2. Recupera gli articoli SENZA chiedere lo slug del prodotto che non esiste nel DB
      if (wishlistData.list_type !== 'money') {
        const { data: itemsData, error: iError } = await supabase
          .from('wishlist_items')
          .select(`
            id,
            quantity_requested,
            quantity_purchased,
            product_id,
            products:product_id ( id, name, price, image_url ),
            prodotti:product_id ( id, name, price, image_url )
          `)
          .eq('wishlist_id', wishlistData.id);

        if (iError) {
          console.error("❌ Errore caricamento articoli:", iError.message);
          toast.error("Errore nel caricamento dei prodotti");
        } else {
          const normalizedItems = (itemsData || []).map((item: any) => {
            let rawProduct = item.products || item.prodotti;
            let productData = null;

            if (rawProduct) {
              productData = Array.isArray(rawProduct) ? rawProduct[0] : rawProduct;
            }

            return {
              id: item.id,
              quantity_requested: item.quantity_requested,
              quantity_purchased: item.quantity_purchased,
              prodotto: productData
            };
          });

          setItems(normalizedItems);
        }
      }
      
      setLoading(false);
    }
    fetchData();
  }, [slug]);

  const handleStripeCheckout = async (type: 'money' | 'physical_product', productDetails?: any, itemId?: string) => {
    if (!guestName.trim()) {
      toast.error("Inserisci il tuo nome per farti riconoscere dal festeggiato");
      return;
    }

    let finalAmount = 0;
    let giftName = '';

    if (type === 'money') {
      finalAmount = parseFloat(quotaAmount);
      if (isNaN(finalAmount) || finalAmount <= 0) {
        toast.error("Inserisci un importo valido per la donazione");
        return;
      }
      giftName = 'Quota Salvadanaio';
    } else {
      finalAmount = productDetails?.price || 0;
      giftName = productDetails?.name || 'Regalo Fisico';
    }

    try {
      setStripeLoading(itemId || 'money');

      const response = await fetch('/api/checkout/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: finalAmount,
          wishlistId: wishlist.id,
          wishlistSlug: slug,
          childName: wishlist.child_name,
          guestName: guestName,
          guestMessage: guestMessage,
          giftName: giftName,
          wishlistItemId: itemId || null
        }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || "Impossibile avviare il pagamento con Stripe");
      }
    } catch (err: any) {
      toast.error(err.message || "Errore di connessione con Stripe");
      setStripeLoading(null);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-12 h-12 border-4 border-[#1e73be] border-t-transparent rounded-full animate-spin"></div>
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
              <span>{new Date(wishlist.event_date).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
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
                  <span>{items.length} desideri disponibili</span>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12">
        {/* Form Dati Invitato */}
        <div className="bg-white rounded-[3rem] p-8 border border-slate-100 shadow-xl mb-12">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-6">
            <User className="text-[#1e73be]" size={20} />
            <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">1. Inserisci i tuoi dati d'auguri</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-black uppercase text-slate-400 tracking-widest mb-2">Il tuo Nome e Cognome *</label>
              <input
                type="text"
                required
                disabled={stripeLoading !== null}
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="Es. Zii Rossi o Nonna Maria"
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-5 font-bold text-slate-800 focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-[#1e73be] transition-all outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-black uppercase text-slate-400 tracking-widest mb-2">Dedica / Messaggio per il bambino</label>
              <textarea
                rows={2}
                disabled={stripeLoading !== null}
                value={guestMessage}
                onChange={(e) => setGuestMessage(e.target.value)}
                placeholder="Tanti auguri di buon compleanno!..."
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 px-5 font-medium text-slate-800 focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-[#1e73be] transition-all outline-none resize-none"
              />
            </div>
          </div>
        </div>

        {wishlist.list_type === 'money' ? (
          /* Salvadanaio */
          <div className="bg-white rounded-[3rem] p-8 sm:p-12 border border-slate-100 shadow-xl">
            <div className="text-center max-w-md mx-auto mb-10">
              <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500 mx-auto mb-4">
                <Coins size={32} />
              </div>
              <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Scegli la tua Quota</h2>
            </div>

            <div className="space-y-6 max-w-md mx-auto">
              <div>
                <label className="block text-xs font-black uppercase text-slate-400 tracking-widest mb-2">Quanto vuoi regalare? (€)</label>
                <div className="relative">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-2xl font-black text-slate-400">€</span>
                  <input
                    type="number"
                    min="1"
                    step="0.01"
                    required
                    disabled={stripeLoading !== null}
                    value={quotaAmount}
                    onChange={(e) => setQuotaAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-5 pl-12 pr-6 text-2xl font-black text-slate-800 focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-[#1e73be] transition-all outline-none"
                  />
                </div>
              </div>

              <button
                onClick={() => handleStripeCheckout('money')}
                disabled={stripeLoading !== null}
                className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 hover:bg-[#1e73be] transition-all shadow-xl active:scale-95"
              >
                {stripeLoading === 'money' ? (
                  <>
                    <Loader2 size={18} className="animate-spin" /> Connessione a Stripe...
                  </>
                ) : (
                  <>
                    <ShoppingBag size={18} /> Procedi al pagamento della quota
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          /* Regali Fisici */
          <div className="space-y-6">
            <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest px-2 mb-2">2. Seleziona il gioco che desideri regalare:</h3>
            
            {items.map((item) => {
              const product = item.prodotto;
              
              if (!product) {
                return (
                  <div key={item.id} className="bg-amber-50 p-4 rounded-xl border border-amber-200 text-xs text-amber-700 font-bold">
                    ⚠️ Errore Relazione: Record presente in lista, ma il prodotto (ID: {item.product_id}) non è stato trovato nella tabella prodotti.
                  </div>
                );
              }
              
              const isPurchased = item.quantity_purchased >= item.quantity_requested;
              const isCurrentLoading = stripeLoading === item.id;

              return (
                <div
                  key={item.id}
                  className={`bg-white rounded-[2rem] p-6 border border-slate-100 flex flex-col sm:flex-row items-center gap-8 transition-all hover:shadow-xl hover:shadow-slate-100/50 ${isPurchased ? 'opacity-50 grayscale' : ''}`}
                >
                  <div className="w-32 h-32 flex-shrink-0 bg-slate-50 rounded-2xl p-4 flex items-center justify-center">
                    <img 
                      src={product.image_url || '/placeholder.png'} 
                      alt={product.name || 'Prodotto'} 
                      className="max-w-full max-h-full object-contain" 
                    />
                  </div>

                  <div className="flex-grow text-center sm:text-left">
                    <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight mb-1">
                      {product.name}
                    </h3>
                    <p className="text-2xl font-black text-[#1e73be] mb-4">
                      {Number(product.price || 0).toFixed(2)}€
                    </p>

                    {isPurchased ? (
                      <div className="inline-flex items-center gap-2 bg-green-50 text-green-600 px-4 py-2 rounded-full text-xs font-black uppercase">
                        <CheckCircle size={14} /> Già regalato
                      </div>
                    ) : (
                      <span className="text-[10px] bg-blue-50 text-blue-600 px-3 py-1 rounded-md font-black uppercase tracking-wider">
                        Disponibile
                      </span>
                    )}
                  </div>

                  {!isPurchased && (
                    <button
                      onClick={() => handleStripeCheckout('physical_product', product, item.id)}
                      disabled={stripeLoading !== null}
                      className="w-full sm:w-auto bg-slate-900 text-white px-8 py-5 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-[#8cc665] transition-all shadow-lg active:scale-95 whitespace-nowrap"
                    >
                      {isCurrentLoading ? (
                        <>
                          <Loader2 size={16} className="animate-spin" /> Connessione...
                        </>
                      ) : (
                        <>
                          <ShoppingBag size={16} /> Regala ora con Stripe
                        </>
                      )}
                    </button>
                  )}
                </div>
              );
            })}

            {items.length === 0 && (
              <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-slate-200">
                <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">Nessun regalo inserito in questa lista.</p>
              </div>
            )}
          </div>
        )}

        <div className="mt-20 p-8 bg-[#1e73be] rounded-[2.5rem] text-white text-center shadow-2xl relative overflow-hidden">
          <Heart className="absolute -top-10 -left-10 w-40 h-40 text-white/10" />
          <h4 className="text-2xl font-black mb-4 uppercase">Grazie per la tua partecipazione!</h4>
          <p className="text-blue-100 font-medium">
            Acquistando direttamente da questa pagina, i regali verranno registrati ed associati istantaneamente alla festa di {wishlist?.child_name}, salvaguardando la sorpresa ed evitando doppioni!
          </p>
        </div>
      </main>

      <footer className="py-12 text-center text-slate-300 text-[10px] font-black uppercase tracking-[0.3em]">
        Giocattoli Caristia
      </footer>
    </div>
  );
}