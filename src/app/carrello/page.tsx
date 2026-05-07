"use client";
import { useCart } from '../shop/useCart';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';

export default function CarrelloPage() {
  const { items, updateQuantity, removeItem } = useCart();
  const [loading, setLoading] = useState(false);
  const totale = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
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
                <div className="flex items-center border border-slate-200 rounded-lg">
                  <button onClick={() => updateQuantity(item.id, -1)} className="px-3 py-1">-</button>
                  <span className="px-4 font-bold">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, 1)} className="px-3 py-1">+</button>
                </div>
                <button onClick={() => removeItem(item.id)} className="text-slate-300 hover:text-red-500">
                  Rimuovi
                </button>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm sticky top-8">
              <h2 className="text-2xl font-bold mb-6">Riepilogo Ordine</h2>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotale</span>
                  <span>{totale.toFixed(2)}€</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Spedizione</span>
                  <span className="text-green-600 font-medium">Gratis</span>
                </div>
                <div className="border-t border-slate-100 pt-4 flex justify-between items-center">
                  <span className="text-lg font-bold">Totale</span>
                  <span className="text-2xl font-bold text-blue-600">{totale.toFixed(2)}€</span>
                </div>
              </div>
              <button
                onClick={handleCheckout}
                disabled={loading}
                className={`w-full py-4 rounded-xl font-bold text-white transition-all ${
                  loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-blue-200'
                }`}
              >
                {loading ? 'Elaborazione...' : 'Procedi al pagamento'}
              </button>
              <p className="text-center text-slate-400 text-sm mt-4">
                Pagamenti sicuri crittografati con Stripe
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}