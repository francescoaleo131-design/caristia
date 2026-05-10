"use client" // Necessario per gestire lo stato del form
import { useState } from "react";
import Image from "next/image";
import HeadOne from "@/components/main";
import Card1, { Card2, Card3 } from "@/components/maincards"; 
import Carosello from "@/components/nuoviArrivi";
import { Mail, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from 'sonner';
import RecensioniGoogle from "@/components/recensioni";


export default function Home() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setStatus("loading");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email,
          source: "homepage_newsletter" 
        }),
      });

      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch (err) {
      setStatus("error");
    }
  };

  return (
    <div className="bg-zinc-50 font-sans">
      <main className="min-h-screen bg-white">
        <HeadOne />

        {/* GRIGLIA CARD */}
        <div className="container mx-auto px-4 py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            <div><Card1 /></div>
            <div><Card2 /></div>
            <div><Card3 /></div>
          </div>
        </div>

        {/* --- IMMAGINE PROMO --- */}
        <div className="w-full my-12 px-4 container mx-auto">
          <img 
            src="/divider_prodotti.png" 
            alt="Prodotti"
            className="w-full h-auto"
            style={{ maxHeight: "400px" }}
          />
        </div>

        <Carosello />

        <div className="w-full my-5 px-4 container mx-auto">
          <img 
            src="/divider_newsletter.png" 
            alt="Newsletter"
            className="w-full h-auto "
            style={{ maxHeight: "400px" }}
          />
        </div>

        {/* --- SEZIONE NEWSLETTER --- */} 
        <div className="relative py-16 bg-zinc-50/50">
          <div className="container mx-auto px-4">
            {status === "success" ? (
              <div className="max-w-md mx-auto text-center space-y-4 animate-in zoom-in-95 duration-500">
           toast.success("Benvenuto nella famiglia caristia! Controlla la tua email, è appena iniziata la magia!")
              </div>
            ) : (
              <>
                <div className="space-y-4 mb-10">
                  <p className="text-center text-zinc-400 font-bold uppercase tracking-[0.2em] text-sm md:text-base">
                    Novità, anteprime e sorprese magiche ogni settimana!
                  </p>
                </div>

                <form onSubmit={handleSubscribe} className="flex flex-col md:flex-row gap-3 max-w-2xl mx-auto bg-white p-4 rounded-[2.5rem] shadow-xl shadow-zinc-200/50 border border-white">
                  <div className="relative flex-1">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300" size={20} />
                    <input 
                      type="email" 
                      required
                      placeholder="La tua email migliore..."
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-zinc-50 border-2 border-transparent focus:border-[#1e73be]/20 rounded-2xl py-4 pl-12 pr-6 font-bold outline-none transition-all"
                    />
                  </div>
                  <button 
                    disabled={status === "loading"}
                    className="bg-[#1e73be] text-white px-10 py-4 rounded-2xl font-black uppercase italic tracking-widest text-xs hover:scale-105 active:scale-95 transition-all shadow-lg shadow-blue-200 disabled:opacity-50 flex items-center justify-center min-w-[160px]"
                  >
                    {status === "loading" ? <Loader2 className="animate-spin" size={20} /> : "Iscriviti Subito"}
                  </button>
                </form>
                
                {status === "error" && (
                  
                    toast.error("Ops! Qualcosa è andato storto. Riprova tra un attimo.")
                  
                )}
              </>
            )}
          </div>
        </div>

        <div className="w-full my-12 px-4 container mx-auto">
          <img 
            src="/divider_recensioni.png" 
            alt="Recensioni"
            className="w-full h-auto"
            style={{ maxHeight: "400px" }}
          />
        </div>

        {/* RECENSIONI */}
        <div className="mx-auto w-full max-w-5xl px-10 py-10">
        </div>
        <RecensioniGoogle />
        
        <div className="w-full my-12 px-4 container mx-auto">
          <img 
            src="/divider_4.png" 
            alt="Promozione Giocattoli"
            className="w-full h-auto"
            style={{ maxHeight: "400px" }}
          />
        </div>



        {/* PADDING FINALE PER IL FOOTER */}
        <div className="pb-20"></div>
      </main>
    </div>
  );
}