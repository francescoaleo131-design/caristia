"use client";
import { useState, useEffect, use } from 'react';
import { supabase } from '@/lib/supabase/supabase';
import { 
  Gift, 
  Calendar, 
  ShoppingBag, 
  CheckCircle, 
  Heart, 
  Star, 
  Coins, 
  User, 
  MessageSquare, 
  Loader2, 
  Search, 
  MessageCircle, 
  Sparkles,
  BookOpen
} from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function GuestWishlistPage({ params }: PageProps) {
  const { slug } = use(params);
  const [wishlist, setWishlist] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [contributions, setContributions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stripeLoading, setStripeLoading] = useState<string | null>(null);
  
  const [quotaAmount, setQuotaAmount] = useState<string>('');
  const [guestName, setGuestName] = useState<string>('');
  const [guestMessage, setGuestMessage] = useState<string>('');

  // Search & Filter state for physical lists
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'available' | 'purchased'>('all');

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      
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

      // Fetch contributions
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
            products:product_id ( id, name, price, image_url, category ),
            prodotti:product_id ( id, name, price, image_url, category )
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
      if (wishlist.min_contribution && finalAmount < wishlist.min_contribution) {
        toast.error(`L'importo minimo per questa lista è di €${wishlist.min_contribution}`);
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
          wishlistItemId: itemId || null,
          productId: productDetails?.id || null
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

  const filteredItems = items.filter(item => {
    const product = item.prodotto;
    if (!product) return false;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const isPurchased = item.quantity_purchased >= item.quantity_requested;
    if (filterStatus === 'available') return matchesSearch && !isPurchased;
    if (filterStatus === 'purchased') return matchesSearch && isPurchased;
    return matchesSearch;
  });

  const quickAmounts = [15, 25, 50, 100];

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

  const isMoney = wishlist.list_type === 'money';
  const moneyProgress = wishlist.target_amount && wishlist.target_amount > 0
    ? Math.min(Math.round(((wishlist.current_amount || 0) / wishlist.target_amount) * 100), 100)
    : 0;

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-24">
      
      {/* Celebration Header */}
      <header className="bg-white border-b border-slate-100 pt-16 pb-12 px-6 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-amber-400 to-[#8cc665]"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-[#1e73be] px-4 py-2 rounded-full mb-6">
            <Sparkles size={16} className="fill-current animate-pulse" />
            <span className="font-black text-[10px] uppercase tracking-widest">
              {isMoney ? 'Partecipa alla raccolta' : 'Scegli un regalo speciale'}
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-slate-950 leading-tight uppercase tracking-tight mb-4">
            Il Compleanno di <span className="text-[#1e73be]">{wishlist.child_name}</span>
          </h1>

          <div className="flex flex-wrap items-center justify-center gap-4 text-slate-500 font-bold text-sm">
            <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-full border border-slate-100">
              <Calendar size={16} className="text-blue-500" />
              <span>{new Date(wishlist.event_date).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-full border border-slate-100">
              {isMoney ? (
                <>
                  <Coins size={16} className="text-amber-500" />
                  <span className="text-amber-600 uppercase text-xs tracking-wider">Salvadanaio quote</span>
                </>
              ) : (
                <>
                  <Gift size={16} className="text-emerald-500" />
                  <span>{items.filter(i => i.quantity_purchased < i.quantity_requested).length} regali disponibili</span>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12 space-y-10">
        
        {/* Step 1: Guest Details */}
        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-6">
            <User className="text-[#1e73be]" size={20} />
            <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">1. Inserisci i tuoi dati d'auguri</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2 ml-2">Il tuo Nome e Cognome *</label>
              <input
                type="text"
                required
                disabled={stripeLoading !== null}
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="Es. Zii Rossi o Nonna Maria"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-5 font-bold text-slate-800 focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-[#1e73be] transition-all outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2 ml-2">Messaggio di Auguri</label>
              <textarea
                rows={2}
                disabled={stripeLoading !== null}
                value={guestMessage}
                onChange={(e) => setGuestMessage(e.target.value)}
                placeholder="Tanti auguri di buon compleanno!..."
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-5 font-semibold text-slate-800 focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-[#1e73be] transition-all outline-none resize-none"
              />
            </div>
          </div>
        </div>

        {/* Step 2: Choose Contribution */}
        {isMoney ? (
          /* Salvadanaio View */
          <div className="bg-white rounded-[2.5rem] p-8 sm:p-10 border border-slate-100 shadow-sm space-y-8">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <Coins className="text-amber-500" size={20} />
              <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">2. Scegli la tua quota regalo</h3>
            </div>

            {/* Donation Meter (if target amount is defined) */}
            {wishlist.target_amount && wishlist.target_amount > 0 && (
              <div className="bg-amber-50/40 p-6 rounded-3xl border border-amber-100/50 space-y-3">
                <div className="flex justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <span>Accumulato finora</span>
                  <span className="text-amber-700 font-black">{moneyProgress}% dell'obiettivo</span>
                </div>
                <div className="w-full h-3 bg-slate-200/50 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-500" 
                    style={{ width: `${moneyProgress}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-slate-400 font-semibold uppercase tracking-wide">
                  <span>€{(wishlist.current_amount || 0).toFixed(2)} raccolti</span>
                  <span>Obiettivo €{wishlist.target_amount.toFixed(2)}</span>
                </div>
              </div>
            )}

            <div className="space-y-6">
              {/* Quick Select Buttons */}
              <div className="space-y-2">
                <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest ml-2">Seleziona una cifra veloce:</label>
                <div className="grid grid-cols-4 gap-3">
                  {quickAmounts.map((amount) => (
                    <button
                      key={amount}
                      disabled={stripeLoading !== null}
                      onClick={() => setQuotaAmount(amount.toString())}
                      className={`py-3.5 rounded-2xl font-black text-sm transition-all cursor-pointer ${
                        quotaAmount === amount.toString()
                          ? 'bg-[#1e73be] text-white shadow-lg shadow-blue-100'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-100'
                      }`}
                    >
                      €{amount}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Input */}
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2 ml-2">Oppure inserisci una quota libera (€)</label>
                <div className="relative">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-xl font-black text-slate-400">€</span>
                  <input
                    type="number"
                    min={wishlist.min_contribution || "1"}
                    step="0.01"
                    required
                    disabled={stripeLoading !== null}
                    value={quotaAmount}
                    onChange={(e) => setQuotaAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-6 text-xl font-black text-slate-800 focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-[#1e73be] transition-all outline-none"
                  />
                </div>
                {wishlist.min_contribution && (
                  <p className="text-[10px] text-amber-600 font-bold uppercase tracking-wide mt-2 ml-2">
                    Quota minima richiesta: €{wishlist.min_contribution.toFixed(2)}
                  </p>
                )}
              </div>

              <button
                onClick={() => handleStripeCheckout('money')}
                disabled={stripeLoading !== null}
                className="w-full bg-slate-950 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-[#1e73be] transition-all shadow-xl active:scale-95 cursor-pointer"
              >
                {stripeLoading === 'money' ? (
                  <>
                    <Loader2 size={18} className="animate-spin" /> Connessione sicura...
                  </>
                ) : (
                  <>
                    <ShoppingBag size={18} /> Regala ora con Stripe
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          /* Products List View */
          <div className="space-y-6">
            <div className="flex items-center gap-3 bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
              <Gift className="text-blue-500" size={20} />
              <h3 className="text-lg font-black text-slate-850 uppercase tracking-tight">2. Seleziona il giocattolo da regalare</h3>
            </div>

            {/* Filters and Search Bar */}
            <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cerca un giocattolo per nome..."
                  className="w-full bg-slate-50 border border-slate-250 rounded-2xl py-3.5 pl-12 pr-4 font-bold text-slate-800 outline-none focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-[#1e73be] transition-all text-sm"
                />
              </div>
              <div className="flex gap-2">
                {[
                  { id: 'all', label: 'Tutti' },
                  { id: 'available', label: 'Disponibili' },
                  { id: 'purchased', label: 'Già Regalati' }
                ].map((status) => (
                  <button
                    key={status.id}
                    onClick={() => setFilterStatus(status.id as any)}
                    className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                      filterStatus === status.id 
                        ? 'bg-blue-600 text-white shadow-md' 
                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                    }`}
                  >
                    {status.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Products Grid */}
            <div className="space-y-6">
              {filteredItems.map((item) => {
                const product = item.prodotto;
                
                if (!product) {
                  return (
                    <div key={item.id} className="bg-amber-50 p-4 rounded-xl border border-amber-250 text-xs text-amber-700 font-bold">
                      ⚠️ Errore Relazione: Record presente in lista, ma il prodotto non è stato trovato.
                    </div>
                  );
                }
                
                const isPurchased = item.quantity_purchased >= item.quantity_requested;
                const isCurrentLoading = stripeLoading === item.id;

                return (
                  <div
                    key={item.id}
                    className={`bg-white rounded-[2.5rem] p-6 border border-slate-100 flex flex-col sm:flex-row items-center gap-6 transition-all hover:shadow-xl hover:shadow-slate-100/50 ${isPurchased ? 'opacity-60 grayscale' : ''}`}
                  >
                    <div className="w-28 h-28 flex-shrink-0 bg-slate-50 rounded-2xl p-3 flex items-center justify-center border">
                      <img 
                        src={product.image_url || '/placeholder.png'} 
                        alt={product.name || 'Prodotto'} 
                        className="max-w-full max-h-full object-contain" 
                      />
                    </div>

                    <div className="flex-grow text-center sm:text-left min-w-0">
                      <span className="text-[9px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-black uppercase tracking-widest">
                        {product.category || 'Generale'}
                      </span>
                      <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight mt-1 truncate">
                        {product.name}
                      </h3>
                      <p className="text-xl font-extrabold text-[#1e73be] mt-1 mb-3">
                        {Number(product.price || 0).toFixed(2)}€
                      </p>

                      <div className="flex items-center justify-center sm:justify-start gap-2">
                        {isPurchased ? (
                          <div className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                            <CheckCircle size={12} className="stroke-[3]" /> Già regalato
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                            <span>Richiesti: {item.quantity_requested} ({item.quantity_requested - item.quantity_purchased} disponibili)</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {!isPurchased && (
                      <button
                        onClick={() => handleStripeCheckout('physical_product', product, item.id)}
                        disabled={stripeLoading !== null}
                        className="w-full sm:w-auto bg-slate-950 text-white px-6 py-4.5 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 hover:bg-[#8cc665] transition-all shadow-lg active:scale-95 whitespace-nowrap cursor-pointer"
                      >
                        {isCurrentLoading ? (
                          <>
                            <Loader2 size={14} className="animate-spin" /> Connessione...
                          </>
                        ) : (
                          <>
                            <ShoppingBag size={14} /> Regala
                          </>
                        )}
                      </button>
                    )}
                  </div>
                );
              })}

              {filteredItems.length === 0 && (
                <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-slate-200">
                  <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Nessun regalo trovato.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Wishes Book (Guestbook) */}
        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-6">
            <BookOpen className="text-[#1e73be]" size={20} />
            <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">I messaggi degli invitati</h3>
          </div>

          {contributions.length === 0 ? (
            <div className="text-center py-6 text-slate-400 font-bold uppercase tracking-widest text-xs">
              Ancora nessun messaggio. Sii il primo a scrivere una dedica!
            </div>
          ) : (
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
              {contributions.map((contrib, i) => (
                <div key={i} className="bg-slate-50/70 p-5 rounded-2xl border border-slate-100 flex flex-col gap-2">
                  <div className="flex justify-between items-center gap-4">
                    <p className="font-black text-slate-800 text-sm">{contrib.customer_name}</p>
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wide">
                      {new Date(contrib.created_at).toLocaleDateString('it-IT')}
                    </span>
                  </div>
                  <span className="text-[9px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded font-black uppercase tracking-wider w-fit">
                    {contrib.gift_name || "Contributo Libero"}
                  </span>
                  {contrib.customer_message && (
                    <div className="mt-2 bg-white p-3 rounded-xl text-xs italic text-slate-600 border border-slate-100/50">
                      "{contrib.customer_message}"
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Brand Information Footer card */}
        <div className="p-8 bg-[#1e73be] rounded-[2.5rem] text-white text-center shadow-xl relative overflow-hidden">
          <Heart className="absolute -top-10 -left-10 w-40 h-40 text-white/10" />
          <h4 className="text-2xl font-black mb-3 uppercase tracking-tight">Grazie per la tua partecipazione!</h4>
          <p className="text-blue-100 text-sm leading-relaxed max-w-xl mx-auto">
            Acquistando direttamente da questa pagina, i regali verranno registrati ed associati istantaneamente alla festa di {wishlist.child_name}, salvaguardando la sorpresa ed evitando doppioni!
          </p>
        </div>
      </main>

      <footer className="py-8 text-center text-slate-350 text-[9px] font-black uppercase tracking-[0.3em]">
        Giocattoli Caristia
      </footer>
    </div>
  );
}