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

  // 1. Calcolo del subtotale dei prodotti nel carrello
  const subtotale = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  // 2. Calcolo dello sconto effettivo applicabile dalla Gift Card
  const scontoGiftCard = useGiftCard 
    ? Math.min(subtotale, giftCardBalance) 
    : 0;

  // 3. Totale finale effettivo da pagare
  const totaleFinale = subtotale - scontoGiftCard;

  const handleCheckout = async () => {
    setLoading(true);
    try {
      // Se l'utente usa la gift card e c'è uno sconto, scaliamo prima il saldo sul DB
      if (scontoGiftCard > 0) {
        const res = await deductGiftCardBalanceAction(scontoGiftCard);
        if (res?.error) {
          toast.error(res.error);
          setLoading(false);
          return; // Blocca il processo se non ci sono abbastanza fondi reali
        }
      }

      // Se la gift card copre l'INTERO carrello, non serve andare su Stripe!
      if (totaleFinale === 0) {
        toast.success("Ordine completato con successo usando il tuo credito!");
        clearCart();
        // Qui puoi fare un router.push('/ordine-confermato') o simile
        setLoading(false);
        return;
      }

      // Altrimenti, procediamo con il pagamento Stripe tradizionale per la differenza
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          items,
          discountApplied: scontoGiftCard // Passiamo l'informazione anche alle API se necessario
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
          
          {/* ELENCO PRODOTTI */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-6">
                <img src={item.image_url} alt={item.name} className="w-20 h-20 object-contain" />
                <div className="flex-grow">
                  <h2 className="text-lg font-bold">{item.name}</h2>
                  <p className="text-blue-600 font-semibold">{item.price.toFixed(2)}€</p>
                </div>
                <div className="flex items-center border border-slate-200 rounded-lg bg-white">
                  {/* Corretto bug: passavi -1 e 1 cumulativi, l'hook di solito richiede la quantità esatta o una funzione relativa */}
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

          {/* SIDEBAR RIEPILOGO */}
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm sticky top-8 space-y-6">
              <h2 className="text-2xl font-bold">Riepilogo Ordine</h2>
              
              {/* INTERFACCIA SELEZIONE CREDITO WALLET */}
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

              {/* DETTAGLIO COSTI */}
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

              {/* BOTTONE DINAMICO */}
              <button
                onClick={handleCheckout}
                disabled={loading}
                className={`w-full py-4 rounded-xl font-bold text-white transition-all ${
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