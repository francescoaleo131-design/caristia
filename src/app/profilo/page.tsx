"use client"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase/supabase"
import { useRouter } from "next/navigation"
import { User, Mail, Lock, LogOut, ShieldCheck, KeyRound } from "lucide-react"
import { toast } from 'sonner'

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const getProfile = async () => {
      setLoading(true)
      const { data: { user }, error: authError } = await supabase.auth.getUser()

      if (authError || !user) {
        router.push("/login")
        return
      }

      const { data: dbProfile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single()

      const displayName = dbProfile?.full_name || user.user_metadata?.full_name || "Ospite Caristia";

      setProfile({
        email: user.email,
        full_name: displayName,
        role: dbProfile?.role || "user",
      })
      
      setLoading(false)
    }

    getProfile()
  }, [router])

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) toast.error("Errore durante il logout")
    else {
      toast.success("Logout effettuato. Torna presto!")
      router.push("/")
    }
  }

  const handlePasswordReset = async () => {
    const { error } = await supabase.auth.resetPasswordForEmail(profile.email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })  
    if (error) toast.error("Errore: " + error.message)
    else toast.success("Email di reset inviata!")
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50">
       <div className="w-10 h-10 border-4 border-[#1e73be] border-t-transparent rounded-full animate-spin"></div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#f8fafc] py-12 px-4 font-sans text-zinc-900">
      <div className="max-w-xl mx-auto space-y-8">

        <div className="text-center space-y-3">
          <div className="bg-white w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto shadow-xl shadow-[#1e73be]/10 border border-zinc-100">
            <User className="text-[#1e73be]" size={36} />
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tighter text-zinc-800">
            Il Tuo <span className="text-[#8cc665]">Profilo</span>
          </h1>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Gestisci i tuoi dati e la tua sicurezza</p>
        </div>

        <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl shadow-zinc-200/50 border border-white space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="text-[#8cc665]" size={20} />
            <h2 className="font-black uppercase text-sm tracking-widest text-[#1e73be]">Informazioni Account</h2>
          </div>

          <div className="space-y-4">
            <div className="group">
              <label className="text-[9px] font-black uppercase text-zinc-400 ml-4 mb-1 block tracking-widest">Nome Completo</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within:text-[#1e73be] transition-colors" size={18} />
                <input
                  type="text"
                  value={profile?.full_name || ""}
                  readOnly
                  className="w-full bg-zinc-50 border-2 border-zinc-50 rounded-2xl py-4 pl-12 pr-4 font-bold text-zinc-700 outline-none focus:border-[#1e73be]/20 transition-all"
                />
              </div>
            </div>

            <div className="group">
              <label className="text-[9px] font-black uppercase text-zinc-400 ml-4 mb-1 block tracking-widest">Email Collegata</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within:text-[#1e73be] transition-colors" size={18} />
                <input
                  type="email"
                  value={profile?.email || ""}
                  readOnly
                  className="w-full bg-zinc-50 border-2 border-zinc-50 rounded-2xl py-4 pl-12 pr-4 font-bold text-zinc-700 outline-none focus:border-[#1e73be]/20 transition-all"
                />
              </div>
            </div>
          </div>
        </div>
    
        <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl shadow-zinc-200/50 border border-white space-y-4">
          <div className="flex items-center gap-2 mb-2">            
            <KeyRound className="text-[#8cc665]" size={20} />
            <h2 className="font-black uppercase text-sm tracking-widest text-[#1e73be]">Azioni Rapide</h2>
          </div>
          
          <div className="flex items-center justify-between gap-4 bg-zinc-50 p-4 rounded-2xl border border-zinc-100">
            <div className="flex items-center gap-3">
              <div className="bg-white p-3 rounded-xl shadow-sm">
                <Lock size={20} className="text-zinc-400" />
              </div>
              <div>
                <p className="text-xs font-black uppercase text-zinc-800">Password</p>
                <p className="text-[10px] font-bold text-zinc-400">Reimposta via email</p>
              </div>
            </div>
            <button 
              onClick={handlePasswordReset}
              className="bg-[#1e73be] hover:bg-[#1e73be]/90 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-[#1e73be]/20"
            >
              Modifica
            </button>
          </div>

          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-3 p-4 rounded-2xl border-2 border-red-50 text-red-500 hover:bg-red-50 font-black uppercase text-xs tracking-widest transition-all"
          >
            <LogOut size={18} />
            Esci dall'Account
          </button>
        </div>

        <p className="text-center text-zinc-400 text-[10px] font-black uppercase tracking-[0.2em]">
          Grazie per far parte della nostra famiglia! 🧸
        </p>
      </div>
    </div>
  )
}