"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/supabase";
import Link from "next/link";
import { 
  Camera, Store, Power, Loader2, ArrowDownCircle, 
  AlertCircle, RefreshCw, Settings, Calendar 
} from "lucide-react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { toast } from "sonner";

export default function AdminCassa() {
  const [code, setCode] = useState("");
  const [cardData, setCardData] = useState<any>(null);
  const [amountToSubtract, setAmountToSubtract] = useState("");
  const [loading, setLoading] = useState(false);
  const [showScanner, setShowScanner] = useState(false);

  // --- LOGICA SCANNER OTTIMIZZATA PER SMARTPHONE ---
  useEffect(() => {
    let scanner: Html5QrcodeScanner | null = null;

    if (showScanner) {
      // Funzione responsive per calcolare la dimensione ottimale del mirino sul telefono
      const qrBoxFunction = (viewfinderWidth: number, viewfinderHeight: number) => {
        const minEdgePercentage = 0.70; // 70% dello schermo mobile
        const minEdgeSize = Math.min(viewfinderWidth, viewfinderHeight);
        const qrboxSize = Math.floor(minEdgeSize * minEdgePercentage);
        return {
          width: qrboxSize < 250 ? 230 : 250,
          height: qrboxSize < 250 ? 230 : 250
        };
      };

      // Inizializzazione dello scanner
      scanner = new Html5QrcodeScanner(
        "reader", 
        { 
          fps: 15, // Leggermente più alto per una scansione più reattiva in movimento
          qrbox: qrBoxFunction,
          // Forza l'uso della fotocamera posteriore sui dispositivi mobili
          videoConstraints: { facingMode: "environment" },
          rememberLastUsedCamera: true
        }, 
        /* verbose= */ false
      );

      scanner.render(
        (decodedText) => {
          // Quando inquadra il codice/QR-Code:
          const cleanedCode = decodedText.trim().toUpperCase();
          setCode(cleanedCode);
          toast.success(`Codice rilevato: ${cleanedCode}`);
          
          // Chiudiamo lo scanner in modo sicuro
          if (scanner) {
            scanner.clear().then(() => {
              setShowScanner(false);
            }).catch((err) => {
              console.error("Errore pulizia scanner:", err);
              setShowScanner(false);
            });
          }
        }, 
        (error) => {
          // Silenziamo i log continui di mancato rilevamento frame per non intasare la console del telefono
        }
      );
    }

    return () => { 
      if (scanner) {
        scanner.clear().catch(err => console.error("Errore distruzione scanner:", err));
      }
    };
  }, [showScanner]);

  // --- CONTROLLO CARTA ---
  const checkCard = async () => {
    if (!code) return;
    setLoading(true);
    setCardData(null); 

    const { data, error } = await supabase
      .from('gift_cards')
      .select('*')
      .ilike('code', code.trim())
      .single();

    if (error || !data) {
      toast.error("Gift Card non trovata", {
        description: "Il codice inserito non esiste nel database."
      });
    } else {
      const isExpired = new Date() > new Date(data.expire_date);
      setCardData({ ...data, isExpired });

      if (isExpired) {
        toast.error("GIFT CARD SCADUTA", {
          description: `Il termine di validità è scaduto il ${new Date(data.expire_date).toLocaleDateString()}.`
        });
      } else {
        toast.success("Carta caricata con successo!");
      }
    }
    setLoading(false);
  };

  // --- ATTIVAZIONE CARTA ---
  const activateCard = async () => {
    if (!cardData) return;
    setLoading(true);

    const { error } = await supabase
      .from('gift_cards')
      .update({ 
        is_active: true, 
        activated_at: new Date().toISOString() 
      })
      .eq('id', cardData.id);

    if (!error) {
      toast.success("Gift Card Attivata!");
      setCardData({ ...cardData, is_active: true });
    } else {
      toast.error("Errore durante l'attivazione");
    }
    setLoading(false);
  };

  // --- TRANSAZIONE ---
  const handleTransaction = async () => {
    if (!cardData || !amountToSubtract || cardData.isExpired) return;
    
    const subtractValue = parseFloat(amountToSubtract.replace(',', '.'));
    if (isNaN(subtractValue) || subtractValue <= 0) return toast.warning("Importo non valido");
    if (subtractValue > cardData.current_balance) return toast.error("Credito insufficiente");

    setLoading(true);
    const newBalance = parseFloat((cardData.current_balance - subtractValue).toFixed(2));

    const { data, error } = await supabase
      .from('gift_cards')
      .update({ current_balance: newBalance })
      .eq('id', cardData.id)
      .select(); 

    if (error) {
      toast.error("Errore Database: " + error.message);
    } else if (data) {
      toast.success("Pagamento confermato!", {
        description: `Saldo aggiornato: €${newBalance.toFixed(2)}`
      });
      setCardData({ ...data[0], isExpired: false }); // Aggiorna lo stato locale col record restituito
      setAmountToSubtract("");
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-zinc-50 py-12 px-4 font-sans text-zinc-900">
      <div className="max-w-xl mx-auto space-y-8">
        
        {/* HEADER */}
        <div className="text-center space-y-3 relative">
          <Link 
            href="/admin/generate" 
            className="absolute right-0 top-0 p-3 bg-white rounded-2xl shadow-sm border border-zinc-100 text-zinc-400 hover:text-[#1e73be] transition-colors"
          >
            <Settings size={20} />
          </Link>

          <div className="bg-white w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto shadow-xl shadow-blue-100 border border-zinc-100">
            <Store className="text-[#1e73be]" size={36} />
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tighter">
            Terminale <span className="text-[#1e73be]">Cassa</span>
          </h1>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Giocattoli Caristia • Gestione Interna</p>
        </div>

        {/* BOX DI RICERCA / SCANNER */}
        <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl shadow-zinc-200/50 border border-white">
          {!showScanner ? (
            <div className="space-y-6">
              
              {/* Contenitore Input Relativo con Icona interna */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-zinc-400 ml-2 tracking-widest block">
                  Inserisci o Scansiona il Codice
                </label>
                
                <div className="relative flex items-center">
                  <input 
                    type="text" 
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    placeholder="CODICE GIFT CARD"
                    className="w-full bg-zinc-50 border-2 border-zinc-100 rounded-2xl p-5 pr-16 text-xl font-mono uppercase focus:border-[#1e73be] outline-none transition-all"
                  />
                  
                  {/* Pulsante con Icona Fotocamera posizionato dentro l'input */}
                  <button 
                    type="button"
                    onClick={() => setShowScanner(true)} 
                    className="absolute right-3 p-3 bg-[#1e73be]/10 text-[#1e73be] rounded-xl hover:bg-[#1e73be]/20 active:scale-95 transition-all z-10"
                    title="Apri fotocamera"
                  >
                    <Camera size={24} />
                  </button>
                </div>
              </div>

              {/* Pulsante di Verifica manuale */}
              <button 
                onClick={checkCard} 
                disabled={loading || !code}
                className="w-full bg-[#1e73be] text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-blue-200 disabled:opacity-50 transition-all flex items-center justify-center"
              >
                {loading ? <Loader2 className="animate-spin" /> : "Verifica Carta"}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Finestra dello Scanner attiva */}
              <div className="overflow-hidden rounded-3xl bg-zinc-900 text-white border-4 border-zinc-100">
                <div id="reader" className="w-full"></div>
              </div>
              <button 
                onClick={() => setShowScanner(false)} 
                className="w-full bg-red-50 text-red-500 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest active:scale-95 transition-all"
              >
                Annulla Scanner
              </button>
            </div>
          )}
        </div>

        {/* DETTAGLI E OPERAZIONI */}
        {cardData && (
          <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl shadow-zinc-200/50 border border-white animate-in zoom-in-95 duration-300">
            
            {cardData.isExpired ? (
              <div className="text-center space-y-6">
                <div className="bg-red-50 text-red-600 p-6 rounded-3xl border border-red-100">
                  <AlertCircle className="mx-auto mb-2" size={32} />
                  <p className="text-sm font-black uppercase tracking-widest">Gift Card Scaduta</p>
                  <p className="text-[10px] font-medium opacity-80 mt-1">
                    Validità terminata il {new Date(cardData.expire_date).toLocaleDateString()}
                  </p>
                </div>
                <div className="opacity-30 grayscale">
                   <p className="text-4xl font-black text-zinc-400">€{cardData.current_balance.toFixed(2)}</p>
                   <p className="text-[9px] font-black uppercase text-zinc-300 mt-1">Saldo Non Utilizzabile</p>
                </div>
                <button 
                  onClick={() => {setCardData(null); setCode("");}}
                  className="w-full bg-zinc-100 text-zinc-500 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest"
                >
                  Nuova Scansione
                </button>
              </div>
            ) : 
            
            !cardData.is_active ? (
              <div className="text-center space-y-6">
                <div className="bg-amber-50 text-amber-600 p-6 rounded-3xl border border-amber-100">
                  <AlertCircle className="mx-auto mb-2" size={32} />
                  <p className="text-[10px] font-black uppercase tracking-widest leading-relaxed">
                    Questa Gift Card non è ancora attiva.
                  </p>
                </div>
                <div className="space-y-1">
                   <p className="text-4xl font-black text-zinc-300">€{cardData.initial_balance.toFixed(2)}</p>
                   <p className="text-[9px] font-black uppercase text-zinc-300">Valore Nominale</p>
                </div>
                <button 
                  onClick={activateCard}
                  disabled={loading}
                  className="w-full bg-[#8cc665] text-white py-6 rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-green-100 flex items-center justify-center gap-3"
                >
                  {loading ? <Loader2 className="animate-spin" /> : <><Power size={18} /> Attiva Ora</>}
                </button>
              </div>
            ) : (
              
              <div className="space-y-8">
                <div className="text-center space-y-1">
                  <div className="flex flex-col gap-2 items-center">
                    <span className="text-[9px] font-black uppercase bg-[#8cc665]/10 text-[#8cc665] px-4 py-1 rounded-full">Saldo Disponibile</span>
                    <div className="flex items-center gap-1 text-zinc-400">
                      <Calendar size={12} />
                      <span className="text-[9px] font-bold uppercase">Scadenza: {new Date(cardData.expire_date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center gap-1 text-[#1e73be] mt-4">
                    <span className="text-2xl font-black">€</span>
                    <span className="text-6xl font-black tracking-tighter">{cardData.current_balance.toFixed(2)}</span>
                  </div>
                </div>

                <div className="space-y-4 pt-6 border-t border-dashed border-zinc-100">
                  <div className="relative">
                    <ArrowDownCircle className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-300" size={24} />
                    <input 
                      type="text" 
                      inputMode="decimal"
                      value={amountToSubtract}
                      onChange={(e) => setAmountToSubtract(e.target.value)}
                      placeholder="Importo scontrino"
                      className="w-full bg-zinc-50 border-2 border-transparent focus:border-[#8cc665]/20 rounded-2xl py-6 pl-16 pr-6 text-3xl font-black outline-none transition-all placeholder:text-zinc-200"
                    />
                  </div>
                  <button 
                    onClick={handleTransaction}
                    disabled={loading || !amountToSubtract}
                    className="w-full bg-[#8cc665] text-white py-6 rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-green-200 flex items-center justify-center"
                  >
                    {loading ? <Loader2 className="animate-spin" /> : "Conferma Pagamento"}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* FOOTER */}
        <div className="flex flex-col items-center gap-4">
          <p className="text-zinc-300 text-[9px] font-black uppercase tracking-[0.3em]">Sicurezza Crittografata Caristia</p>
          {cardData && (
            <button 
              onClick={() => {setCardData(null); setCode(""); setAmountToSubtract("");}} 
              className="flex items-center gap-2 text-[10px] font-black uppercase text-zinc-400 hover:text-zinc-600 transition-colors"
            >
              <RefreshCw size={12} /> Nuova Operazione
            </button>
          )}
        </div>
      </div>
    </div>
  );
}