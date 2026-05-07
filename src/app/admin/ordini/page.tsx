import { createClient } from '@/lib/server';
import { ShoppingBag, Eye, Clock, CheckCircle2, Truck, MoreVertical } from "lucide-react";

export default async function OrdiniPage() {
  const supabase = await createClient();

  // 1. Recuperiamo gli ordini (assicurati che i nomi colonne siano corretti)
  const { data: ordini, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Errore caricamento ordini:", error.message);
  }

  const getStatusStyle = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'paid':
        return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'pending':
        return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'shipped':
        return 'bg-blue-50 text-blue-700 border-blue-100';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-100';
    }
  };

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="border-b border-slate-100 pb-6">
        <h2 className="text-2xl font-light text-slate-800 tracking-tight">
          Gestione <span className="font-semibold text-indigo-600">Ordini</span>
        </h2>
        <p className="text-slate-500 text-sm mt-1">
          Monitora le vendite e aggiorna lo stato delle spedizioni.
        </p>
      </div>

      <div className="bg-white border border-slate-100 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">ID Ordine</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Cliente</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Data</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Totale</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Stato</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Azioni</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {ordini && ordini.length > 0 ? (
                ordini.map((ordine) => (
                  <tr key={ordine.id} className="hover:bg-slate-50/30 transition-colors">
                    <td className="p-4 text-sm font-mono text-slate-500">
                      {/* Usiamo l'ID di Stripe se l'ID interno è troppo lungo */}
                      #{ordine.stripe_session_id?.slice(-8) || ordine.id.toString().slice(0, 8)}
                    </td>
                    <td className="p-4">
                      <div className="text-sm font-medium text-slate-700">
                        {ordine.customer_name || 'Cliente Stripe'}
                      </div>
                      <div className="text-xs text-slate-400">
                        {ordine.customer_email || 'No email'}
                      </div>
                    </td>
                    <td className="p-4 text-sm text-slate-600">
                      {new Date(ordine.created_at).toLocaleDateString('it-IT')}
                    </td>
                    <td className="p-4 text-sm font-semibold text-slate-700">
                      {/* Usiamo total_amount che è il nome standard che abbiamo usato prima */}
                      € {(ordine.total_amount || 0).toFixed(2)}
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusStyle(ordine.status)}`}>
                        {ordine.status === 'pending' && <Clock size={12} />}
                        {ordine.status === 'paid' && <CheckCircle2 size={12} />}
                        {ordine.status === 'shipped' && <Truck size={12} />}
                        {(ordine.status || 'UNKNOWN').toUpperCase()}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-slate-400 text-sm">
                    {error ? `Errore: ${error.message}` : "Nessun ordine ricevuto finora."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}