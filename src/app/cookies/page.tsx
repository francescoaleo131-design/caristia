import Link from 'next/link';
import { ArrowLeft, Cookie, ShieldCheck, Settings, Eye } from "lucide-react";

export const dynamic = 'force-dynamic';

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-slate-100 py-6 mb-12 sticky top-0 bg-white/80 backdrop-blur-md z-10">
        <div className="max-w-4xl mx-auto px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-slate-900 hover:text-indigo-600 transition-colors">
            <ArrowLeft size={18} strokeWidth={3} />
            Torna allo store
          </Link>
          <div className="flex items-center gap-2 text-indigo-600 font-black uppercase text-xs tracking-widest">
            <Cookie size={16} />
            Cookie Policy
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 pb-24">
        <header className="mb-16">
          <h1 className="text-6xl font-black text-slate-900 uppercase tracking-tighter mb-4">
            Cookie <span className="text-indigo-600">Policy</span>
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-xs font-bold uppercase tracking-widest text-slate-400">
            <span>Giocattoli Caristia</span>
            <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></span>
            <span>Ultimo aggiornamento: 04 Dicembre 2023</span>
            <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></span>
            <span>EEA & Svizzera</span>
          </div>
        </header>

        <article className="prose prose-slate max-w-none">
          <div className="space-y-8 text-slate-700 leading-relaxed text-lg">
            <p>Questa politica sui cookie è stata aggiornata l'ultima volta il Dicembre 4, 2023 e si applica ai cittadini e ai residenti permanenti legali dello Spazio Economico Europeo e della Svizzera.<br /><br /></p>

            <h2 className="text-2xl font-black text-slate-900 uppercase mt-12 mb-4 border-l-4 border-indigo-600 pl-4">1. Introduzione</h2>
            <p>Il nostro sito web, https://giocattolicaristia.it (di seguito: "il sito web") utilizza i cookie e altre tecnologie correlate (per comodità tutte le tecnologie sono definite "cookie").<br /><br />
            I cookie vengono anche inseriti da terze parti che abbiamo ingaggiato.<br /><br />
            Nel documento sottostante ti informiamo sull'uso dei cookie sul nostro sito web.<br /><br /></p>

            <h2 className="text-2xl font-black text-slate-900 uppercase mt-12 mb-4 border-l-4 border-indigo-600 pl-4">2. Cosa sono i cookie?</h2>
            <p>I cookie sono dei semplici file spediti assieme alle pagine di questo sito e salvati dal tuo browser sul disco rigido del tuo computer o altri dispositivi.<br /><br />
            Le informazioni raccolte in essi possono venire rispediti ai nostri server oppure ai server di terze parti durante la prossima visita.<br /><br /></p>

            <h2 className="text-2xl font-black text-slate-900 uppercase mt-12 mb-4 border-l-4 border-indigo-600 pl-4">3. Cosa sono gli script?</h2>
            <p>Uno script è un pezzo di codice usato per far funzionare correttamente ed interattivamente il nostro sito.<br /><br />
            Questo codice viene eseguito sui nostri server o sul tuo dispositivo.<br /><br /></p>

            <h2 className="text-2xl font-black text-slate-900 uppercase mt-12 mb-4 border-l-4 border-indigo-600 pl-4">4. Cos'è un web beacon?</h2>
            <p>Un web beacon (o pixel tag) è un piccolo, invisibile pezzo di testo o immagine su un sito che viene usato per monitorare il traffico di un sito web.<br /><br />
            Per fare questo, diversi dati su di te vengono conservati utilizzando dei web beacon.<br /><br /></p>

            <h2 className="text-2xl font-black text-slate-900 uppercase mt-12 mb-4 border-l-4 border-indigo-600 pl-4">5. Cookie</h2>
            <h2 className="text-2xl font-black text-slate-900 uppercase mt-12 mb-4 border-l-4 border-indigo-600 pl-4">5.1 Cookie tecnici o funzionali</h2>
            <p>Alcuni cookie assicurano il corretto funzionamento del sito e che le tue preferenze rimangano valide.<br /><br />
            Piazzando cookie funzionali, rendiamo più facile per te visitare il nostro sito web.<br /><br />
            In questo modo non devi inserire ripetutamente le stesse informazioni quando visiti il nostro sito web, per esempio, l'oggetto rimane nel tuo carrello finché non hai pagato.<br /><br />
            Possiamo piazzare questi cookie senza il tuo consenso.<br /><br /></p>

            <h2 className="text-2xl font-black text-slate-900 uppercase mt-12 mb-4 border-l-4 border-indigo-600 pl-4">5.2 Cookie statistici</h2>
            <p>Utilizziamo i cookie statistici per ottimizzare l'esperienza del sito web per i nostri utenti.<br /><br />
            Con questi cookie statistici otteniamo approfondimenti sull'uso del nostro sito web.<br /><br />
            Chiediamo il tuo permesso per piazzare cookie statistici.<br /><br /></p>

            <h2 className="text-2xl font-black text-slate-900 uppercase mt-12 mb-4 border-l-4 border-indigo-600 pl-4">5.3 Cookie di marketing/tracciamento</h2>
            <p>I cookie di marketing/tracciamento sono cookie o qualsiasi altra forma di memorizzazione locale, utilizzati per creare profili utente per visualizzare pubblicità o per tracciare l'utente su questo sito web o su diversi siti web per scopi di marketing simili.<br /><br /></p>

            <h2 className="text-2xl font-black text-slate-900 uppercase mt-12 mb-4 border-l-4 border-indigo-600 pl-4">5.4 Social media</h2>
            <p>Sul nostro sito web abbiamo inserito contenuti di Facebook, WhatsApp, Instagram e TikTok per promuovere pagine web (ad es.<br /><br />
            "mi piace", "pin") o condividerle (ad es.<br /><br />
            "tweet") su social network come Facebook, WhatsApp, Instagram e TikTok.<br /><br />
            Questo contenuto è incorporato con codice derivato da Facebook, WhatsApp, Instagram e TikTok e inserisce cookie.<br /><br />
            Questo contenuto potrebbe memorizzare ed elaborare alcune informazioni per la pubblicità personalizzata.<br /><br /></p>

            <p>Leggi l'informativa sulla privacy di questi social network (che possono cambiare regolarmente) per sapere cosa fanno con i tuoi dati (personali) che processano usando questi cookie.<br /><br />
            I dati ottenuti vengono anonimizzati quanto possibile.<br /><br />
            Facebook, WhatsApp, Instagram e TikTok si trovano negli Stati Uniti.<br /><br /></p>

            <h2 className="text-2xl font-black text-slate-900 uppercase mt-12 mb-4 border-l-4 border-indigo-600 pl-4">6. Cookie inseriti</h2>
            <p>WordPress<br /><br /></p>

            <p>Funzionale<br /><br /></p>

            <p>Consent to service wordpress<br /><br /></p>

            <p>WooCommerce<br /><br /></p>

            <p>Funzionale, Statistiche<br /><br /></p>

            <p>Consent to service woocommerce<br /><br /></p>

            <p>Elementor<br /><br /></p>

            <p>Statistiche (anonimo)<br /><br /></p>

            <p>Consent to service elementor<br /><br /></p>

            <p>Matomo<br /><br /></p>

            <p>Statistiche (anonimo)<br /><br /></p>

            <p>Consent to service matomo<br /><br /></p>

            <p>Google Analytics<br /><br /></p>

            <p>Statistiche<br /><br /></p>

            <p>Consent to service google-analytics<br /><br /></p>

            <p>mailpoet<br /><br /></p>

            <p>Pubblicità<br /><br /></p>

            <p>Consent to service mailpoet<br /><br /></p>

            <p>Google Fonts<br /><br /></p>

            <p>Pubblicità<br /><br /></p>

            <p>Consent to service google-fonts<br /><br /></p>

            <p>Google reCAPTCHA<br /><br /></p>

            <p>Pubblicità<br /><br /></p>

            <p>Consent to service google-recaptcha<br /><br /></p>

            <p>Google Maps<br /><br /></p>

            <p>Pubblicità<br /><br /></p>

            <p>Consent to service google-maps<br /><br /></p>

            <p>YouTube<br /><br /></p>

            <p>Pubblicità<br /><br /></p>

            <p>Consent to service youtube<br /><br /></p>

            <p>PayPal<br /><br /></p>

            <p>Funzionale<br /><br /></p>

            <p>Consent to service paypal<br /><br /></p>

            <p>LiveChat<br /><br /></p>

            <p>Funzionale, Pubblicità<br /><br /></p>

            <p>Consent to service livechat<br /><br /></p>

            <p>Facebook<br /><br /></p>

            <p>Pubblicità, Funzionale<br /><br /></p>

            <p>Consent to service facebook<br /><br /></p>

            <p>WhatsApp<br /><br /></p>

            <p>Funzionale<br /><br /></p>

            <p>Consent to service whatsapp<br /><br /></p>

            <p>TikTok<br /><br /></p>

            <p>Pubblicità, Funzionale<br /><br /></p>

            <p>Consent to service tiktok<br /><br /></p>

            <p>Varie<br /><br /></p>

            <p>Scopo in attesa di indagine<br /><br /></p>

            <p>Consent to service varie<br /><br /></p>

            <h2 className="text-2xl font-black text-slate-900 uppercase mt-12 mb-4 border-l-4 border-indigo-600 pl-4">7. Consenso</h2>
            <p>Quando visiti il sito web per la prima volta, noi mostreremo un popup con una spiegazione dei cookie.<br /><br />
            Appena clicchi su "Salva preferenze", dai il permesso a noi di usare le categorie di cookie e plugin come descritto in questa dichiarazione relativa ai popup e cookie.<br /><br />
            Puoi disabilitare i cookie attraverso il tuo browser, ma prendi in considerazione, che il nostro sito web potrebbe non funzionare più correttamente.<br /><br /></p>

            <h2 className="text-2xl font-black text-slate-900 uppercase mt-12 mb-4 border-l-4 border-indigo-600 pl-4">7.1 Gestisci le tue impostazioni di consenso</h2>
            <p>Funzionale<br /><br /></p>

            <p>Sempre attivo<br /><br /></p>

            <p>Statistiche<br /><br /></p>

            <p>Statistiche<br /><br /></p>

            <p>Marketing<br /><br /></p>

            <p>Marketing<br /><br /></p>

            <h2 className="text-2xl font-black text-slate-900 uppercase mt-12 mb-4 border-l-4 border-indigo-600 pl-4">8. Abilitare/disabilitare e cancellazione dei cookie</h2>
            <p>Puoi usare il tuo browser per cancellare automaticamente o manualmente i cookie.<br /><br />
            È anche possibile specificare che determinati cookie non possono essere piazzati.<br /><br />
            Un'altra opzione è quella di modificare le impostazioni del tuo browser internet in modo da ricevere un messaggio ogni volta che viene inserito un cookie.<br /><br />
            Per ulteriori informazioni su queste opzioni, consultare le istruzioni nella sezione Guida del tuo browser.<br /><br /></p>

            <p>Tieni presente che il nostro sito web potrebbe non funzionare correttamente se tutti i cookie sono disabilitati.<br /><br />
            Se cancelli i cookie nel vostro browser, essi verranno nuovamente inseriti dopo il consenso fornito quando visiterete nuovamente il nostro sito web.<br /><br /></p>

            <h2 className="text-2xl font-black text-slate-900 uppercase mt-12 mb-4 border-l-4 border-indigo-600 pl-4">9. I tuoi diritti in relazione ai dati personali</h2>
            <p>Hai i seguenti diritti relativi ai tuoi dati personali:<br /><br /></p>

            <p>Hai il diritto di sapere quando i tuoi dati personali sono necessari, cosa succede ad essi, quanto a lungo verranno mantenuti.<br /><br /></p>

            <div className="flex gap-3 items-start bg-slate-50 p-4 border-l-2 border-slate-200">
                <div className="mt-1.5 w-1.5 h-1.5 bg-indigo-600 rounded-full flex-shrink-0"></div>
                <p className="font-bold text-slate-800 uppercase text-sm tracking-tight m-0">Diritto di accesso: hai il diritto ad accedere ai tuoi dati personali dei quali siamo a conoscenza.</p>
            </div>
            <div className="flex gap-3 items-start bg-slate-50 p-4 border-l-2 border-slate-200">
                <div className="mt-1.5 w-1.5 h-1.5 bg-indigo-600 rounded-full flex-shrink-0"></div>
                <p className="font-bold text-slate-800 uppercase text-sm tracking-tight m-0">Diritto di rettifica: hai il diritto di completare, correggere, cancellare o bloccare i tuoi dati personali quando lo desideri.</p>
            </div>
            <p>Se ci darai il consenso per elaborare i tuoi dati, hai il diritto di revocare questo consenso e di eliminare i tuoi dati personali.<br /><br /></p>

            <div className="flex gap-3 items-start bg-slate-50 p-4 border-l-2 border-slate-200">
                <div className="mt-1.5 w-1.5 h-1.5 bg-indigo-600 rounded-full flex-shrink-0"></div>
                <p className="font-bold text-slate-800 uppercase text-sm tracking-tight m-0">Diritto di trasferire i tuoi dati: hai il diritto di richiedere tutti i tuoi dati dal controllore e trasferirli tutti quanti ad un altro controllore.</p>
            </div>
            <div className="flex gap-3 items-start bg-slate-50 p-4 border-l-2 border-slate-200">
                <div className="mt-1.5 w-1.5 h-1.5 bg-indigo-600 rounded-full flex-shrink-0"></div>
                <p className="font-bold text-slate-800 uppercase text-sm tracking-tight m-0">Diritto di opposizione: hai il diritto di opporti al trattamento dei tuoi dati. Noi rispetteremo questa scelta, a meno che non ci siano delle basi valide per trattarli.</p>
            </div>
            <p>Per esercitare questi diritti, non esitate a contattarci.<br /><br />
            Si prega di fare riferimento ai dettagli di contatto in fondo a questa Cookie Policy.<br /><br />
            Se hai un reclamo su come gestiamo i tuoi dati, vorremmo sentirti, ma hai anche il diritto di presentare un reclamo all'autorità di vigilanza (l'Autorità per la Protezione dei Dati).<br /><br /></p>

            <h2 className="text-2xl font-black text-slate-900 uppercase mt-12 mb-4 border-l-4 border-indigo-600 pl-4">10. Dettagli di contatto</h2>
            <p>Per domande e/o commenti riguardo la Cookie Policy e questa dichiarazione, per favore contattaci usando i seguenti dati di contatto:<br /><br /></p>

            <p>Giocattoli Caristia di Angelo Caristia<br /><br /></p>

            <p>Via Madonna della Via, 74/C, 95041 Caltagirone CT<br /><br /></p>

            <p>Italia<br /><br /></p>

            <p>Sito web: https://giocattolicaristia.it<br /><br /></p>

            <p>Email: info@giocattolicaristia.it<br /><br /></p>

            <p>Numero di telefono: +39 09332 6865<br /><br /></p>

            <p>Questa politica sui cookie è stata sincronizzata con cookiedatabase.org il Dicembre 4, 2023<br /><br /></p>

          </div>
        </article>

        {/* Box Contatti Finale BOLD */}
        <section className="mt-20 p-10 bg-slate-900 text-white rounded-3xl">
            <h2 className="text-3xl font-black uppercase mb-6 text-indigo-400">Dettagli di contatto</h2>
            <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-2 uppercase font-bold tracking-widest text-sm opacity-80">
                    <p>Giocattoli Caristia di Angelo Caristia</p>
                    <p>Via Madonna della Via, 74/C</p>
                    <p>95041 Caltagirone (CT)</p>
                </div>
                <div className="space-y-2 uppercase font-bold tracking-widest text-sm">
                    <p className="text-indigo-400">Email:</p>
                    <p className="text-lg font-black">info@giocattolicaristia.it</p>
                    <p className="mt-4 text-indigo-400">Web:</p>
                    <p>https://giocattolicaristia.it</p>
                </div>
            </div>
        </section>

        {/* Footer */}
        <footer className="mt-20 pt-12 border-t-4 border-slate-900">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-sm font-bold uppercase tracking-widest text-slate-500">
              © {new Date().getFullYear()} Giocattoli Caristia. Trasparenza sui Cookie.
            </p>
            <div className="flex gap-8 text-xs font-black uppercase tracking-widest">
              <Link href="/privacy" className="hover:text-indigo-600">Privacy Policy</Link>
              <Link href="/termini-condizioni" className="hover:text-indigo-600">Termini e Condizioni</Link>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
