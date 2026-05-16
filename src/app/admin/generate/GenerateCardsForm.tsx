"use client";
import { useState } from "react"
import { supabase } from "@/lib/supabase/supabase"
import { generateSecureGiftCode } from "@/lib/utils/giftcard-utils"
import { Ticket, ArrowLeft, Plus, Check, Loader2 } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"

export const dynamic = 'force-dynamic';

export default function GenerateCardsForm() {
  const [quantity, setQuantity] = useState(10)
  const [amount, setAmount] = useState(20) 
  const [loading, setLoading] = useState(false)
  const [generatedCards, setGeneratedCards] = useState<any[]>([])

  const standardAmounts = [25, 50, 100];

  const handleGenerate = async () => {
    setLoading(true);
    const newCards = [];
    const timestamp = new Date().toLocaleString('it-IT').replace(/\//g, '-').replace(/:/g, '.');

    for (let i = 0; i < quantity; i++) {
      const code = generateSecureGiftCode();
      newCards.push({
        code: code,
        initial_balance: amount,
        current_balance: amount,
        is_active: false,
        is_physical: true,
      });
    }

    const { data, error } = await supabase
      .from('gift_cards')
      .insert(newCards)
      .select();

    if (error) {
      toast.error("Errore database: " + error.message);
    } else if (data) {
      setGeneratedCards(data);
      toast.success(`${quantity} Gift Card da ${amount}€ generate!`);

      const fileHeader = `LOTTO GIOCATTOLI CARISTIA\nData: ${timestamp}\nTaglio: €${amount}\nQuantità: ${quantity}\n------------------------------------------\n\n`;
      const fileContent = data.map(c => `CODICE: ${c.code}  |  VALORE: €${c.initial_balance}`).join("\n");
      
      const blob = new Blob([fileHeader + fileContent], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `lotto_${amount}euro_${timestamp.split(',')[0]}.txt`;
      a.click();
      window.URL.revokeObjectURL(url);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-zinc-50 py-12 px-4 font-sans text-zinc-900">
      <div className="max-w-xl mx-auto space-y-8">
        
        <Link href="/admin/giftcard" className="flex items-center gap-2 text-zinc-400 hover:text-[#1e73be] transition-colors font-black uppercase text-[10px] tracking-widest w-fit">
          <ArrowLeft size={16} /> Torna al Terminale Cassa
        </Link>

        <div className="flex flex-col items-center text-center space-y-4">
          <div className="bg-white w-20 h-20 rounded-[2rem] flex items-center justify-center shadow-xl shadow-blue-100 border border-zinc-100">
            <Ticket className="text-[#1e73be]" size={40} />
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-black uppercase tracking-tighter">
              Generatore <span className="text-[#1e73be]">Lotti</span>
            </h1>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">
              Creazione Gift Card Fisiche
            </p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl shadow-zinc-200/50 border border-white">
          <div className="space-y-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase text-zinc-400 ml-2 tracking-widest text-center block">
                Seleziona il valore della card
              </label>
              <div className="grid grid-cols-3 gap-3">
                {standardAmounts.map((val) => (
                  <button
                    key={val}
                    onClick={() => setAmount(val)}
                    className={`relative py-6 rounded-2xl font-black text-xl transition-all border-2 ${
                      amount === val 
                      ? "border-[#1e73be] bg-[#1e73be] text-white shadow-lg shadow-blue-200 scale-[1.05] z-10" 
                      : "border-zinc-100 bg-zinc-50 text-zinc-400 hover:border-zinc-200"
                    }`}
                  >
                    €{val}
                    {amount === val && <Check size={16} className="absolute top-2 right-2" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase text-zinc-400 ml-2 tracking-widest text-center block">
                Quantità da generare
              </label>
              <input 
                type="number" 
                min="1"
                max="100"
                value={quantity} 
                onChange={e => setQuantity(Math.max(1, Number(e.target.value)))} 
                className="w-full bg-zinc-50 p-5 rounded-2xl outline-none border-2 border-zinc-100 focus:border-blue-100 font-bold text-xl text-center" 
              />
            </div>

            <button 
              onClick={handleGenerate} 
              disabled={loading} 
              className="w-full bg-[#1e73be] text-white py-6 rounded-[2rem] font-black uppercase tracking-[0.2em] shadow-xl shadow-blue-100 disabled:opacity-50 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
            >
              {loading ? <Loader2 className="animate-spin" /> : (
                <><Plus size={20} /> Genera {quantity} Card da {amount}€</>
              )}
            </button>
          </div>
        </div>

        {generatedCards.length > 0 && (
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl animate-in zoom-in-95 border border-white">
            <h2 className="font-bold uppercase text-[10px] tracking-[0.2em] text-zinc-400 mb-6 text-center">
              Lotto salvato e pronto per la stampa
            </h2>
            <div className="space-y-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
              {generatedCards.map((card) => (
                <div key={card.id} className="flex justify-between p-4 bg-zinc-50 rounded-2xl font-mono text-sm border border-zinc-100">
                  <span className="text-zinc-500 font-bold">{card.code}</span>
                  <span className="font-black text-[#1e73be]">€{card.initial_balance.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}