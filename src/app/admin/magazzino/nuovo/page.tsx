"use client";

import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { ArrowLeft, Save, ListPlus, Box } from "lucide-react";
import Link from 'next/link';
import { toast } from "sonner";

export default function NuovoProdottoPage() {
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    const supabase = await createClient();

    const sku = formData.get('sku') as string;
    const nome = formData.get('name') as string;
    const brand = formData.get('brand') as string;
    const prezzo = parseFloat(formData.get('price') as string);
    const categoria = formData.get('category') as string;
    const stock = parseInt(formData.get('stock_quantity') as string);
    const descrizione = formData.get('description') as string;

    const specs = {
      "Età consigliata": formData.get('spec_eta'),
      "Materiale": formData.get('spec_materiale'),
      "Colore": formData.get('spec_colore'),
      "Lingua": formData.get('spec_lingua'),
      "Dimensioni": formData.get('spec_dimensioni'),
      "Peso": formData.get('spec_peso'),
      "Pezzi": formData.get('spec_pezzi'),
      "Modello": sku, 
      "Assemblaggio necessario": formData.get('spec_assemblaggio'),
      "Batterie necessarie": formData.get('spec_batterie_req'),
      "Batterie incluse": formData.get('spec_batterie_inc')
    };

    const filteredSpecs = Object.fromEntries(
      Object.entries(specs).filter(([_, v]) => v !== "" && v !== null)
    );

    const { error } = await supabase
      .from('prodotti')
      .insert([
        { 
          sku: sku,
          name: nome, 
          brand: brand,
          price: prezzo, 
          category: categoria, 
          stock_quantity: stock,
          description: descrizione,
          specs: Object.keys(filteredSpecs).length > 0 ? filteredSpecs : null,
          is_active: true 
        }
      ]);

    if (error) {
      toast.error("Errore: " + error.message);
    } else {
      toast.success("Prodotto creato con successo!");
      router.push('/admin/magazzino');
      router.refresh();
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/magazzino" className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500">
          <ArrowLeft size={20} />
        </Link>
        <h2 className="text-2xl font-light text-slate-800">
          Nuovo <span className="font-semibold text-indigo-600">Prodotto</span>
        </h2>
      </div>

      <form action={handleSubmit} className="space-y-8">
        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-8 space-y-6">
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-widest mb-2">
            <Box size={16} /> Informazioni Base
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Codice SKU (Danea)</label>
              <input name="sku" type="text" required className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none" placeholder="Es: LEGO-42151" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Nome Giocattolo</label>
              <input name="name" type="text" required className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none" placeholder="Esempio: Bugatti Bolide Technic" />
            </div>
            
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Marca / Brand</label>
              <input name="brand" type="text" className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none" placeholder="Es: LEGO" />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Prezzo (€)</label>
              <input name="price" type="number" step="0.01" required className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none" placeholder="0.00" />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Stock Iniziale</label>
              <input name="stock_quantity" type="number" required className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none" placeholder="0" />
            </div>

            <div className="md:col-span-3">
              <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Categoria</label>
              <input name="category" type="text" required className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none" placeholder="Es: Costruzioni" />
            </div>

            <div className="md:col-span-3">
              <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Descrizione</label>
              <textarea name="description" rows={3} className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none" placeholder="Descrizione completa del prodotto..."></textarea>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 space-y-6">
          <div className="flex items-center gap-2 text-slate-600 font-bold text-xs uppercase tracking-widest mb-2">
            <ListPlus size={16} /> Caratteristiche Tecniche (Specs)
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-1">Età Consigliata</label>
              <input name="spec_eta" type="text" className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm" placeholder="Es: 3+ anni" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-1">Materiale</label>
              <input name="spec_materiale" type="text" className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm" placeholder="Es: Plastica ABS" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-1">Colore</label>
              <input name="spec_colore" type="text" className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm" placeholder="Es: Multicolore" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-1">Lingua</label>
              <input name="spec_lingua" type="text" className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm" placeholder="Es: Italiano" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-1">Dimensioni</label>
              <input name="spec_dimensioni" type="text" className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm" placeholder="Es: 20x10x5 cm" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-1">Peso</label>
              <input name="spec_peso" type="text" className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm" placeholder="Es: 500g" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-1">Assemblaggio?</label>
              <select name="spec_assemblaggio" className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm">
                <option value="">Non specificato</option>
                <option value="Sì">Sì</option>
                <option value="No">No</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-1">Batterie Necessarie?</label>
              <select name="spec_batterie_req" className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm">
                <option value="">Non specificato</option>
                <option value="Sì">Sì</option>
                <option value="No">No</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-1">Batterie Incluse?</label>
              <select name="spec_batterie_inc" className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm">
                <option value="">Non specificato</option>
                <option value="Sì">Sì</option>
                <option value="No">No</option>
              </select>
            </div>
          </div>
        </div>

        <div className="pt-6 flex justify-end gap-4">
          <Link href="/admin/magazzino" className="px-6 py-2.5 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors">
            Annulla
          </Link>
          <button type="submit" className="flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all active:scale-95">
            <Save size={18} />
            Salva Prodotto
          </button>
        </div>
      </form>
    </div>
  );
}