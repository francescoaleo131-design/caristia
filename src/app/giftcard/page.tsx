"use client"
import { useState } from "react"
import { Gift, CheckCircle2, Smartphone, Loader2 } from "lucide-react"

// Configurazione dei tagli disponibili con le rispettive immagini locali
const CARDS_DISPONIBILI = [
  { id: 1, amount: 25, image: "/card20.jpeg", label: "Gift Card Bronze" },
  { id: 2, amount: 50, image: "/card50.jpeg", label: "Gift Card Silver" },
  { id: 3, amount: 100, image: "/card100.jpeg", label: "Gift Card Gold" },
];

export default function GiftCardPage() {
  const [selectedCard, setSelectedCard] = useState(CARDS_DISPONIBILI[1]); // Default a 50€
  const [loading, setLoading] = useState(false);
  
  // Dati opzionali per la dedica della card
  const [buyerName, setBuyerName] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [giftMessage, setGiftMessage] = useState("");

  const handleAcquista = async () => {
    // Validazione base se viene inserita l'email
    if (recipientEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipientEmail)) {
      alert("Inserisci un indirizzo email valido per il destinatario.");
      return;
    }

    setLoading(true);
    try {
      // 🚀 Modificato l'endpoint per puntare alla rotta di checkout principale ed unificata
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // 🚀 Inviamo i parametri corretti mappati su quelli che si aspetta il backend in checkout.txt
        body: JSON.stringify({ 
          isGiftCard: true,
          giftCardAmount: selectedCard.amount,
          buyerName: buyerName.trim(),
          recipientEmail: recipientEmail.trim(),
          giftMessage: giftMessage.trim()
        }),
      });

      const data = await response.json();

      if (response.ok && data.url) {
        // Rimanda l'utente alla pagina di pagamento sicuro di Stripe
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
            <div className="w-full aspect-[1.6/1] rounded-[2rem] p-8 text-white shadow-2xl overflow-hidden relative transition-all bg-gradient-to-br from-indigo-900 to-slate-900">
              
              {/* Sfondo dinamico basato sull'immagine del taglio selezionato */}
              <div 
                className="absolute inset-0 bg-cover bg-center transition-all duration-300"
                style={{ backgroundImage: `url(${selectedCard.image})` }}
              />
              <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px]"></div>

              <div className="relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-start">
                  <Gift size={40} className="opacity-90" />
                  <span className="text-4xl font-black italic">€{selectedCard.amount}</span>
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
            <p className="text-center text-xs text-gray-400 italic">Anteprima della Gift Card da €{selectedCard.amount}</p>
          </div>

          {/* Pannello Configurazione con Selettore Immagini e Dedica */}
          <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-gray-100 space-y-6">
            
            {/* Scelta Taglio Tramite Miniature */}
            <div className="space-y-3">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-wider">Seleziona la Gift Card</h3>
              
              <div className="grid grid-cols-3 gap-3">
                {CARDS_DISPONIBILI.map((card) => (
                  <button
                    key={card.id}
                    type="button"
                    onClick={() => setSelectedCard(card)}
                    className={`group relative flex flex-col items-center p-2 rounded-2xl border-2 transition-all overflow-hidden ${
                      selectedCard.id === card.id 
                        ? "border-[#1e73be] bg-blue-50/50 shadow-sm" 
                        : "border-gray-100 bg-gray-50 hover:border-gray-200"
                    }`}
                  >
                    {/* Mini-anteprima immagine */}
                    <div 
                      className="w-full aspect-[1.6/1] bg-cover bg-center rounded-lg shadow-sm mb-2"
                      style={{ backgroundImage: `url(${card.image})` }}
                    />
                    <span className={`text-sm font-black ${selectedCard.id === card.id ? "text-[#1e73be]" : "text-gray-700"}`}>
                      €{card.amount}
                    </span>
                  </button>
                ))}
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
                className="w-full bg-gray-50 px-4 py-3 rounded-xl text-sm border-2 border-transparent outline-none focus:border-[#1e73be]/20"
              />
              <input
                type="email"
                placeholder="Email del destinatario (se vuoi spedirla direttamente)"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                className="w-full bg-gray-50 px-4 py-3 rounded-xl text-sm border-2 border-transparent outline-none focus:border-[#1e73be]/20"
              />
              <textarea
                placeholder="Messaggio d'auguri..."
                value={giftMessage}
                onChange={(e) => setGiftMessage(e.target.value)}
                rows={3}
                className="w-full bg-gray-50 px-4 py-3 rounded-xl text-sm border-2 border-transparent outline-none focus:border-[#1e73be]/20 resize-none"
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
              disabled={loading}
              className="w-full bg-[#8cc665] hover:bg-[#76b054] text-white font-black py-4 rounded-xl uppercase tracking-widest transition-all shadow-lg disabled:bg-gray-200 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : `Acquista Card da €${selectedCard.amount}`}
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}