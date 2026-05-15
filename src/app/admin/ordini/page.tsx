import { createClient } from '@/lib/supabase/server';
import { Eye } from "lucide-react";
import StatusSelect from "@/components/StatusSelect"; // Importa il nuovo componente

export default async function OrdiniPage() {
  const supabase = await createClient();

  const { data: ordini, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-8 p-6">
      <div className="border-b border-slate-100 pb-6">
        <h2 className="text-2xl font-light text-slate-800 tracking-tight">
          Gestione <span className="font-semibold text-indigo-600">Ordini</span>
        </h2>
      </div>

      <div className="bg-white border border-slate-100 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase">ID Ordine</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Cliente</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Data</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Totale</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Stato</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase text-right">Azioni</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {ordini && ordini.map((ordine) => (
                <tr key={ordine.id} className="hover:bg-slate-50/30 transition-colors">
                  <td className="p-4 text-sm font-mono text-slate-500">
                    #{ordine.id.toString().slice(0, 8)}
                  </td>
                  <td className="p-4">
                    <div className="text-sm font-medium text-slate-700">{ordine.customer_name || 'Cliente'}</div>
                    <div className="text-xs text-slate-400">{ordine.customer_email}</div>
                  </td>
                  <td className="p-4 text-sm text-slate-600">
                    {new Date(ordine.created_at).toLocaleDateString('it-IT')}
                  </td>
                  <td className="p-4 text-sm font-semibold text-slate-700">
                    € {(ordine.total_amount || 0).toFixed(2)}
                  </td>
                  <td className="p-4">
                    {/* INSERIAMO IL SELETTORE QUI */}
                    <StatusSelect 
                      orderId={ordine.id} 
                      initialStatus={ordine.status || 'paid'} 
                    />
                  </td>
                  <td className="p-4 text-right">
                    <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg">
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}