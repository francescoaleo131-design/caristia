"use client"
import { Receipt, FileText, Download, CreditCard, BookOpen } from "lucide-react"

export default function FatturazionePage() {
  return (


    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
        <div className="bg-white w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto shadow-xl shadow-[#1e73be]/10 border border-zinc-100">
            <BookOpen className="text-[#1e73be]" size={36} />
          </div>
      <div className="text-center md:text-left space-y-2">
        <h1 className="text-3xl font-black uppercase tracking-tighter text-zinc-800 text-center">
          Dati <span className="text-[#8cc665]">Fatturazione</span>
        </h1>
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 text-center">Ricevute, fatture e metodi di pagamento</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-[2rem] shadow-xl shadow-zinc-200/40 border border-white flex items-center gap-4">
          <div className="bg-[#1e73be]/10 p-4 rounded-2xl text-[#1e73be]">
            <Receipt size={24} />
          </div>
          <div>
            <p className="text-[9px] font-black uppercase text-zinc-400 tracking-widest">Documenti disponibili</p>
            <p className="text-xl font-black text-zinc-800">0 Files</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-[2rem] shadow-xl shadow-zinc-200/40 border border-white flex items-center gap-4">
          <div className="bg-[#8cc665]/10 p-4 rounded-2xl text-[#8cc665]">
            <CreditCard size={24} />
          </div>
          <div>
            <p className="text-[9px] font-black uppercase text-zinc-400 tracking-widest">Metodo Predefinito</p>
            <p className="text-xl font-black text-zinc-800">Nessuno</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-2xl shadow-zinc-200/50 border border-white">
        <div className="p-6 border-b border-zinc-50 flex justify-between items-center bg-zinc-50/50">
          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Storico Documenti</span>
          <FileText size={16} className="text-zinc-300" />
        </div>
        
        <div className="p-12 text-center space-y-4">
          <p className="text-zinc-300 font-bold">Nessuna fattura emessa al momento.</p>
          <div className="w-full h-px bg-zinc-50"></div>
          <p className="text-[9px] font-black uppercase text-zinc-400 tracking-[0.2em]">
            Le fatture verranno generate automaticamente dopo ogni acquisto.
          </p>
        </div>
      </div>
    </div>
  )
}