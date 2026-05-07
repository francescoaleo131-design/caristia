import { createClient } from '@/lib/server'; 
import { ShoppingBag, Users, Euro } from "lucide-react";
import StatCard from "@/components/admin/StatCard";

export default async function AdminDashboard() {
  // Inizializziamo il client (necessita di await nelle versioni recenti)
  const supabase = await createClient();

  // Eseguiamo tutte le query contemporaneamente
  const [salesResponse, pendingResponse, listsResponse] = await Promise.all([
    supabase
      .from('orders')
      .select('total_price')
      .eq('status', 'paid'),
    supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending'),
    supabase
      .from('birthday_lists')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true)
  ]);

  // Logica di calcolo sicura
  const totalSales = salesResponse.data?.reduce((acc, curr) => acc + (curr.total_price || 0), 0) || 0;
  const pendingCount = pendingResponse.count || 0;
  const activeListsCount = listsResponse.count || 0;

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="border-b border-slate-100 pb-6">
        <h2 className="text-2xl font-light text-slate-800 tracking-tight">
          Pannello <span className="font-semibold text-indigo-600">Gestionale</span>
        </h2>
        <p className="text-slate-500 text-sm mt-1">
          Riepilogo delle attività in tempo reale per Caristia.
        </p>
      </div>

      {/* Grid delle Statistiche */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Incasso Totale" 
          value={`€ ${totalSales.toLocaleString('it-IT', { minimumFractionDigits: 2 })}`} 
          icon={Euro} 
          color="text-emerald-600" 
        />
        <StatCard 
          title="Ordini in Sospeso" 
          value={pendingCount} 
          icon={ShoppingBag} 
          color="text-amber-600" 
        />
        <StatCard 
          title="Liste Attive" 
          value={activeListsCount} 
          icon={Users} 
          color="text-indigo-600" 
        />
      </div>

      {/* Area Placeholder per futuri widget (es. grafici o ultimi ordini) */}
      <div className="rounded-xl border border-dashed border-slate-200 p-12 text-center bg-slate-50/50">
        <p className="text-slate-400 text-sm">
          I dati degli ultimi ordini e i grafici di vendita appariranno qui man mano che il database si popola.
        </p>
      </div>
    </div>
  );
}