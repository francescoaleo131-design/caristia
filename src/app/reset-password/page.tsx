"use client"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase/supabase"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Loader2, ShieldCheck } from "lucide-react"

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession()
      if (!data.session) {
        toast.error("Sessione non valida o scaduta. Riprova il reset.")
        router.push("/login")
      }
    }
    checkSession()
  }, [router])

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (password !== confirmPassword) {
      toast.error("Le password non coincidono!")
      return
    }

    if (password.length < 6) {
      toast.error("La password deve avere almeno 6 caratteri")
      return
    }

    setLoading(true)

    const { error } = await supabase.auth.updateUser({
      password: password,
    })

    if (error) {
      toast.error("Errore nell'aggiornamento: " + error.message)
    } else {
      toast.success("Password modificata con successo!")
      router.push("/")
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 px-4 py-20">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl p-10 border-b-8 border-[#1e73be]">
        
        <div className="text-center mb-8 flex flex-col items-center">
          <div className="mb-4 p-3 bg-blue-50 rounded-full">
            <ShieldCheck className="text-[#1e73be]" size={32} />
          </div>
          <h1 className="text-3xl font-black text-[#1e73be] uppercase leading-none">
            Nuova <span className="block text-2xl">Password</span>
          </h1>
          <p className="text-gray-500 font-medium mt-2">Imposta la nuova password per il tuo account</p>
        </div>

        <form onSubmit={handleUpdate} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">
              Nuova Password
            </label>
            <input 
              type="password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 bg-gray-50 border rounded-2xl outline-none focus:ring-2 focus:ring-[#1e73be] font-bold" 
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">
              Conferma Password
            </label>
            <input 
              type="password" 
              required 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-4 bg-gray-50 border rounded-2xl outline-none focus:ring-2 focus:ring-[#1e73be] font-bold" 
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#1e73be] hover:bg-[#8cc665] text-white font-black py-5 rounded-2xl uppercase tracking-widest transition-all shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Aggiorna Password"
            )}
          </button>
        </form>
      </div>
    </div>
  )
}