import { Suspense } from "react";
import GenerateCardsForm from "@/app/admin/generate/GenerateCardsForm";

export default function GenerateCardsPage() {
  return (
    <Suspense 
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-zinc-50">
          <p className="text-zinc-400 font-medium animate-pulse">Caricamento generatore...</p>
        </div>
      }
    >
      <GenerateCardsForm />
    </Suspense>
  );
}