'use client';

import { useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle2, ShoppingBag, Calendar, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '../shop/useCart';

function SuccessContent() {
  const searchParams = useSearchParams();
  const session_id = searchParams.get('session_id');
  const type = searchParams.get('type');
  const { clearCart } = useCart();

  useEffect(() => {
    // Clear cart on successful checkout
    if (session_id && type !== 'mascotte') {
      clearCart();
    }
  }, [session_id, type, clearCart]);

  const isMascotte = type === 'mascotte';

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12 bg-white">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ 
            type: "spring",
            stiffness: 260,
            damping: 20,
            delay: 0.2 
          }}
          className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8"
        >
          <CheckCircle2 className="w-12 h-12 text-green-500" />
        </motion.div>

        <h1 className="text-4xl font-bold tracking-tight text-zinc-900 mb-4">
          Pagamento Confermato!
        </h1>
        
        <p className="text-lg text-zinc-500 mb-10 leading-relaxed">
          {isMascotte 
            ? "La tua prenotazione della mascotte è stata ricevuta correttamente. Riceverai presto un'email con tutti i dettagli."
            : "Grazie per il tuo acquisto! Il tuo ordine è stato ricevuto e stiamo già lavorando per spedirlo il prima possibile."}
        </p>

        <div className="space-y-4">
          <Link 
            href="/"
            className="group flex items-center justify-center gap-2 w-full py-4 bg-zinc-900 text-white rounded-2xl font-bold transition-all hover:bg-zinc-800 active:scale-[0.98]"
          >
            Torna alla Home
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Link>

          {!isMascotte && (
            <Link 
              href="/shop"
              className="flex items-center justify-center gap-2 w-full py-4 bg-zinc-100 text-zinc-900 rounded-2xl font-bold transition-all hover:bg-zinc-200 active:scale-[0.98]"
            >
              <ShoppingBag className="w-5 h-5" />
              Continua lo Shopping
            </Link>
          )}

          {isMascotte && (
            <Link 
              href="/mascotte"
              className="flex items-center justify-center gap-2 w-full py-4 bg-zinc-100 text-zinc-900 rounded-2xl font-bold transition-all hover:bg-zinc-200 active:scale-[0.98]"
            >
              <Calendar className="w-5 h-5" />
              Vedi altre Mascotte
            </Link>
          )}
        </div>

        <div className="mt-12 pt-8 border-t border-zinc-100">
          <p className="text-sm text-zinc-400">
            ID Sessione: <span className="font-mono text-xs">{session_id?.substring(0, 20)}...</span>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-zinc-900"></div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
