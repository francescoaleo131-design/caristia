import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
}

export default function StatCard({ title, value, icon: Icon, color }: StatCardProps) {
  return (
    <div className="bg-white border border-slate-100 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2 rounded-lg bg-slate-50 ${color}`}>
          <Icon size={20} strokeWidth={2} />
        </div>
      </div>
      
      <div>
        <p className="text-xs font-medium text-slate-400 uppercase tracking-widest mb-1">
          {title}
        </p>
        <p className="text-2xl font-semibold text-slate-800 tracking-tight">
          {value}
        </p>
      </div>
    </div>
  );
}