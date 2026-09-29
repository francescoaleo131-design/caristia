'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Cookie, Settings, Check, X, ShieldCheck, ChevronDown, ChevronUp } from 'lucide-react';

export interface CookiePreferences {
  necessary: boolean; // Always true
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
}

const DEFAULT_PREFERENCES: CookiePreferences = {
  necessary: true,
  analytics: false,
  marketing: false,
  functional: false,
};

export default function CookieBanner() {
  const [isOpen, setIsOpen] = useState(false);
  const [showManageModal, setShowManageModal] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>(DEFAULT_PREFERENCES);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  useEffect(() => {
    try {
      const savedConsent = localStorage.getItem('cookie-consent-preferences');
      if (!savedConsent) {
        setIsOpen(true);
      } else {
        const parsed = JSON.parse(savedConsent);
        setPreferences({ ...DEFAULT_PREFERENCES, ...parsed, necessary: true });
      }
    } catch (e) {
      setIsOpen(true);
    }
  }, []);

  const savePreferences = (prefs: CookiePreferences) => {
    try {
      localStorage.setItem('cookie-consent-preferences', JSON.stringify({ ...prefs, necessary: true }));
      localStorage.setItem('cookie-consent', 'custom');
    } catch (e) {
      console.error('Failed to save cookie consent', e);
    }
    setIsOpen(false);
    setShowManageModal(false);
  };

  const handleAcceptAll = () => {
    const allAccepted: CookiePreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
      functional: true,
    };
    setPreferences(allAccepted);
    savePreferences(allAccepted);
  };

  const handleRejectAll = () => {
    const onlyNecessary: CookiePreferences = {
      necessary: true,
      analytics: false,
      marketing: false,
      functional: false,
    };
    setPreferences(onlyNecessary);
    savePreferences(onlyNecessary);
  };

  const handleSaveCustom = () => {
    savePreferences(preferences);
  };

  const togglePreference = (key: keyof CookiePreferences) => {
    if (key === 'necessary') return; // Cannot toggle mandatory
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay background for manage modal */}
      {showManageModal && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[9998] transition-opacity"
          onClick={() => setShowManageModal(false)}
        />
      )}

      {/* Main Banner */}
      {!showManageModal && (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-[9999] bg-white/95 backdrop-blur-md border border-zinc-200/80 shadow-2xl rounded-3xl p-5 sm:p-6 flex flex-col gap-4 animate-in slide-in-from-bottom-5 duration-300">
          <div className="flex items-start gap-3">
            <div className="bg-[#1e73be]/10 text-[#1e73be] p-2.5 rounded-2xl shrink-0 mt-0.5">
              <Cookie className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-black uppercase text-zinc-800 tracking-wider flex items-center gap-2">
                Informativa sui Cookie 🍪
              </h4>
              <p className="text-xs text-zinc-600 font-semibold leading-relaxed mt-1">
                Utilizziamo i cookie tecnici indispensabili per il funzionamento del sito e, previo tuo consenso, cookie di profilazione e statistici per offrirti un'esperienza personalizzata. Consulta la nostra{' '}
                <Link href="/cookies" className="text-[#1e73be] underline font-bold hover:text-[#1e73be]/80">
                  Cookie Policy
                </Link>.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap gap-2 pt-1">
            <button
              onClick={handleAcceptAll}
              className="flex-1 bg-[#1e73be] hover:bg-[#1e73be]/90 text-white py-3 px-4 rounded-2xl text-[11px] font-black uppercase tracking-wider transition-all cursor-pointer shadow-md shadow-[#1e73be]/20 active:scale-95 text-center"
            >
              Accetta tutti
            </button>
            <button
              onClick={handleRejectAll}
              className="flex-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 py-3 px-4 rounded-2xl text-[11px] font-black uppercase tracking-wider transition-all cursor-pointer border border-zinc-200 active:scale-95 text-center"
            >
              Rifiuta tutti
            </button>
            <button
              onClick={() => setShowManageModal(true)}
              className="w-full sm:w-auto bg-zinc-900 hover:bg-zinc-800 text-white py-3 px-4 rounded-2xl text-[11px] font-black uppercase tracking-wider transition-all cursor-pointer shadow-md active:scale-95 flex items-center justify-center gap-1.5"
            >
              <Settings className="w-3.5 h-3.5" />
              Gestisci
            </button>
          </div>
        </div>
      )}

      {/* Preferences Management Modal */}
      {showManageModal && (
        <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 max-w-xl mx-auto z-[9999] bg-white border border-zinc-200 shadow-2xl rounded-[2.5rem] p-6 sm:p-8 flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200">
          
          {/* Modal Header */}
          <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
            <div className="flex items-center gap-2.5">
              <div className="bg-[#1e73be]/10 text-[#1e73be] p-2.5 rounded-2xl">
                <Settings className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black uppercase text-zinc-900 tracking-tight">
                  Preferenze sui Cookie
                </h3>
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                  Personalizza i consensi del browser
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowManageModal(false)}
              className="p-2 rounded-xl text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Content / Cookie Categories */}
          <div className="py-6 space-y-4 overflow-y-auto pr-1">
            
            {/* Category 1: Necessary (Fixed) */}
            <div className="bg-zinc-50 border border-zinc-100 rounded-2xl p-4 transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <div>
                    <div className="text-xs font-black uppercase tracking-wider text-zinc-800 flex items-center gap-2">
                      Cookie Obbligatori / Tecnici
                      <span className="text-[9px] font-black uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md">
                        Sempre Attivi
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-500 font-semibold mt-0.5">
                      Essenziali per il funzionamento del sito (es. carrello, login, sicurezza).
                    </p>
                  </div>
                </div>

                <div className="relative inline-flex items-center shrink-0">
                  <input
                    type="checkbox"
                    checked={true}
                    disabled
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-emerald-500 rounded-full peer cursor-not-allowed opacity-80 flex items-center justify-end px-1">
                    <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
                  </div>
                </div>
              </div>
            </div>

            {/* Category 2: Functional */}
            <div className="bg-zinc-50 border border-zinc-100 rounded-2xl p-4 transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-black uppercase tracking-wider text-zinc-800">
                    Cookie Funzionali
                  </div>
                  <p className="text-[11px] text-zinc-500 font-semibold mt-0.5">
                    Permettono di memorizzare le preferenze dell'utente (lingua, impostazioni).
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => togglePreference('functional')}
                  className="relative inline-flex items-center shrink-0 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={preferences.functional}
                    onChange={() => {}}
                    className="sr-only peer"
                  />
                  <div className={`w-11 h-6 rounded-full transition-colors flex items-center px-1 ${
                    preferences.functional ? 'bg-[#1e73be] justify-end' : 'bg-zinc-300 justify-start'
                  }`}>
                    {preferences.functional && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                  </div>
                </button>
              </div>
            </div>

            {/* Category 3: Analytics */}
            <div className="bg-zinc-50 border border-zinc-100 rounded-2xl p-4 transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-black uppercase tracking-wider text-zinc-800">
                    Cookie Analitici e Statistici
                  </div>
                  <p className="text-[11px] text-zinc-500 font-semibold mt-0.5">
                    Ci aiutano a capire come gli utenti interagiscono con il sito per migliorarlo.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => togglePreference('analytics')}
                  className="relative inline-flex items-center shrink-0 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={preferences.analytics}
                    onChange={() => {}}
                    className="sr-only peer"
                  />
                  <div className={`w-11 h-6 rounded-full transition-colors flex items-center px-1 ${
                    preferences.analytics ? 'bg-[#1e73be] justify-end' : 'bg-zinc-300 justify-start'
                  }`}>
                    {preferences.analytics && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                  </div>
                </button>
              </div>
            </div>

            {/* Category 4: Marketing & Profiling */}
            <div className="bg-zinc-50 border border-zinc-100 rounded-2xl p-4 transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-black uppercase tracking-wider text-zinc-800">
                    Cookie di Marketing e Profilazione
                  </div>
                  <p className="text-[11px] text-zinc-500 font-semibold mt-0.5">
                    Utilizzati per mostrare annunci pertinenti e contenuti personalizzati sui social.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => togglePreference('marketing')}
                  className="relative inline-flex items-center shrink-0 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={preferences.marketing}
                    onChange={() => {}}
                    className="sr-only peer"
                  />
                  <div className={`w-11 h-6 rounded-full transition-colors flex items-center px-1 ${
                    preferences.marketing ? 'bg-[#1e73be] justify-end' : 'bg-zinc-300 justify-start'
                  }`}>
                    {preferences.marketing && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                  </div>
                </button>
              </div>
            </div>

          </div>

          {/* Modal Footer */}
          <div className="pt-4 border-t border-zinc-100 flex flex-col sm:flex-row gap-2 justify-end">
            <button
              onClick={handleRejectAll}
              className="px-5 py-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-black uppercase text-xs tracking-widest rounded-2xl transition active:scale-95"
            >
              Rifiuta Non Essenziali
            </button>
            <button
              onClick={handleSaveCustom}
              className="px-6 py-3 bg-[#1e73be] hover:bg-[#1e73be]/90 text-white font-black uppercase text-xs tracking-widest rounded-2xl transition shadow-lg shadow-[#1e73be]/20 active:scale-95"
            >
              Salva Preferenze
            </button>
          </div>

        </div>
      )}
    </>
  );
}
