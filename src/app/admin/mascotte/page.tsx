"use client"
import React, { useEffect, useState } from "react"
import { Calendar, Package, User, Plus, Search, Filter, CheckCircle, Clock, Truck, RotateCcw } from "lucide-react"
import AddBookingModal from "@/components/admin/AddBookingModal"

const statusStyles: any = {
  pending: "bg-amber-50 text-amber-700 border-amber-100",
  paid: "bg-green-50 text-green-700 border-green-100",
  preparing: "bg-blue-50 text-blue-700 border-blue-100",
  delivered: "bg-purple-50 text-purple-700 border-purple-100",
  returned: "bg-slate-50 text-slate-700 border-slate-100",
  confirmed: "bg-indigo-50 text-indigo-700 border-indigo-100"
}

export default function MascotteAdminPage() {
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [filter, setFilter] = useState("all")

  const fetchBookings = async () => {
    setLoading(true)
    const res = await fetch("/api/admin/mascotte-bookings")
    const data = await res.json()
    if (data.bookings) setBookings(data.bookings)
    setLoading(false)
  }

  useEffect(() => {
    fetchBookings()
  }, [])

  const updateStatus = async (id: string, newStatus: string) => {
    await fetch("/api/admin/mascotte-status", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: newStatus })
    })
    fetchBookings()
  }

  const filteredBookings = filter === "all" 
    ? bookings 
    : bookings.filter(b => b.status === filter)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-6">
        <div>
          <h2 className="text-2xl font-light text-slate-800 tracking-tight">
            Gestione <span className="font-semibold text-pink-600">Mascotte</span>
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Gestisci prenotazioni, disponibilità e stati delle mascotte.
          </p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-pink-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-pink-700 transition-all shadow-lg shadow-pink-100"
        >
          <Plus size={20} /> Nuova Prenotazione
        </button>
      </div>

      {/* Filtri */}
      <div className="flex flex-wrap gap-2">
        {["all", "pending", "paid", "preparing", "delivered", "returned"].map((s) => (
          <button 
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all border ${filter === s ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-400'}`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Tabella */}
      <div className="bg-white border border-slate-100 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Mascotte / Data</th>
              <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Cliente</th>
              <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Dettagli</th>
              <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Stato</th>
              <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Azioni</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {loading ? (
              <tr><td colSpan={5} className="p-20 text-center text-slate-400 font-bold animate-pulse">Caricamento...</td></tr>
            ) : filteredBookings.length === 0 ? (
              <tr><td colSpan={5} className="p-20 text-center text-slate-400">Nessuna prenotazione trovata.</td></tr>
            ) : (
              filteredBookings.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4">
                    <div className="font-black text-slate-800 uppercase">{b.mascot_name}</div>
                    <div className="text-xs text-pink-500 font-bold flex items-center gap-1 mt-1">
                      <Calendar size={12} /> {new Date(b.booking_date).toLocaleDateString('it-IT')}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm font-bold text-slate-700">{b.customer_name}</div>
                    <div className="text-xs text-slate-400 flex items-center gap-1">
                      <User size={12} /> {b.customer_phone}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                      {b.package_type === 'solo_abito' ? 'Solo Abito' : 'Assistente Inc.'}
                    </div>
                    <div className="text-sm font-bold text-slate-600">€{b.total_price}</div>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${statusStyles[b.status]}`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <select 
                        onChange={(e) => updateStatus(b.id, e.target.value)}
                        value={b.status}
                        className="text-[10px] font-bold border rounded-lg p-1 bg-slate-50 outline-none"
                      >
                        <option value="pending">Pending</option>
                        <option value="paid">Pagato</option>
                        <option value="preparing">In Prep.</option>
                        <option value="delivered">Consegnato</option>
                        <option value="returned">Riconsegnato</option>
                      </select>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && <AddBookingModal onClose={() => setShowModal(false)} onRefresh={fetchBookings} />}
    </div>
  )
}
