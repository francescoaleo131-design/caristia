"use client"

import { useState } from 'react'
import { createClient } from '@/lib/client' // Assicurati che punti al tuo client Supabase lato browser
import { toast } from 'sonner'
import { Loader2 } from "lucide-react"

const STATI = [
  { value: 'paid', label: 'Pagato', color: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
  { value: 'preparing', label: 'In Preparazione', color: 'bg-orange-50 text-orange-700 border-orange-100' },
  { value: 'shipped', label: 'In Spedizione', color: 'bg-blue-50 text-blue-700 border-blue-100' },
  { value: 'delivered', label: 'Consegnato', color: 'bg-slate-100 text-slate-700 border-slate-200' },
]

export default function StatusSelect({ orderId, initialStatus }: { orderId: string, initialStatus: string }) {
  const [status, setStatus] = useState(initialStatus?.toLowerCase() || 'paid')
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const handleChange = async (newStatus: string) => {
    setLoading(true)
    
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId)

    if (error) {
      toast.error("Errore nell'aggiornamento del database")
      console.error(error)
    } else {
      setStatus(newStatus)
      toast.success("Stato aggiornato correttamente")
    }
    setLoading(false)
  }

  const currentStyle = STATI.find(s => s.value === status)?.color || STATI[0].color

  return (
    <div className="relative inline-block">
      {loading && (
        <div className="absolute -left-6 top-1/2 -translate-y-1/2">
          <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
        </div>
      )}
      <select
        value={status}
        onChange={(e) => handleChange(e.target.value)}
        disabled={loading}
        className={`appearance-none cursor-pointer px-3 py-1 rounded-full text-xs font-bold border outline-none transition-colors ${currentStyle} ${loading ? 'opacity-50' : 'hover:brightness-95'}`}
      >
        {STATI.map((s) => (
          <option key={s.value} value={s.value} className="bg-white text-slate-900">
            {s.label.toUpperCase()}
          </option>
        ))}
      </select>
    </div>
  )
}