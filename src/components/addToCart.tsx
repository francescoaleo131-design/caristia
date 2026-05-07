"use client";
import { useCart } from "@/app/shop/useCart";
import { toast } from "sonner";

export default function AddToCartButton({ prodotto }: { prodotto: any }) {
  const addItem = useCart((state) => state.addItem);

  // Creiamo una funzione per gestire entrambe le azioni
  const handleAddToCart = () => {
    addItem(prodotto); // 1. Aggiunge al carrello
    toast.success(`${prodotto.name} aggiunto al carrello!`); // 2. Mostra il toast
  };

  return (
    <button 
      onClick={handleAddToCart} // Colleghiamo la funzione qui
      className="flex-grow bg-blue-600 text-white font-bold py-5 rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95"
    >
      Aggiungi al carrello
    </button>
  );
}