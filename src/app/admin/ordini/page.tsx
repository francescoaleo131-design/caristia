import { createClient } from '@/lib/supabase/server'; 
import { MapPin, Calendar, Search, Filter } from "lucide-react";
import StatusSelect from "@/components/admin/StatusSelect";

export default async function AdminOrdersDashboard() {
  const supabase = await createClient();

  // Recuperiamo esclusivamente la lista degli ordini (senza le altre tabelle)
  const { data: ordersData } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  const orders = ordersData || [];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('it-IT', {
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  const renderAddress = (address: any) => {
    if (!address) return "Ritiro in negozio / Non specificato";
    return address;
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header Unico di Sezione */}
      <div className="border-b border-slate-100 pb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-light text-slate-800 tracking-tight">
            Gestione <span className="font-semibold text-indigo-600">Ordini</span>
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Visualizza l'elenco completo, controlla gli indirizzi di spedizione e aggiorna lo stato logistico.
          </p>
        </div>
      </div>

      {/* Tabella Centrale dei Flussi d'Ordine */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 font-semibold text-[10px] text-slate-500 uppercase tracking-widest">
                <th className="p-4">ID Ordine / Data</th>
                <th className="p-4">Cliente / Contatti</th>
                <th className="p-4">Indirizzo di Spedizione</th>
                <th className="p-4">Totale</th>
                <th className="p-4 text-right">Stato Operativo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-slate-400 text-sm">
                    Nessun ordine registrato nel sistema.
                  </td>
                </tr>
              ) : (
                orders.map((ordine) => (
                  <tr key={ordine.id} className="hover:bg-slate-50/30 transition-colors group">
                    
                    {/* ID e Data */}
                    <td className="p-4">
                      <p className="text-xs font-mono font-bold text-slate-700">
                        #{ordine.id.toString().slice(-6).toUpperCase()}
                      </p>
                      <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <Calendar size={10} /> {formatDate(ordine.created_at)}
                      </p>
                    </td>

                    {/* Dati Cliente */}
                    <td className="p-4">
                      <p className="text-sm font-semibold text-slate-700">
                        {ordine.customer_name || "Cliente"}
                      </p>
                      <p className="text-[10px] text-slate-400 font-mono">
                        {ordine.customer_email || 'Email non disponibile'}
                      </p>
                    </td>

                    {/* Indirizzo Logistica */}
                    <td className="p-4 max-w-xs md:max-w-md">
                      <div className="flex items-start gap-1.5 text-slate-600">
                        <MapPin size={14} className="text-slate-400 mt-0.5 shrink-0" />
                        <span className="text-xs leading-relaxed">
                          {renderAddress(ordine.shipping_address)}
                        </span>
                      </div>
                    </td>

                    {/* Importo Totale */}
                    <td className="p-4 text-sm font-bold text-slate-800">
                      € {(ordine.total_amount || 0).toFixed(2)}
                    </td>

                    {/* Menu a tendina Interattivo dello Stato */}
                    <td className="p-4 text-right">
                      <StatusSelect orderId={ordine.id} currentStatus={ordine.status} />
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}