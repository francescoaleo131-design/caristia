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
  Percent
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
      <div className="flex flex-col items-center justify-center py-20">
        <AlertCircle size={48} className="text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-slate-800">Lista non trouvata</h2>
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
          image_url
        )
      `)
      .eq('wishlist_id', id);
    items = itemsData || [];
  }

  const { data: ordini } = await supabase
    .from('ordini')
    .select('*')
    .eq('status', 'pagato')
    .eq('wishlist_id', id) 
    .order('created_at', { ascending: false });

  const totalRequested = items.reduce((acc, item) => acc + item.quantity_requested, 0);
  const totalPurchased = items.reduce((acc, item) => acc + item.quantity_purchased, 0);
  
  const progress = isMoneyList
    ? (lista.target_amount && lista.target_amount > 0 ? Math.min(Math.round(((lista.current_amount || 0) / lista.target_amount) * 100), 100) : 0)
    : (totalRequested > 0 ? Math.round((totalPurchased / totalRequested) * 100) : 0);

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col gap-4">
        <Link 
          href="/admin/liste" 
          className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 font-medium transition-colors w-fit"
        >
          <ArrowLeft size={16} />
          Torna alle liste
        </Link>
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className={`text-[9px] font-extrabold uppercase px-2 py-1 rounded-md ${isMoneyList ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'}`}>
                {isMoneyList ? 'Raccolta Fondi' : 'Lista Articoli'}
              </span>
              <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-md ${lista.is_active ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                {lista.is_active ? 'Attiva' : 'Conclusa'}
              </span>
              <span className="text-slate-400 text-xs font-medium">ID: {lista.id}</span>
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">
              Lista di <span className={isMoneyList ? 'text-amber-500' : 'text-indigo-600'}>{lista.child_name}</span>
            </h1>
            <div className="flex flex-wrap items-center gap-6 mt-4">
              <div className="flex items-center gap-2 text-slate-600 font-medium bg-slate-100 px-3 py-1.5 rounded-full text-sm">
                <Calendar size={16} className="text-indigo-500" />
                <span>{new Date(lista.event_date).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600 font-medium bg-slate-100 px-3 py-1.5 rounded-full text-sm">
                {isMoneyList ? (
                  <>
                    <Coins size={16} className="text-amber-500" />
                    <span>Quota min: €{lista.min_contribution || 10}</span>
                  </>
                ) : (
                  <>
                    <Gift size={16} className="text-pink-500" />
                    <span>{items.length} Prodotti in lista</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col md:items-end gap-2 shrink-0">
             <div className="text-left md:text-right">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                  {isMoneyList ? 'Totale Raccolto' : 'Stato Regali'}
                </p>
                <p className="text-3xl font-black text-slate-900">
                  {isMoneyList ? `€${(lista.current_amount || 0).toFixed(2)}` : `${totalPurchased} / ${totalRequested}`}
                </p>
             </div>
             <div className="w-full md:w-48 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className={`h-full ${isMoneyList ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${progress}%` }}></div>
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        <div className="lg:col-span-2 space-y-6">
          {!isMoneyList ? (
            <>
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <ShoppingBag size={20} className="text-indigo-600" />
                Prodotti in Lista
              </h3>
              
              <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left min-w-[600px]">
                    <thead className="bg-slate-50 border-b border-slate-100">
                      <tr>
                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Prodotto</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Richiesti</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Acquistati</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Prezzo</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {items.map((item: any) => (
                        <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-4">
                              <img 
                                src={item.prodotti?.image_url || '/placeholder.png'} 
                                alt={item.prodotti?.name} 
                                className="w-12 h-12 object-contain bg-white rounded-lg border border-slate-100 p-1"
                              />
                              <span className="font-bold text-slate-700 text-sm line-clamp-1">{item.prodotti?.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center font-bold text-slate-500">{item.quantity_requested}</td>
                          <td className="px-6 py-4 text-center">
                            <span className={`px-3 py-1 rounded-full text-xs font-black ${item.quantity_purchased >= item.quantity_requested ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
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
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Coins size={20} className="text-amber-500" />
                Resoconto Salvadanaio Digitale
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-white p-6 border border-slate-100 rounded-2xl shadow-sm flex items-center gap-4">
                  <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                    <TrendingUp size={24} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Accumulato Reale</p>
                    <p className="text-2xl font-black text-emerald-600">€{(lista.current_amount || 0).toFixed(2)}</p>
                  </div>
                </div>

                <div className="bg-white p-6 border border-slate-100 rounded-2xl shadow-sm flex items-center gap-4">
                  <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                    <Percent size={24} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Obiettivo Prefissato</p>
                    <p className="text-2xl font-black text-slate-800">
                      {lista.target_amount ? `€${lista.target_amount.toFixed(2)}` : 'Nessuno'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-sm">
                <h4 className="font-bold text-sm uppercase tracking-wide mb-2 text-amber-400">Nota per l'amministratore</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Questo fondo è spendibile dai genitori esclusivamente presso il tuo punto vendita. Una volta concluso l'evento, potrai emettere un buono spesa interno o scalare direttamente l'importo di €{(lista.current_amount || 0).toFixed(2)} dall'acquisto finale dei giocattoli scelti in negozio dai genitori.
                </p>
              </div>
            </>
          )}
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <UserCheck size={20} className="text-indigo-600" />
            {isMoneyList ? 'Quote Ricevute' : 'Chi ha già regalato'}
          </h3>

          <div className="space-y-4">
            {ordini && ordini.length > 0 ? (
              ordini.map((ordine: any) => (
                <div key={ordine.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isMoneyList ? 'bg-amber-50 text-amber-600' : 'bg-indigo-50 text-indigo-600'}`}>
                    <User size={18} />
                  </div>
                  <div className="flex-grow">
                    <p className="font-bold text-slate-800 text-sm">{ordine.customer_email || 'Anonimo'}</p>
                    <p className="text-xs text-slate-400">{new Date(ordine.created_at).toLocaleString('it-IT')}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-indigo-600">€{ordine.total_amount?.toFixed(2)}</p>
                    <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Versato</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-slate-50 rounded-2xl p-8 border border-dashed border-slate-200 text-center">
                <Coins className="mx-auto text-slate-300 mb-2" size={32} />
                <p className="text-sm text-slate-400 font-medium">Nessuna transazione registrata.</p>
              </div>
            )}
            
            {!isMoneyList ? (
              <div className="bg-amber-50 rounded-3xl p-6 border border-amber-100 mt-6">
                <h4 className="font-black text-amber-800 text-xs uppercase tracking-widest mb-4">Mancano al totale</h4>
                <p className="text-4xl font-black text-amber-600 tracking-tighter">
                  {totalRequested - totalPurchased} <span className="text-lg">regali</span>
                </p>
              </div>
            ) : (
              lista.target_amount && lista.target_amount > lista.current_amount && (
                <div className="bg-amber-50 rounded-3xl p-6 border border-amber-100 mt-6">
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