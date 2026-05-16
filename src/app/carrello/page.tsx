import { Suspense } from "react";
import { getUserGiftCardBalance } from "@/lib/wallet";
import CarrelloClient from "./CarrelloClient";

// Forza la rotta a non essere statica a livello globale
export const dynamic = 'force-dynamic';

export default async function CarrelloPage() {
  // Recupera il saldo reale lato server
  const giftCardBalance = await getUserGiftCardBalance();

  return (
    // Il Suspense Boundary risolve istantaneamente l'errore di CSR bailout / useSearchParams
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-zinc-400 font-medium animate-pulse">Caricamento carrello...</p>
      </div>
    }>
      <CarrelloClient giftCardBalance={giftCardBalance} />
    </Suspense>
  );
}