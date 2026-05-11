"use client";

import { useState, useEffect } from "react";
import { Edit3, X, Loader2 } from "lucide-react";

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
      setFormData({ ...prodotto });
    }
  }, [prodotto]);

  if (!isOpen || !formData) return null;

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
      
      <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
              <Edit3 size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800">Modifica Prodotto</h3>
              <p className="text-xs text-slate-400 font-mono tracking-widest uppercase">SKU: {formData.sku}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full text-slate-400">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-5">
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase ml-1">Nome Prodotto</label>
            <input
              type="text"
              value={formData.name || ""}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full mt-1 px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase ml-1">Prezzo (€)</label>
              <input
                type="number"
                step="0.01"
                // Protezione contro NaN: se il valore non è un numero, usa stringa vuota
                value={isNaN(formData.price) ? "" : formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                className="w-full mt-1 px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase ml-1">Stock (Pezzi)</label>
              <input
                type="number"
                // Protezione contro NaN
                value={isNaN(formData.stock_quantity) ? "" : formData.stock_quantity}
                onChange={(e) => setFormData({ ...formData, stock_quantity: parseInt(e.target.value) || 0 })}
                className="w-full mt-1 px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-8">
          <button
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