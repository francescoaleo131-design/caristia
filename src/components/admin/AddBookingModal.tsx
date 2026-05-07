"use client"
import React, { useState } from "react"
import { X, Save, User, Phone, Calendar, Clock, MapPin, Package } from "lucide-react"

export default function AddBookingModal({ onClose, onRefresh }: { onClose: () => void, onRefresh: () => void }) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    customer_name: "",
    customer_phone: "",
    mascot_name: "",
    booking_date: "",
    booking_time: "",
    location: "",
    package_type: "solo_abito",
    total_price: 30,
    note: ""
  })

  const handleChange = (e: any) => {
    const { name, value } = e.target
    if (name === 'package_type') {
        const price = value === 'solo_abito' ? 30 : 50
        setFormData({ ...formData, [name]: value, total_price: price })
    } else {
        setFormData({ ...formData, [name]: value })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/admin/mascotte-manual-booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        onRefresh()
        onClose()
      } else {
        const data = await response.json()
        alert("Errore: " + data.error)
      }
    } catch (error) {
      alert("Errore di connessione")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden relative">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-xl font-bold text-slate-800">Nuova Prenotazione (Manuale)</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={24} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase">Nome Cliente</label>
            <div className="relative">
              <input required name="customer_name" onChange={handleChange} className="w-full p-3 bg-slate-50 border rounded-xl pl-10" />
              <User className="absolute left-3 top-3.5 text-slate-400" size={18} />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase">Telefono</label>
            <div className="relative">
              <input required name="customer_phone" onChange={handleChange} className="w-full p-3 bg-slate-50 border rounded-xl pl-10" />
              <Phone className="absolute left-3 top-3.5 text-slate-400" size={18} />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase">Mascotte</label>
            <input required name="mascot_name" onChange={handleChange} className="w-full p-3 bg-slate-50 border rounded-xl" placeholder="Es. Topolino" />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase">Data</label>
            <input required type="date" name="booking_date" onChange={handleChange} className="w-full p-3 bg-slate-50 border rounded-xl" />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase">Orario</label>
            <input required name="booking_time" onChange={handleChange} className="w-full p-3 bg-slate-50 border rounded-xl" />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase">Luogo</label>
            <input required name="location" onChange={handleChange} className="w-full p-3 bg-slate-50 border rounded-xl" />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase">Pacchetto</label>
            <select name="package_type" onChange={handleChange} className="w-full p-3 bg-slate-50 border rounded-xl">
              <option value="solo_abito">Solo Abito (30€)</option>
              <option value="assistente_integrato">Assistente (50€)</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase">Prezzo Finale</label>
            <input type="number" name="total_price" value={formData.total_price} onChange={handleChange} className="w-full p-3 bg-slate-50 border rounded-xl font-bold" />
          </div>

          <div className="md:col-span-2 space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase">Note</label>
            <textarea name="note" onChange={handleChange} className="w-full p-3 bg-slate-50 border rounded-xl" rows={2} />
          </div>

          <button 
            disabled={loading}
            className="md:col-span-2 bg-indigo-600 text-white font-bold py-4 rounded-xl mt-4 flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all"
          >
            {loading ? "Salvataggio..." : "Salva Prenotazione"} <Save size={20} />
          </button>
        </form>
      </div>
    </div>
  )
}
