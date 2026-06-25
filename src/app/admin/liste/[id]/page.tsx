import { createClient } from '@/lib/supabase/server';
import { 
  ArrowLeft, 
  Gift, 
  Calendar, 
  User, 
  AlertCircle,
  ShoppingBag,
  UserCheck,
  Coins,
  TrendingUp,
  Percent,
  MessageSquare
} from "lucide-react";
import Link from 'next/link';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ListaDettaglioAdminPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: lista, error: listaError } = await supabase
    .from('wishlists')
    .select('*')
    .eq('id', id)
    .single();

  if (listaError || !lista) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white">
        <AlertCircle size={48} className="text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-slate-800">Lista non trovata</h2>
        <Link href="/admin/liste" className="text-indigo-600 mt-4 hover:underline">Torna alle liste</Link>
      </div>
    );
  }

  const isMoneyList = lista.list_type === 'money';

  let items: any[] = [];
  if (!isMoneyList) {
    const { data: itemsData } = await supabase
      .from('wishlist_items')
      .select(`
        id,
        quantity_requested,
        quantity_purchased,
        prodotti (
          id,
          name,
          price,
          image_url,
          category
        )
      `)
      .eq('wishlist_id', id);
    items = itemsData || [];
  }

  // Query actual wishlist contributions instead of "ordini"
  const { data: contributions } = await supabase
    .from('wishlist_contributions')
    .select('*')
    .eq('wishlist_id', id) 
    .order('created_at', { ascending: false });

  const totalRequested = items.reduce((acc, item) => acc + item.quantity_requested, 0);
  const totalPurchased = items.reduce((acc, item) => acc + item.quantity_purchased, 0);
  
  const progress = isMoneyList
    ? (lista.target_amount && lista.target_amount > 0 ? Math.min(Math.round(((lista.current_amount || 0) / lista.target_amount) * 100), 100) : 0)
    : (totalRequested > 0 ? Math.round((totalPurchased / totalRequested) * 100) : 0);

  return (
    <div className="space-y-10 pb-20 p-6 bg-white">
      <div className="flex flex-col gap-4">
        <Link 
          href="/admin/liste" 
          className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 font-semibold transition-colors w-fit text-sm"
        >
          <ArrowLeft size={16} />
          Torna alle liste
        </Link>
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-100 pb-8">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className={`text-[9px] font-extrabold uppercase px-2.5 py-1 rounded-md ${isMoneyList ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'}`}>
                {isMoneyList ? 'Raccolta Fondi' : 'Lista Articoli'}
              </span>
              <span className={`text-[9px] font-bold uppercase px-2.5 py-1 rounded-md ${lista.is_active ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                {lista.is_active ? 'Attiva' : 'Conclusa'}
              </span>
              <span className="text-slate-400 text-xs font-semibold">ID: {lista.id}</span>
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">
              Lista di <span className={isMoneyList ? 'text-amber-500' : 'text-indigo-600'}>{lista.child_name}</span>
            </h1>
            <div className="flex flex-wrap items-center gap-6 mt-4">
              <div className="flex items-center gap-2 text-slate-600 font-semibold bg-slate-50 border px-3.5 py-1.5 rounded-full text-xs">
                <Calendar size={14} className="text-indigo-500" />
                <span>Festa: {new Date(lista.event_date).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600 font-semibold bg-slate-50 border px-3.5 py-1.5 rounded-full text-xs">
                {isMoneyList ? (
                  <>
                    <Coins size={14} className="text-amber-500" />
                    <span>Quota min: €{lista.min_contribution || 10}</span>
                  </>
                ) : (
                  <>
                    <Gift size={14} className="text-pink-500" />
                    <span>{items.length} Prodotti scelti</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col md:items-end gap-2 shrink-0">
             <div className="text-left md:text-right">
                <p className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-1">
                  {isMoneyList ? 'Totale Raccolto' : 'Stato Regali'}
                </p>
                <p className="text-3xl font-black text-slate-950">
                  {isMoneyList ? `€${(lista.current_amount || 0).toFixed(2)}` : `${totalPurchased} / ${totalRequested}`}
                </p>
             </div>
             <div className="w-full md:w-48 h-2 bg-slate-100 rounded-full overflow-hidden border">
                <div className={`h-full ${isMoneyList ? 'bg-amber-500' : 'bg-indigo-500'}`} style={{ width: `${progress}%` }}></div>
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Main section: Products or Money summary */}
        <div className="lg:col-span-2 space-y-6">
          {!isMoneyList ? (
            <>
              <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight flex items-center gap-2">
                <ShoppingBag size={18} className="text-indigo-600" />
                Prodotti Scelti dai Genitori
              </h3>
              
              <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left min-w-[500px]">
                    <thead className="bg-slate-50 border-b border-slate-100">
                      <tr>
                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Prodotto</th>
                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Richiesti</th>
                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Acquistati</th>
                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Prezzo</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 text-slate-700">
                      {items.map((item: any) => (
                        <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-4">
                              <img 
                                src={item.prodotti?.image_url || '/placeholder.png'} 
                                alt={item.prodotti?.name} 
                                className="w-12 h-12 object-contain bg-white rounded-lg border border-slate-100 p-1 shrink-0"
                              />
                              <div className="min-w-0">
                                <span className="font-bold text-slate-800 text-sm truncate uppercase block">{item.prodotti?.name}</span>
                                <span className="text-[9px] text-slate-400 font-bold uppercase block tracking-wider mt-0.5">{item.prodotti?.category || 'Generale'}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center font-bold text-slate-500">{item.quantity_requested}</td>
                          <td className="px-6 py-4 text-center">
                            <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${item.quantity_purchased >= item.quantity_requested ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-55 bg-amber-50 text-amber-700'}`}>
                              {item.quantity_purchased}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right font-black text-indigo-600 whitespace-nowrap">{item.prodotti?.price?.toFixed(2)}€</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : (
            <>
              <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight flex items-center gap-2">
                <Coins size={18} className="text-amber-500" />
                Resoconto Salvadanaio Digitale
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-white p-6 border border-slate-100 rounded-2xl shadow-sm flex items-center gap-4">
                  <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                    <TrendingUp size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">Accumulato Reale</p>
                    <p className="text-2xl font-black text-emerald-600">€{(lista.current_amount || 0).toFixed(2)}</p>
                  </div>
                </div>

                <div className="bg-white p-6 border border-slate-100 rounded-2xl shadow-sm flex items-center gap-4">
                  <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                    <Percent size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">Obiettivo Prefissato</p>
                    <p className="text-2xl font-black text-slate-800">
                      {lista.target_amount ? `€${lista.target_amount.toFixed(2)}` : 'Nessuno'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-sm">
                <h4 className="font-black text-sm uppercase tracking-wider mb-2 text-amber-400">Nota per il Negozio</h4>
                <p className="text-xs text-slate-350 leading-relaxed font-semibold">
                  Questo fondo è spendibile dai genitori esclusivamente presso il tuo punto vendita. Una volta concluso l'evento, potrai emettere un buono spesa interno o scalare direttamente l'importo di €{(lista.current_amount || 0).toFixed(2)} dall'acquisto finale dei giocattoli scelti in negozio dai genitori.
                </p>
              </div>
            </>
          )}
        </div>

        {/* Sidebar section: Contributions history */}
        <div className="space-y-6">
          <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight flex items-center gap-2">
            <UserCheck size={18} className="text-indigo-600" />
            {isMoneyList ? 'Quote Ricevute' : 'Chi ha partecipato'}
          </h3>

          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
            {contributions && contributions.length > 0 ? (
              contributions.map((contrib: any) => (
                <div key={contrib.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${isMoneyList ? 'bg-amber-50 text-amber-600' : 'bg-indigo-50 text-indigo-600'}`}>
                      <User size={16} />
                    </div>
                    <div className="flex-grow min-w-0">
                      <p className="font-black text-slate-800 text-sm truncate uppercase">{contrib.customer_name || 'Invitato'}</p>
                      <p className="text-[10px] text-slate-400 font-semibold truncate">{contrib.customer_email || 'Email non fornita'}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-black text-indigo-600">€{contrib.amount?.toFixed(2)}</p>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wide">
                        {new Date(contrib.created_at).toLocaleDateString('it-IT')}
                      </p>
                    </div>
                  </div>

                  <span className="text-[9px] bg-slate-50 text-indigo-600 border border-slate-100 px-2 py-0.5 rounded font-black uppercase tracking-wider w-fit">
                    {contrib.gift_name || "Contributo Libero"}
                  </span>

                  {contrib.customer_message && (
                    <div className="flex gap-2 items-start bg-slate-50/50 p-3 rounded-xl text-xs italic text-slate-500 border border-slate-100">
                      <MessageSquare size={12} className="text-slate-400 mt-0.5 shrink-0" />
                      <span>"{contrib.customer_message}"</span>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="bg-slate-50 rounded-2xl p-8 border border-dashed border-slate-200 text-center">
                <Coins className="mx-auto text-slate-300 mb-2" size={32} />
                <p className="text-sm text-slate-400 font-medium">Nessuna transazione registrata.</p>
              </div>
            )}
            
            {!isMoneyList ? (
              <div className="bg-amber-55/20 bg-amber-50 rounded-3xl p-6 border border-amber-100 mt-6">
                <h4 className="font-black text-amber-800 text-xs uppercase tracking-widest mb-4">Mancano al totale</h4>
                <p className="text-4xl font-black text-amber-600 tracking-tighter">
                  {totalRequested - totalPurchased} <span className="text-lg font-bold">regali</span>
                </p>
              </div>
            ) : (
              lista.target_amount && lista.target_amount > lista.current_amount && (
                <div className="bg-amber-55/20 bg-amber-50 rounded-3xl p-6 border border-amber-100 mt-6">
                  <h4 className="font-black text-amber-800 text-xs uppercase tracking-widest mb-4">Mancano all'obiettivo</h4>
                  <p className="text-3xl font-black text-amber-600 tracking-tighter">
                    €{(lista.target_amount - lista.current_amount).toFixed(2)}
                  </p>
                </div>
              )
            )}
          </div>
        </div>

      </div>
    </div>
  );
}