'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { 
  CreditCard, 
  QrCode, 
  Search, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  RefreshCw, 
  Power, 
  DollarSign, 
  Calendar, 
  User, 
  Sparkles,
  ShieldCheck,
  Trash2,
  RotateCcw
} from 'lucide-react';

interface GiftCard {
  id: string;
  code: string;
  initial_balance: number;
  current_balance: number;
  created_at: string;
  is_phisical?: boolean | string | null;
  is_physical?: boolean | string | null;
  is_active: boolean;
  activated_at?: string | null;
  expire_date: string | null;
  redeemed_by: string | null;
  redeemed_at: string | null;
  buyer_email: string | null;
  qr_code_url: string | null;
}

export default function GiftCardAdminPage() {
  const supabase = createClient();
  const [searchCode, setSearchCode] = useState('');
  const [giftCard, setGiftCard] = useState<GiftCard | null>(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [chargeAmount, setChargeAmount] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [showScanner, setShowScanner] = useState(false);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  // Auto clear message after 5s
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // QR Code Scanner lifecycle
  useEffect(() => {
    if (showScanner) {
      scannerRef.current = new Html5QrcodeScanner(
        'qr-reader',
        { fps: 10, qrbox: { width: 250, height: 250 } },
        /* verbose= */ false
      );

      scannerRef.current.render(
        (decodedText) => {
          let code = decodedText.trim();
          try {
            if (code.includes('http')) {
              const url = new URL(code);
              const paramCode = url.searchParams.get('code') || url.pathname.split('/').pop();
              if (paramCode) code = paramCode;
            }
          } catch (e) {
            // keep raw text
          }
          setSearchCode(code);
          setShowScanner(false);
          fetchGiftCard(code);
        },
        (error) => {
          // quiet scan errors
        }
      );

      return () => {
        if (scannerRef.current) {
          scannerRef.current.clear().catch(console.error);
        }
      };
    }
  }, [showScanner]);

  const fetchGiftCard = async (codeToSearch?: string) => {
    const code = (codeToSearch !== undefined ? codeToSearch : searchCode).trim();
    if (!code) {
      setMessage({ type: 'error', text: 'Inserisci un codice valido o scansiona un QR code.' });
      return;
    }

    setLoading(true);
    setMessage(null);
    setGiftCard(null);

    try {
      const { data, error } = await supabase
        .from('gift_cards')
        .select('*')
        .eq('code', code)
        .maybeSingle();

      if (error) {
        throw error;
      }

      if (!data) {
        setMessage({ type: 'error', text: `Nessuna Gift Card trovata con il codice "${code}".` });
      } else {
        setGiftCard(data as GiftCard);
      }
    } catch (err: any) {
      console.error('Error fetching gift card:', err);
      setMessage({ type: 'error', text: err.message || 'Errore durante la ricerca della Gift Card.' });
    } finally {
      setLoading(false);
    }
  };

  const handleActivate = async () => {
    if (!giftCard) return;
    setActionLoading(true);
    setMessage(null);

    try {
      const { data, error } = await supabase
        .from('gift_cards')
        .update({ 
          is_active: true,
          activated_at: new Date().toISOString()
        })
        .eq('id', giftCard.id)
        .select()
        .single();

      if (error) throw error;

      setGiftCard(data as GiftCard);
      setMessage({ type: 'success', text: 'Gift Card attivata con successo!' });
    } catch (err: any) {
      console.error('Error activating gift card:', err);
      setMessage({ type: 'error', text: err.message || 'Errore durante l\'attivazione.' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeductBalance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!giftCard) return;

    const amount = parseFloat(chargeAmount);
    if (isNaN(amount) || amount <= 0) {
      setMessage({ type: 'error', text: 'Inserisci un importo valido da scalare.' });
      return;
    }

    if (amount > giftCard.current_balance) {
      setMessage({ type: 'error', text: `L'importo (€${amount.toFixed(2)}) supera il saldo disponibile (€${giftCard.current_balance.toFixed(2)}).` });
      return;
    }

    setActionLoading(true);
    setMessage(null);

    try {
      const newBalance = Number((giftCard.current_balance - amount).toFixed(2));

      if (newBalance === 0) {
        if (isPhysical) {
          // Physical Card reached 0 -> reset to initial balance
          const { data, error } = await supabase
            .from('gift_cards')
            .update({ current_balance: giftCard.initial_balance })
            .eq('id', giftCard.id)
            .select()
            .single();

          if (error) throw error;

          setGiftCard(data as GiftCard);
          setMessage({
            type: 'info',
            text: `Saldo azzerato! Trattandosi di una carta FISICA, il saldo è stato ripristinato a €${giftCard.initial_balance.toFixed(2)}.`
          });
        } else {
          // Digital Card reached 0 -> Delete card
          const { error } = await supabase
            .from('gift_cards')
            .delete()
            .eq('id', giftCard.id);

          if (error) throw error;

          setGiftCard(null);
          setSearchCode('');
          setMessage({
            type: 'info',
            text: 'Saldo azzerato! Trattandosi di una carta DIGITALE, la carta è stata eliminata definitivamente.'
          });
        }
      } else {
        // Balance > 0 -> Update balance
        const { data, error } = await supabase
          .from('gift_cards')
          .update({ current_balance: newBalance })
          .eq('id', giftCard.id)
          .select()
          .single();

        if (error) throw error;

        setGiftCard(data as GiftCard);
        setMessage({
          type: 'success',
          text: `Scalati €${amount.toFixed(2)}. Nuovo saldo disponibile: €${newBalance.toFixed(2)}.`
        });
      }

      setChargeAmount('');
    } catch (err: any) {
      console.error('Error processing usage:', err);
      setMessage({ type: 'error', text: err.message || 'Errore durante l\'aggiornamento del saldo.' });
    } finally {
      setActionLoading(false);
    }
  };

  // Helper to check if card is physical regardless of typo or string format in DB
  const isPhysical = Boolean(
    giftCard?.is_phisical === true ||
    String(giftCard?.is_phisical) === 'true' ||
    String(giftCard?.is_phisical) === '1' ||
    giftCard?.is_physical === true ||
    String(giftCard?.is_physical) === 'true' ||
    String(giftCard?.is_physical) === '1'
  );

  // Validity check
  const isExpired = giftCard?.expire_date ? new Date(giftCard.expire_date) < new Date() : false;
  const isUsable = giftCard?.is_active && !isExpired && (giftCard.current_balance > 0);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-zinc-900 p-4 sm:p-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="bg-white w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto shadow-xl shadow-[#1e73be]/10 border border-zinc-100">
            <ShieldCheck className="text-[#1e73be]" size={36} />
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tighter text-zinc-800">
            Controllo <span className="text-[#8cc665]">Gift Card</span>
          </h1>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">
            Dashboard di verifica validità, attivazione e scalabilità saldo
          </p>
        </div>

        {/* Global Notifications */}
        {message && (
          <div
            className={`p-5 rounded-2xl border flex items-start gap-3 transition-all animate-in fade-in slide-in-from-top-2 shadow-lg ${
              message.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : message.type === 'error'
                ? 'bg-rose-50 border-rose-200 text-rose-800'
                : 'bg-sky-50 border-sky-200 text-sky-800'
            }`}
          >
            {message.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />}
            {message.type === 'error' && <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />}
            {message.type === 'info' && <Sparkles className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />}
            <div className="text-xs font-bold uppercase tracking-wider">{message.text}</div>
          </div>
        )}

        {/* Search & Scan Bar */}
        <div className="bg-white rounded-[2.5rem] p-6 shadow-2xl shadow-zinc-200/50 border border-white">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              fetchGiftCard();
            }}
            className="flex flex-col sm:flex-row items-center gap-3"
          >
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
              <input
                type="text"
                placeholder="Inserisci o incolla il codice della Gift Card..."
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-zinc-50 border-2 border-zinc-50 rounded-2xl font-bold text-zinc-700 outline-none focus:border-[#1e73be]/20 transition-all text-sm font-mono"
              />
            </div>
            
            <div className="flex w-full sm:w-auto items-center gap-2">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 sm:flex-none px-6 py-4 bg-[#1e73be] hover:bg-[#1e73be]/90 text-white font-black uppercase text-xs tracking-widest rounded-2xl transition-all shadow-lg shadow-[#1e73be]/20 disabled:opacity-50 whitespace-nowrap"
              >
                {loading ? 'Ricerca...' : 'Verifica'}
              </button>
              
              <button
                type="button"
                onClick={() => setShowScanner(!showScanner)}
                className={`p-4 rounded-2xl border-2 transition shrink-0 ${
                  showScanner
                    ? 'bg-rose-50 border-rose-200 text-rose-600'
                    : 'bg-zinc-50 hover:bg-zinc-100 border-zinc-100 text-[#1e73be]'
                }`}
                title="Scansiona QR Code"
              >
                <QrCode className="w-5 h-5" />
              </button>
            </div>
          </form>

          {/* Scanner Box */}
          {showScanner && (
            <div className="mt-6 p-4 bg-zinc-50 border border-zinc-200 rounded-2xl flex flex-col items-center">
              <div className="flex justify-between items-center w-full mb-3">
                <span className="text-xs font-black uppercase tracking-widest text-[#1e73be] flex items-center gap-2">
                  <QrCode className="w-4 h-4" /> Scansiona QR Code
                </span>
                <button
                  onClick={() => setShowScanner(false)}
                  className="text-xs font-bold text-zinc-400 hover:text-zinc-700"
                >
                  Chiudi scanner
                </button>
              </div>
              <div id="qr-reader" className="w-full max-w-sm rounded-xl overflow-hidden border border-zinc-200 bg-white"></div>
            </div>
          )}
        </div>

        {/* Gift Card Details & Actions */}
        {giftCard && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            {/* Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Active Status */}
              <div className="bg-white rounded-2xl p-5 shadow-lg shadow-zinc-200/50 border border-zinc-100 flex items-center gap-4">
                <div className={`p-3 rounded-xl ${giftCard.is_active ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                  <Power className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Stato Attivazione</div>
                  <div className={`text-sm font-black uppercase tracking-wider ${giftCard.is_active ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {giftCard.is_active ? 'Attiva' : 'Inattiva'}
                  </div>
                </div>
              </div>

              {/* Validity Status */}
              <div className="bg-white rounded-2xl p-5 shadow-lg shadow-zinc-200/50 border border-zinc-100 flex items-center gap-4">
                <div className={`p-3 rounded-xl ${isExpired ? 'bg-rose-50 text-rose-600' : 'bg-sky-50 text-sky-600'}`}>
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Scadenza</div>
                  <div className={`text-sm font-black uppercase tracking-wider ${isExpired ? 'text-rose-600' : 'text-zinc-800'}`}>
                    {giftCard.expire_date
                      ? new Date(giftCard.expire_date).toLocaleDateString('it-IT')
                      : 'Nessuna Scadenza'}
                  </div>
                </div>
              </div>

              {/* Type Status */}
              <div className="bg-white rounded-2xl p-5 shadow-lg shadow-zinc-200/50 border border-zinc-100 flex items-center gap-4">
                <div className="p-3 rounded-xl bg-purple-50 text-purple-600">
                  <CreditCard className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Tipologia Carta</div>
                  <div className="text-sm font-black uppercase tracking-wider text-purple-700">
                    {isPhysical ? 'Fisica (Ricaricabile)' : 'Digitale (Monouso)'}
                  </div>
                </div>
              </div>
            </div>

            {/* Activation Banner if Inactive */}
            {!giftCard.is_active && (
              <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0" />
                  <div>
                    <h3 className="font-bold text-amber-900 text-sm uppercase tracking-wide">Gift Card Non Attiva</h3>
                    <p className="text-xs text-amber-700">
                      Questa carta è disattivata e non può essere utilizzata per i pagamenti.
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleActivate}
                  disabled={actionLoading}
                  className="w-full sm:w-auto px-5 py-3 bg-[#8cc665] hover:bg-[#8cc665]/90 text-white font-black uppercase text-xs tracking-widest rounded-xl transition shadow-lg shadow-[#8cc665]/20 disabled:opacity-50 whitespace-nowrap"
                >
                  {actionLoading ? 'Attivazione...' : 'Attiva Ora'}
                </button>
              </div>
            )}

            {/* Expired Banner */}
            {isExpired && (
              <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-center gap-3 text-rose-800">
                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  Attenzione: Questa Gift Card è scaduta il {new Date(giftCard.expire_date!).toLocaleDateString('it-IT')}.
                </span>
              </div>
            )}

            {/* Main Balance & Deduction Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Balance Card */}
              <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl shadow-zinc-200/50 border border-white flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Saldo Disponibile</span>
                    <span className="font-mono text-xs font-bold px-3 py-1 bg-zinc-100 rounded-lg text-[#1e73be] border border-zinc-200">
                      {giftCard.code}
                    </span>
                  </div>

                  <div className="text-4xl sm:text-5xl font-black text-zinc-800 tracking-tight mb-2">
                    € {giftCard.current_balance.toFixed(2)}
                  </div>
                  
                  <div className="text-xs font-bold text-zinc-400">
                    Saldo Iniziale: <span className="text-zinc-600">€ {giftCard.initial_balance.toFixed(2)}</span>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-zinc-100 grid grid-cols-2 gap-2 text-xs text-zinc-500">
                  <div>
                    <span className="block text-[9px] font-black uppercase text-zinc-400 tracking-widest">Creata il</span>
                    <span className="font-bold text-zinc-700">
                      {giftCard.created_at ? new Date(giftCard.created_at).toLocaleDateString('it-IT') : '-'}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[9px] font-black uppercase text-zinc-400 tracking-widest">Compratore</span>
                    <span className="font-bold text-zinc-700 truncate block" title={giftCard.buyer_email || 'N/D'}>
                      {giftCard.buyer_email || 'N/D'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Deduct Form */}
              <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl shadow-zinc-200/50 border border-white flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-black uppercase tracking-widest text-[#1e73be] mb-1 flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-[#8cc665]" /> Scalare Importo
                  </h3>
                  <p className="text-xs text-zinc-400 mb-6">
                    Inserisci l'importo da addebitare a questa Gift Card per il pagamento.
                  </p>

                  <form onSubmit={handleDeductBalance} className="space-y-4">
                    <div>
                      <label className="text-[9px] font-black uppercase text-zinc-400 ml-4 mb-1 block tracking-widest">
                        Importo da Scalare (€)
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 font-bold">€</span>
                        <input
                          type="number"
                          step="0.01"
                          min="0.01"
                          max={giftCard.current_balance}
                          disabled={!isUsable || actionLoading}
                          placeholder="0.00"
                          value={chargeAmount}
                          onChange={(e) => setChargeAmount(e.target.value)}
                          className="w-full pl-9 pr-4 py-4 bg-zinc-50 border-2 border-zinc-50 rounded-2xl font-bold text-zinc-800 outline-none focus:border-[#1e73be]/20 transition-all text-lg disabled:opacity-50"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={!isUsable || actionLoading || !chargeAmount}
                      className="w-full py-4 bg-[#8cc665] hover:bg-[#8cc665]/90 text-white font-black uppercase text-xs tracking-widest rounded-2xl transition-all shadow-lg shadow-[#8cc665]/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {actionLoading ? 'Elaborazione...' : 'Conferma Addebito'}
                    </button>
                  </form>
                </div>

                {/* Behavioral helper note */}
                <div className="mt-4 pt-3 border-t border-zinc-100 text-[11px] text-zinc-500 flex items-start gap-2">
                  {isPhysical ? (
                    <>
                      <RotateCcw className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-purple-700">Carta Fisica:</strong> Se il saldo raggiunge €0.00, verrà ripristinato automaticamente a €{giftCard.initial_balance.toFixed(2)}.
                      </span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-rose-700">Carta Digitale:</strong> Se il saldo raggiunge €0.00, la carta verrà eliminata definitivamente dal database.
                      </span>
                    </>
                  )}
                </div>
              </div>

            </div>

            {/* Additional Details Box */}
            <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl shadow-zinc-200/50 border border-white">
              <h4 className="text-xs font-black uppercase tracking-widest text-[#1e73be] mb-4 flex items-center gap-2">
                <User className="w-4 h-4 text-[#8cc665]" /> Dettagli Avanzati
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 text-xs">
                <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-100">
                  <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400 block mb-1">ID Card</span>
                  <span className="font-mono text-zinc-700 font-bold break-all">{giftCard.id}</span>
                </div>
                <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-100">
                  <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400 block mb-1">Attivata Il</span>
                  <span className="font-bold text-zinc-700">
                    {giftCard.activated_at ? new Date(giftCard.activated_at).toLocaleString('it-IT') : 'N/D'}
                  </span>
                </div>
                <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-100">
                  <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400 block mb-1">Riscatto Da</span>
                  <span className="font-bold text-zinc-700">{giftCard.redeemed_by || 'Non riscattata'}</span>
                </div>
                <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-100">
                  <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400 block mb-1">Data Riscatto</span>
                  <span className="font-bold text-zinc-700">
                    {giftCard.redeemed_at ? new Date(giftCard.redeemed_at).toLocaleString('it-IT') : 'N/D'}
                  </span>
                </div>
                <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-100">
                  <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400 block mb-1">URL QR Code</span>
                  {giftCard.qr_code_url ? (
                    <a
                      href={giftCard.qr_code_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#1e73be] font-bold hover:underline truncate block"
                    >
                      Visualizza QR
                    </a>
                  ) : (
                    <span className="text-zinc-400">Nessun QR</span>
                  )}
                </div>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}