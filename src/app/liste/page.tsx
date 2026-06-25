"use client";
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/supabase';
import { Plus, Calendar, Share2, Trash2, Gift, PartyPopper, CheckCircle2, ArrowRight, Heart, Info, Coins, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

export default function WishlistsPage() {
  const [lists, setLists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [user, setUser] = useState<any>(null);
  
  const [childName, setChildName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [listType, setListType] = useState<'items' | 'money'>('items'); 
  const [minContribution, setMinContribution] = useState('10'); 

  useEffect(() => {
    checkUser();
    fetchLists();
  }, []);

  async function checkUser() {
    const { data } = await supabase.auth.getUser();
    setUser(data.user);
  }

  async function fetchLists() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('wishlists')
      .select('*')
      .eq('owner_id', user.id)
      .order('created_at', { ascending: false });

    if (error) toast.error("Errore nel caricamento");
    else setLists(data || []);
    setLoading(false);
  }

  async function createList(e: React.FormEvent) {
    e.preventDefault();
    if (!user) {
      toast.error("Devi essere loggato per creare una lista");
      return;
    }

    const slug = `${childName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
    
    const insertData: any = { 
      child_name: childName, 
      event_date: eventDate, 
      owner_id: user.id, 
      slug: slug,
      list_type: listType
    };

    if (listType === 'money') {
      insertData.min_contribution = parseFloat(minContribution) || 10;
    }

    const { error } = await supabase
      .from('wishlists')
      .insert([insertData]);

    if (error) toast.error("Errore durante la creazione");
    else {
      toast.success("Lista creata con successo!");
      setChildName(''); 
      setEventDate(''); 
      setListType('items');
      setMinContribution('10');
      setShowForm(false);
      fetchLists();
    }
  }

  return (
    <div className="min-h-screen bg-white">
      
      <section className="bg-slate-50 py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <span className="bg-[#8cc665]/20 text-[#6a9e4b] px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest">
            Servizio Gratuito per le Famiglie
          </span>
          <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 mt-6 mb-8 leading-tight">
            Rendi magico il suo compleanno con la <span className="text-[#1e73be]">Lista Regalo.</span>
          </h1>
          <p className="text-xl text-slate-600 mb-10 leading-relaxed">
            Niente più doppioni o regali inutili. Scegli se inserire i giocattoli desiderati o ricevere quote in denaro dagli invitati per un super regalo finale.
          </p>
        </div>
      </section>

      <section className="py-20 px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="flex flex-col items-center text-center">
            <div className="bg-blue-50 p-6 rounded-3xl mb-6 text-[#1e73be]"><Gift size={40} /></div>
            <h3 className="text-xl font-bold mb-3">1. Scegli la Modalità</h3>
            <p className="text-slate-500 text-sm">Inserisci singoli prodotti fisici oppure attiva un salvadanaio digitale con quota minima.</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="bg-green-50 p-6 rounded-3xl mb-6 text-[#8cc665]"><Share2 size={40} /></div>
            <h3 className="text-xl font-bold mb-3">2. Condividi il link</h3>
            <p className="text-slate-500 text-sm">Invia il link su WhatsApp. Parenti e amici acquistano i giochi o versano la loro quota online.</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="bg-purple-50 p-6 rounded-3xl mb-6 text-purple-600"><PartyPopper size={40} /></div>
            <h3 className="text-xl font-bold mb-3">3. Ritira o Usa il Budget</h3>
            <p className="text-slate-500 text-sm">Ritira i giocattoli impacchettati o usa il budget raccolto direttamente in negozio.</p>
          </div>
        </div>
      </section>

      <section className="bg-[#1e73be] py-16 px-6 rounded-[3rem] mx-4 mb-20 text-white relative overflow-hidden shadow-2xl">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full mb-6">
            <Heart size={18} className="fill-red-400 text-red-400" />
            <span className="font-bold text-sm">Il nostro regalo per voi</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black mb-6">Ricevi un buono del 10%</h2>
          <p className="text-blue-100 text-lg leading-relaxed max-w-2xl mx-auto">
            Amiamo festeggiare con voi. Alla chiusura della lista, Giocattoli Caristia ti regala un 
            **buono spesa pari al 10% del valore totale** dei regali o delle quote ricevute!
          </p>
        </div>
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
      </section>

      <section id="gestione" className="py-20 px-6 bg-slate-50 border-t border-slate-100">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
            <div>
              <h2 className="text-3xl font-black text-slate-900 uppercase">Le tue liste attive</h2>
              <p className="text-slate-500">Crea, modifica e condividi i desideri del tuo bambino.</p>
            </div>
            
            {user ? (
              <button 
                onClick={() => setShowForm(!showForm)}
                className="bg-[#8cc665] text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-[#7ab554] transition-all shadow-lg shadow-green-100 active:scale-95"
              >
                {showForm ? <Trash2 size={20} /> : <Plus size={20} />}
                {showForm ? "Annulla" : "Crea Nuova Lista"}
              </button>
            ) : (
              <Link href="/login" className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-slate-800 transition-all">
                Accedi per creare la lista
              </Link>
            )}
          </div>

          {showForm && (
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-xl mb-12 animate-in zoom-in-95 duration-300">
              <form onSubmit={createList} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-2 mb-2 block tracking-widest">Festeggiato/a</label>
                    <input required type="text" value={childName} onChange={(e) => setChildName(e.target.value)} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 outline-none focus:border-[#1e73be] transition-all font-bold" placeholder="Nome bambino" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-2 mb-2 block tracking-widest">Data della festa</label>
                    <input required type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 outline-none focus:border-[#1e73be] transition-all font-bold" />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2 mb-3 block tracking-widest">Scegli il tipo di Lista</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div 
                      onClick={() => setListType('items')}
                      className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-4 ${listType === 'items' ? 'border-[#1e73be] bg-blue-50/50' : 'border-slate-100 bg-slate-50/50 hover:bg-slate-50'}`}
                    >
                      <ShoppingBag className={`mt-0.5 ${listType === 'items' ? 'text-[#1e73be]' : 'text-slate-400'}`} size={24} />
                      <div>
                        <h4 className="font-bold text-slate-900">Lista Articoli</h4>
                        <p className="text-xs text-slate-500 mt-1">Scegli i giocattoli dal catalogo. Gli invitati comprano il gioco fisico (fino ad esaurimento).</p>
                      </div>
                    </div>

                    <div 
                      onClick={() => setListType('money')}
                      className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-4 ${listType === 'money' ? 'border-[#1e73be] bg-blue-50/50' : 'border-slate-100 bg-slate-50/50 hover:bg-slate-50'}`}
                    >
                      <Coins className={`mt-0.5 ${listType === 'money' ? 'text-[#1e73be]' : 'text-slate-400'}`} size={24} />
                      <div>
                        <h4 className="font-bold text-slate-900">Raccolta Quote (Soldi)</h4>
                        <p className="text-xs text-slate-500 mt-1">Gli invitati lasciano una busta d'oro con una quota in denaro a scelta libera.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* INPUT CONFIGURAZIONE QUOTA MINIMA (Visibile solo se seleziona 'money') */}
                {listType === 'money' && (
                  <div className="bg-blue-50/30 p-6 rounded-2xl border border-blue-100/50 max-w-sm animate-in fade-in slide-in-from-top-2 duration-200">
                    <label className="text-[10px] font-black uppercase text-[#1e73be] mb-2 block tracking-widest">Quota Minima per Invitato (€)</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">€</span>
                      <input 
                        type="number" 
                        min="1"
                        value={minContribution} 
                        onChange={(e) => setMinContribution(e.target.value)} 
                        className="w-full bg-white border-2 border-slate-200 rounded-xl pl-9 pr-4 py-3 outline-none focus:border-[#1e73be] transition-all font-bold text-slate-800" 
                        placeholder="10" 
                      />
                    </div>
                    <p className="text-[11px] text-slate-400 mt-2">I genitori invitati non potranno inserire quote inferiori a questa cifra.</p>
                  </div>
                )}

                <button type="submit" className="w-full bg-[#1e73be] text-white font-black uppercase py-5 rounded-2xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all tracking-wider text-sm">
                  Crea e Attiva Lista
                </button>
              </form>
            </div>
          )}

          {user && (
            loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="h-40 bg-slate-200 animate-pulse rounded-3xl" />
                <div className="h-40 bg-slate-200 animate-pulse rounded-3xl" />
              </div>
            ) : lists.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {lists.map((list) => (
                  <div key={list.id} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all flex justify-between items-center group">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-black text-[#8cc665] uppercase tracking-widest">Compleanno di</span>
                        <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider ${list.list_type === 'money' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                          {list.list_type === 'money' ? `Quote (Min. €${list.min_contribution})` : 'Articoli'}
                        </span>
                      </div>
                      <h3 className="text-2xl font-black text-slate-900 mb-2">{list.child_name}</h3>
                      <div className="flex items-center gap-3 text-slate-400 font-bold text-sm mb-4">
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          <span>{new Date(list.event_date).toLocaleDateString('it-IT')}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          const url = `${window.location.origin}/regala/${list.slug}`;
                          navigator.clipboard.writeText(url);
                          toast.success("Link invitati copiato!");
                        }}
                        className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-widest text-[#1e73be] bg-blue-50 hover:bg-[#1e73be] hover:text-white px-3 py-1.5 rounded-full transition-all cursor-pointer"
                      >
                        <Share2 size={12} />
                        Copia Link Condivisione
                      </button>
                    </div>
                    <Link href={`/liste/${list.slug}`} className="bg-slate-50 p-4 rounded-2xl text-slate-400 group-hover:bg-[#1e73be] group-hover:text-white transition-all">
                      <ArrowRight size={24} />
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
                <p className="text-slate-400 font-bold uppercase tracking-tighter">Non hai ancora liste attive.</p>
              </div>
            )
          )}
        </div>
      </section>
    </div>
  );
}