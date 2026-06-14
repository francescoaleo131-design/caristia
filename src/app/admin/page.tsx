import { createClient } from '@/lib/supabase/server'; 
import { ShoppingBag, Users, Euro, MapPin, Calendar, Clock } from "lucide-react";
import StatCard from "@/components/admin/StatCard";

export default async function AdminDashboard() {
  const supabase = await createClient();

  const [salesResponse, pendingResponse, listsResponse, latestOrdersResponse] = await Promise.all([
    supabase
      .from('orders')
      .select('total_amount') 
      .eq('status', 'paid'),
    supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending'),
    supabase
      .from('birthday_lists')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true),
    supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10) 
  ]);

  const totalSales = salesResponse.data?.reduce((acc, curr) => acc + (curr.total_amount || 0), 0) || 0;
  const pendingCount = pendingResponse.count || 0;
  const activeListsCount = listsResponse.count || 0;
  const latestOrders = latestOrdersResponse.data || [];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('it-IT', {
      day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  const renderAddress = (address: any) => {
    if (!address) return "Ritiro in negozio / Non specificato";
    return address;
  };

  return (
    <div className="space-y-10 p-6">
      <div className="border-b border-slate-100 pb-6">
        <h2 className="text-2xl font-light text-slate-800 tracking-tight">
          Pannello <span className="font-semibold text-indigo-600">Gestionale</span>
        </h2>
        <p className="text-slate-500 text-sm mt-1">Riepilogo delle attività in tempo reale per Caristia.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Incasso Totale" 
          value={`€ ${totalSales.toLocaleString('it-IT', { minimumFractionDigits: 2 })}`} 
          icon={Euro} 
          color="text-emerald-600" 
        />
        <StatCard title="Ordini in Sospeso" value={pendingCount} icon={ShoppingBag} color="text-amber-600" />
        <StatCard title="Liste Attive" value={activeListsCount} icon={Users} color="text-indigo-600" />
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-800 tracking-tight">Ultimi Ordini Ricevuti</h3>
          <p className="text-xs text-slate-400">Monitoraggio dei flussi di vendita e logistica delle spedizioni.</p>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 font-semibold text-[10px] text-slate-500 uppercase tracking-widest">
                <th className="p-4">ID Ordine / Data</th>
                <th className="p-4">Cliente</th>
                <th className="p-4">Indirizzo di Spedizione</th>
                <th className="p-4">Totale</th>
                <th className="p-4 text-right">Stato</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {latestOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-slate-400 text-sm">Nessun ordine presente.</td>
                </tr>
              ) : (
                latestOrders.map((ordine) => (
                  <tr key={ordine.id} className="hover:bg-slate-50/30 transition-colors group">
                    <td className="p-4">
                      <p className="text-xs font-mono font-bold text-slate-700">#{ordine.id.toString().slice(-6).toUpperCase()}</p>
                      <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <Calendar size={10} /> {formatDate(ordine.created_at)}
                      </p>
                    </td>
                    <td className="p-4">
                      <p className="text-sm font-semibold text-slate-700">{ordine.customer_name || ordine.customer_email || "Cliente"}</p>
                    </td>
                    <td className="p-4 max-w-xs">
                      <div className="flex items-start gap-1.5 text-slate-600">
                        <MapPin size={14} className="text-slate-400 mt-0.5 shrink-0" />
                        <span className="text-xs leading-relaxed">{renderAddress(ordine.shipping_address)}</span>
                      </div>
                    </td>
                    <td className="p-4 text-sm font-bold text-slate-800">
                      € {(ordine.total_amount || 0).toFixed(2)} 
                    </td>
                    <td className="p-4 text-right">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                        ordine.status === 'paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                      }`}>
                        {ordine.status === 'paid' ? 'Pagato' : ordine.status}
                      </span>
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