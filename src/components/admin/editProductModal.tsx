"use client";

import { useState, useEffect } from "react";
import { Edit3, X, Loader2, ImagePlus, Link2 } from "lucide-react";

interface EditProductModalProps {
  prodotto: any;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedData: any) => Promise<void>;
}

export default function EditProductModal({ prodotto, isOpen, onClose, onSave }: EditProductModalProps) {
  const [formData, setFormData] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (prodotto) {
      setFormData({
        ...prodotto,
        specs: prodotto.specs || {}
      });
    }
  }, [prodotto, isOpen]);

  if (!isOpen || !formData) return null;

  const handleSpecChange = (key: string, value: string) => {
    setFormData({
      ...formData,
      specs: {
        ...formData.specs,
        [key]: value
      }
    });
  };

  const handleConfirm = async () => {
    setIsSaving(true);
    try {
      await onSave(formData);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-3xl rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in-95 duration-200 overflow-y-auto max-h-[90vh]">
        
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
              <Edit3 size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800">Modifica Prodotto</h3>
              <p className="text-xs text-slate-400 font-mono tracking-widest uppercase">SKU: {formData.sku || 'N/D'}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full text-slate-400 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6">
          
          <div className="bg-slate-50/50 p-5 rounded-3xl border border-slate-100 space-y-4">
            <h4 className="text-xs font-black text-indigo-600 uppercase tracking-wider mb-2">Informazioni Base</h4>
            
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase ml-1">Immagine Prodotto (URL)</label>
              <div className="flex items-start gap-4 mt-1.5">
                <div className="relative w-20 h-20 bg-white border border-slate-100 rounded-2xl flex items-center justify-center overflow-hidden shrink-0">
                  {formData.image_url ? (
                    <img 
                      src={formData.image_url} 
                      alt="Anteprima" 
                      className="w-full h-full object-contain p-1"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "";
                        (e.target as HTMLImageElement).classList.add('hidden');
                      }}
                    />
                  ) : (
                    <ImagePlus size={22} className="text-slate-300" />
                  )}
                </div>

                <div className="flex-1 relative">
                  <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type="text"
                    placeholder="https://esempio.com/immagine.jpg"
                    value={formData.image_url || ""}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 uppercase ml-1">Nome Prodotto</label>
              <input
                type="text"
                value={formData.name || ""}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full mt-1 px-4 py-3 bg-white border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase ml-1">Prezzo (€)</label>
                <input
                  type="number"
                  step="0.01"
                  value={isNaN(formData.price) ? "" : formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                  className="w-full mt-1 px-4 py-3 bg-white border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase ml-1">Stock (Pezzi)</label>
                <input
                  type="number"
                  value={isNaN(formData.stock_quantity) ? "" : formData.stock_quantity}
                  onChange={(e) => setFormData({ ...formData, stock_quantity: parseInt(e.target.value) || 0 })}
                  className="w-full mt-1 px-4 py-3 bg-white border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase ml-1">Marca / Produttore</label>
                <input
                  type="text"
                  value={formData.brand || ""}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  className="w-full mt-1 px-4 py-3 bg-white border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm"
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-100 space-y-4">
            <h4 className="text-xs font-black text-indigo-600 uppercase tracking-wider flex items-center gap-1.5">
              <span>🛠️</span> Caratteristiche Tecniche (Specs)
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase ml-1">Età Consigliata</label>
                <input
                  type="text"
                  placeholder="Es: 3+ anni"
                  value={formData.specs["Età consigliata"] || ""}
                  onChange={(e) => handleSpecChange("Età consigliata", e.target.value)}
                  className="w-full mt-1 px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase ml-1">Materiale</label>
                <input
                  type="text"
                  placeholder="Es: Plastica ABS"
                  value={formData.specs["Materiale"] || ""}
                  onChange={(e) => handleSpecChange("Materiale", e.target.value)}
                  className="w-full mt-1 px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase ml-1">Colore</label>
                <input
                  type="text"
                  placeholder="Es: Multicolore"
                  value={formData.specs["Colore"] || ""}
                  onChange={(e) => handleSpecChange("Colore", e.target.value)}
                  className="w-full mt-1 px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase ml-1">Lingua</label>
                <input
                  type="text"
                  placeholder="Es: Italiano"
                  value={formData.specs["Lingua"] || ""}
                  onChange={(e) => handleSpecChange("Lingua", e.target.value)}
                  className="w-full mt-1 px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase ml-1">Dimensioni</label>
                <input
                  type="text"
                  placeholder="Es: 20x10x5 cm"
                  value={formData.specs["Dimensioni"] || ""}
                  onChange={(e) => handleSpecChange("Dimensioni", e.target.value)}
                  className="w-full mt-1 px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase ml-1">Peso</label>
                <input
                  type="text"
                  placeholder="Es: 500g"
                  value={formData.specs["Peso"] || ""}
                  onChange={(e) => handleSpecChange("Peso", e.target.value)}
                  className="w-full mt-1 px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase ml-1">Assemblaggio?</label>
                <select
                  value={formData.specs["Assemblaggio"] || "Non specificato"}
                  onChange={(e) => handleSpecChange("Assemblaggio", e.target.value)}
                  className="w-full mt-1 px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm text-slate-700"
                >
                  <option value="Non specificato">Non specificato</option>
                  <option value="Sì">Sì</option>
                  <option value="No">No</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase ml-1">Batterie Necessarie?</label>
                <select
                  value={formData.specs["Batterie Necessarie"] || "Non specificato"}
                  onChange={(e) => handleSpecChange("Batterie Necessarie", e.target.value)}
                  className="w-full mt-1 px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm text-slate-700"
                >
                  <option value="Non specificato">Non specificato</option>
                  <option value="Sì">Sì</option>
                  <option value="No">No</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase ml-1">Batterie Incluse?</label>
                <select
                  value={formData.specs["Batterie Incluse"] || "Non specificato"}
                  onChange={(e) => handleSpecChange("Batterie Incluse", e.target.value)}
                  className="w-full mt-1 px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm text-slate-700"
                >
                  <option value="Non specificato">Non specificato</option>
                  <option value="Sì">Sì</option>
                  <option value="No">No</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-8 border-t border-slate-100 pt-6">
          <button
            type="button"
            disabled={isSaving}
            onClick={onClose}
            className="flex-1 py-4 bg-slate-50 border border-slate-100 text-slate-500 rounded-2xl font-bold text-sm hover:bg-slate-100 transition-all text-center"
          >
            ANNULLA
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isSaving}
            className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-bold text-sm hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2"
          >
            {isSaving && <Loader2 size={18} className="animate-spin" />}
            SALVA MODIFICHE
          </button>
        </div>
      </div>
    </div>
  );
}