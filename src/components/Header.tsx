"use client";
import { useState } from "react";
import { Search, ShoppingBag, User, Phone, MapPin, Menu, X } from "lucide-react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="w-full shadow-sm bg-white">
      {/* 1. TOP BAR (Blu) */}
      <div className="bg-[#4a69bd] text-white py-2 px-4 flex flex-col sm:flex-row justify-between items-center text-[12px] font-medium">
        <div className="flex items-center gap-2">
          <MapPin size={14} />
          <span>Via Madonna della Via, 74/C - Caltagirone (CT)</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Phone size={14} />
            <span>0933 26865</span>
          </div>
        </div>
      </div>

      {/* 2. MAIN BAR */}
      <div className="container mx-auto py-4 px-4">
        
        {/* --- LAYOUT DESKTOP --- */}
        <div className="hidden md:flex items-center justify-between gap-8">
          {/* SINISTRA: Logo */}
          <div className="w-48 shrink-0">
            <img 
              src="/icon.jpg" 
              alt="Logo" 
              className="h-14 w-auto object-contain" 
              style={{ height: "80px" , width: "auto"}}
            />
          </div>

          {/* CENTRO: Barra di ricerca allungata */}
          <div className="flex-1 max-w-5xl mx-2"> 
            <div className="flex border-2 border-gray-200 rounded-full overflow-hidden focus-within:border-blue-400">
              <input type="text" className="w-full px-2 py-1 outline-none" placeholder="Cerca prodotti..." />
              <button className="bg-[#1e73be] text-white px-10 font-bold">Cerca</button>
            </div>
            <p className="text-[10px] mt-2 text-gray-400 uppercase font-bold tracking-widest pl-4">
              Scopri i Nuovi Prodotti in Vetrina! <span className="text-blue-500 cursor-pointer">CLICCA QUI</span>
            </p>
          </div>

          {/* DESTRA: Profilo e Carrello */}
          <div className="flex items-center gap-4 shrink-0">
            <div className="flex items-center gap-3 bg-slate-50 rounded-full pr-5 pl-2 py-2 shadow-sm">
              <div className="bg-[#1e73be] p-2.5 rounded-full text-white">
                <User size={18} />
              </div>
              <div className="leading-tight">
                <p className="text-[9px] uppercase text-gray-500 font-bold">Profilo</p>
                <p className="text-xs font-bold text-black">Accedi</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-slate-50 rounded-full pr-5 pl-2 py-2 shadow-sm relative">
              <div className="bg-[#1e73be] p-2.5 rounded-full text-white">
                <ShoppingBag size={18} />
                <span className="absolute top-1 left-7 bg-red-500 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-white">0</span>
              </div>
              <div className="leading-tight">
                <p className="text-[9px] uppercase text-gray-500 font-bold">Carrello</p>
                <p className="text-xs font-bold text-black">€0.00</p>
              </div>
            </div>
          </div>
        </div>

        {/* --- LAYOUT MOBILE --- */}
        <div className="md:hidden flex flex-col items-center">
          <div className="relative w-full flex items-center pt-2 pb-3 px-2">
            
            {/* Logo centrato e proporzionato */}
            <div className="absolute left-1/2 -translate-x-1/2">
              <img 
                src="/icon.jpg" 
                alt="Logo Caristia" 
                className="h-10 w-auto px-5 object-contain" 
                style={{ height: "80px" , width: "auto", paddingTop:"10px"}}

              />
            </div>

            <div className="w-10"></div> 

            {/* Icone a destra */}
            <div className="flex items-center gap-4 ml-auto relative z-10">
              <button onClick={() => setSearchOpen(!searchOpen)}>
                <Search size={22} className="text-gray-700" />
              </button>
              <User size={22} className="text-gray-700" />
              <div className="relative">
                <ShoppingBag size={22} className="text-gray-700" />
                <span className="absolute -top-1.5 -right-1.5 bg-[#1e73be] text-white text-[9px] font-bold rounded-full h-4 w-4 flex items-center justify-center">0</span>
              </div>
            </div>
          </div>

          {searchOpen && (
            <div className="mt-2 px-4 w-full animate-in fade-in slide-in-from-top-1">
              <input type="text" className="w-full border-2 border-blue-100 p-2 rounded-lg text-sm" placeholder="Cerca..." autoFocus />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}