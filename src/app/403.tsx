import Link from 'next/link';
import { ShieldAlert, Home, ArrowLeft } from "lucide-react";

export default function ForbiddenPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        {/* Icona Minimalista con animazione delicata */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-indigo-100 rounded-full scale-150 blur-2xl opacity-50 animate-pulse"></div>
            <div className="relative bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
              <ShieldAlert size={48} className="text-indigo-500" strokeWidth={1.5} />
            </div>
          </div>
        </div>

        {/* Testo */}
        <h1 className="text-4xl font-light text-slate-900 mb-4 tracking-tight">
          Area <span className="font-medium">Riservata</span>
        </h1>
        <p className="text-slate-500 text-lg mb-10 leading-relaxed">
          Sembra che tu abbia cercato di entrare in una scatola ancora sigillata. Non hai i permessi per accedere a questa pagina.
        </p>

        {/* Azioni */}
        <div className="flex flex-col gap-3">
          <Link 
            href="/" 
            className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-indigo-600 text-white py-4 rounded-2xl transition-all duration-300 font-medium"
          >
            <Home size={18} />
            Torna alla Home
          </Link>
          
          <button 
            onClick={() => window.history.back()}
            className="flex items-center justify-center gap-2 text-slate-500 hover:text-slate-800 py-2 transition-colors text-sm font-medium"
          >
            <ArrowLeft size={16} />
            Torna alla pagina precedente
          </button>
        </div>

        {/* Footer Minimal */}
        <footer className="mt-16 pt-8 border-t border-slate-200">
          <p className="text-xs uppercase tracking-widest text-slate-400 font-semibold">
            Errore 403 — Giocattoli Caristia
          </p>
        </footer>
      </div>
    </div>
  );
}