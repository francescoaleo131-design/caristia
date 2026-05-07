"use client";

import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/client'; // Assicurati che sia il client browser
import { Package, ArrowLeft, Save } from "lucide-react";
import Link from 'next/link';

export default function NuovoProdottoPage() {
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    // 1. Inizializza il client (usiamo await per sicurezza se la tua funzione lo richiede)
    const supabase = await createClient();

    const nome = formData.get('name') as string;
    const prezzo = parseFloat(formData.get('price') as string);
    const categoria = formData.get('category') as string;
    const stock = parseInt(formData.get('stock_quantity') as string);
    const descrizione = formData.get('description') as string;

    // 2. Esegui l'inserimento
    const { error } = await supabase
      .from('prodotti')
      .insert([
        { 
          name: nome, 
          price: prezzo, 
          category: categoria, 
          stock_quantity: stock,
          description: descrizione,
          is_active: true 
        }
      ]);

    if (error) {
      alert("Errore: " + error.message);
    } else {
      router.push('/admin/magazzino');
      router.refresh();
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header Form */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/magazzino" className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500">
            <ArrowLeft size={20} />
          </Link>
          <h2 className="text-2xl font-light text-slate-800">
            Nuovo <span className="font-semibold text-indigo-600">Prodotto</span>
          </h2>
        </div>
      </div>

      <form action={handleSubmit} className="bg-white border border-slate-100 rounded-2xl shadow-sm p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nome */}
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Nome Giocattolo</label>
            <input name="name" type="text" required className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all" placeholder="Esempio: LEGO Star Wars..." />
          </div>

          {/* Prezzo */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Prezzo (€)</label>
            <input name="price" type="number" step="0.01" required className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all" placeholder="0.00" />
          </div>

          {/* Stock */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Quantità Iniziale</label>
            <input name="stock_quantity" type="number" required className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all" placeholder="10" />
          </div>

          {/* Categoria */}
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Categoria</label>
            <input name="category" type="text" required className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all" placeholder="Costruzioni, Bambole, ecc." />
          </div>

          {/* Descrizione */}
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Descrizione</label>
            <textarea name="description" rows={4} className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all" placeholder="Dettagli del prodotto..."></textarea>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-50 flex justify-end gap-4">
          <Link href="/admin/magazzino" className="px-6 py-2.5 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors">
            Annulla
          </Link>
          <button type="submit" className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 shadow-sm transition-all">
            <Save size={18} />
            Salva Prodotto
          </button>
        </div>
      </form>
    </div>
  );
}