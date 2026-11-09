import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import _XLSX from 'xlsx';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { v2 as cloudinary } from 'cloudinary';
import { createClient } from '@supabase/supabase-js';

// Normalizzazione sicura di XLSX per ESM
const XLSX = (_XLSX as any).default || _XLSX;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Caricamento variabili d'ambiente
dotenv.config({ path: path.resolve(__dirname, '../../../.env.local') });
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Legge un campo in modo sicuro da Excel gestendo variazioni di nomi e spazi
 */
function getValoreExcel(row: any, possibiliNomi: string[]): string {
  const rowKeys = Object.keys(row);
  for (const nomeCercato of possibiliNomi) {
    const normalizzatoCercato = nomeCercato.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    for (const key of rowKeys) {
      const normalizzatoKey = key.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      if (normalizzatoKey.includes(normalizzatoCercato)) {
        if (row[key] !== undefined && row[key] !== null) {
          return row[key].toString().trim();
        }
      }
    }
  }
  return '';
}

async function cercaUrlImmagineGratis(query: string): Promise<string> {
  try {
    const searchUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query + ' foto prodotto')}`;
    const { data } = await axios.get(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
        'Accept-Language': 'it-IT,it;q=0.9,en-US;q=0.8,en;q=0.7'
      },
      timeout: 5000
    });

    const $ = cheerio.load(data);
    let imageUrl: string | null = null;

    $('a.result__snippet, .result__body img').each((_, element) => {
      const src = $(element).attr('src');
      if (src && src.startsWith('http') && !src.includes('duckduckgo.com')) {
        imageUrl = src;
        return false;
      }
    });

    if (imageUrl) return imageUrl;
  } catch (err: any) {
    // Fallback silenzioso
  }

  return `https://placehold.co/600x600/e2e8f0/1e293b.jpg?text=${encodeURIComponent(query)}`;
}

