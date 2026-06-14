import { Suspense } from "react";
import { getUserGiftCardBalance } from "@/lib/wallet";
import CarrelloClient from "./CarrelloClient";

export const dynamic = 'force-dynamic';

export default async function CarrelloPage() {
  const giftCardBalance = await getUserGiftCardBalance();

  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-zinc-400 font-medium animate-pulse">Caricamento carrello...</p>
      </div>
    }>
      <CarrelloClient giftCardBalance={giftCardBalance} />
    </Suspense>
  );
}