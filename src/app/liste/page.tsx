"use client";
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, Calendar, Share2, Trash2, Gift, PartyPopper, CheckCircle2, ArrowRight, Heart, Info } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

export default function WishlistsPage() {
  const [lists, setLists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [user, setUser] = useState<any>(null);
  
  const [childName, setChildName] = useState('');
  const [eventDate, setEventDate] = useState('');

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
    const { error } = await supabase
      .from('wishlists')
      .insert([{ child_name: childName, event_date: eventDate, owner_id: user.id, slug: slug }]);

    if (error) toast.error("Errore durante la creazione");
    else {
      toast.success("Lista creata con successo!");
      setChildName(''); setEventDate(''); setShowForm(false);
      fetchLists();
    }
  }

  return (
    <div className="min-h-screen bg-white">
      
      {/* 1. SEZIONE INFORMATIVA (Hero) */}
      <section className="bg-slate-50 py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <span className="bg-[#8cc665]/20 text-[#6a9e4b] px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest">
            Servizio Gratuito per le Famiglie
          </span>
          <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 mt-6 mb-8 leading-tight">
            Rendi magico il suo compleanno con la <span className="text-[#1e73be]">Lista Regalo.</span>
          </h1>
          <p className="text-xl text-slate-600 mb-10 leading-relaxed">
            Niente più doppioni o regali inutili. Con la nostra lista online, parenti e amici scelgono il regalo perfetto in un click, e tu ricevi un premio speciale.
          </p>
        </div>
      </section>

      {/* 2. COME FUNZIONA */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="flex flex-col items-center text-center">
            <div className="bg-blue-50 p-6 rounded-3xl mb-6 text-[#1e73be]"><Gift size={40} /></div>
            <h3 className="text-xl font-bold mb-3">1. Componi la Lista</h3>
            <p className="text-slate-500 text-sm">Scegli i giocattoli più desiderati dal nostro catalogo online.</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="bg-green-50 p-6 rounded-3xl mb-6 text-[#8cc665]"><Share2 size={40} /></div>
            <h3 className="text-xl font-bold mb-3">2. Condividi il link</h3>
            <p className="text-slate-500 text-sm">Invia il link su WhatsApp. Parenti e amici acquistano online o in negozio.</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="bg-purple-50 p-6 rounded-3xl mb-6 text-purple-600"><PartyPopper size={40} /></div>
            <h3 className="text-xl font-bold mb-3">3. Ritira i regali</h3>
            <p className="text-slate-500 text-sm">Passa a trovarci in negozio per ritirare i pacchetti già pronti.</p>
          </div>
        </div>
      </section>

      {/* 3. IL VANTAGGIO (Banner Blu) */}
      <section className="bg-[#1e73be] py-16 px-6 rounded-[3rem] mx-4 mb-20 text-white relative overflow-hidden shadow-2xl">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full mb-6">
            <Heart size={18} className="fill-red-400 text-red-400" />
            <span className="font-bold text-sm">Il nostro regalo per voi</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black mb-6">Ricevi un buono del 10%</h2>
          <p className="text-blue-100 text-lg leading-relaxed max-w-2xl mx-auto">
            Amiamo festeggiare con voi. Alla chiusura della lista, Giocattoli Caristia ti regala un 
            **buono spesa pari al 10% del valore totale** dei regali ricevuti!
          </p>
        </div>
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
      </section>

      {/* 4. AREA GESTIONE (Azione) */}
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
              <form onSubmit={createList} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2 mb-2 block tracking-widest">Festeggiato/a</label>
                  <input required type="text" value={childName} onChange={(e) => setChildName(e.target.value)} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 outline-none focus:border-[#1e73be] transition-all font-bold" placeholder="Nome bambino" />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2 mb-2 block tracking-widest">Data della festa</label>
                  <input required type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 outline-none focus:border-[#1e73be] transition-all font-bold" />
                </div>
                <button type="submit" className="bg-[#1e73be] text-white font-black uppercase py-5 rounded-2xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all">Crea Lista</button>
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
                      <span className="text-[10px] font-black text-[#8cc665] uppercase tracking-widest">Compleanno di</span>
                      <h3 className="text-2xl font-black text-slate-900 mb-2">{list.child_name}</h3>
                      <div className="flex items-center gap-2 text-slate-400 font-bold text-sm">
                        <Calendar size={14} />
                        <span>{new Date(list.event_date).toLocaleDateString('it-IT')}</span>
                      </div>
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