async function importaTutto() {
  console.log('🚀 Avvio sincronizzazione da file Excel (Cartel1.xlsx e Cartel2.xlsx)...\n');

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  );

  cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  async function elaboraECaricaImmagineOnline(sku: string, name: string, urlDalFile?: string) {
    try {
      let finalImageUrl = urlDalFile?.trim();

      if (!finalImageUrl) {
        const searchTerm = `${name} ${sku}`;
        finalImageUrl = await cercaUrlImmagineGratis(searchTerm);
      }

      const uploadRes = await cloudinary.uploader.upload(finalImageUrl, {
        public_id: sku,
        folder: 'prodotti_ecom',
        overwrite: false,
      });

      console.log(`  └─ [IMG OK] Caricata su Cloudinary per SKU ${sku}`);
      return uploadRes.secure_url;
    } catch (err: any) {
      console.error(`  └─ [IMG ERR] Impossibile caricare immagine per SKU ${sku}:`, err.message);
      return null;
    }
  }

  let totali = 0;
  let successi = 0;
  let errori = 0;

  const mappaProdottiPadre = new Map<string, string>();

  // -------------------------------------------------------------
  // FASE 1: IMPORTAZIONE PRODOTTI DA Cartel1.xlsx
  // -------------------------------------------------------------
  const pathCartel1 = path.join(__dirname, 'Cartel1.xlsx');
  let righeCartel1: any[] = [];

  if (fs.existsSync(pathCartel1)) {
    console.log('📦 Lettura file principale (Excel: Cartel1.xlsx)...');
    const wb = XLSX.readFile(pathCartel1);
    const ws = wb.Sheets[wb.SheetNames[0]];
    righeCartel1 = XLSX.utils.sheet_to_json(ws);
  } else {
    console.error('❌ Errore critico: Il file Cartel1.xlsx non è stato trovato nella cartella!');
    return;
  }

  if (righeCartel1.length > 0) {
    console.log(`Trovati ${righeCartel1.length} prodotti in Cartel1.xlsx. Elaborazione in corso...\n`);
    console.log("🔍 Colonne rilevate in Cartel1.xlsx:", Object.keys(righeCartel1[0]));

    for (const row of righeCartel1) {
      const sku = getValoreExcel(row, ['Cod.', 'Codice']);
      const name = getValoreExcel(row, ['Descrizione', 'Nome']);

      if (!sku || !name) continue;

      totali++;
      mappaProdottiPadre.set(slugify(name), sku);

      // Listino 1 (ivato) -> imposto
      const rawImposto = getValoreExcel(row, ['Listino 1 (ivato)', 'Listino 1']);
      const imposto = parseFloat(rawImposto.replace(',', '.')) || 0;

      // Listino 2 (ivato) -> scontato
      const rawScontato = getValoreExcel(row, ['Listino 2 (ivato)', 'Listino 2']);
      const scontato = parseFloat(rawScontato.replace(',', '.')) || 0;

      // Giacenza
      const rawStock = getValoreExcel(row, ['Q.tà giacenza', 'giacenza', 'quantita', 'q.ta']);
      const stock = parseInt(rawStock, 10) || 0;

      // Categoria e Sottocategoria separate
      const category = getValoreExcel(row, ['Categoria']) || null;
      const subcategory = getValoreExcel(row, ['Sottocategoria']) || null;

      const urlFile = getValoreExcel(row, ['Immagine', 'Foto']);
      const imageUrl = await elaboraECaricaImmagineOnline(sku, name, urlFile);

      const { error } = await supabase
        .from('prodotti')
        .upsert({
          sku: sku,
          parent_sku: null,
          name: name,
          imposto: imposto,
          scontato: scontato,
          stock_quantity: stock,
          category: category,
          subcategory: subcategory, // Sottocategoria separata
          image_url: imageUrl,
          is_active: true
        }, { onConflict: 'sku' });

      if (error) {
        console.error(`❌ Errore SKU ${sku}:`, error.message);
        errori++;
      } else {
        successi++;
      }
    }
  }

  // -------------------------------------------------------------
  // FASE 2: IMPORTAZIONE VARIANTI DA Cartel2.xlsx
  // -------------------------------------------------------------
  const pathCartel2 = path.join(__dirname, 'Cartel2.xlsx');
  let righeCartel2: any[] = [];

  if (fs.existsSync(pathCartel2)) {
    console.log('\n📦 Lettura file varianti (Excel: Cartel2.xlsx)...');
    const wb = XLSX.readFile(pathCartel2);
    const ws = wb.Sheets[wb.SheetNames[0]];
    righeCartel2 = XLSX.utils.sheet_to_json(ws);
  } else {
    console.log('\n⚠️ File Cartel2.xlsx non trovato, salto la fase delle varianti.');
  }

  if (righeCartel2.length > 0) {
    console.log(`Trovate ${righeCartel2.length} varianti in Cartel2.xlsx. Elaborazione...\n`);

    for (const row of righeCartel2) {
      const sku = getValoreExcel(row, ['Cod.', 'Codice']);
      const name = getValoreExcel(row, ['Descrizione', 'Nome']);

      if (!sku || !name) continue;

      totali++;
      const slugNome = slugify(name);
      const parentSku = mappaProdottiPadre.get(slugNome) || `PARENT-${slugNome}`;
      
      const tagliaRaw = getValoreExcel(row, ['Taglia']);
      const taglia = tagliaRaw ? tagliaRaw.replace(/^\((.*)\)$/, '$1').trim() : null;
      
      const coloreRaw = getValoreExcel(row, ['Colore']);
      const colore = (coloreRaw && coloreRaw !== '-') ? coloreRaw : null;

      const rawStock = getValoreExcel(row, ['Q.tà giacenza', 'Q.tà disponibile', 'giacenza', 'disponibile']);
      const stock = parseInt(rawStock, 10) || 0;

      const urlFile = getValoreExcel(row, ['Immagine', 'Foto']);
      const imageUrl = await elaboraECaricaImmagineOnline(sku, name, urlFile);

      const { error } = await supabase
        .from('prodotti')
        .upsert({
          sku: sku,
          parent_sku: parentSku,
          name: name,
          size: taglia,
          color: colore,
          stock_quantity: stock,
          image_url: imageUrl,
          is_active: true
        }, { onConflict: 'sku' });

      if (error) {
        console.error(`❌ Errore SKU variante ${sku}:`, error.message);
        errori++;
      } else {
        successi++;
      }
    }
  }

  console.log('\n========================================');
  console.log(`🎉 Sincronizzazione completata!`);
  console.log(`Elaborati: ${totali} | Successi: ${successi} | Errori: ${errori}`);
  console.log('========================================\n');
}

importaTutto();