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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden relative animate-in fade-in zoom-in duration-300">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X size={24} />
        </button>

        <div className="p-8 md:p-12">
          <div className="mb-8">
            <span className="bg-blue-50 text-[#1e73be] px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
              Stai prenotando: {packageInfo.nome}
            </span>
            <h3 className="text-3xl font-black text-slate-900 mt-2 uppercase">Dettagli Prenotazione</h3>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Personaggio Scelto</label>
              <div className="relative">
                <input required name="personaggio" value={formData.personaggio} onChange={handleChange} placeholder="Es. Topolino, Elsa..." className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-[#1e73be] transition-all pl-12 font-bold" />
                <User className="absolute left-4 top-4 text-slate-300" size={20} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Data dell'evento</label>
              <div className="relative">
                <input required type="date" name="data" value={formData.data} onChange={handleChange} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-[#1e73be] transition-all pl-12 font-bold" />
                <Calendar className="absolute left-4 top-4 text-slate-300" size={20} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Orario Indicativo</label>
              <div className="relative">
                <input required name="orario" value={formData.orario} onChange={handleChange} placeholder="Es. 16:30" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-[#1e73be] transition-all pl-12 font-bold" />
                <Clock className="absolute left-4 top-4 text-slate-300" size={20} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Luogo / Indirizzo</label>
              <div className="relative">
                <input required name="luogo" value={formData.luogo} onChange={handleChange} placeholder="Indirizzo o Sala Feste" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-[#1e73be] transition-all pl-12 font-bold" />
                <MapPin className="absolute left-4 top-4 text-slate-300" size={20} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Tuo Nome e Cognome</label>
              <div className="relative">
                <input required name="nome" value={formData.nome} onChange={handleChange} placeholder="Nome Cliente" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-[#1e73be] transition-all pl-12 font-bold" />
                <User className="absolute left-4 top-4 text-slate-300" size={20} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Telefono WhatsApp</label>
              <div className="relative">
                <input required name="telefono" value={formData.telefono} onChange={handleChange} placeholder="3XX XXXXXXX" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-[#1e73be] transition-all pl-12 font-bold" />
                <Phone className="absolute left-4 top-4 text-slate-300" size={20} />
              </div>
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Note Speciali</label>
              <textarea name="note" value={formData.note} onChange={handleChange} rows={2} placeholder="Eventuali richieste particolari..." className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-[#1e73be] transition-all font-bold" />
            </div>

            <div className="md:col-span-2 flex items-start gap-2.5 px-2 py-1">
              <input 
                type="checkbox" 
                required 
                id="mascot-return-policy"
                checked={acceptedReturnPolicy}
                onChange={(e) => setAcceptedReturnPolicy(e.target.checked)}
                className="mt-1 shrink-0 accent-[#8cc665] cursor-pointer" 
              />
              <label htmlFor="mascot-return-policy" className="text-xs text-slate-500 font-semibold leading-snug cursor-pointer select-none">
                Confermo di aver letto e accettato la <a href="/return_policy" target="_blank" rel="noopener noreferrer" className="text-[#1e73be] underline hover:text-blue-700 font-bold">Politica di Reso e Cancellazione</a>. *
              </label>
            </div>

            <button
              disabled={loading}
              type="submit"
              className="md:col-span-2 bg-[#8cc665] hover:bg-[#1e73be] text-white font-black py-5 rounded-2xl uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-xl disabled:opacity-50 mt-4 cursor-pointer"
            >
              {loading ? "Elaborazione..." : "Procedi al Pagamento"} <Send size={20} />
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
