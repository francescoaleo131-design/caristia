"use client";
import { useState, useEffect, use } from 'react';
import { supabase } from '@/lib/supabase/supabase';
import { 
  Gift, 
  Calendar, 
  Share2, 
  Trash2, 
  Check, 
  ArrowLeft, 
  Coins, 
  Users, 
  MessageSquare, 
  Plus, 
  Minus, 
  Settings, 
  X, 
  Search, 
  Sparkles, 
  Copy,
  CheckCircle2
} from 'lucide-react';
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

  // Edit Mode state
  const [editMode, setEditMode] = useState(false);
  const [editedChildName, setEditedChildName] = useState('');
  const [editedEventDate, setEditedEventDate] = useState('');
  const [editedTargetAmount, setEditedTargetAmount] = useState('');
  const [editedMinContribution, setEditedMinContribution] = useState('');

  // Add Product state
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tutti');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Copy state
  const [linkCopied, setLinkCopied] = useState(false);

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
        toast.error("Impossibile caricare la lista regalo");
        return;
      }
      setWishlist(wishlistData);
      
      setEditedChildName(wishlistData.child_name || '');
      setEditedEventDate(wishlistData.event_date || '');
      setEditedTargetAmount(wishlistData.target_amount || '');
      setEditedMinContribution(wishlistData.min_contribution || '10');

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
            prodotti:product_id ( id, name, price, image_url, category )
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

  // Load products list for the search modal
  useEffect(() => {
    async function fetchProducts() {
      const { data, error } = await supabase
        .from('prodotti')
        .select('*')
        .order('name', { ascending: true });
      if (!error) {
        setAllProducts(data || []);
      }
    }
    fetchProducts();
  }, []);

  const handleCopyLink = () => {
    const url = `${window.location.origin}/regala/${slug}`;
    navigator.clipboard.writeText(url);
    setLinkCopied(true);
    toast.success("Link invitati copiato!");
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const removeItem = async (itemId: string) => {
    const { error } = await supabase.from('wishlist_items').delete().eq('id', itemId);
    if (error) {
      toast.error("Errore durante la rimozione del regalo");
    } else {
      setItems(items.filter(item => item.id !== itemId));
      toast.success("Regalo rimosso con successo");
    }
  };

  const updateRequestedQuantity = async (itemId: string, newQty: number) => {
    const item = items.find(i => i.id === itemId);
    if (!item) return;

    if (newQty < item.quantity_purchased) {
      toast.error(`Non puoi impostare una quantità inferiore a quella già acquistata (${item.quantity_purchased})`);
      return;
    }

    const { error } = await supabase
      .from('wishlist_items')
      .update({ quantity_requested: newQty })
      .eq('id', itemId);

    if (error) {
      toast.error("Errore durante l'aggiornamento della quantità");
    } else {
      setItems(items.map(i => i.id === itemId ? { ...i, quantity_requested: newQty } : i));
      toast.success("Quantità aggiornata");
    }
  };

  const addProductToWishlist = async (productId: string) => {
    if (items.some(item => item.prodotto?.id === productId)) {
      toast.error("Prodotto già presente in lista!");
      return;
    }

    const { data, error } = await supabase
      .from('wishlist_items')
      .insert([{
        wishlist_id: wishlist.id,
        product_id: productId,
        quantity_requested: 1,
        quantity_purchased: 0
      }])
      .select(`
        id,
        quantity_requested,
        quantity_purchased,
        product_id,
        prodotti:product_id ( id, name, price, image_url, category )
      `)
      .single();

    if (error) {
      toast.error("Errore durante l'aggiunta");
      console.error(error);
    } else {
      toast.success("Prodotto aggiunto!");
      setItems([...items, {
        id: data.id,
        quantity_requested: data.quantity_requested,
        quantity_purchased: data.quantity_purchased,
        prodotto: data.prodotti
      }]);
    }
  };

  const saveDetails = async () => {
    const updates: any = {
      child_name: editedChildName,
      event_date: editedEventDate,
    };

    if (wishlist.list_type === 'money') {
      updates.target_amount = editedTargetAmount ? parseFloat(editedTargetAmount) : null;
      updates.min_contribution = editedMinContribution ? parseFloat(editedMinContribution) : 10;
    }

    const { error } = await supabase
      .from('wishlists')
      .update(updates)
      .eq('id', wishlist.id);

    if (error) {
      toast.error("Errore durante l'aggiornamento dei dettagli");
    } else {
      toast.success("Dettagli aggiornati con successo!");
      setWishlist({ ...wishlist, ...updates });
      setEditMode(false);
    }
  };

  const filteredProducts = allProducts.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Tutti' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getWhatsAppShareLink = () => {
    if (!wishlist) return '';
    const shareLink = `${window.location.origin}/regala/${slug}`;
    const text = `Ciao! Ho creato la lista regalo di compleanno per ${wishlist.child_name} presso Giocattoli Caristia. Puoi vedere i giocattoli desiderati o partecipare qui: ${shareLink}`;
    return `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-12 h-12 border-4 border-[#1e73be] border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!wishlist) return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <h2 className="text-2xl font-black text-slate-900 mb-4 uppercase">Lista non trovata</h2>
      <Link href="/liste" className="text-blue-600 font-bold underline">Torna alle tue liste</Link>
    </div>
  );

  const isMoney = wishlist.list_type === 'money';
  const moneyProgress = wishlist.target_amount && wishlist.target_amount > 0
    ? Math.min(Math.round(((wishlist.current_amount || 0) / wishlist.target_amount) * 100), 100)
    : 0;

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      
      {/* Header Bar */}
      <header className="bg-white border-b border-slate-100 py-6 px-6 sticky top-0 z-30 shadow-sm">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <Link href="/liste" className="flex items-center gap-2 text-slate-400 hover:text-[#1e73be] font-bold text-sm transition-colors cursor-pointer">
            <ArrowLeft size={16} />
            <span>Gestione Liste</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-full ${isMoney ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
              {isMoney ? 'Salvadanaio digital' : 'Lista Regali Fisici'}
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 mt-10 space-y-8">
        
        {/* Title and Settings Panel */}
        {editMode ? (
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-lg font-black uppercase text-slate-800">Modifica Dettagli Lista</h3>
              <button onClick={() => setEditMode(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors cursor-pointer text-slate-400"><X size={18} /></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2 mb-2 block tracking-widest">Nome Festeggiato/a</label>
                <input 
                  type="text" 
                  value={editedChildName} 
                  onChange={(e) => setEditedChildName(e.target.value)} 
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:border-[#1e73be] focus:bg-white transition-all font-bold text-slate-800" 
                />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2 mb-2 block tracking-widest">Data della festa</label>
                <input 
                  type="date" 
                  value={editedEventDate} 
                  onChange={(e) => setEditedEventDate(e.target.value)} 
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:border-[#1e73be] focus:bg-white transition-all font-bold text-slate-800" 
                />
              </div>
              {isMoney && (
                <>
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-2 mb-2 block tracking-widest">Obiettivo Fondi (€, Opzionale)</label>
                    <input 
                      type="number" 
                      value={editedTargetAmount} 
                      onChange={(e) => setEditedTargetAmount(e.target.value)} 
                      placeholder="Nessun obiettivo"
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:border-[#1e73be] focus:bg-white transition-all font-bold text-slate-800" 
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-2 mb-2 block tracking-widest">Quota Minima per Invitato (€)</label>
                    <input 
                      type="number" 
                      value={editedMinContribution} 
                      onChange={(e) => setEditedMinContribution(e.target.value)} 
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:border-[#1e73be] focus:bg-white transition-all font-bold text-slate-800" 
                    />
                  </div>
                </>
              )}
            </div>
            <div className="flex gap-4 pt-4 border-t border-slate-100 justify-end">
              <button onClick={() => setEditMode(false)} className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-6 py-3 rounded-xl font-bold transition-all text-xs uppercase tracking-widest cursor-pointer">Annulla</button>
              <button onClick={saveDetails} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-all text-xs uppercase tracking-widest cursor-pointer shadow-md">Salva Modifiche</button>
            </div>
          </div>
        ) : (
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-1">Pannello Genitore</span>
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight uppercase tracking-tight">
                Lista di <span className="text-[#1e73be]">{wishlist.child_name}</span>
              </h1>
              <div className="flex flex-wrap items-center gap-4 mt-3 text-slate-500 font-bold text-sm">
                <div className="flex items-center gap-1 bg-slate-50 px-3 py-1.5 rounded-full border">
                  <Calendar size={14} className="text-blue-500" />
                  <span>{new Date(wishlist.event_date).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>
                {isMoney && wishlist.target_amount && (
                  <div className="flex items-center gap-1 bg-slate-50 px-3 py-1.5 rounded-full border">
                    <Coins size={14} className="text-amber-500" />
                    <span>Obiettivo: €{wishlist.target_amount}</span>
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={() => setEditMode(true)}
              className="flex items-center gap-2 bg-slate-900 text-white px-5 py-3 rounded-2xl font-bold text-xs uppercase tracking-wider hover:bg-[#1e73be] transition-colors cursor-pointer shadow-md"
            >
              <Settings size={14} />
              Impostazioni Lista
            </button>
          </div>
        )}

        {/* Sharing Panel */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Share2 className="text-[#1e73be]" size={20} />
            <h2 className="text-lg font-black uppercase tracking-tight text-slate-800">Condividi la tua lista</h2>
          </div>
          <p className="text-sm text-slate-500 mb-6">Invia il link per permettere ad amici e parenti di regalare giocattoli o inviare le proprie quote.</p>
          
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
            <div className="flex-grow bg-slate-50 border border-slate-100 rounded-2xl py-4 px-5 flex items-center justify-between gap-4 select-all font-mono font-bold text-slate-600 text-sm">
              <span className="truncate">{window.location.origin}/regala/{slug}</span>
              <button 
                onClick={handleCopyLink}
                className="text-slate-400 hover:text-blue-600 transition-colors cursor-pointer p-1"
                title="Copia link"
              >
                {linkCopied ? <Check size={18} className="text-green-600" /> : <Copy size={18} />}
              </button>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleCopyLink}
                className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-6 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-wider text-xs hover:bg-slate-800 transition-all cursor-pointer shadow-md active:scale-95"
              >
                {linkCopied ? "Copiato!" : "Copia Link"}
              </button>
              <a
                href={getWhatsAppShareLink()}
                target="_blank"
                rel="noreferrer"
                className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-6 py-4 bg-[#25D366] text-white rounded-2xl font-black uppercase tracking-wider text-xs hover:bg-[#20ba5a] transition-all cursor-pointer shadow-md active:scale-95 text-center"
              >
                Condividi WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* Money list metrics (if money) */}
        {isMoney && (
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Coins className="text-amber-500" size={22} />
                <h2 className="text-lg font-black uppercase text-slate-800 tracking-tight">Salvadanaio Quote</h2>
              </div>
              <span className="text-3xl font-black text-slate-900">€{(wishlist.current_amount || 0).toFixed(2)}</span>
            </div>
            
            {wishlist.target_amount && wishlist.target_amount > 0 ? (
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest">
                  <span>Progresso raccolta</span>
                  <span className="text-amber-600 font-black">{moneyProgress}%</span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-500" 
                    style={{ width: `${moneyProgress}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-slate-400 font-bold uppercase tracking-wider pt-1">
                  <span>€{(wishlist.current_amount || 0).toFixed(2)} raccolti</span>
                  <span>Obiettivo €{wishlist.target_amount.toFixed(2)}</span>
                </div>
              </div>
            ) : (
              <div className="bg-amber-50/50 p-4 border border-amber-100/50 rounded-2xl text-xs text-amber-700 font-bold uppercase tracking-wider">
                Attivo per quote libere senza obiettivo prefissato (quota min: €{wishlist.min_contribution || 10})
              </div>
            )}
          </div>
        )}

        {/* Physical Products (if not money) */}
        {wishlist.list_type !== 'money' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center gap-4">
              <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Giocattoli scelti ({items.length})</h2>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3.5 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-md active:scale-95 text-xs uppercase tracking-wider cursor-pointer"
              >
                <Plus size={16} /> Aggiungi Giocattoli
              </button>
            </div>

            {items.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-slate-200">
                <Gift className="mx-auto text-slate-300 mb-4 animate-bounce" size={48} />
                <p className="text-slate-400 font-bold uppercase tracking-widest text-sm mb-4">Nessun regalo inserito.</p>
                <button 
                  onClick={() => setIsAddModalOpen(true)} 
                  className="bg-blue-50 text-blue-600 px-6 py-3.5 rounded-2xl font-bold hover:bg-blue-100 transition-all text-xs uppercase tracking-wider cursor-pointer"
                >
                  Sfoglia il catalogo
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {items.map((item) => {
                  const product = item.prodotto;
                  if (!product) return null;
                  
                  const isFullyGifted = item.quantity_purchased >= item.quantity_requested;

                  return (
                    <div key={item.id} className="bg-white rounded-[2.5rem] border border-slate-100 p-6 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between relative overflow-hidden group">
                      
                      {isFullyGifted && (
                        <div className="absolute top-3 right-3 bg-green-100 text-green-700 p-1.5 rounded-full" title="Tutti regalati!">
                          <Check size={14} className="stroke-[3]" />
                        </div>
                      )}

                      <div className="text-center space-y-4">
                        <div className="w-32 h-32 mx-auto bg-slate-50 rounded-2xl p-3 flex items-center justify-center">
                          <img src={product.image_url || '/placeholder.png'} className="max-w-full max-h-full object-contain" />
                        </div>
                        <div>
                          <span className="text-[9px] bg-slate-100 text-slate-500 font-black uppercase px-2 py-0.5 rounded-md tracking-wider">
                            {product.category || 'Generale'}
                          </span>
                          <h3 className="font-black text-slate-800 uppercase text-xs mt-2 line-clamp-2 leading-snug">{product.name}</h3>
                          <p className="font-extrabold text-blue-600 text-md mt-1">{product.price.toFixed(2)}€</p>
                        </div>
                      </div>

                      <div className="mt-6 pt-4 border-t border-slate-100 space-y-4">
                        {/* Status tracker */}
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-400 font-bold uppercase tracking-wider">Acquistati:</span>
                          <span className={`font-black uppercase tracking-wider ${item.quantity_purchased > 0 ? 'text-green-600' : 'text-slate-400'}`}>
                            {item.quantity_purchased} di {item.quantity_requested}
                          </span>
                        </div>

                        {/* Quantity editor */}
                        <div className="flex items-center justify-between gap-2 bg-slate-50 p-1.5 rounded-xl">
                          <button
                            onClick={() => updateRequestedQuantity(item.id, item.quantity_requested - 1)}
                            disabled={item.quantity_requested <= item.quantity_purchased || item.quantity_requested <= 1}
                            className="w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-white transition-all cursor-pointer"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="font-black text-slate-800 text-xs">{item.quantity_requested} desiderati</span>
                          <button
                            onClick={() => updateRequestedQuantity(item.id, item.quantity_requested + 1)}
                            className="w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-all cursor-pointer"
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        {/* Remove button */}
                        <div className="text-center">
                          {item.quantity_purchased > 0 ? (
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                              Già regalato - Non rimovibile
                            </span>
                          ) : (
                            <button 
                              onClick={() => removeItem(item.id)} 
                              className="text-red-500 hover:text-red-700 text-xs font-black uppercase tracking-wider flex items-center gap-1 mx-auto transition-colors cursor-pointer"
                            >
                              <Trash2 size={12} /> Rimuovi
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Contributions and Messages Section */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <Users className="text-[#1e73be]" />
            <h2 className="text-lg font-black uppercase tracking-tight text-slate-800">Messaggi e partecipazioni</h2>
          </div>
          
          {contributions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-slate-400 font-bold">Ancora nessuna partecipazione registrata.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {contributions.map((contrib, i) => (
                <div key={i} className="bg-slate-50/70 p-6 rounded-3xl border border-slate-100 flex flex-col justify-between gap-4">
                  <div>
                    <div className="flex justify-between items-start gap-4 mb-2">
                      <p className="font-black text-slate-800 text-base">{contrib.customer_name}</p>
                      <span className="bg-green-50 text-green-700 px-3 py-1.5 rounded-full font-black text-xs shrink-0">
                        + €{contrib.amount.toFixed(2)}
                      </span>
                    </div>
                    
                    <p className="text-[10px] text-[#1e73be] uppercase tracking-widest font-black mb-3">
                      {contrib.gift_name || "Contributo Libero"}
                    </p>

                    {contrib.customer_message && (
                      <div className="flex gap-2 items-start bg-white p-4 rounded-2xl text-xs italic text-slate-600 border border-slate-100 shadow-sm">
                        <MessageSquare size={14} className="text-blue-400 mt-0.5 shrink-0" />
                        <span>"{contrib.customer_message}"</span>
                      </div>
                    )}
                  </div>
                  
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider text-right">
                    {new Date(contrib.created_at).toLocaleDateString('it-IT', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Modal Aggiungi Giocattoli */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-3xl rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100 flex flex-col h-[85vh] animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <Sparkles className="text-[#1e73be] animate-pulse" size={20} />
                <h2 className="text-xl font-black uppercase text-slate-800 tracking-tight">Catalogo Giocattoli Caristia</h2>
              </div>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Filters */}
            <div className="p-6 border-b border-slate-100 space-y-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cerca giocattoli per nome..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pl-12 pr-4 font-bold text-slate-800 outline-none focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-[#1e73be] transition-all"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {['Tutti', 'Costruzioni', 'Società', 'Veicoli', 'Generale'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                      selectedCategory === cat 
                        ? 'bg-blue-600 text-white shadow-md' 
                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Modal Body / Products List */}
            <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((p) => {
                  const alreadyInWishlist = items.some(item => item.prodotto?.id === p.id);
                  return (
                    <div key={p.id} className="border border-slate-100 rounded-2xl p-4 flex gap-4 items-center bg-slate-50/50 hover:bg-white hover:shadow-lg hover:shadow-slate-100/50 transition-all">
                      <img src={p.image_url} alt={p.name} className="w-16 h-16 object-contain bg-white rounded-xl p-1 border border-slate-100 shrink-0" />
                      <div className="flex-grow min-w-0">
                        <h4 className="font-black text-slate-850 text-xs truncate uppercase leading-snug">{p.name}</h4>
                        <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mt-0.5">{p.category || 'Generale'}</p>
                        <p className="font-extrabold text-[#1e73be] text-sm mt-1">{p.price.toFixed(2)}€</p>
                      </div>
                      <button
                        disabled={alreadyInWishlist}
                        onClick={() => addProductToWishlist(p.id)}
                        className={`px-3 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shrink-0 ${
                          alreadyInWishlist
                            ? 'bg-green-50 text-green-700 font-black cursor-default'
                            : 'bg-slate-900 text-white hover:bg-blue-600 cursor-pointer shadow-md'
                        }`}
                      >
                        {alreadyInWishlist ? <Check size={12} className="inline mr-1" /> : <Plus size={12} className="inline mr-1" />}
                        {alreadyInWishlist ? 'In lista' : 'Aggiungi'}
                      </button>
                    </div>
                  );
                })
              ) : (
                <div className="col-span-full py-12 text-center text-slate-400 font-bold uppercase tracking-widest text-xs italic">
                  Nessun giocattolo trovato.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}