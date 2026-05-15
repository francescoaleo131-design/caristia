// src/app/not-found.tsx

export const dynamic = 'force-dynamic'; // <--- Questa riga risolve i problemi di prerendering globale

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6 text-center">
      <h2 className="text-3xl font-black uppercase text-slate-800 mb-2">Pagina non trovata</h2>
      <p className="text-slate-500 mb-6 font-medium">Ci dispiace, la pagina che stai cercando non esiste.</p>
      <Link href="/shop" className="bg-blue-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors">
        Torna allo Shop
      </Link>
    </div>
  );
}