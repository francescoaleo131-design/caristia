"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { 
  Plus, Search, Filter, Edit3, Trash2, 
  FileUp, ChevronDown, Loader2, ArrowDownCircle 
} from "lucide-react";
import Link from 'next/link';
import Papa from "papaparse";
import { toast } from "sonner";
import EditProductModal from "@/components/editProductModal";

export default function MagazzinoPage() {
  const [prodotti, setProdotti] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [isModalImportOpen, setIsModalImportOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [productToEdit, setProductToEdit] = useState<any>(null);

  const fetchProdotti = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('prodotti')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error("Errore caricamento: " + error.message);
    } else {
      setProdotti(data || []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchProdotti();
  }, []);

  const handleUpdateProduct = async (updatedProduct: any) => {
    const { error } = await supabase
      .from('prodotti')
      .update({
        name: updatedProduct.name,
        price: updatedProduct.price,
        stock_quantity: updatedProduct.stock_quantity
      })
      .eq('id', updatedProduct.id);

    if (error) {
      toast.error("Errore aggiornamento: " + error.message);
    } else {
      toast.success("Prodotto aggiornato!");
      setIsEditModalOpen(false);
      fetchProdotti();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Vuoi eliminare definitivamente questo prodotto?")) return;
    const { error } = await supabase.from('prodotti').delete().eq('id', id);
    if (error) toast.error(error.message);
    else {
      toast.success("Eliminato");
      fetchProdotti();
    }
  };

  const handleDaneaImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsImporting(true);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const formattedData = results.data.map((row: any) => ({
          sku: row['Codice'],
          name: row['Descrizione'],
          price: parseFloat(row['Prezzo Listino 1']?.replace(',', '.') || '0'),
          stock_quantity: parseInt(row['Disponibilità'] || '0'),
          category: row['Categoria'] || 'Generale'
        }));

        const { error } = await supabase.from('prodotti').upsert(formattedData, { onConflict: 'sku' });

        if (error) toast.error(error.message);
        else {
          toast.success("Importazione riuscita");
          setIsModalImportOpen(false);
          fetchProdotti();
        }
        setIsImporting(false);
      }
    });
  };

  const prodottiFiltrati = prodotti.filter(p => 
    p.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.sku?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <h2 className="text-2xl font-light text-slate-800 tracking-tight">
          Gestione <span className="font-semibold text-indigo-600">Magazzino</span>
        </h2>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Cerca..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none"
            />
          </div>

          <div className="relative">
            <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">
              <Plus size={16} /> Nuovo <ChevronDown size={14} />
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-100 rounded-xl shadow-xl z-50 overflow-hidden">
                <Link href="/admin/magazzino/nuovo" className="flex items-center gap-2 px-4 py-3 text-sm text-slate-600 hover:bg-slate-50">
                  <Plus size={14} /> Manuale
                </Link>
                <button onClick={() => { setIsModalImportOpen(true); setIsDropdownOpen(false); }} className="w-full flex items-center gap-2 px-4 py-3 text-sm text-slate-600 hover:bg-slate-50 border-t border-slate-50">
                  <FileUp size={14} /> Da Danea
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-100 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100 font-semibold text-xs text-slate-500 uppercase">
              <th className="p-4">SKU</th>
              <th className="p-4">Prodotto</th>
              <th className="p-4">Prezzo</th>
              <th className="p-4">Stock</th>
              <th className="p-4 text-right">Azioni</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {isLoading ? (
              <tr><td colSpan={5} className="p-12 text-center"><Loader2 className="animate-spin mx-auto text-indigo-600" /></td></tr>
            ) : prodottiFiltrati.map((prodotto) => (
              <tr key={prodotto.id} className="hover:bg-slate-50/30 transition-colors">
                <td className="p-4 text-sm font-mono text-slate-400">{prodotto.sku}</td>
                <td className="p-4 text-sm font-medium text-slate-700">{prodotto.name}</td>
                <td className="p-4 text-sm font-semibold">€ {prodotto.price?.toFixed(2)}</td>
                <td className="p-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${prodotto.stock_quantity > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                    {prodotto.stock_quantity} pz
                  </span>
                </td>
                <td className="p-4 text-right space-x-1">
                  <button onClick={() => { setProductToEdit(prodotto); setIsEditModalOpen(true); }} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg">
                    <Edit3 size={18} />
                  </button>
                  <button onClick={() => handleDelete(prodotto.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalImportOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => !isImporting && setIsModalImportOpen(false)} />
          <div className="relative bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl text-center">
            <FileUp size={32} className="mx-auto text-indigo-600 mb-4" />
            <h3 className="text-xl font-bold">Importa Danea</h3>
            <label className="mt-8 group relative flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-slate-200 rounded-[2rem] hover:border-indigo-400 cursor-pointer">
              {isImporting ? <Loader2 className="animate-spin text-indigo-600" /> : <>
                <ArrowDownCircle className="text-slate-300 mb-2" size={32} />
                <p className="text-sm text-slate-500">Seleziona .csv</p>
                <input type="file" accept=".csv" className="hidden" onChange={handleDaneaImport} />
              </>}
            </label>
            <button onClick={() => setIsModalImportOpen(false)} className="mt-4 text-xs font-bold text-slate-400">Annulla</button>
          </div>
        </div>
      )}

      {productToEdit && (
        <EditProductModal
          prodotto={productToEdit}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleUpdateProduct}
        />
      )}
    </div>
  );
}