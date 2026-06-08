"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/supabase";
import { 
  Plus, Search, Edit3, Trash2, 
  FileUp, ChevronDown, Loader2, ArrowDownCircle 
} from "lucide-react";
import Link from 'next/link';
import Papa from "papaparse";
import { toast } from "sonner";
import EditProductModal from "@/components/admin/editProductModal";

export default function MagazzinoPage() {
  const [prodotti, setProdotti] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [isModalImportOpen, setIsModalImportOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [productToEdit, setProductToEdit] = useState<any>(null);

  // Recupera i prodotti dal database
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

  // Gestisce l'aggiornamento dei dati testuali e l'eventuale upload dell'immagine su Supabase Storage
  const handleUpdateProduct = async (updatedProduct: any, imageFile?: File) => {
    setIsLoading(true);
    
    try {
      let imageUrl = updatedProduct.image_url;

      // Se l'utente ha selezionato un nuovo file dal modale, eseguiamo l'upload
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        // Generiamo un nome file univoco basato su SKU/ID e timestamp
        const fileName = `${updatedProduct.sku || updatedProduct.id}-${Date.now()}.${fileExt}`;
        const filePath = `products/${fileName}`;

        // Caricamento nel bucket 'product-images'
        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, imageFile, {
            cacheControl: '3600',
            upsert: true
          });

        if (uploadError) {
          throw new Error("Errore caricamento immagine: " + uploadError.message);
        }

        // Recuperiamo l'URL pubblico dell'immagine appena salvata
        const { data: publicUrlData } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);

        imageUrl = publicUrlData.publicUrl;
      }

      // Eseguiamo l'update definitivo del record nella tabella 'prodotti'
      const { error: dbError } = await supabase
        .from('prodotti')
        .update({
          name: updatedProduct.name,
          price: updatedProduct.price,
          stock_quantity: updatedProduct.stock_quantity,
          specs: updatedProduct.specs,
          brand: updatedProduct.brand,
          image_url: imageUrl // Aggiornato con il nuovo URL (o null se è stata rimossa)
        })
        .eq('id', updatedProduct.id);

      if (dbError) throw dbError;

      toast.success("Prodotto aggiornato!");
      setIsEditModalOpen(false);
      fetchProdotti();
    } catch (error: any) {
      toast.error(error.message || "Errore durante il salvataggio");
    } finally {
      setIsLoading(false);
    }
  };

  // Elimina un prodotto dal database
  const handleDelete = async (id: string) => {
    if (!confirm("Vuoi eliminare definitivamente questo prodotto?")) return;
    const { error } = await supabase.from('prodotti').delete().eq('id', id);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Eliminato");
      fetchProdotti();
    }
  };

  // Logica di importazione file CSV da Danea
  const handleDaneaImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsImporting(true);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          const formattedData = results.data.map((row: any) => {
            const dynamicSpecs: any = {};

            // Mappatura Campi Liberi Danea
            if (row['Libero 1']) dynamicSpecs["Età consigliata"] = row['Libero 1'];
            if (row['Libero 2']) dynamicSpecs["Materiale"] = row['Libero 2'];
            if (row['Libero 3']) dynamicSpecs["Colore"] = row['Libero 3'];
            if (row['Libero 4']) dynamicSpecs["Lingua"] = row['Libero 4'];

            // Mappatura Campi Standard Danea
            if (row['Codice']) dynamicSpecs["Modello"] = row['Codice'];
            if (row['Peso lordo'] && row['Peso lordo'] !== '0') dynamicSpecs["Peso"] = row['Peso lordo'];
            if (row['Dimensioni']) dynamicSpecs["Dimensioni"] = row['Dimensioni'];

            return {
              sku: row['Codice'],
              name: row['Descrizione'],
              price: parseFloat(row['Prezzo Listino 1']?.replace(',', '.') || '0'),
              stock_quantity: parseInt(row['Disponibilità'] || '0'),
              category: row['Categoria'] || 'Generale',
              specs: Object.keys(dynamicSpecs).length > 0 ? dynamicSpecs : null,
              brand: row['Produttore'] || row['Marca'] || 'Generico'
            };
          });

          const { error } = await supabase.from('prodotti').upsert(formattedData, { onConflict: 'sku' });

          if (error) throw error;
          
          toast.success("Importazione riuscita!");
          setIsModalImportOpen(false);
          fetchProdotti();
        } catch (err: any) {
          toast.error("Errore: " + err.message);
        } finally {
          setIsImporting(false);
        }
      }
    });
  };

  // Filtro di ricerca locale
  const prodottiFiltrati = prodotti.filter(p => 
    p.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.sku?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 p-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <h2 className="text-2xl font-light text-slate-800 tracking-tight">
          Gestione <span className="font-semibold text-indigo-600">Magazzino</span>
        </h2>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Cerca per nome o SKU..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none w-64"
            />
          </div>

          <div className="relative">
            <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-all shadow-md active:scale-95">
              <Plus size={16} /> Nuovo <ChevronDown size={14} />
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-100 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in duration-200">
                <Link href="/admin/magazzino/nuovo" className="flex items-center gap-2 px-4 py-3 text-sm text-slate-600 hover:bg-slate-50">
                  <Plus size={14} /> Manuale
                </Link>
                <button onClick={() => { setIsModalImportOpen(true); setIsDropdownOpen(false); }} className="w-full flex items-center gap-2 px-4 py-3 text-sm text-slate-600 hover:bg-slate-50 border-t border-slate-50">
                  <FileUp size={14} /> Da Danea (.csv)
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* TABELLA PRODOTTI */}
      <div className="bg-white border border-slate-100 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100 font-semibold text-[10px] text-slate-500 uppercase tracking-widest">
              <th className="p-4">SKU / Modello</th>
              <th className="p-4">Prodotto</th>
              <th className="p-4">Prezzo</th>
              <th className="p-4">Disponibilità</th>
              <th className="p-4 text-right">Azioni</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {isLoading && prodotti.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-12 text-center">
                  <Loader2 className="animate-spin mx-auto text-indigo-600" />
                </td>
              </tr>
            ) : prodottiFiltrati.map((prodotto) => (
              <tr key={prodotto.id} className="hover:bg-slate-50/30 transition-colors group">
                <td className="p-4 text-xs font-mono text-slate-400">{prodotto.sku}</td>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    {prodotto.image_url && (
                      <img 
                        src={prodotto.image_url} 
                        alt="" 
                        className="w-8 h-8 rounded-lg object-contain bg-slate-50 border border-slate-100 p-0.5" 
                      />
                    )}
                    <div>
                      <p className="text-sm font-bold text-slate-700">{prodotto.name}</p>
                      <p className="text-[10px] text-slate-400 uppercase">{prodotto.category}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-sm font-black text-indigo-600">€ {prodotto.price?.toFixed(2)}</td>
                <td className="p-4">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${prodotto.stock_quantity > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                    {prodotto.stock_quantity} pezzi
                  </span>
                </td>
                <td className="p-4 text-right space-x-1">
                  <button onClick={() => { setProductToEdit(prodotto); setIsEditModalOpen(true); }} className="p-2 text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
                    <Edit3 size={18} />
                  </button>
                  <button onClick={() => handleDelete(prodotto.id)} className="p-2 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {prodottiFiltrati.length === 0 && !isLoading && (
            <div className="p-12 text-center text-slate-400 text-sm">Nessun prodotto trovato.</div>
        )}
      </div>

      {/* MODALE IMPORTAZIONE DANEA */}
      {isModalImportOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => !isImporting && setIsModalImportOpen(false)} />
          <div className="relative bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl text-center">
            <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FileUp size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-800">Sincronizzazione Danea</h3>
            <p className="text-sm text-slate-500 mt-2">Carica il file .csv esportato da Danea per aggiornare prezzi, stock e caratteristiche.</p>
            
            <label className="mt-8 group relative flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-slate-200 rounded-[2rem] hover:border-indigo-400 hover:bg-indigo-50/30 cursor-pointer transition-all">
              {isImporting ? (
                <div className="flex flex-col items-center gap-2">
                    <Loader2 className="animate-spin text-indigo-600" size={32} />
                    <p className="text-xs font-bold text-indigo-600">Elaborazione dati...</p>
                </div>
              ) : (
                <>
                    <ArrowDownCircle className="text-slate-300 group-hover:text-indigo-400 mb-2 transition-colors" size={32} />
                    <p className="text-sm font-medium text-slate-500">Trascina o clicca per selezionare</p>
                    <p className="text-[10px] text-slate-300 uppercase mt-1">Formato richiesto: .CSV</p>
                    <input type="file" accept=".csv" className="hidden" onChange={handleDaneaImport} />
                </>
              )}
            </label>
            
            <button 
                disabled={isImporting}
                onClick={() => setIsModalImportOpen(false)} 
                className="mt-6 text-xs font-bold text-slate-400 hover:text-slate-600 uppercase tracking-widest disabled:opacity-0"
            >
                Annulla
            </button>
          </div>
        </div>
      )}

      {/* MODALE EDIT PRODOTTO (IMMAGINI COMPRESE) */}
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