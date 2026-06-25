"use client";
import { useState } from 'react';
import { Share2, Check } from 'lucide-react';
import { toast } from 'sonner';

interface CopyLinkButtonProps {
  slug: string;
}

export default function CopyLinkButton({ slug }: CopyLinkButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const url = `${window.location.origin}/regala/${slug}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success("Link invitati copiato negli appunti!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center justify-center gap-1.5 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-widest text-[#1e73be] bg-blue-50 hover:bg-[#1e73be] hover:text-white rounded-lg transition-all cursor-pointer border border-blue-100"
      title="Copia link per invitati"
    >
      {copied ? <Check size={12} className="text-green-600" /> : <Share2 size={12} />}
      {copied ? "Copiato!" : "Copia Link"}
    </button>
  );
}
