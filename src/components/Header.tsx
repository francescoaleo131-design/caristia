"use client";
import { useState, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, ShoppingBag, User, Phone, MapPin, Menu, X, ChevronDown, ChevronRight, LogOut, Store } from "lucide-react";
import { supabase } from "@/lib/supabase/supabase";
import Link from "next/link";
import { useCart } from "@/app/shop/useCart";
import { SHOP_CATEGORIES } from "@/config/categories";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [shopMenuOpen, setShopMenuOpen] = useState(false);
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
  const [mobileExpandedCat, setMobileExpandedCat] = useState<string | null>(null);

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");

  const items = useCart((state) => state.items);
  const [mounted, setMounted] = useState(false);

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = items.reduce((acc, item) => acc + (item.scontato * item.quantity), 0);

  useEffect(() => {
    setSearchQuery(searchParams.get("search") || "");
  }, [searchParams]);

  useEffect(() => {
    setMounted(true);
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

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = searchQuery.trim();
    if (trimmed) {
      router.push(`/shop?search=${encodeURIComponent(trimmed)}`);
    } else {
      router.push(`/shop`);
    }
    setSearchOpen(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  const navLinks = [
    { name: "Animazione", link: "/animazione" },
    { name: "Affitto Mascotte", link: "/mascotte" },
    { name: "Liste Regalo", link: "/liste" },
    { name: "Gift Card", link: "/giftcard" },
    { name: "Chi siamo", link: "/about" }
  ];

  const currentCategory = SHOP_CATEGORIES[activeCategoryIndex] || SHOP_CATEGORIES[0];

  return (
    <header className="w-full shadow-sm bg-white relative z-[80]">
      {/* Top Bar */}
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

      {/* Main Header Container */}
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
            <form
              onSubmit={handleSearchSubmit}
              className="flex border-2 border-gray-200 rounded-full overflow-hidden focus-within:border-blue-400"
            >
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-1 outline-none text-zinc-700"
                placeholder="Cerca giochi, costumi, LEGO e molto altro..."
              />
              <button
                type="submit"
                className="bg-[#1e73be] text-white px-10 font-bold hover:bg-blue-700 transition-colors whitespace-nowrap"
              >
                Cerca
              </button>
            </form>
            <p className="text-[10px] mt-2 text-gray-400 uppercase font-bold tracking-widest pl-4">
              Scopri i Nuovi Prodotti in Vetrina! <Link href="/shop" className="text-blue-500 cursor-pointer hover:underline">CLICCA QUI</Link>
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

        {/* Mobile Header Bar */}
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
              <form onSubmit={handleSearchSubmit}>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full border-2 border-blue-100 p-2 rounded-lg text-sm outline-none focus:border-blue-400 text-zinc-700"
                  placeholder="Cerca prodotti..."
                  autoFocus
                />
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Desktop Navbar */}
      <nav className="hidden md:block border-b-2 border-[#8cc665] bg-white relative">
        <div className="container mx-auto px-4">
          <ul className="flex items-center justify-start">
            <li className={`transition-colors ${pathname === "/" ? "bg-[#8cc665] text-white" : "bg-white text-gray-700 hover:text-[#1e73be]"}`}>
              <Link href="/" className="px-6 py-3 font-bold text-sm uppercase tracking-wider flex items-center gap-2">
                Home
              </Link>
            </li>

            {/* Shop Megamenu Dropdown Trigger */}
            <li 
              className="relative"
              onMouseEnter={() => setShopMenuOpen(true)}
              onMouseLeave={() => setShopMenuOpen(false)}
            >
              <Link
                href="/shop"
                className={`py-3 px-6 text-sm font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 ${
                  pathname.startsWith("/shop")
                    ? "bg-[#8cc665] text-white"
                    : "text-[#1e73be] hover:bg-slate-50 font-black"
                }`}
              >
                <Store size={16} />
                Shop
                <ChevronDown size={14} className={`transition-transform duration-200 ${shopMenuOpen ? "rotate-180" : ""}`} />
              </Link>

              {/* Megamenu Box */}
              {shopMenuOpen && (
                <div className="absolute top-full left-0 w-[920px] bg-white border border-zinc-200 shadow-2xl rounded-b-3xl overflow-hidden z-[150] animate-in fade-in slide-in-from-top-2 duration-200 flex">
                  
                  {/* Left Column: Categories List */}
                  <div className="w-72 bg-zinc-50 border-r border-zinc-200/80 p-3 space-y-1 shrink-0">
                    <div className="px-3 py-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 border-b border-zinc-200/60 mb-1">
                      Tutte le Categorie
                    </div>
                    {SHOP_CATEGORIES.map((cat, idx) => {
                      const isSelected = activeCategoryIndex === idx;
                      return (
                        <button
                          key={cat.title}
                          onMouseEnter={() => setActiveCategoryIndex(idx)}
                          onClick={() => {
                            router.push(`/shop?cat=${encodeURIComponent(cat.slug)}`);
                            setShopMenuOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between group ${
                            isSelected
                              ? "bg-[#1e73be] text-white shadow-md shadow-[#1e73be]/20"
                              : "text-zinc-700 hover:bg-zinc-200/70"
                          }`}
                        >
                          <span className="truncate">{cat.title}</span>
                          <ChevronRight size={14} className={isSelected ? "text-white" : "text-zinc-400 group-hover:text-zinc-700"} />
                        </button>
                      );
                    })}
                  </div>

                  {/* Right Content Column: Subcategories & Product Items */}
                  <div className="flex-1 p-6 bg-white overflow-y-auto max-h-[460px]">
                    <div className="flex items-center justify-between pb-3 border-b border-zinc-100 mb-4">
                      <h3 className="text-base font-black uppercase text-[#1e73be] tracking-tight">
                        {currentCategory.title}
                      </h3>
                      <Link
                        href={`/shop?cat=${encodeURIComponent(currentCategory.slug)}`}
                        onClick={() => setShopMenuOpen(false)}
                        className="text-xs font-bold text-[#8cc665] hover:underline uppercase tracking-wider"
                      >
                        Vedi tutti in {currentCategory.title} &rarr;
                      </Link>
                    </div>

                    <div className="grid grid-cols-3 gap-6">
                      {currentCategory.subcategories.map((sub) => (
                        <div key={sub.name} className="space-y-2">
                          <Link
                            href={`/shop?cat=${encodeURIComponent(currentCategory.slug)}&sub=${encodeURIComponent(sub.name)}`}
                            onClick={() => setShopMenuOpen(false)}
                            className="text-xs font-black uppercase tracking-wider text-zinc-800 hover:text-[#1e73be] block border-l-2 border-[#8cc665] pl-2"
                          >
                            {sub.name}
                          </Link>

                          {sub.items && sub.items.length > 0 && (
                            <ul className="space-y-1 pl-2.5">
                              {sub.items.map((item) => (
                                <li key={item}>
                                  <Link
                                    href={`/shop?search=${encodeURIComponent(item)}`}
                                    onClick={() => setShopMenuOpen(false)}
                                    className="text-[11px] font-semibold text-zinc-500 hover:text-[#1e73be] transition-colors block py-0.5"
                                  >
                                    {item}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}
            </li>

            {navLinks.map((item) => {
              const isActive = pathname === item.link;
              return (
                <li key={item.name}>
                  <Link
                    href={item.link}
                    className={`block py-3 px-6 text-sm font-bold uppercase tracking-wider transition-colors ${
                      isActive
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

      {/* Mobile Backdrop Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] transition-opacity duration-300 ${menuOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
        onClick={() => setMenuOpen(false)}
      />

      {/* Mobile Drawer Menu */}
      <aside
        className={`fixed top-0 left-0 h-full w-[310px] bg-white z-[101] shadow-2xl transition-transform duration-300 ease-in-out flex flex-col ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="p-5 border-b flex items-center justify-between bg-zinc-50">
          <span className="font-black uppercase italic text-[#1e73be] tracking-wider text-base">Menu Navigazione</span>
          <button onClick={() => setMenuOpen(false)} className="p-2 text-gray-500 hover:text-zinc-800">
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto space-y-2">
          <Link
            href="/"
            onClick={() => setMenuOpen(false)}
            className={`block p-3.5 rounded-2xl font-bold uppercase text-xs tracking-wide ${pathname === "/" ? "bg-[#8cc665] text-white" : "text-gray-700 hover:bg-gray-50"}`}
          >
            Home
          </Link>

          {/* Mobile Shop Collapsible Category Tree */}
          <div className="border border-zinc-200/80 rounded-2xl overflow-hidden bg-zinc-50">
            <Link
              href="/shop"
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-between p-3.5 font-black uppercase text-xs tracking-wide text-[#1e73be] bg-blue-50/50 border-b border-zinc-200/60"
            >
              <span className="flex items-center gap-2">
                <Store size={16} /> Tutti i Prodotti Shop
              </span>
              <span className="text-[10px] bg-[#1e73be] text-white px-2 py-0.5 rounded-md font-bold">Vedi Tutti</span>
            </Link>

            <div className="p-2 space-y-1">
              {SHOP_CATEGORIES.map((cat) => {
                const isExpanded = mobileExpandedCat === cat.slug;
                return (
                  <div key={cat.slug} className="rounded-xl overflow-hidden">
                    <button
                      onClick={() => setMobileExpandedCat(isExpanded ? null : cat.slug)}
                      className="w-full flex items-center justify-between p-2.5 text-xs font-bold text-zinc-800 hover:bg-zinc-200/60 rounded-xl transition"
                    >
                      <span>{cat.title}</span>
                      <ChevronDown size={14} className={`transition-transform duration-200 ${isExpanded ? "rotate-180 text-[#1e73be]" : "text-zinc-400"}`} />
                    </button>

                    {isExpanded && (
                      <div className="pl-3 pr-2 py-2 bg-white space-y-3 rounded-xl border border-zinc-100 my-1">
                        {cat.subcategories.map((sub) => (
                          <div key={sub.name} className="space-y-1">
                            <Link
                              href={`/shop?cat=${encodeURIComponent(cat.slug)}&sub=${encodeURIComponent(sub.name)}`}
                              onClick={() => setMenuOpen(false)}
                              className="text-[11px] font-black uppercase text-zinc-800 hover:text-[#1e73be] block border-l-2 border-[#8cc665] pl-2"
                            >
                              {sub.name}
                            </Link>

                            {sub.items && sub.items.length > 0 && (
                              <div className="pl-3 flex flex-wrap gap-1 pt-1">
                                {sub.items.map((item) => (
                                  <Link
                                    key={item}
                                    href={`/shop?search=${encodeURIComponent(item)}`}
                                    onClick={() => setMenuOpen(false)}
                                    className="text-[10px] font-semibold bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded-md hover:bg-blue-50 hover:text-[#1e73be]"
                                  >
                                    {item}
                                  </Link>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {navLinks.map((item) => (
            <Link
              key={item.name}
              href={item.link}
              onClick={() => setMenuOpen(false)}
              className={`block p-3.5 rounded-2xl font-bold uppercase text-xs tracking-wide ${pathname === item.link ? "bg-[#8cc665] text-white" : "text-gray-700 hover:bg-gray-50"}`}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>
    </header>
  );
}