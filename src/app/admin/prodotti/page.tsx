"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase"; // Assicurati di usare il client browser qui
import { Package, Plus, Search, Filter, Edit3, Trash2, FileUp, ChevronDown, Loader2 } from "lucide-react";
import Link from 'next/link';
import Papa from "papaparse";
import { toast } from "sonner";

export default function MagazzinoPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [prodotti, setProdotti] = useState<any[]>([]); // Caricali con un useEffect o passa i dati iniziali

  // --- LOGICA IMPORTAZIONE DANEA ---
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
          category: row['Categoria'] || 'Giocattoli',
          // Mappatura JSONB per le specifiche
          specs: {
            brand: row['Produttore'],
            note: row['Note'],
            codice_a_barre: row['Codice a barre']
          }
        }));

        const { error } = await supabase
          .from('prodotti')
          .upsert(formattedData, { onConflict: 'sku' });

        if (error) {
          toast.error("Errore durante l'importazione: " + error.message);
        } else {
          toast.success("Importazione completata!", {
            description: `${formattedData.length} prodotti aggiornati dal catalogo Danea.`
          });
          setIsModalOpen(false);
          // Qui dovresti ricaricare i dati (window.location.reload() o funzione fetch)
        }
        setIsImporting(false);
      }
    });
  };

  return (
    <div className="space-y-8">
      {/* Header con Dropdown Azioni */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <h2 className="text-2xl font-light text-slate-800 tracking-tight">
            Gestione <span className="font-semibold text-indigo-600">Magazzino</span>
          </h2>
        </div>
        
        <div className="flex items-center gap-3 relative">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50">
            <Filter size={16} />
            Filtra
          </button>

          {/* Menu a tendina */}
          <div className="relative">
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-shadow shadow-sm"
            >
              <Plus size={16} />
              Nuovo
              <ChevronDown size={14} />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-100 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                <Link 
                  href="/admin/magazzino/nuovo"
                  className="flex items-center gap-2 px-4 py-3 text-sm text-slate-600 hover:bg-slate-50"
                >
                  <Plus size={14} /> Inserimento Manuale
                </Link>
                <button 
                  onClick={() => { setIsModalOpen(true); setIsDropdownOpen(false); }}
                  className="w-full flex items-center gap-2 px-4 py-3 text-sm text-slate-600 hover:bg-slate-50 border-t border-slate-50"
                >
                  <FileUp size={14} /> Importa da Danea
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ... Barra di ricerca e tabella (rimangono simili) ... */}

      {/* MODAL IMPORTAZIONE DANEA */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => !isImporting && setIsModalOpen(false)} />
          
          {/* Modal Card */}
          <div className="relative bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-4">
                <FileUp size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-800">Importazione Danea EasyFatt</h3>
              <p className="text-sm text-slate-500">
                Seleziona il file <span className="font-mono bg-slate-100 px-1 rounded">.csv</span> esportato da Danea per aggiornare prezzi, stock e specifiche prodotti.
              </p>

              <div className="mt-8">
                <label className="group relative flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-slate-200 rounded-[2rem] hover:border-indigo-400 hover:bg-indigo-50/30 transition-all cursor-pointer">
                  {isImporting ? (
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="animate-spin text-indigo-600" size={32} />
                      <span className="text-sm font-semibold text-indigo-600 uppercase tracking-widest">Elaborazione...</span>
                    </div>
                  ) : (
                    <>
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <ArrowDownCircle className="text-slate-300 group-hover:text-indigo-400 mb-2" size={32} />
                        <p className="text-sm text-slate-500">Trascina qui il file o <span className="text-indigo-600 font-semibold">sfoglia</span></p>
                      </div>
                      <input type="file" accept=".csv" className="hidden" onChange={handleDaneaImport} />
                    </>
                  )}
                </label>
              </div>

              <button 
                onClick={() => setIsModalOpen(false)}
                disabled={isImporting}
                className="mt-4 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-slate-600 disabled:opacity-0"
              >
                Annulla
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Icona mancante per il modal
function ArrowDownCircle(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v8"/><path d="m8 12 4 4 4-4"/></svg>
  )
}