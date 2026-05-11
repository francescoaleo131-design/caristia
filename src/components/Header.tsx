"use client";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Search, ShoppingBag, User, Phone, MapPin, Menu, X, ChevronDown, LogOut, } from "lucide-react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useCart } from "@/app/shop/useCart";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  // --- LOGICA CARRELLO ---
  const items = useCart((state) => state.items);
  const [mounted, setMounted] = useState(false);

  // Calcolo quantità totale e prezzo totale
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  useEffect(() => {
    setMounted(true); // Evita hydration mismatch
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };
    getUser();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  const navLinks = [
    { name: "Negozio", link: "/shop" },
    { name: "Animazione", link: "/animazione" },
    { name: "Affitto Mascotte", link: "/mascotte" },
    { name: "Liste Regalo", link: "/liste" },
    { name: "Gift Card", link: "/giftcard" }
  ];

  return (
    <header className="w-full shadow-sm bg-white relative">
      {/* 1. TOP BAR */}
      <div className="bg-[#4a69bd] text-white py-2 px-4 flex flex-col sm:flex-row justify-between items-center text-[12px] font-medium">
        <div className="flex items-center gap-2">
          <MapPin size={14} />
          <span>Via Madonna della Via, 74/C - Caltagirone (CT)</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Phone size={14} />
            <span>+39 338 408 3646</span>
          </div>
        </div>
      </div>

      {/* 2. MAIN BAR */}
      <div className="container mx-auto py-4 px-4 border-b border-gray-50">
        <div className="hidden md:flex items-center justify-between gap-8">
          <div className="w-48 shrink-0">
            <Link href="/">
              <img
                src="/icon.jpg"
                alt="Logo"
                className="h-14 w-auto object-contain"
                style={{ height: "80px", width: "auto" }}
              />
            </Link>
          </div>

          <div className="flex-1 max-w-5xl mx-2">
            <div className="flex border-2 border-gray-200 rounded-full overflow-hidden focus-within:border-blue-400">
              <input type="text" className="w-full px-4 py-1 outline-none" placeholder="Cerca prodotti..." />
              <button className="bg-[#1e73be] text-white px-10 font-bold hover:bg-blue-700 transition-colors">Cerca</button>
            </div>
            <p className="text-[10px] mt-2 text-gray-400 uppercase font-bold tracking-widest pl-4">
              Scopri i Nuovi Prodotti in Vetrina! <span className="text-blue-500 cursor-pointer">CLICCA QUI</span>
            </p>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            {loading ? (
              <div className="w-32 h-10 bg-slate-100 animate-pulse rounded-full" />
            ) : user ? (
              <div className="group relative flex items-center gap-3 bg-slate-50 rounded-full pr-5 pl-2 py-2 shadow-sm cursor-pointer hover:bg-slate-100 transition-colors">
                <Link href="/profilo" className="flex items-center gap-3">
                  <div className="bg-[#8cc665] p-2.5 rounded-full text-white">
                    <User size={18} />
                  </div>
                  <div className="leading-tight">
                    <p className="text-[9px] uppercase text-gray-500 font-bold">Ciao,</p>
                    <p className="text-xs font-bold text-black truncate max-w-[80px]">
                      {user.user_metadata?.full_name?.split(' ')[0] || 'Utente'}
                    </p>
                  </div>
                </Link>
                <button onClick={handleLogout} className="ml-2 text-gray-400 hover:text-red-500 transition-colors">
                  <LogOut size={14} />
                </button>
              </div>
            ) : (
              <Link href="/login" className="flex items-center gap-3 bg-slate-50 rounded-full pr-5 pl-2 py-2 shadow-sm cursor-pointer hover:bg-slate-100 transition-colors">
                <div className="bg-[#1e73be] p-2.5 rounded-full text-white">
                  <User size={18} />
                </div>
                <div className="leading-tight">
                  <p className="text-[9px] uppercase text-gray-500 font-bold">Account</p>
                  <p className="text-xs font-bold text-black">Accedi</p>
                </div>
              </Link>
            )}

            {/* --- CARRELLO DESKTOP FUNZIONANTE --- */}
            <Link href="/carrello" className="flex items-center gap-3 bg-slate-50 rounded-full pr-5 pl-2 py-2 shadow-sm relative cursor-pointer hover:bg-slate-100 transition-colors">
              <div className="bg-[#1e73be] p-2.5 rounded-full text-white">
                <ShoppingBag size={18} />
                {mounted && totalItems > 0 && (
                  <span className="absolute top-1 left-7 bg-red-500 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-white animate-in zoom-in">
                    {totalItems}
                  </span>
                )}
              </div>
              <div className="leading-tight">
                <p className="text-[9px] uppercase text-gray-500 font-bold">Carrello</p>
                <p className="text-xs font-bold text-black">
                  {mounted ? `€${totalPrice.toFixed(2)}` : "€0.00"}
                </p>
              </div>
            </Link>
          </div>
        </div>

        {/* --- LAYOUT MOBILE --- */}
        <div className="md:hidden flex flex-col items-center">
          <div className="relative w-full flex items-center pt-2 pb-3 px-2">
            <button onClick={() => setMenuOpen(true)} className="z-10 p-1">
              <Menu size={28} className="text-gray-700" />
            </button>

            <div className="absolute left-1/2 -translate-x-1/2">
              <Link href="/">
                <img
                  src="/icon.jpg"
                  alt="Logo Caristia"
                  className="h-10 w-auto object-contain"
                  style={{ height: "60px", width: "auto" }}
                />
              </Link>
            </div>

            <div className="flex items-center gap-4 ml-auto relative z-10">
              <button onClick={() => setSearchOpen(!searchOpen)} className="p-1">
                <Search size={22} className="text-gray-700" />
              </button>
              <Link href={user ? "/profilo" : "/login"}>
                <User size={22} className={user ? "text-[#8cc665]" : "text-gray-700"} />
              </Link>

              {/* --- CARRELLO MOBILE FUNZIONANTE --- */}
              <Link href="/carrello" className="relative p-1">
                <ShoppingBag size={22} className="text-gray-700" />
                {mounted && totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-[#1e73be] text-white text-[9px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Link>
            </div>
          </div>

          {searchOpen && (
            <div className="mt-2 px-4 w-full animate-in fade-in slide-in-from-top-1 pb-2">
              <input type="text" className="w-full border-2 border-blue-100 p-2 rounded-lg text-sm outline-none focus:border-blue-400" placeholder="Cerca..." autoFocus />
            </div>
          )}
        </div>
      </div>

      {/* 3. NAVBAR DESKTOP */}
      <nav className="hidden md:block border-b-2 border-[#8cc665]">
        <div className="container mx-auto px-4">
          <ul className="flex items-center justify-start">
            <li className={`transition-colors ${pathname === "/" ? "bg-[#8cc665] text-white" : "bg-white text-gray-700 hover:text-[#1e73be]"}`}>
              <Link href="/" className="px-8 py-3 font-bold text-sm uppercase tracking-wider flex items-center gap-2">
                Main
              </Link>
            </li>

            {navLinks.map((item) => {
              const isActive = pathname === item.link;
              return (
                <li key={item.name}>
                  <Link
                    href={item.link}
                    className={`block py-3 px-6 text-sm font-bold uppercase tracking-wider transition-colors ${isActive
                        ? "bg-[#8cc665] text-white"
                        : "text-gray-700 hover:text-[#1e73be]"
                      }`}
                  >
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      {/* --- MENU MOBILE SIDEBAR --- */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] transition-opacity duration-300 ${menuOpen ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
        onClick={() => setMenuOpen(false)}
      />

      <aside
        className={`fixed top-0 left-0 h-full w-[280px] bg-white z-[101] shadow-2xl transition-transform duration-300 ease-in-out ${menuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="flex flex-col h-full">
          <div className="p-5 border-b flex items-center justify-between">
            <span className="font-black uppercase italic text-[#1e73be]">Menu</span>
            <button onClick={() => setMenuOpen(false)} className="p-2 text-gray-500">
              <X size={24} />
            </button>
          </div>

          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  onClick={() => setMenuOpen(false)}
                  className={`block p-4 rounded-xl font-bold uppercase text-sm tracking-wide ${pathname === "/" ? "bg-[#8cc665] text-white" : "text-gray-700 hover:bg-gray-50"
                    }`}
                >
                  Main
                </Link>
              </li>
              {navLinks.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.link}
                    onClick={() => setMenuOpen(false)}
                    className={`block p-4 rounded-xl font-bold uppercase text-sm tracking-wide ${pathname === item.link ? "bg-[#8cc665] text-white" : "text-gray-700 hover:bg-gray-50"
                      }`}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </aside>
    </header>
  );
}