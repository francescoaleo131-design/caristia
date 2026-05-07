import Link from 'next/link';
import { ArrowLeft, RefreshCcw, PackageCheck, AlertCircle } from "lucide-react";

export default function PoliticaRimborsoPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar di cortesia */}
      <nav className="border-b border-slate-50 py-4 mb-12">
        <div className="max-w-4xl mx-auto px-6 flex items-center">
          <Link href="/" className="flex items-center gap-2 text-sm text-slate-400 hover:text-indigo-600 transition-colors">
            <ArrowLeft size={16} />
            Torna allo store
          </Link>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 pb-24">
        <header className="mb-16">
          <h1 className="text-4xl font-light text-slate-900 tracking-tight mb-4">
            Politica di <span className="font-semibold text-indigo-600">Rimborso</span>
          </h1>
          <p className="text-slate-500">La tua soddisfazione è la nostra priorità. Leggi come gestiamo resi e rimborsi.</p>
        </header>

        <div className="space-y-12 text-slate-600 leading-relaxed">
          
          {/* Sezione 1: Il Diritto di Recesso */}
          <section className="grid md:grid-cols-3 gap-8 items-start">
            <div className="flex items-center gap-3 text-indigo-600 font-semibold uppercase text-xs tracking-widest">
              <RefreshCcw size={18} />
              <span>Diritto di Recesso</span>
            </div>
            <div className="md:col-span-2">
              <p>
                Ai sensi delle norme europee, hai il diritto di recedere dal contratto di acquisto entro <strong>14 giorni</strong> dal ricevimento della merce, senza dover fornire alcuna motivazione. 
              </p>
            </div>
          </section>

          {/* Sezione 2: Condizioni del Prodotto */}
          <section className="grid md:grid-cols-3 gap-8 items-start border-t border-slate-50 pt-12">
            <div className="flex items-center gap-3 text-indigo-600 font-semibold uppercase text-xs tracking-widest">
              <PackageCheck size={18} />
              <span>Stato del reso</span>
            </div>
            <div className="md:col-span-2 space-y-4">
              <p>
                Per avere diritto a un rimborso completo, il prodotto deve essere nelle stesse condizioni in cui lo hai ricevuto. In particolare:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-sm">
                <li>Il giocattolo deve essere nella sua confezione originale sigillata.</li>
                <li>Non deve presentare segni di utilizzo o danneggiamento.</li>
                <li>Tutti gli accessori e manuali devono essere inclusi.</li>
              </ul>
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 flex gap-3 text-sm text-amber-800">
                <AlertCircle className="shrink-0" size={18} />
                <p>Nota: Per motivi igienici o di sicurezza, alcuni prodotti (come articoli gonfiabili già aperti) potrebbero non essere rimborsabili.</p>
              </div>
            </div>
          </section>

          {/* Sezione 3: Procedura */}
          <section className="grid md:grid-cols-3 gap-8 items-start border-t border-slate-50 pt-12">
            <div className="text-indigo-600 font-semibold uppercase text-xs tracking-widest">
              <span>Come procedere</span>
            </div>
            <div className="md:col-span-2">
              <p className="mb-4">
                Per avviare un reso, contattaci all'indirizzo <strong>info@giocattolicaristia.it</strong> indicando il tuo numero d'ordine. 
              </p>
              <p>
                Le spese di spedizione per la restituzione sono a carico dell'acquirente, a meno che il prodotto non sia arrivato danneggiato o errato.
              </p>
            </div>
          </section>

          {/* Sezione 4: Tempi del Rimborso */}
          <section className="grid md:grid-cols-3 gap-8 items-start border-t border-slate-50 pt-12">
            <div className="text-indigo-600 font-semibold uppercase text-xs tracking-widest">
              <span>Rimborsi</span>
            </div>
            <div className="md:col-span-2">
              <p>
                Una volta ricevuto e ispezionato il tuo reso, ti invieremo un'email per informarti dell'approvazione o del rifiuto del rimborso. 
                Se approvato, il rimborso verrà elaborato automaticamente sul metodo di pagamento originale entro <strong>5-10 giorni lavorativi</strong>.
              </p>
            </div>
          </section>

        </div>

        <footer className="mt-24 pt-12 border-t border-slate-100 text-center text-sm text-slate-400">
          <p>© {new Date().getFullYear()} Giocattoli Caristia. Tutti i diritti riservati.</p>
        </footer>
      </main>
    </div>
  );
}