import Link from 'next/link';
import { ArrowLeft, RefreshCcw, PackageCheck, AlertCircle, CalendarClock, ShieldAlert } from "lucide-react";

export default function PoliticaRimborsoPage() {
  return (
    <div className="min-h-screen bg-white">
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
            Politica di <span className="font-semibold text-indigo-600">Rimborso e Cancellazione</span>
          </h1>
          <p className="text-slate-500">La tua soddisfazione è la nostra priorità. Leggi come gestiamo resi, rimborsi ed eventi.</p>
        </header>

        <div className="space-y-12 text-slate-600 leading-relaxed">
          
          <section className="grid md:grid-cols-3 gap-8 items-start border-b border-slate-100 pb-12">
            <div className="flex items-center gap-3 text-indigo-600 font-semibold uppercase text-xs tracking-widest">
              <CalendarClock size={18} />
              <span>Animazione ed Eventi</span>
            </div>
            <div className="md:col-span-2 space-y-4">
              <p>
                Per i servizi di intrattenimento, feste e animazione si applicano condizioni particolari legate alla pianificazione e alla prenotazione esclusiva della data:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-sm">
                <li>Al momento della prenotazione è richiesto un <strong>anticipo del 30%</strong> sul totale del preventivo, il quale è rigorosamente <strong>non rimborsabile</strong> in caso di cancellazione dell'evento.</li>
                <li>In caso di qualsiasi modifica contrattuale (variazione della data, cambio dell'orario, modifica del luogo o dei dettagli del pacchetto scelto), l'organizzatore deve inviare tempestiva comunicazione <strong>almeno 10 giorni prima</strong> della data fissata per l'evento.</li>
              </ul>
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 flex gap-3 text-sm text-amber-800">
                <ShieldAlert className="shrink-0" size={18} />
                <p>Nota: Qualora le modifiche o le disdette venissera comunicate oltre il termine dei 10 giorni antecedenti l'evento, l'anticipo versato andrà interamente perso e non sarà possibile recuperarlo o spostarlo su una nuova data.</p>
              </div>
            </div>
          </section>

          <section className="grid md:grid-cols-3 gap-8 items-start ">
            <div className="flex items-center gap-3 text-indigo-600 font-semibold uppercase text-xs tracking-widest">
              <RefreshCcw size={18} />
              <span>Diritto di Recesso</span>
            </div>
            <div className="md:col-span-2">
              <p>
                Ai sensi delle norme europee, per tutti gli acquisti di beni fisici (giocattoli e articoli dello store), hai il diritto di recedere dal contratto di acquisto entro <strong>14 giorni</strong> dal ricevimento della merce, senza dover fornire alcuna motivazione.
              </p>
            </div>
          </section>

          <section className="grid md:grid-cols-3 gap-8 items-start border-t border-slate-50 pt-12">
            <div className="flex items-center gap-3 text-indigo-600 font-semibold uppercase text-xs tracking-widest">
              <PackageCheck size={18} />
              <span>Stato del reso</span>
            </div>
            <div className="md:col-span-2 space-y-4">
              <p>
                Per avere diritto a un rimborso completo sulla merce fisica, il prodotto deve essere nelle stesse condizioni in cui lo hai ricevuto. In particolare:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-sm">
                <li>Il giocattolo deve essere nella sua confezione originale sigillata.</li>
                <li>Non deve presentare segni di utilizzo o danneggiamento.</li>
                <li>Tutti gli accessori e manuali devono essere inclusi.</li>
              </ul>
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 flex gap-3 text-sm text-amber-800">
                <AlertCircle className="shrink-0" size={18} />
                <p>Nota: Per motivi igienici o di sicurezza, alcuni prodotti (come articoli gonfiabili già aperti o costumi monouso) potrebbero non essere rimborsabili.</p>
              </div>
            </div>
          </section>

          <section className="grid md:grid-cols-3 gap-8 items-start border-t border-slate-50 pt-12">
            <div className="text-indigo-600 font-semibold uppercase text-xs tracking-widest">
              <span>Come procedere</span>
            </div>
            <div className="md:col-span-2">
              <p className="mb-4">
                Per avviare la pratica di reso di un oggetto o per richiedere variazioni sull'animazione, contattaci tempestivamente all'indirizzo <strong>info@giocattolicaristia.it</strong> indicando i tuoi riferimenti e il numero d'ordine/preventivo.
              </p>
              <p>
                Le spese di spedizione per la restituzione dei giocattoli sono a carico dell'acquirente, a meno che il prodotto non sia arrivato visibilmente danneggiato o errato.
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
                Una volta ricevuto e ispezionato il tuo reso (o a seguito di un annullamento tempestivo del servizio nei termini di preavviso), ti invieremo un'email per informarti dell'approvazione o del rifiuto del rimborso. 
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