"use client"
import { useState } from "react"
import { Gift, CheckCircle2, Smartphone, Loader2, Euro } from "lucide-react"

const TAGLI_PRESET = [25, 50, 100];

export default function GiftCardPage() {
  const [amount, setAmount] = useState<number>(50); // Default a 50€
  const [loading, setLoading] = useState(false);
  
  // Dati opzionali per la dedica della card
  const [buyerName, setBuyerName] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [giftMessage, setGiftMessage] = useState("");

  const handleAcquista = async () => {
    if (!amount || amount <= 0) {
      alert("Inserisci un importo valido");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/checkout/giftcard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          amount,
          buyerName,
          recipientEmail,
          giftMessage
        }),
      });

      const data = await response.json();

      if (response.ok && data.url) {
        // Voliamo sul checkout sicuro di Stripe
        window.location.href = data.url;
      } else {
        console.error("Errore API:", data.error);
        alert(data.error || "Si è verificato un errore. Riprova.");
      }
    } catch (err) {
      console.error("Errore di rete:", err);
      alert("Errore di connessione. Controlla la tua rete.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-[#1e73be] uppercase italic tracking-tight">
            Gift Card <span className="text-[#8cc665]">Caristia</span>
          </h1>
          <p className="text-gray-500 mt-2 font-medium">Il regalo perfetto, pronto in un secondo e dell'importo che vuoi tu.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-start">

          {/* Anteprima Dinamica Carta Regalo */}
          <div className="sticky top-6 space-y-4">
            <div
              className="w-full aspect-[1.6/1] rounded-[2rem] p-8 text-white shadow-2xl overflow-hidden relative transition-all bg-gradient-to-br from-indigo-900 to-slate-900"
            >
              <div className="absolute inset-0 bg-black/20"></div>

              <div className="relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-start">
                  <Gift size={40} className="opacity-90" />
                  <span className="text-4xl font-black italic">€{amount || 0}</span>
                </div>

                <div className="mt-6">
                  <p className="text-xs uppercase tracking-[0.2em] opacity-90 font-bold">Codice Regalo</p>
                  <p className="text-xl font-mono font-bold tracking-widest mt-1">CAR-XXXX-XXXX</p>
                </div>

                {buyerName && (
                  <p className="text-xs italic opacity-80 mt-2">Da: {buyerName}</p>
                )}

                <div className="mt-auto flex justify-between items-end border-t border-white/20 pt-4">
                  <p className="text-[10px] uppercase font-bold tracking-widest">Valida in negozio e online</p>
                  <span className="font-black text-sm tracking-widest text-[#8cc665]">CARISTIA</span>
                </div>
              </div>
            </div>
          </div>

          {/* Pannello Configurazione Importo Libero e Dedica */}
          <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-gray-100 space-y-6">
            
            {/* Scelta Importo */}
            <div className="space-y-3">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-wider">Scegli l'importo della card</h3>
              
              {/* Preset Veloci */}
              <div className="grid grid-cols-3 gap-3">
                {TAGLI_PRESET.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setAmount(p)}
                    className={`py-3 rounded-xl font-bold text-sm transition-all ${
                      amount === p ? "bg-[#1e73be] text-white shadow-md" : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                    }`}
                  >
                    €{p}
                  </button>
                ))}
              </div>

              {/* Input Libero */}
              <div className="relative mt-2">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-400">€</span>
                <input
                  type="number"
                  min="5"
                  step="1"
                  placeholder="Inserisci un importo personalizzato"
                  value={amount || ""}
                  onChange={(e) => setAmount(Math.max(0, Number(e.target.value)))}
                  className="w-full bg-gray-50 pl-8 pr-4 py-4 rounded-xl outline-none border-2 border-transparent focus:border-indigo-100 font-bold text-base text-left"
                />
              </div>
            </div>

            {/* Campi Dedica (Opzionali - passati come metadata a Stripe) */}
            <div className="space-y-3 pt-2 border-t border-gray-50">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-wider">Aggiungi una dedica (Opzionale)</h3>
              <input
                type="text"
                placeholder="Il tuo nome"
                value={buyerName}
                onChange={(e) => setBuyerName(e.target.value)}
                className="w-full bg-gray-50 px-4 py-3 rounded-xl text-sm border-2 border-transparent outline-none focus:border-indigo-500/10"
              />
              <input
                type="email"
                placeholder="Email del destinatario (se vuoi spedirla direttamente)"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                className="w-full bg-gray-50 px-4 py-3 rounded-xl text-sm border-2 border-transparent outline-none focus:border-indigo-500/10"
              />
              <textarea
                placeholder="Messaggio d'auguri..."
                value={giftMessage}
                onChange={(e) => setGiftMessage(e.target.value)}
                rows={3}
                className="w-full bg-gray-50 px-4 py-3 rounded-xl text-sm border-2 border-transparent outline-none focus:border-indigo-500/10 resize-none"
              />
            </div>

            {/* Vantaggi della Card */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 text-xs text-gray-600 font-medium">
                <CheckCircle2 size={16} className="text-[#8cc665]" />
                Email transazionale istantanea dedicata
              </div>
              <div className="flex items-center gap-3 text-xs text-gray-600 font-medium">
                <Smartphone size={16} className="text-[#8cc665]" />
                QR Code allegato per l'uso immediato in cassa
              </div>
            </div>

            {/* Bottone Checkout */}
            <button
              type="button"
              onClick={handleAcquista}
              disabled={loading || !amount || amount <= 0}
              className="w-full bg-[#8cc665] hover:bg-[#76b054] text-white font-black py-4 rounded-xl uppercase tracking-widest transition-all shadow-lg disabled:bg-gray-200 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : "Procedi al Pagamento"}
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}