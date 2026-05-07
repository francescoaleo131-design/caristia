"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Users, 
  Ticket, 
  Package, 
  LogOut 
} from "lucide-react";

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/admin" },
  { name: "Ordini", icon: ShoppingBag, href: "/admin/ordini" },
  { name: "Liste Compleanno", icon: Users, href: "/admin/liste" },
  { name: "Gift Cards", icon: Ticket, href: "/admin/giftcard" },
  { name: "Magazzino", icon: Package, href: "/admin/prodotti" },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Overlay per Mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white flex flex-col border-r border-slate-100 transition-transform duration-300 lg:translate-x-0 lg:static lg:inset-auto
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6">
          <h1 className="text-2xl font-extrabold tracking-tighter text-[#bef264]">
            CARISTIA <span className="text-slate-500 text-sm italic uppercase tracking-widest">Admin</span>
          </h1>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all duration-200 ${
                  isActive 
                    ? "bg-[#bef264] text-[#020617] shadow-[0_0_20px_rgba(190,242,100,0.1)]" 
                    : "text-slate-400 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button className="flex items-center gap-3 px-4 py-3 w-full text-red-400 font-semibold hover:bg-red-50 rounded-xl transition-colors">
            <LogOut size={22} />
            Esci
          </button>
        </div>
      </aside>
    </>
  );
}