"use client"
import React, { useState } from "react"
import { Calendar, Clock, MapPin, User, Phone, Send, X } from "lucide-react"

interface MascotteBookingFormProps {
  packageInfo: {
    id: string
    nome: string
    prezzo: number
  }
  initialMascot?: string
  onClose: () => void
}

export default function MascotteBookingForm({ packageInfo, initialMascot, onClose }: MascotteBookingFormProps) {
  const [loading, setLoading] = useState(false)
  const [bookedDates, setBookedDates] = useState<string[]>([])
  const [acceptedReturnPolicy, setAcceptedReturnPolicy] = useState(false)
  const [formData, setFormData] = useState({
    personaggio: initialMascot || "",
    data: "",
    orario: "",
    luogo: "",
    nome: "",
    telefono: "",
    note: ""
  })

  React.useEffect(() => {
    if (formData.personaggio) {
      fetch(`/api/mascotte-availability?mascot=${encodeURIComponent(formData.personaggio)}`)
        .then(res => res.json())
        .then(data => {
          if (data.bookedDates) setBookedDates(data.bookedDates)
        })
    }
  }, [formData.personaggio])

  const isDateDisabled = (date: string) => bookedDates.includes(date)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    if (name === 'data' && isDateDisabled(value)) {
      alert("Spiacente, questa mascotte è già prenotata per la data selezionata.")
      return
    }
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!acceptedReturnPolicy) {
      alert("Devi accettare la Politica di Reso e Cancellazione prima di prenotare.");
      return;
    }
    setLoading(true)

    try {
      const response = await fetch("/api/mascotte-booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          packageId: packageInfo.id,
          packageName: packageInfo.nome,
          price: packageInfo.prezzo
        })
      })

      const data = await response.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        alert("Errore nella creazione della prenotazione: " + data.error)
      }
    } catch (error) {
      console.error("Errore:", error)
      alert("Si è verificato un errore imprevisto.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg sm:max-w-xl md:max-w-2xl rounded-[2rem] shadow-2xl relative animate-in fade-in zoom-in duration-300 max-h-[90vh] overflow-y-auto">

        {/* Pulsante chiusura - posizionato meglio per mobile */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 transition-colors z-10"
        >
          <X size={20} />
        </button>

        <div className="p-6 md:p-10">
          <div className="mb-6">
            <span className="bg-blue-50 text-[#1e73be] px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">
              Stai prenotando: {packageInfo.nome}
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2 uppercase leading-tight">Dettagli Prenotazione</h3>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Ho aggiunto 'sm:text-sm' e ridotto il padding degli input */}
            {[
              { label: "Personaggio", name: "personaggio", icon: User, type: "text" },
              { label: "Data", name: "data", icon: Calendar, type: "date" },
              { label: "Orario", name: "orario", icon: Clock, type: "text" },
              { label: "Luogo", name: "luogo", icon: MapPin, type: "text" },
              { label: "Nome", name: "nome", icon: User, type: "text" },
              { label: "Telefono", name: "telefono", icon: Phone, type: "tel" },
            ].map((field) => (
              <div key={field.name} className="space-y-1">
                <label className="text-[9px] font-black uppercase text-slate-400 ml-2">{field.label}</label>
                <div className="relative">
                  <input
                    required
                    name={field.name}
                    type={field.type}
                    value={formData[field.name as keyof typeof formData]}
                    onChange={handleChange}
                    className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-[#1e73be] transition-all pl-10 text-sm font-bold"
                  />
                  <field.icon className="absolute left-3 top-3.5 text-slate-300" size={16} />
                </div>
              </div>
            ))}

            <div className="md:col-span-2 space-y-1">
              <label className="text-[9px] font-black uppercase text-slate-400 ml-2">Note Speciali</label>
              <textarea name="note" value={formData.note} onChange={handleChange} rows={2} className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-[#1e73be] transition-all text-sm font-bold" />
            </div>

            <div className="md:col-span-2 flex items-start gap-2 px-1">
              <input type="checkbox" required checked={acceptedReturnPolicy} onChange={(e) => setAcceptedReturnPolicy(e.target.checked)} className="mt-1 shrink-0 accent-[#8cc665] cursor-pointer" />
              <label className="text-[11px] text-slate-500 font-medium leading-tight cursor-pointer">
                Accetto la <a href="/return_policy" target="_blank" className="text-[#1e73be] underline font-bold">Politica di Reso e Cancellazione</a>. *
              </label>
            </div>

            <button
              disabled={loading}
              type="submit"
              className="md:col-span-2 bg-[#8cc665] hover:bg-[#1e73be] text-white font-black py-4 rounded-xl uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg mt-2 cursor-pointer text-sm"
            >
              {loading ? "Elaborazione..." : "Procedi al Pagamento"} <Send size={16} />
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}