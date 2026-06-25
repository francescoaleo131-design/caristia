"use client";
import { useCart } from '../shop/useCart';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';
import { deductGiftCardBalanceAction } from '@/lib/wallet';
import { Wallet } from 'lucide-react';

interface CarrelloClientProps {
  giftCardBalance: number;
}

export default function CarrelloClient({ giftCardBalance }: CarrelloClientProps) {
  const { items, updateQuantity, removeItem, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [useGiftCard, setUseGiftCard] = useState(true);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const subtotale = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const scontoGiftCard = useGiftCard 
    ? Math.min(subtotale, giftCardBalance) 
    : 0;

  const totaleFinale = subtotale - scontoGiftCard;

  const handleCheckout = async () => {
    if (!acceptedTerms) {
      toast.error("Devi accettare i Termini e Condizioni e la Politica di Reso prima di procedere al pagamento.");
      return;
    }
    setLoading(true);
    try {
      if (scontoGiftCard > 0) {
        const res = await deductGiftCardBalanceAction(scontoGiftCard);
        if (res?.error) {
          toast.error(res.error);
          setLoading(false);
          return; 
        }
      }

      if (totaleFinale === 0) {
        toast.success("Ordine completato con successo usando il tuo credito!");
        clearCart();
        setLoading(false);
        return;
      }

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          items,
          discountApplied: scontoGiftCard 
        }),
      });

      const data = await response.json();

      if (data.error) {
        toast.error(data.error);
        setLoading(false);
        return;
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error("Impossibile creare la sessione di pagamento.");
      }
    } catch (err) {
      toast.error("Si è verificato un errore durante il checkout.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <h2 className="text-2xl font-bold mb-4">Il tuo carrello è vuoto</h2>
        <Link href="/shop" className="text-blue-600 font-bold hover:underline">Torna allo shop</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-slate-800 mb-10">Il tuo Carrello</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-6">
                <img src={item.image_url} alt={item.name} className="w-20 h-20 object-contain" />
                <div className="flex-grow">
                  <h2 className="text-lg font-bold">{item.name}</h2>
                  <p className="text-blue-600 font-semibold">{item.price.toFixed(2)}€</p>
                </div>
                <div className="flex items-center border border-slate-200 rounded-lg bg-white">
                  <button onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))} className="px-3 py-1 hover:bg-slate-50">-</button>
                  <span className="px-4 font-bold">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-3 py-1 hover:bg-slate-50">+</button>
                </div>
                <button onClick={() => removeItem(item.id)} className="text-slate-400 hover:text-red-500 text-sm font-medium transition-colors">
                  Rimuovi
                </button>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm sticky top-8 space-y-6">
              <h2 className="text-2xl font-bold">Riepilogo Ordine</h2>
              
              {giftCardBalance > 0 && (
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Wallet className="text-green-600" size={20} />
                    <div className="leading-tight">
                      <p className="text-xs font-bold text-slate-700">Usa Credito Portafoglio</p>
                      <p className="text-[11px] text-slate-400 font-semibold mt-0.5">Disponibili: {giftCardBalance.toFixed(2)}€</p>
                    </div>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={useGiftCard} 
                    onChange={(e) => setUseGiftCard(e.target.checked)}
                    disabled={loading}
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                </div>
              )}

              <div className="space-y-4">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotale</span>
                  <span>{subtotale.toFixed(2)}€</span>
                </div>

                {scontoGiftCard > 0 && (
                  <div className="flex justify-between text-green-600 font-semibold bg-green-50 px-3 py-2 rounded-xl border border-green-100">
                    <span>Sconto Gift Card</span>
                    <span>- {scontoGiftCard.toFixed(2)}€</span>
                  </div>
                )}

                <div className="flex justify-between text-slate-600">
                  <span>Spedizione</span>
                  <span className="text-green-600 font-medium">Gratis</span>
                </div>

                <div className="border-t border-slate-100 pt-4 flex justify-between items-center">
                  <span className="text-lg font-bold">Totale da pagare</span>
                  <span className="text-2xl font-bold text-blue-600">{totaleFinale.toFixed(2)}€</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 px-1 py-1">
                <input 
                  type="checkbox" 
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  id="checkout-terms-checkbox"
                  className="mt-1 shrink-0 accent-blue-600 cursor-pointer" 
                />
                <label htmlFor="checkout-terms-checkbox" className="text-xs text-slate-500 font-semibold leading-snug cursor-pointer select-none">
                  Accetto i <Link href="/tos" className="text-blue-600 underline font-bold hover:text-blue-750">Termini e Condizioni</Link> e la <Link href="/return_policy" className="text-blue-600 underline font-bold hover:text-blue-750">Politica di Reso</Link> di Giocattoli Caristia. *
                </label>
              </div>

              <button
                onClick={handleCheckout}
                disabled={loading}
                className={`w-full py-4 rounded-xl font-bold text-white transition-all cursor-pointer ${
                  loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-blue-200'
                }`}
              >
                {loading ? 'Elaborazione...' : totaleFinale === 0 ? 'Conferma Ordine Gratuito' : 'Procedi al pagamento'}
              </button>
              
              <p className="text-center text-slate-400 text-sm">
                {totaleFinale === 0 ? 'Transazione sicura protetta dal tuo saldo' : 'Pagamenti sicuri crittografati con Stripe'}
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}