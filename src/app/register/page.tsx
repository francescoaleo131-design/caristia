"use client"
import { useState } from "react"
import { supabase } from "@/lib/supabase/supabase"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { UserPlus, Mail, Lock, User } from "lucide-react"
import { toast } from 'sonner';

export default function RegisterPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [loading, setLoading] = useState(false)
  const [marketingAccepted, setMarketingAccepted] = useState(false)
  const router = useRouter()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: {
          full_name: fullName,
          marketing_accepted: marketingAccepted,
        },
      },
    })

    if (error) {
      toast.error("Errore: " + error.message)
      setLoading(false)
    } else {
      toast.success("Registrazione completata! Controlla l'email per confermare.")
      
      setTimeout(() => {
        router.push("/login")
      }, 3000)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl p-8 md:p-12 border-b-8 border-[#8cc665]">
        
        <div className="text-center mb-10">
          <div className="bg-[#8cc665]/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <UserPlus className="text-[#8cc665]" size={32} />
          </div>
          <h1 className="text-3xl font-black text-[#1e73be] uppercase leading-tight">
            Crea il tuo <span className="text-[#8cc665]">Account</span>
          </h1>
          <p className="text-gray-500 font-medium mt-2">Entra nel magico mondo di Giocattoli Caristia!</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-5">
          <div className="relative">
            <label className="text-xs font-black uppercase text-gray-400 ml-2 mb-1 block tracking-widest">Nome e Cognome</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                required 
                placeholder="es. Mario Rossi"
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#8cc665] transition-all text-black" 
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
          </div>

          <div className="relative">
            <label className="text-xs font-black uppercase text-gray-400 ml-2 mb-1 block tracking-widest">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="email" 
                required 
                placeholder="mario@esempio.it"
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#1e73be] transition-all text-black" 
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="relative">
            <label className="text-xs font-black uppercase text-gray-400 ml-2 mb-1 block tracking-widest">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="password" 
                required 
                placeholder="••••••••"
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#1e73be] transition-all text-black" 
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-start gap-2.5">
              <input 
                type="checkbox" 
                required 
                id="register-terms-privacy"
                className="mt-1 shrink-0 accent-[#1e73be] cursor-pointer" 
              />
              <label htmlFor="register-terms-privacy" className="text-xs text-gray-500 font-semibold leading-snug cursor-pointer select-none">
                Accetto i <Link href="/tos" className="text-[#1e73be] underline hover:text-blue-700 font-bold">Termini e Condizioni</Link> e la <Link href="/privacy" className="text-[#1e73be] underline hover:text-blue-700 font-bold">Privacy Policy</Link>. *
              </label>
            </div>
            
            <div className="flex items-start gap-2.5">
              <input 
                type="checkbox" 
                id="register-marketing"
                checked={marketingAccepted}
                onChange={(e) => setMarketingAccepted(e.target.checked)}
                className="mt-1 shrink-0 accent-[#1e73be] cursor-pointer" 
              />
              <label htmlFor="register-marketing" className="text-xs text-gray-500 font-semibold leading-snug cursor-pointer select-none">
                Desidero ricevere newsletter commerciali e offerte speciali. (Facoltativo)
              </label>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#1e73be] hover:bg-[#8cc665] text-white font-black py-5 rounded-2xl uppercase tracking-[0.2em] transition-all shadow-lg active:scale-95 disabled:opacity-50 mt-4 cursor-pointer"
          >
            {loading ? "Elaborazione..." : "Registrati ora"}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 font-medium">
            Hai già un account?{" "}
            <Link href="/login" className="text-[#1e73be] font-black hover:underline underline-offset-4">
              Accedi qui
            </Link>
          </p>
        </div>

      </div>
    </div>
  )
}