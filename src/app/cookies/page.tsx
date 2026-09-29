'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Cookie, ShieldCheck, Settings, Check, Lock, Sparkles, RefreshCcw } from "lucide-react";
import { CookiePreferences } from '@/components/CookieBanner';

const DEFAULT_PREFERENCES: CookiePreferences = {
  necessary: true,
  analytics: false,
  marketing: false,
  functional: false,
};

export default function CookiePolicyPage() {
  const [preferences, setPreferences] = useState<CookiePreferences>(DEFAULT_PREFERENCES);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('cookie-consent-preferences');
      if (saved) {
        setPreferences({ ...DEFAULT_PREFERENCES, ...JSON.parse(saved), necessary: true });
      }
    } catch (e) {
      // default
    }
  }, []);

  const handleToggle = (key: keyof CookiePreferences) => {
    if (key === 'necessary') return;
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = () => {
    try {
      localStorage.setItem('cookie-consent-preferences', JSON.stringify({ ...preferences, necessary: true }));
      localStorage.setItem('cookie-consent', 'custom');
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleAcceptAll = () => {
    const all = { necessary: true, analytics: true, marketing: true, functional: true };
    setPreferences(all);
    localStorage.setItem('cookie-consent-preferences', JSON.stringify(all));
    localStorage.setItem('cookie-consent', 'accepted');
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  const handleRejectAll = () => {
    const min = { necessary: true, analytics: false, marketing: false, functional: false };
    setPreferences(min);
    localStorage.setItem('cookie-consent-preferences', JSON.stringify(min));
    localStorage.setItem('cookie-consent', 'rejected');
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-zinc-900 font-sans">
      
      {/* Top Navbar */}
      <nav className="border-b border-zinc-200/80 py-4 sticky top-0 bg-white/90 backdrop-blur-md z-20">
        <div className="max-w-4xl mx-auto px-6 flex items-center justify-between">
          <Link 
            href="/" 
            className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-zinc-700 hover:text-[#1e73be] transition-colors"
          >
            <ArrowLeft size={16} strokeWidth={3} />
            Torna allo store
          </Link>
          <div className="flex items-center gap-2 text-[#1e73be] font-black uppercase text-xs tracking-widest">
            <Cookie size={18} />
            Cookie Policy
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-12 pb-24 space-y-10">
        
        {/* Header Section */}
        <header className="text-center space-y-4">
          <div className="bg-white w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto shadow-xl shadow-[#1e73be]/10 border border-zinc-100">
            <Cookie className="text-[#1e73be]" size={36} />
          </div>
          <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tighter text-zinc-800">
            Cookie <span className="text-[#8cc665]">Policy</span>
          </h1>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400">
            Informativa estesa sull'uso dei Cookie & Gestione dei Consensi
          </p>
          <div className="inline-flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-wider text-zinc-500 bg-white px-4 py-1.5 rounded-full border border-zinc-200 shadow-sm">
            <span>Giocattoli Caristia</span>
            <span className="w-1.5 h-1.5 bg-[#1e73be] rounded-full"></span>
            <span>Aggiornato: Settembre 2026</span>
          </div>
        </header>

        {/* Success Alert */}
        {savedSuccess && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 shadow-lg">
            <Sparkles className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="text-xs font-bold uppercase tracking-wider">
              Preferenze sui cookie aggiornate con successo!
            </span>
          </div>
        )}

        {/* Interactive Consent Panel */}
        <section className="bg-white rounded-[2.5rem] p-8 shadow-2xl shadow-zinc-200/50 border border-white space-y-6">
          <div className="flex items-center gap-3 border-b border-zinc-100 pb-4">
            <Settings className="text-[#1e73be]" size={22} />
            <div>
              <h2 className="font-black uppercase text-sm tracking-widest text-[#1e73be]">
                Pannello di Controllo Consensi
              </h2>
              <p className="text-xs text-zinc-500 font-semibold">
                Modifica le tue preferenze sui cookie in qualsiasi momento.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            
            {/* Category 1: Necessary */}
            <div className="bg-zinc-50 border border-zinc-100 rounded-2xl p-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />
                <div>
                  <div className="text-xs font-black uppercase tracking-wider text-zinc-800 flex items-center gap-2">
                    Cookie Necessari / Tecnici
                    <span className="text-[9px] font-black uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md">
                      Sempre Attivi
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500 font-semibold mt-1">
                    Essenziali per navigare, autenticarti, aggiungere prodotti al carrello ed effettuare ordini in sicurezza.
                  </p>
                </div>
              </div>

              <div className="w-11 h-6 bg-emerald-500 rounded-full opacity-80 flex items-center justify-end px-1 shrink-0">
                <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
              </div>
            </div>

            {/* Category 2: Functional */}
            <div className="bg-zinc-50 border border-zinc-100 rounded-2xl p-5 flex items-center justify-between gap-4">
              <div>
                <div className="text-xs font-black uppercase tracking-wider text-zinc-800">
                  Cookie Funzionali
                </div>
                <p className="text-xs text-zinc-500 font-semibold mt-1">
                  Memorizzano preferenze personalizzate come la lingua, il carrello o la valuta per visite future.
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleToggle('functional')}
                className={`w-11 h-6 rounded-full transition-colors flex items-center px-1 shrink-0 cursor-pointer ${
                  preferences.functional ? 'bg-[#1e73be] justify-end' : 'bg-zinc-300 justify-start'
                }`}
              >
                {preferences.functional && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
              </button>
            </div>

            {/* Category 3: Analytics */}
            <div className="bg-zinc-50 border border-zinc-100 rounded-2xl p-5 flex items-center justify-between gap-4">
              <div>
                <div className="text-xs font-black uppercase tracking-wider text-zinc-800">
                  Cookie Analitici e Statistiche
                </div>
                <p className="text-xs text-zinc-500 font-semibold mt-1">
                  Permettono di misurare l'afflusso di visitatori e capire quali pagine vengono visitate maggiormente.
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleToggle('analytics')}
                className={`w-11 h-6 rounded-full transition-colors flex items-center px-1 shrink-0 cursor-pointer ${
                  preferences.analytics ? 'bg-[#1e73be] justify-end' : 'bg-zinc-300 justify-start'
                }`}
              >
                {preferences.analytics && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
              </button>
            </div>

            {/* Category 4: Marketing */}
            <div className="bg-zinc-50 border border-zinc-100 rounded-2xl p-5 flex items-center justify-between gap-4">
              <div>
                <div className="text-xs font-black uppercase tracking-wider text-zinc-800">
                  Cookie di Marketing e Profilazione
                </div>
                <p className="text-xs text-zinc-500 font-semibold mt-1">
                  Utilizzati da partner terzi per offrirti messaggi promozionali pertinenti alle tue ricerche.
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleToggle('marketing')}
                className={`w-11 h-6 rounded-full transition-colors flex items-center px-1 shrink-0 cursor-pointer ${
                  preferences.marketing ? 'bg-[#1e73be] justify-end' : 'bg-zinc-300 justify-start'
                }`}
              >
                {preferences.marketing && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
              </button>
            </div>

          </div>

          <div className="flex flex-wrap sm:flex-nowrap gap-3 pt-4 border-t border-zinc-100">
            <button
              onClick={handleSave}
              className="flex-1 bg-[#8cc665] hover:bg-[#8cc665]/90 text-white py-3.5 px-6 rounded-2xl font-black uppercase text-xs tracking-widest transition shadow-lg shadow-[#8cc665]/20 cursor-pointer active:scale-95"
            >
              Salva Preferenze
            </button>
            <button
              onClick={handleAcceptAll}
              className="flex-1 bg-[#1e73be] hover:bg-[#1e73be]/90 text-white py-3.5 px-6 rounded-2xl font-black uppercase text-xs tracking-widest transition shadow-lg shadow-[#1e73be]/20 cursor-pointer active:scale-95"
            >
              Accetta Tutti
            </button>
            <button
              onClick={handleRejectAll}
              className="bg-zinc-100 hover:bg-zinc-200 text-zinc-700 py-3.5 px-6 rounded-2xl font-black uppercase text-xs tracking-widest transition border border-zinc-200 cursor-pointer active:scale-95"
            >
              Rifiuta Non Essenziali
            </button>
          </div>
        </section>

        {/* Detailed Informative Policy Body */}
        <article className="bg-white rounded-[2.5rem] p-8 sm:p-12 shadow-2xl shadow-zinc-200/50 border border-white space-y-8 text-zinc-700 leading-relaxed text-sm">
          
          <section>
            <h2 className="text-lg font-black text-zinc-800 uppercase tracking-wide mb-3 flex items-center gap-2 border-l-4 border-[#1e73be] pl-3">
              1. Cosa sono i Cookie?
            </h2>
            <p>
              I cookie sono piccoli file di testo che i siti visitati inviano al dispositivo dell'utente (computer, smartphone, tablet), dove vengono memorizzati per essere poi ritrasmessi agli stessi siti alla visita successiva. I cookie svolgono diverse funzioni importanti, come permettere la navigazione tra le pagine, ricordare le preferenze salvate ed esaminare le modalità d'uso del sito.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black text-zinc-800 uppercase tracking-wide mb-3 flex items-center gap-2 border-l-4 border-[#1e73be] pl-3">
              2. Servizi Utilizzati e Cookie Inseriti
            </h2>
            <p className="mb-4">
              Questo sito web utilizza esclusivamente i servizi di seguito elencati, necessari per il funzionamento dell'e-commerce, l'autenticazione, la gestione dei pagamenti e l'analisi prestazionale:
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse border border-zinc-200 text-xs">
                <thead>
                  <tr className="bg-zinc-100 text-zinc-800 uppercase font-black tracking-wider border-b border-zinc-200">
                    <th className="p-3 border-r border-zinc-200">Servizio / Fornitore</th>
                    <th className="p-3 border-r border-zinc-200">Tipologia</th>
                    <th className="p-3 border-r border-zinc-200">Scopo</th>
                    <th className="p-3">Privacy Policy</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 font-medium text-zinc-700">
                  <tr className="hover:bg-zinc-50/80">
                    <td className="p-3 font-bold text-zinc-900 border-r border-zinc-200">Supabase Auth & Database</td>
                    <td className="p-3 border-r border-zinc-200 font-bold text-emerald-700">Tecnico / Necessario</td>
                    <td className="p-3 border-r border-zinc-200">Gestione sessioni utente, autenticazione sicura e salvataggio carrello/ordini.</td>
                    <td className="p-3"><a href="https://supabase.com/privacy" target="_blank" rel="noreferrer" className="text-[#1e73be] font-bold hover:underline">Supabase Privacy</a></td>
                  </tr>
                  <tr className="hover:bg-zinc-50/80">
                    <td className="p-3 font-bold text-zinc-900 border-r border-zinc-200">Stripe Payments</td>
                    <td className="p-3 border-r border-zinc-200 font-bold text-emerald-700">Tecnico / Necessario</td>
                    <td className="p-3 border-r border-zinc-200">Elaborazione sicura dei pagamenti con carta di credito e prevenzione frodi.</td>
                    <td className="p-3"><a href="https://stripe.com/it/privacy" target="_blank" rel="noreferrer" className="text-[#1e73be] font-bold hover:underline">Stripe Privacy</a></td>
                  </tr>
                  <tr className="hover:bg-zinc-50/80">
                    <td className="p-3 font-bold text-zinc-900 border-r border-zinc-200">Vercel Speed Insights & Analytics</td>
                    <td className="p-3 border-r border-zinc-200 font-bold text-sky-700">Analitico / Prestazioni</td>
                    <td className="p-3 border-r border-zinc-200">Monitoraggio anonimo delle prestazioni di caricamento del sito web.</td>
                    <td className="p-3"><a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noreferrer" className="text-[#1e73be] font-bold hover:underline">Vercel Privacy</a></td>
                  </tr>
                  <tr className="hover:bg-zinc-50/80">
                    <td className="p-3 font-bold text-zinc-900 border-r border-zinc-200">Preference Cookie Store</td>
                    <td className="p-3 border-r border-zinc-200 font-bold text-purple-700">Funzionale</td>
                    <td className="p-3 border-r border-zinc-200">Memorizzazione locale (`localStorage`) del consenso ai cookie e preferenze utente.</td>
                    <td className="p-3"><span className="text-zinc-400">Interno</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-black text-zinc-800 uppercase tracking-wide mb-3 flex items-center gap-2 border-l-4 border-[#1e73be] pl-3">
              3. Come disabilitare i Cookie tramite Browser
            </h2>
            <p className="mb-3">
              È possibile configurare il proprio browser internet affinché accetti o rifiuti i cookie. Di seguito i link alle guide ufficiali dei principali browser:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-bold">
              <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noreferrer" className="p-3 bg-zinc-50 hover:bg-zinc-100 rounded-xl text-[#1e73be] border border-zinc-200 text-center">Google Chrome</a>
              <a href="https://support.mozilla.org/it/kb/Gestione%20dei%20cookie" target="_blank" rel="noreferrer" className="p-3 bg-zinc-50 hover:bg-zinc-100 rounded-xl text-[#1e73be] border border-zinc-200 text-center">Mozilla Firefox</a>
              <a href="https://support.apple.com/it-it/guide/safari/sfri11471/mac" target="_blank" rel="noreferrer" className="p-3 bg-zinc-50 hover:bg-zinc-100 rounded-xl text-[#1e73be] border border-zinc-200 text-center">Apple Safari</a>
              <a href="https://support.microsoft.com/it-it/microsoft-edge/eliminare-i-cookie-in-microsoft-edge-6394440f-50b9-5753-5425-d04550164606" target="_blank" rel="noreferrer" className="p-3 bg-zinc-50 hover:bg-zinc-100 rounded-xl text-[#1e73be] border border-zinc-200 text-center">Microsoft Edge</a>
            </div>
          </section>

          <section className="bg-zinc-900 text-white rounded-3xl p-6 sm:p-8 space-y-4">
            <h3 className="text-lg font-black uppercase text-[#8cc665] tracking-wide">Titolare del Trattamento</h3>
            <div className="text-xs font-bold space-y-1 text-zinc-300">
              <p className="text-sm font-black text-white">Giocattoli Caristia di Angelo Caristia</p>
              <p>Via Madonna della Via, 74/C - 95041 Caltagirone (CT)</p>
              <p>Email: <a href="mailto:info@giocattolicaristia.it" className="text-[#1e73be] underline">info@giocattolicaristia.it</a></p>
              <p>Telefono: +39 09332 6865</p>
            </div>
          </section>

        </article>

        {/* Footer */}
        <footer className="pt-8 border-t border-zinc-200 text-center space-y-3">
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">
            © {new Date().getFullYear()} Giocattoli Caristia - Tutti i diritti riservati.
          </p>
          <div className="flex justify-center gap-6 text-xs font-black uppercase tracking-widest text-zinc-600">
            <Link href="/privacy" className="hover:text-[#1e73be]">Privacy Policy</Link>
            <Link href="/cookies" className="hover:text-[#1e73be]">Cookie Policy</Link>
          </div>
        </footer>

      </main>
    </div>
  );
}
