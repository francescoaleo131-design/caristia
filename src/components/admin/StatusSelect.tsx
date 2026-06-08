'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client'; // Usa il client per il browser
import { Loader2 } from 'lucide-react';

interface StatusSelectProps {
  orderId: string | number;
  currentStatus: string;
}

const STATUS_OPTIONS = [
  { value: 'paid', label: 'Pagato', color: 'bg-emerald-50 text-emerald-600 border-emerald-200' },
  { value: 'preparing', label: 'In Preparazione', color: 'bg-amber-50 text-amber-600 border-amber-200' },
  { value: 'shipped', label: 'Spedito', color: 'bg-blue-50 text-blue-600 border-blue-200' },
  { value: 'delivered', label: 'Consegnato', color: 'bg-slate-100 text-slate-600 border-slate-300' },
];

export default function StatusSelect({ orderId, currentStatus }: StatusSelectProps) {
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleStatusChange = async (newStatus: string) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) throw error;
      setStatus(newStatus);
    } catch (err) {
      console.error("Errore durante l'aggiornamento dello stato:", err);
      alert("Impossibile aggiornare lo stato dell'ordine.");
    } finally {
      setLoading(false);
    }
  };

  const currentConfig = STATUS_OPTIONS.find(o => o.value === status) || STATUS_OPTIONS[0];

  return (
    <div className="relative inline-flex items-center group">
      {loading && <Loader2 size={12} className="animate-spin absolute -left-5 text-indigo-600" />}
      <select
        value={status}
        disabled={loading}
        onChange={(e) => handleStatusChange(e.target.value)}
        className={`appearance-none font-black text-[10px] uppercase tracking-tighter px-2.5 py-1 pr-6 rounded-full border cursor-pointer font-sans transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${currentConfig.color}`}
      >
        {STATUS_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-white text-slate-700 font-medium">
            {opt.label}
          </option>
        ))}
      </select>
      {/* Freccetta personalizzata per il select */}
      <span className="absolute right-2 pointer-events-none text-current opacity-60 font-sans text-[8px]">▼</span>
    </div>
  );
}