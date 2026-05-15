"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { User, Package, Receipt, LogOut, Tickets } from "lucide-react"

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const menuItems = [
    { name: "Info Utente", href: "/profilo", icon: User },
    { name: "Ordini", href: "/profilo/ordini", icon: Package },
    { name: "Fatturazione", href: "/profilo/fatturazione", icon: Receipt },
    { name: "Gift Card", href: "/profilo/giftcard", icon: Tickets },
  ]

  return (
    <div className="min-h-screen bg-zinc-50 py-12 px-4 font-sans">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8">
        
        <aside className="w-full md:w-72 shrink-0">
          <div className="bg-white rounded-[2.5rem] p-6 shadow-xl border-b-4 border-[#1e73be] sticky top-8">
            <div className="mb-8 p-2">
              <h2 className="font-black text-zinc-800 uppercase text-lg tracking-tighter">Il Mio Account</h2>
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em]">Giocattoli Caristia</p>
            </div>

            <nav className="space-y-2">
              {menuItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link 
                    key={item.href} 
                    href={item.href}
                    className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
                      isActive 
                      ? 'bg-[#1e73be] text-white shadow-lg shadow-blue-200 scale-[1.02]' 
                      : 'text-zinc-400 hover:bg-zinc-50 hover:text-[#1e73be]'
                    }`}
                  >
                    <item.icon size={18} />
                    {item.name}
                  </Link>
                )
              })}
              
              <div className="pt-4 mt-4 border-t border-zinc-100">
                <button className="w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest text-red-400 hover:bg-red-50 transition-all">
                  <LogOut size={18} /> Esci
                </button>
              </div>
            </nav>
          </div>
        </aside>

        <main className="flex-1 w-full">
          {children}
        </main>

      </div>
    </div>
  )
}