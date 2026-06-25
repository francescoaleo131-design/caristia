"use client"
import React, { useState } from "react"
import { Send, User, Phone, Users, PartyPopper, Calendar } from "lucide-react"

export default function FormContatti() {
  const [acceptedReturnPolicy, setAcceptedReturnPolicy] = useState(false)
  const [formData, setFormData] = useState({
    nome: "", 
    telefono: "", 
    bambini: "", 
    tipoFesta: "Compleanno", 
    durataMatrimonio: "3 ore", 
    data: "", 
    messaggio: ""
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!acceptedReturnPolicy) {
      alert("Devi accettare la Politica di Reso e Cancellazione prima di procedere.");
      return;
    }
    const numeroOwner = "393384083646" 
    
    const pacchettoScelto = formData.tipoFesta === "Matrimonio" 
      ? `Matrimonio (${formData.durataMatrimonio})` 
      : "Compleanno"

    const testoMessaggio = `Ciao Angelo! Vorrei prenotare: \n- *Nome:* ${formData.nome}\n- *Telefono:* ${formData.telefono}\n- *Data:* ${formData.data}\n- *Bambini:* ${formData.bambini}\n- *Evento:* ${formData.tipoFesta}\n- *Pacchetto:* ${pacchettoScelto}\n- *Note:* ${formData.messaggio}`
    
    window.open(`https://wa.me/${numeroOwner}?text=${encodeURIComponent(testoMessaggio)}`, "_blank")
  }

  const handleChange = (e: any) => setFormData({ ...formData, [e.target.name]: e.target.value })

  return (
    <section id="contatti" className="py-2 md:py-5 bg-white scroll-mt-20">
      <div className="container mx-auto px-4 max-w-3xl">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-8 rounded-3xl shadow-xl">
          
          <input required name="nome" placeholder="Nome e Cognome" className="p-3 bg-gray-50 border rounded-xl outline-none" onChange={handleChange} />
          
          <input required name="telefono" placeholder="Telefono" className="p-3 bg-gray-50 border rounded-xl outline-none" onChange={handleChange} />
          
          <input required type="number" name="bambini" placeholder="N. Bambini" className="p-3 bg-gray-50 border rounded-xl outline-none" onChange={handleChange} />
          
          <select name="tipoFesta" className="p-3 bg-gray-50 border rounded-xl outline-none font-medium text-slate-700" onChange={handleChange} value={formData.tipoFesta}>
            <option value="Compleanno">Compleanno</option>
            <option value="Matrimonio">Matrimonio</option>
          </select>

          {formData.tipoFesta === "Matrimonio" && (
            <div className="md:col-span-2 flex flex-col gap-1 animate-fadeIn">
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider pl-1">Seleziona la durata del pacchetto</label>
              <select name="durataMatrimonio" className="w-full p-3 bg-gray-50 border rounded-xl outline-none font-medium text-slate-700" onChange={handleChange} value={formData.durataMatrimonio}>
                <option value="3 ore">Pacchetto Matrimonio (3 Ore)</option>
                <option value="4 ore">Pacchetto Matrimonio (4 Ore)</option>
              </select>
            </div>
          )}
          
          <input required type="date" name="data" className="md:col-span-2 p-3 bg-gray-50 border rounded-xl outline-none" onChange={handleChange} />
          
          <textarea name="messaggio" rows={3} placeholder="Note speciali..." className="md:col-span-2 p-3 bg-gray-50 border rounded-xl outline-none resize-none" onChange={handleChange} />
          
          <div className="md:col-span-2 flex items-start gap-2.5 px-2 py-1">
            <input 
              type="checkbox" 
              required 
              id="animation-return-policy"
              checked={acceptedReturnPolicy}
              onChange={(e) => setAcceptedReturnPolicy(e.target.checked)}
              className="mt-1 shrink-0 accent-[#1e73be] cursor-pointer" 
            />
            <label htmlFor="animation-return-policy" className="text-xs text-slate-500 font-semibold leading-snug cursor-pointer select-none">
              Confermo di aver letto e accettato la <a href="/return_policy" target="_blank" rel="noopener noreferrer" className="text-[#1e73be] underline hover:text-[#8cc665] font-bold">Politica di Reso e Cancellazione</a>. *
            </label>
          </div>

          <button type="submit" className="md:col-span-2 bg-[#1e73be] hover:bg-[#8cc665] text-white font-black py-4 rounded-2xl uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer">
            Invia su WhatsApp <Send size={20} />
          </button>
        </form>
      </div>
    </section>
  )
}