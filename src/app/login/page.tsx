"use client"
import { useState } from "react"

import { createBrowserClient } from "@supabase/ssr" 
import { useRouter } from "next/navigation"
import Link from "next/link"
import { toast } from 'sonner'

import { Eye, EyeOff } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      toast.error("Errore nell'accesso: " + error.message)
      setLoading(false)
      return
    }

    if (data.session) {
      toast.success("Bentornato!")
      router.refresh() 
      
      setTimeout(() => {
        router.push("/")
      }, 100)
    }
    
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 px-4 py-20">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl p-10 border-b-8 border-[#1e73be]">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-[#1e73be] uppercase">Bentornato!</h1>
          <p className="text-gray-500 font-medium">Accedi per gestire le tue feste</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
            <input 
              type="email" 
              required 
              className="w-full p-4 bg-gray-50 border rounded-2xl outline-none focus:ring-2 focus:ring-[#1e73be] text-black" 
              placeholder="latua@email.it"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-bold text-gray-700">Password</label>
              <Link href="/reset-password" className="text-[10px] font-black uppercase text-zinc-400 hover:text-[#1e73be]">
                Hai dimenticato la password?
              </Link>
            </div>
            
            <div className="relative flex items-center">
              <input 
                type={showPassword ? "text" : "password"} 
                required 
                className="w-full p-4 pr-12 bg-gray-50 border rounded-2xl outline-none focus:ring-2 focus:ring-[#1e73be] text-black" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 text-zinc-400 hover:text-[#1e73be] transition-colors focus:outline-none"
                title={showPassword ? "Nascondi password" : "Mostra password"}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#1e73be] hover:bg-[#8cc665] text-white font-black py-4 rounded-2xl uppercase tracking-widest transition-all shadow-lg disabled:opacity-50"
          >
            {loading ? "Accesso in corso..." : "Entra"}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-500">
          Non hai ancora un account?{" "}
          <Link href="/register" className="text-[#8cc665] font-bold hover:underline">
            Registrati qui
          </Link>
        </div>
      </div>
    </div>
  )
}