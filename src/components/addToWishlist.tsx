"use client";
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/supabase';
import { Gift, ChevronDown, Plus, Check } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  productId: string;
  productName: string;
}

export default function AddToWishlistButton({ productId, productName }: Props) {
  const [lists, setLists] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [addedToLists, setAddedToLists] = useState<string[]>([]); 

  const fetchUserLists = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('wishlists')
      .select('id, child_name')
      .eq('owner_id', user.id);
    
    setLists(data || []);
  };

  const handleAdd = async (wishlistId: string) => {
    setLoading(true);
    const { error } = await supabase
      .from('wishlist_items')
      .insert([{ 
        wishlist_id: wishlistId, 
        product_id: productId, 
        quantity_requested: 1 
      }]);

    if (error) {
      if (error.code === '23505') toast.error("Già presente in questa lista");
      else toast.error("Errore durante l'aggiunta");
    } else {
      toast.success(`${productName} aggiunto alla lista!`);
      setAddedToLists([...addedToLists, wishlistId]);
    }
    setLoading(false);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block w-full">
      <button
        onClick={async () => {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) {
            toast.error("Accedi per aggiungere prodotti alla lista regalo");
            return;
          }
          await fetchUserLists();
          setIsOpen(!isOpen);
        }}
        className="w-full flex items-center justify-center gap-2 bg-white border-2 border-slate-200 text-slate-600 font-bold py-4 rounded-2xl hover:border-blue-500 hover:text-blue-600 transition-all active:scale-95"
      >
        <Gift size={20} />
        Aggiungi alla Lista Regalo
        <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 bottom-full mb-2 left-0 w-full bg-white border border-slate-100 shadow-2xl rounded-2xl p-2 animate-in fade-in slide-in-from-bottom-2">
          {lists.length > 0 ? (
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase text-slate-400 p-2 tracking-widest">Scegli una lista:</p>
              {lists.map((list) => (
                <button
                  key={list.id}
                  onClick={() => handleAdd(list.id)}
                  disabled={loading}
                  className="w-full text-left p-3 rounded-xl hover:bg-blue-50 flex justify-between items-center group transition-colors"
                >
                  <span className="font-bold text-slate-700 group-hover:text-blue-600">{list.child_name}</span>
                  {addedToLists.includes(list.id) ? <Check size={18} className="text-green-500" /> : <Plus size={18} className="text-slate-300" />}
                </button>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center">
              <p className="text-sm text-slate-500 mb-3">Non hai ancora creato una lista.</p>
              <a href="/liste" className="text-blue-600 font-bold text-sm hover:underline">Crea la tua prima lista →</a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}