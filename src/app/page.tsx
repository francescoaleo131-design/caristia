"use client";

import { useState, useEffect } from "react";
import { Mail, Loader2, CheckCircle2, User } from "lucide-react";
import { toast } from 'sonner';
import Link from 'next/link';

import HeadOne from "@/components/main";
import Card1, { Card2, Card3 } from "@/components/maincards";
import Carosello from "@/components/nuoviArrivi";
import RecensioniGoogle from "@/components/recensioni";

export default function Home() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  useEffect(() => {
    if (status === "success") {
      toast.success("Benvenuto nella famiglia Caristia! Controlla la tua email, è appena iniziata la magia!");
    } else if (status === "error") {
      toast.error("Ops! Qualcosa è andato storto. Riprova tra un attimo.");
    }
  }, [status]);

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
          name,
          source: "homepage_newsletter"
        }),
      });

      if (res.ok) {
        setStatus("success");
        setEmail("");
        setName("");
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

        <div className="container mx-auto px-4 py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            <div><Card1 /></div>
            <div><Card2 /></div>
            <div><Card3 /></div>
          </div>
        </div>

        <div className="w-full my-12 px-0 md:px-4">
          <picture>
            <source media="(max-width: 768px)" srcSet="/mobile_divider_prodotti.webp" />
            <img
              src="/divider_prodotti.webp"
              alt="Prodotti"
              className="w-full h-[800px] md:h-[400px] object-cover"
            />
          </picture>
        </div>

        <h1 className="text-center text-4xl font-bold text-[#1e73be]">IN ARRIVO</h1>

        <div className="w-full my-5 px-4 container mx-auto">
          <picture>
            <source media="(max-width: 768px)" srcSet="/mobile_divider_newsletter.webp" />
            <img
              src="/divider_newsletter.webp"
              alt="Newsletter"
              className="w-full h-auto"
              style={{ maxHeight: "400px" }}
            />
          </picture>
        </div>

        <div className="relative py-16 bg-zinc-50/50">
          <div className="container mx-auto px-4">
            {status === "success" ? (
              <div className="max-w-md mx-auto text-center space-y-4 animate-in zoom-in-95 duration-500">
                <CheckCircle2 className="mx-auto text-green-500" size={48} />
                <h3 className="text-xl font-black text-zinc-800">Iscrizione completata!</h3>
              </div>
            ) : (
              <>
                <div className="space-y-4 mb-10">
                  <p className="text-center text-zinc-400 font-bold uppercase tracking-[0.2em] text-sm md:text-base">
                    Novità, anteprime e sorprese magiche ogni settimana!
                  </p>
                </div>

                <form onSubmit={handleSubscribe} className="flex flex-col gap-3 max-w-lg mx-auto bg-white p-6 rounded-[2.5rem] shadow-xl shadow-zinc-200/50 border border-white">

                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300" size={20} />
                    <input
                      type="text"
                      placeholder="Come possiamo chiamarti?"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-zinc-50 border-2 border-transparent focus:border-[#1e73be]/20 rounded-2xl py-4 pl-12 pr-6 font-bold outline-none transition-all"
                    />
                  </div>

                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300" size={20} />
                    <input
                      type="email"
                      required
                      placeholder="La tua email migliore..."
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-zinc-50 border-2 border-transparent focus:border-[#1e73be]/20 rounded-2xl py-4 pl-12 pr-6 font-bold outline-none transition-all text-black"
                    />
                  </div>

                  <div className="flex items-start gap-2.5 px-2 py-1">
                    <input
                      type="checkbox"
                      required
                      id="newsletter-privacy"
                      className="mt-1 shrink-0 accent-[#1e73be] cursor-pointer"
                    />
                    <label htmlFor="newsletter-privacy" className="text-xs text-zinc-500 font-semibold leading-snug cursor-pointer select-none">
                      Ho letto e accetto la <Link href="/privacy" className="text-[#1e73be] underline hover:text-blue-700 font-bold">Privacy Policy</Link> di Giocattoli Caristia. *
                    </label>
                  </div>

                  <button
                    disabled={status === "loading"}
                    className="bg-[#1e73be] text-white py-4 rounded-2xl font-black uppercase italic tracking-widest text-xs hover:scale-105 active:scale-95 transition-all shadow-lg shadow-blue-200 disabled:opacity-50 flex items-center justify-center min-w-[160px] cursor-pointer"
                  >
                    {status === "loading" ? <Loader2 className="animate-spin" size={20} /> : "Iscriviti Subito"}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>

        <div className="w-full my-5 md:my-12 px-4 container mx-auto">
          <picture>
            <source media="(max-width: 768px)" srcSet="/mobile_divider_recensioni.webp" />
            <img
              src="/divider_recensioni.webp"
              alt="Recensioni"
              className="w-full h-auto"
              style={{ maxHeight: "400px" }}
            />
          </picture>
        </div>

        <RecensioniGoogle />

        <div className="w-full my-5 md:my-12 px-4 container mx-auto">
          <img
            src="/divider_4.webp"
            alt="Promozione Giocattoli"
            className="w-full h-auto"
            style={{ maxHeight: "400px" }}
          />
        </div>

        <div className="pb-20"></div>
      </main>
    </div>
  );
}