import { createClient } from '@/lib/supabase/server';
import { Users, Calendar, Gift, ChevronRight, Plus, Coins } from "lucide-react";
import Link from 'next/link';

export default async function ListeCompleannoPage() {
  const supabase = await createClient();

  // Recuperiamo le liste dal database (tabella: wishlists)
  const { data: liste, error } = await supabase
    .from('wishlists')
    .select('*')
    .order('event_date', { ascending: true });

  if (error) {
    console.error('Errore caricamento liste:', error);
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <h2 className="text-2xl font-light text-slate-800 tracking-tight">
            Liste <span className="font-semibold text-indigo-600">Compleanno</span>
          </h2>
          <p className="text-slate-500 text-sm mt-1 max-w-md">
            Gestisci i desideri dei piccoli festeggiati, monitora i regali fisici e controlla i salvadanai digitali.
          </p>
        </div>
        
        <Link 
          href="/admin/liste/nuova" 
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-all shadow-sm w-fit"
        >
          <Plus size={16} />
          Nuova Lista
        </Link>
      </div>

      {/* Grid delle Liste */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {liste && liste.length > 0 ? (
          liste.map((lista) => {
            const isMoneyList = lista.list_type === 'money';
            
            // Calcolo percentuale progresso per il salvadanaio (se c'è un obiettivo, altrimenti 100% o dinamico)
            const moneyProgress = lista.target_amount && lista.target_amount > 0
              ? Math.min(Math.round(((lista.current_amount || 0) / lista.target_amount) * 100), 100)
              : 0;

            return (
              <div key={lista.id} className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all group">
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 rounded-xl ${isMoneyList ? 'bg-amber-50 text-amber-600' : 'bg-indigo-50 text-indigo-600'}`}>
                    {isMoneyList ? <Coins size={20} /> : <Users size={20} />}
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Badge tipo lista */}
                    <span className={`text-[9px] font-extrabold uppercase px-2 py-1 rounded-md ${isMoneyList ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'}`}>
                      {isMoneyList ? 'Soldi' : 'Articoli'}
                    </span>
                    <span className={`text-[9px] font-bold uppercase px-2 py-1 rounded-md ${lista.is_active ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                      {lista.is_active ? 'Attiva' : 'Conclusa'}
                    </span>
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-slate-800 mb-1">{lista.child_name}</h3>
                
                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Calendar size={14} />
                    <span>{new Date(lista.event_date).toLocaleDateString('it-IT')}</span>
                  </div>
                  
                  {/* Info dinamiche in base al tipo */}
                  {!isMoneyList ? (
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <Gift size={14} />
                      <span>{lista.items_count || 0} prodotti in lista</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <Coins size={14} className="text-amber-500" />
                      <span className="font-medium text-slate-700">
                        Racc. fondi: €{(lista.current_amount || 0).toFixed(2)}
                        {lista.target_amount ? ` / €${lista.target_amount}` : ''}
                      </span>
                    </div>
                  )}
                </div>

                {/* Barra di progressione Dinamica */}
                <div className="space-y-1.5 mb-6">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-400">
                      {isMoneyList ? 'Progresso raccolta' : 'Progresso regali'}
                    </span>
                    <span className={isMoneyList ? 'text-amber-600' : 'text-indigo-600'}>
                      {isMoneyList ? moneyProgress : (lista.progress || 0)}%
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${isMoneyList ? 'bg-amber-500' : 'bg-indigo-500'}`} 
                      style={{ width: `${isMoneyList ? moneyProgress : (lista.progress || 0)}%` }}
                    ></div>
                  </div>
                </div>

                <Link 
                  href={`/admin/liste/${lista.id}`}
                  className="flex items-center justify-center gap-2 w-full py-2.5 bg-slate-50 text-slate-600 rounded-xl text-sm font-medium group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors"
                >
                  Dettagli Lista
                  <ChevronRight size={16} />
                </Link>
              </div>
            );
          })
        ) : (
          <div className="col-span-full py-20 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <p className="text-slate-400">Nessuna lista compleanno creata.</p>
          </div>
        )}
      </div>
    </div>
  );
}