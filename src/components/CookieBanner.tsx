"use client";
import { useState, useEffect } from 'react';

export default function CookieBanner() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setIsOpen(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setIsOpen(false);
  };

  const handleRejectAll = () => {
    localStorage.setItem('cookie-consent', 'rejected');
    setIsOpen(false);
  };

  const handleManage = () => {
    // Navigate to detailed cookie management page
    window.location.href = '/cookies';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 md:bottom-6 md:right-6 md:max-w-sm md:w-auto max-w-full px-4 md:px-0 p-4 md:p-5 bg-white/95 backdrop-blur-md border border-slate-200/80 shadow-2xl rounded-3xl flex flex-col gap-3 animate-in slide-in-from-bottom-5 duration-300">
      <div>
        <h4 className="text-xs font-black uppercase text-slate-800 tracking-wider">Informativa sui Cookie 🍪</h4>
        <p className="text-[11px] text-slate-500 font-semibold leading-relaxed mt-1">
          Utilizziamo i cookie per offrirti la migliore esperienza sul nostro sito. Continuando a navigare, acconsenti al loro utilizzo in conformità alla nostra{" "}
          <a href="/cookies" className="text-[#1e73be] underline font-bold hover:text-blue-700">Cookie Policy</a>.
        </p>
      </div>
      <div className="flex gap-2 justify-center md:justify-end">
        <button
          onClick={handleAccept}
          className="bg-slate-950 hover:bg-[#1e73be] text-white px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer shadow-md active:scale-95 w-full md:w-auto"
        >
          Accetta tutti
        </button>
        <button
          onClick={handleRejectAll}
          className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer shadow-md active:scale-95 w-full md:w-auto"
        >
          Rifiuta tutti
        </button>
        <button
          onClick={handleManage}
          className="bg-blue-700 hover:bg-blue-600 text-white px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer shadow-md active:scale-95 w-full md:w-auto"
        >
          Gestisci
        </button>
      </div>
    </div>
  );
}
