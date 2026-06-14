import Link from 'next/link';
import { ArrowLeft, ShieldCheck } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-slate-100 py-6 mb-12 sticky top-0 bg-white/80 backdrop-blur-md z-10">
        <div className="max-w-4xl mx-auto px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-slate-900 hover:text-indigo-600 transition-colors">
            <ArrowLeft size={18} strokeWidth={3} />
            Torna allo store
          </Link>
          <div className="flex items-center gap-2 text-indigo-600 font-black uppercase text-xs tracking-widest">
            <ShieldCheck size={16} />
            Privacy Sicura
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 pb-24">
        <header className="mb-16">
          <h1 className="text-6xl font-black text-slate-900 uppercase tracking-tighter mb-4">
            Informativa sulla <span className="text-indigo-600">Privacy</span>
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-xs font-bold uppercase tracking-widest text-slate-400">
            <span>Giocattoli Caristia</span>
            <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></span>
            <span>Ultimo aggiornamento: 24 Maggio 2020</span>
            <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></span>
            <span>GDPR Compliance</span>
          </div>
        </header>

        <article className="prose prose-slate max-w-none">
          <div className="space-y-8 text-slate-700 leading-relaxed text-lg">
            <p>Informativa Sulla Privacy Online Generale Di Giocattoli Caristia<br /><br /></p>

            <p className="font-bold text-slate-900 italic">Aggiornato il 24 maggio 2020</p>
            <p>La tua privacy è importante per la Famiglia di aziende Giocattoli Caristia.<br /><br />
            Questa informativa sulla privacy descrive i dati che Giocattoli Caristia raccoglie dall’utente, attraverso le nostre interazioni con gli utenti, attraverso i Servizi Giocattoli Caristia e il nostro utilizzo dei dati.<br /><br />
            Descrive anche quali dati raccolgono le terze parti dagli utenti e come tali dati sono utilizzati.<br /><br />
            I termini chiave sono in corsivo e sottolineati (così) e si trovano anche nella sezione DEFINIZIONI.<br /><br />
            Questa informativa sulla privacy fornisce gli esempi di dati che raccogliamo, come li usiamo e le scelte che l’utente può esercitare; questi esempi potrebbero non essere esaurienti o esclusivi.<br /><br /></p>

            <p>Questo documento si applica a Servizi Giocattoli Caristia, inclusi i Siti Giocattoli Caristia, app, app mobili, servizi online e prodotti connessi.<br /><br />
            I Siti Giocattoli Caristia sono anche soggetti ai TERMINI E CONDIZIONI DI GIOCATTOLI CARISTIA.<br /><br />
            Potrebbero essere applicati altri termini, accordi di licenza per l’utente finale o regole aggiuntive.<br /><br />
            Ogni volta che usa i Servizi Giocattoli Caristia, l’utente accetta questi termini.<br /><br />
            Se non si accettano tutti i termini della presente Informativa sulla privacy, si prega di non utilizzare i Servizi Giocattoli Caristia.<br /><br /></p>

            <h2 className="text-2xl font-black text-slate-900 uppercase mt-12 mb-4 border-l-4 border-indigo-600 pl-4">DEFINIZIONI</h2>
            <p>Bambino/bambini (ragazzo/ragazzi).<br /><br />
            Persone che non hanno raggiunto l’età legale per acconsentire alla raccolta e al trattamento dei loro dati personali.<br /><br />
            Per la maggior parte delle aree del mondo, si tratta di persone di età inferiore a 13 anni.<br /><br />
            Nello Spazio economico europeo (SEE), si tratta di persone di età inferiore a 16 anni.<br /><br />
            Per i Servizi Giocattoli Caristia erogati in giurisdizioni in cui l’età è diversa aderiamo alla definizione locale di “bambino”.<br /><br /></p>

            <p>Dati.<br /><br />
            I dati che raccogliamo.<br /><br />
            Includono, in ordine alfabetico:<br /><br /></p>

            <p>Contenuti generati dall’utente.<br /><br /></p>

            <p>Dati di accesso ai social network.<br /><br /></p>

            <p>Dati di contatto personali.<br /><br /></p>

            <p>Dati di login.<br /><br /></p>

            <p>Dati forniti da terze parti.<br /><br /></p>

            <p>Dati personali.<br /><br /></p>

            <p>Dati raccolti automaticamente.<br /><br /></p>

            <p>Dati su interessi o dati demografici.<br /><br /></p>

            <p>Dati sui sondaggi.<br /><br /></p>

            <p>Dati sul dispositivo.<br /><br /></p>

            <p>Dati sul pagamento.<br /><br /></p>

            <p>Dati sull’ordine.<br /><br /></p>

            <p>Dati sulla posizione.<br /><br /></p>

            <p>Pubblicità basata sugli interessi.<br /><br />
            Pubblicità mirata per prodotti e servizi che potrebbero essere di interesse per l’utente in base alle sue attività.<br /><br /></p>

            <p>Servizi Giocattoli Caristia.<br /><br />
            Tutti i servizi online offerti dalla Famiglia di aziende Giocattoli Caristia, compresi siti web (Siti Giocattoli Caristia), app e prodotti connessi.<br /><br />
            Leggi di più sui SERVIZI GIOCATTOLI CARISTIA.<br /><br /></p>

            <p>Terze parti.<br /><br />
            Qualsiasi società non correlata alla Famiglia di aziende Giocattoli Caristia, compresi i siti di terze parti a cui ci colleghiamo o terze parti che gestiscono negozi online o negozi di app mobili.<br /><br />
            Leggi di più sui PARTNER DI TERZE PARTI E PARTNER TECNOLOGICI DI TERZE PARTI.<br /><br /></p>

            <p>Partner di terze parti o fornitore di servizi di terze parti.<br /><br />
            Una terza parte che Giocattoli Caristia si è impegnata ad assistere nella fornitura di Servizi Giocattoli Caristia, inclusi agenti, venditori, fornitori di servizi e altri.<br /><br /></p>

            <p>Partner tecnologici di terze parti.<br /><br />
            Terze parti di cui utilizziamo le tecnologie per offrire contenuti, comprendere i nostri utenti e fornire pubblicità.<br /><br /></p>

            <h2 className="text-2xl font-black text-slate-900 uppercase mt-12 mb-4 border-l-4 border-indigo-600 pl-4">SERVIZI GIOCATTOLI CARISTIA</h2>
            <p>I Servizi Giocattoli Caristia sono servizi online offerti dalla Famiglia di aziende Giocattoli Caristia, incluso:<br /><br /></p>

            <p>Siti Giocattoli Caristia,<br /><br /></p>

            <p>Negozi online,<br /><br /></p>

            <p>Applicazioni di Servizi Giocattoli Caristia<br /><br /></p>

            <p>avanzate, e<br /><br /></p>

            <p>Prodotti collegati.<br /><br />
            Per informazioni sulle funzionalità, leggere le FAQ dello specifico prodotto connesso, sui responsabili della privacy e sui dati raccolti.<br /><br /></p>

            <p>Per effettuare un acquisto, scaricare un’app o utilizzare un prodotto connesso, potrebbe essere necessario interfacciarsi con terze parti.<br /><br /></p>

            <p>Può essere possibile connettere un’app o un prodotto connesso tramite un servizio wireless.<br /><br /></p>

            <p>Siti Giocattoli Caristia<br /><br /></p>

            <p>Offriamo Siti Giocattoli Caristia con giochi, informazioni, prodotti in vendita e altre attività interattive e statiche a cura della Famiglia di aziende Giocattoli Caristia.<br /><br /></p>

            <p>Alcuni Siti Giocattoli Caristia o aree di tali siti sono progettati per l’utilizzo da parte di bambini, mentre altri sono destinati agli adulti.<br /><br />
            È possibile ottenere ulteriori informazioni sui siti per bambini e sulle pratiche specifiche per loro leggendo la nostra<br /><br /></p>

            <p>Non è necessario condividere dati di contatto personali per l’utilizzo della maggior parte dei Siti Giocattoli Caristia, tuttavia la maggior parte dei Siti Giocattoli Caristia per adulti e ragazzi contiene sezioni speciali e privilegi per i membri che si iscrivono.<br /><br /></p>

            <p>Negozi online<br /><br /></p>

            <p>Offriamo l’opportunità di acquistare prodotti nei nostri negozi online, in app o tramite altri media o partner commerciali.<br /><br />
            Spesso i negozi online fanno parte di un Sito Giocattoli Caristia più ampio.<br /><br /></p>

            <p>Per effettuare acquisti, i clienti devono avere più di 18 anni e disporre di un metodo di pagamento valido.<br /><br /></p>

            <p>Quando un cliente effettua un ordine online, sarà inviata un’email di conferma.<br /><br /></p>

            <p>Servizi Giocattoli Caristia avanzati<br /><br /></p>

            <p>I Servizi Giocattoli Caristia avanzati possono essere disponibili per l’utente o a nome del suo bambino a un costo mensile o con altra cadenza con alcuni Servizi Giocattoli Caristia.<br /><br /></p>

            <p>Applicazioni<br /><br /></p>

            <p>Offriamo una gamma di app divertenti e coinvolgenti con i nostri brand.<br /><br />
            In alcuni casi le app possono essere rese disponibili tramite un negozio online Giocattoli Caristia, ma più spesso quando si scarica o si acquista un’app o si effettua un acquisto in-app, il processo è effettuato attraverso un negozio online di applicazioni mobili di terze parti.<br /><br />
            Visita LINK E TERZE PARTI per maggiori informazioni.<br /><br /></p>

            <p>Nota: L’utilizzo di app può essere soggetto a un Contratto di licenza con l’utente finale (EULA) oltre ai TERMINI E CONDIZIONI STANDARD DI GIOCATTOLI CARISTIA.<br /><br /></p>

            <p>Prodotti connessi<br /><br /></p>

            <p>Giocattoli Caristia offre a genitori e bambini una gamma di prodotti che si connettono a Internet.<br /><br />
            Talvolta collaboriamo con partner di terze parti per offrire prodotti connessi.<br /><br /></p>

            <p>Alcuni prodotti connessi, come i baby monitor, sono destinati esclusivamente ai genitori.<br /><br /></p>

            <p>L’utilizzo di prodotti connessi richiede in genere il download di un’app associata.<br /><br /></p>

            <p>Le prassi per la privacy di alcuni prodotti connessi sono responsabilità di una terza parte.<br /><br /></p>

            <p>Forniamo FAQ e altre informazioni per aiutare a comprendere le caratteristiche specifiche del prodotto connesso (per esempio se sono raccolti dati vocali o visivi), chi è il responsabile della privacy e quali dati raccogliamo.<br /><br /></p>

            <p>Servizi wireless<br /><br /></p>

            <p>Potremmo comunicare con l’utente tramite dispositivo mobile.<br /><br />
            Per ricevere Servizi Giocattoli Caristia attraverso una connessione wireless, i visitatori devono fornire il proprio consenso e confermare di aver compreso che saranno addebitate tariffe per l’invio e la ricezione di messaggi in base al proprio piano tariffario.<br /><br />
            Potrebbe essere richiesto di riconfermare tale accordo.<br /><br /></p>

            <p>Se non diversamente indicato, saranno applicate le tariffe standard; se si applicano tariffe premium, i visitatori saranno avvisati prima della registrazione.<br /><br /></p>

            <p>Giocattoli Caristia non è responsabile dei costi del servizio wireless, come i costi di messaggistica, associati all’accesso o alla connessione ai Servizi Giocattoli Caristia.<br /><br /></p>

            <h2 className="text-2xl font-black text-slate-900 uppercase mt-12 mb-4 border-l-4 border-indigo-600 pl-4">CHE DATI RACCOGLIAMO?</h2>
            <p>Raccogliamo i dati che aiutano l’utente a registrarsi per utilizzare un Servizio Giocattoli Caristia.<br /><br />
            Spesso i dati di accesso sono sufficienti per la registrazione.<br /><br /></p>

            <p>Raccogliamo dati di contatto personali.<br /><br /></p>

            <p>Raccogliamo altri dati personali sugli utenti, per esempio interessi o dati demografici, ecc.<br /><br /></p>

            <p>Raccogliamo contenuti generati dall’utente nel caso in cui un Servizio Giocattoli Caristia offre questa opzione.<br /><br /></p>

            <p>Raccogliamo dati sul dispositivo, dati raccolti automaticamente e dati che aiutano ad accedere ai Servizi Giocattoli Caristia (per esempio dati di accesso, nome della rete Wi-Fi, etc.).<br /><br /></p>

            <p>Raccogliamo dati dall’utente e relativi all’utente per fornire i Servizi Giocattoli Caristia.<br /><br />
            I dati raccolti dipendono dallo specifico Servizio Giocattoli Caristia.<br /><br /></p>

            <p className="font-bold text-slate-900 italic">Possiamo raccogliere:</p>
            <p>Dati di accesso.<br /><br /></p>

            <p>Dati di contatto personali.<br /><br /></p>

            <p>Dati raccolti automaticamente.<br /><br /></p>

            <p>Dati di accesso ai social network.<br /><br /></p>

            <p>Dati sull’ordine.<br /><br /></p>

            <p>Dati sul pagamento.<br /><br /></p>

            <p>Nome e indirizzo di spedizione quando un utente effettua un acquisto e chiede di inviarlo a sé o a qualcun altro.<br /><br /></p>

            <p>Dati sulla posizione.<br /><br /></p>

            <p>Indirizzi email, nomi utente o altri dati degli amici a cui si invia una e-card o che l’utente invita a partecipare a un’offerta dei Servizi Giocattoli Caristia.<br /><br /></p>

            <p>Dati sul bambino (come dati personali e dati di contatto del bambino, incluso interessi o dati demografici).<br /><br /></p>

            <p>Dati che consentono di confermare che l’utente sia il genitore o il tutore legale del bambino, inclusa l’età.<br /><br /></p>

            <p>Contenuti generati dall’utente.<br /><br /></p>

            <p>Nome della rete Wi-Fi.<br /><br /></p>

            <p>Dati del sondaggio.<br /><br /></p>

            <h2 className="text-2xl font-black text-slate-900 uppercase mt-12 mb-4 border-l-4 border-indigo-600 pl-4">QUANDO RACCOGLIAMO INFORMAZIONI?</h2>
            <p className="font-bold text-slate-900 italic">Raccogliamo dati:</p>
            <p>che condividi volontariamente;<br /><br /></p>

            <p>per adempiere a una transazione; e<br /><br /></p>

            <p>automaticamente.<br /><br /></p>

            <p>Visitare INFORMAZIONI SU COOKIE E TECNOLOGIE per maggiori informazioni sulle tecnologie utilizzate per raccogliere automaticamente i dati.<br /><br /></p>

            <p>Raccogliamo dati che condividi volontariamente<br /><br /></p>

            <p>Si possono usare molti Servizi Giocattoli Caristia senza condividere nessun dato di contatto personale.<br /><br />
            Se lo si desidera, è possibile condividere con noi dati di contatto personali, dati personali, dati di accesso, interessi o dati demografici o dati del sondaggio sull’utente o sul bambino quando:<br /><br /></p>

            <p>Ci si registra per un Servizio Giocattoli Caristia.<br /><br /></p>

            <p>Si utilizza un gioco.<br /><br /></p>

            <p>Si utilizza un’attività interattiva.<br /><br /></p>

            <p>Si effettua un acquisto presso uno dei nostri negozi online (consultare RACCOGLIAMO INFORMAZIONI SUGLI ORDINI).<br /><br /></p>

            <p>Si ordina un catalogo.<br /><br /></p>

            <p>Si partecipa a un concorso o una lotteria.<br /><br /></p>

            <p>Ci si iscrive per ricevere informazioni e offerte.<br /><br /></p>

            <p>Ci si candida per un lavoro online.<br /><br /></p>

            <p>Si risponde a un sondaggio o questionario.<br /><br /></p>

            <p>Si inviano contenuti generati dall’utente.<br /><br />
            Si applicano regole speciali; per ulteriori informazioni consultare CONTENUTI GENERATI DALL’UTENTE.<br /><br /></p>

            <p>Raccogliamo informazioni sugli ordini<br /><br /></p>

            <p>Quando un cliente mette un articolo in un carrello della spesa, effettua un ordine o richiede un catalogo online, raccogliamo dati sull’ordine associato alla transazione.<br /><br />
            Ciò potrebbe includere dati personali del bambino.<br /><br /></p>

            <p>Quando si effettua un ordine, i clienti possono registrarsi per completare comodamente l’ordine e per effettuare ordini in futuro.<br /><br />
            Quando i clienti registrati ritornano sul sito per effettuare ordini successivi, possono identificarsi con i propri dati di accesso.<br /><br /></p>

            <p>Raccogliamo dati automaticamente quando si accede a un servizio Giocattoli Caristia<br /><br /></p>

            <p>Raccogliamo alcuni dati automaticamente, incluso dati sul dispositivo, per fornire i Servizi Giocattoli Caristia o Siti Giocattoli Caristia appropriati (per esempio nella lingua dell’utente) quando li si utilizza o li si visita.<br /><br /></p>

            <h2 className="text-2xl font-black text-slate-900 uppercase mt-12 mb-4 border-l-4 border-indigo-600 pl-4">PERCHÉ RACCOGLIAMO DATI?</h2>
            <p>Raccogliamo i dati degli utenti per soddisfare le loro esigenze, gestire i nostri contenuti e pubblicità, operare in modo efficiente e migliorare i prodotti e Servizi Giocattoli Caristia.<br /><br /></p>

            <p>Raccogliamo i dati per fare ciò che l’utente ci chiede.<br /><br /></p>

            <p>Raccogliamo i dati per fornire informazioni su prodotti o Servizi Giocattoli Caristia che possono interessare all’utente o al bambino.<br /><br /></p>

            <p>Raccogliamo i dati per supportare operazioni e Servizi Giocattoli Caristia.<br /><br /></p>

            <p>Raccogliamo i dati per migliorare i Servizi Giocattoli Caristia.<br /><br /></p>

            <p>Raccogliamo i dati per migliorare i nostri prodotti.<br /><br /></p>

            <p>Raccogliamo i dati per offrire contenuti agli utenti.<br /><br /></p>

            <p>Raccogliamo i dati per fare pubblicità.<br /><br /></p>

            <p>Raccogliamo i dati per il mantenimento della sicurezza.<br /><br /></p>

            <p>Raccogliamo i dati per proteggere i nostri diritti legali e i diritti legali degli altri.<br /><br /></p>

            <p className="font-bold text-slate-900 italic">Raccogliamo dati:</p>
            <p>Per fornire i Servizi Giocattoli Caristia.<br /><br /></p>

            <p>Per rispondere alle richieste degli utenti.<br /><br /></p>

            <p>Per verificare l’età dell’utente o del bambino.<br /><br /></p>

            <p>Per completare le transazioni.<br /><br /></p>

            <p>Per finalizzare le transazioni.<br /><br /></p>

            <p>Per confermare l’ordine.<br /><br /></p>

            <p>Per fornire aggiornamenti sullo stato dell’ordine.<br /><br /></p>

            <p>Per finalizzare gli abbonamenti gratuiti o a pagamento.<br /><br /></p>

            <p>Per avvisare i vincitori di concorsi e lotterie.<br /><br /></p>

            <p>Per inviare consigli sui Servizi Giocattoli Caristia che interessano l’utente o i bambini.<br /><br /></p>

            <p>Per inviare consigli su prodotti che interessano all’utente o ai bambini.<br /><br /></p>

            <p>Per inviare comunicazioni di marketing.<br /><br /></p>

            <p>Per inviare cataloghi.<br /><br /></p>

            <p>Per offrire pubblicità basate sugli interessi.<br /><br /></p>

            <p>Per analizzare e misurare l’efficacia della nostra pubblicità.<br /><br /></p>

            <p>Per supportare i Servizi Giocattoli Caristia.<br /><br /></p>

            <p>Per comprendere i nostri visitatori.<br /><br /></p>

            <p>Per migliorare i nostri prodotti.<br /><br /></p>

            <p>Per migliorare i Servizi Giocattoli Caristia.<br /><br /></p>

            <p>Per sviluppare nuovi prodotti.<br /><br /></p>

            <p>Per sviluppare nuovi Servizi Giocattoli Caristia.<br /><br /></p>

            <p>Per mantenere la sicurezza, l’integrità e la qualità dei prodotti e Servizi Giocattoli Caristia.<br /><br /></p>

            <p>Per proteggere la proprietà intellettuale.<br /><br /></p>

            <p>Per proteggere i nostri diritti legali.<br /><br /></p>

            <p>Per proteggere i diritti legali altrui.<br /><br /></p>

            <p>Possiamo collaborare con partner di terze parti, inclusi partner tecnologici di terze parti, per alcuni o per tutti questi scopi.<br /><br />
            Per informazioni su alcune di queste terze parti, consultare le INFORMAZIONI SU COOKIE E TECNOLOGIE.<br /><br /></p>

            <p>Possiamo combinare tutti i dati raccolti per comprendere meglio le esigenze degli utenti, migliorare le operazioni e i Servizi Giocattoli Caristia, gestire contenuti e pubblicità, inviare offerte e informazioni e offrire un servizio migliore.<br /><br /></p>

            <p>Se ai sensi delle leggi locali è necessario il consenso dell’utente per raccogliere dati per uno scopo particolare, ciò avverrà nel momento in cui i dati sono raccolti.<br /><br /></p>

            <h2 className="text-2xl font-black text-slate-900 uppercase mt-12 mb-4 border-l-4 border-indigo-600 pl-4">DATI DA ALTRE FONTI</h2>
            <p>Talvolta otteniamo dati forniti da terze parti sugli utenti e li combiniamo con gli altri dati personali che abbiamo raccolto.<br /><br /></p>

            <p>Possiamo raccogliere dati di autenticazione.<br /><br /></p>

            <p>Raccogliamo informazioni da altre fonti<br /><br /></p>

            <p>Potremmo ottenere dati da terze parti sugli utenti forniti da fonti commerciali.<br /><br />
            Possiamo combinare tali dati con altri dati personali dell’utente raccolti da noi.<br /><br /></p>

            <p>Possiamo anche raccogliere dati di autenticazione (per esempio per verificare che l’utente sia un titolare autorizzato di una carta di credito).<br /><br /></p>

            <h2 className="text-2xl font-black text-slate-900 uppercase mt-12 mb-4 border-l-4 border-indigo-600 pl-4">CONDIVISIONE DEI DATI</h2>
            <p className="font-bold text-slate-900 italic">Possiamo condividere dati come segue:</p>
            <p>Condividiamo i dati ottenuti all’interno della Famiglia di aziende Giocattoli Caristia e con i nostri partner di terze parti.<br /><br /></p>

            <p>Condividiamo alcuni dati di contatto personali con terze parti per scopi di marketing con il consenso dell’utente.<br /><br /></p>

            <p>Come è consuetudine con la rivendita per corrispondenza, condividiamo indirizzi postali (ma non indirizzi email) con altre società di vendita per corrispondenza i cui prodotti e servizi potrebbero interessare all’utente.<br /><br />
            Dove richiesto, otteniamo prima il consenso dell’utente.<br /><br />
            Diamo all’utente l’opportunità di annullare l’iscrizione.<br /><br /></p>

            <p>Se l’utente fornisce dati di accesso ai social network, Giocattoli Caristia condivide i dati con i social network dell’utente.<br /><br /></p>

            <p>Condividiamo dati sull’utilizzo e sugli interessi ottenuti tramite i cookie e la tecnologia con partner tecnologici di terze parti e otteniamo il consenso dell’utente ove richiesto dalla legge applicabile.<br /><br />
            Scopri ulteriori informazioni su<br /><br /></p>

            <p>Ove necessario, condividiamo qualsiasi dato (inclusi i dati personali) ottenuto per soddisfare richieste o citazioni legali, proteggere la proprietà o la sicurezza personale, quando un’azienda Giocattoli Caristia è acquistata o venduta, o come altrimenti consentito o richiesto dalla legge.<br /><br /></p>

            <p>Condividiamo i dati ottenuti all’interno della Famiglia di aziende Giocattoli Caristia e con i nostri partner di terze parti perché possano adempiere ai loro compiti a nostro nome.<br /><br /></p>

            <p>A eccezione di quanto descritto nella presente Informativa sulla privacy, non condividiamo i dati di contatto personali ricevuti online da o relativi a bambini con altre aziende al di fuori della Famiglia di aziende Giocattoli Caristia per scopi di marketing diretto.<br /><br /></p>

            <p>Condivisione con i nostri partner di terze parti<br /><br /></p>

            <p>Possiamo condividere dati con diversi partner di terze parti.<br /><br />
            Questi ci aiutano a:<br /><br /></p>

            <p>Gestire la manutenzione e la sicurezza del database e del server.<br /><br /></p>

            <p>Gestire le transazioni.<br /><br /></p>

            <p>Elaborare e completare ordini o richieste.<br /><br /></p>

            <p>Analizzare le nostre offerte.<br /><br /></p>

            <p>Inoltre, offrono altri servizi simili alla Famiglia di aziende Giocattoli Caristia.<br /><br />
            Richiediamo ai partner di terze parti che accedono ai dati di salvaguardare la sicurezza dei dati.<br /><br /></p>

            <p>Condivisione con terze parti a scopo di marketing<br /><br /></p>

            <p>Condividiamo determinati nomi e indirizzi postali dei destinatari dei cataloghi con terze parti i cui cataloghi potrebbero interessare all’utente.<br /><br />
            Dove richiesto, otteniamo prima il consenso dell’utente.<br /><br />
            È possibile annullare l’iscrizione in qualsiasi momento.<br /><br /></p>

            <p>Con il consenso dell’utente, Giocattoli Caristia condivide i dati di contatto personali con società esterne che offrono prodotti o servizi che potrebbero interessare all’utente.<br /><br /></p>

            <p>Se l’utente ci contatta, rimuoveremo il suo nome dall’elenco fornito alle società esterne.<br /><br />
            Consultare<br /><br /></p>

            <p>Condivisione con i social network<br /><br /></p>

            <p>Se l’utente fornisce i dati di accesso ai social network per accedere a un Servizio Giocattoli Caristia o a un Sito Giocattoli Caristia, i dati sono condivisi con il social network, come tale che è stato effettuato l’accesso a un Servizio Giocattoli Caristia o a un Sito Giocattoli Caristia, o un’attività svolta col il Servizio Giocattoli Caristia o Sito Giocattoli Caristia.<br /><br />
            Possiamo inviare messaggi tramite il social network per comunicare con l’utente.<br /><br /></p>

            <p>Condivisione con partner tecnologici di terze parti<br /><br /></p>

            <p>Condividiamo dati sull’utilizzo e sugli interessi ottenuti tramite i cookie e la tecnologia con partner tecnologici di terze parti e otteniamo il consenso dell’utente ove richiesto dalla legge applicabile.<br /><br />
            Scopri ulteriori informazioni su SCELTE E CONTROLLI DELL’UTENTE.<br /><br /></p>

            <p>Condivisione per la protezione dei diritti legali e l’adempimento degli obblighi legali<br /><br /></p>

            <p>Se Giocattoli Caristia ritiene che il comportamento di un utente in qualsiasi Servizio Giocattoli Caristia possa danneggiare l’azienda, i Servizi Giocattoli Caristia o qualsiasi persona o proprietà, possiamo divulgare dati personali per prevenire tali danni.<br /><br />
            In tal caso, potremmo tentare di identificare il trasgressore, contattarlo o intraprendere azioni legali nei suoi confronti.<br /><br /></p>

            <p>Possiamo divulgare i dati personali se riteniamo che la divulgazione sia richiesta o consentita dalla legge o in risposta a una richiesta o citazione legale.<br /><br /></p>

            <h2 className="text-2xl font-black text-slate-900 uppercase mt-12 mb-4 border-l-4 border-indigo-600 pl-4">LINK E TERZE PARTI</h2>
            <p>I Servizi Giocattoli Caristia possono collegarsi a o utilizzare altri contenuti presenti su Internet.<br /><br />
            Non controlliamo le pratiche di raccolta dei dati o le condizioni di utilizzo di nessun sito di terze parti.<br /><br />
            A tali siti si applicano l’informativa sulla privacy e i termini di utilizzo di tali terze parti.<br /><br /></p>

            <p>Le impostazioni del computer o del dispositivo mobile possono consentire di bloccare o bloccare parzialmente altri contenuti, ma tali impostazioni potrebbero non essere efficaci in tutti i casi.<br /><br /></p>

            <p>Può essere possibile effettuare ordini o registrarsi tramite un fornitore di terze parti.<br /><br />
            Alle attività svolte con i fornitori di terze parti si applicano l’informativa sulla privacy e i termini di servizio di tali terze parti.<br /><br /></p>

            <p>Collaboriamo con partner di terze parti per offrire i Servizi Giocattoli Caristia.<br /><br /></p>

            <p>Altri siti per cui forniamo link<br /><br /></p>

            <p>I Servizi Giocattoli Caristia possono connettersi ad altri contenuti presenti su Internet che non controlliamo.<br /><br /></p>

            <p>Possiamo fornire link a siti social media o a siti che vendono i nostri prodotti.<br /><br /></p>

            <p>Possiamo fornire link ad altri siti o servizi di terze parti che riteniamo possano interessare all’utente.<br /><br /></p>

            <p>Invitiamo gli utenti a leggere attentamente l’informativa sulla privacy e i termini di utilizzo dei fornitori di terze parti, in quanto non sono coperti dalla presente Informativa sulla privacy e Giocattoli Caristia non ne è responsabile.<br /><br /></p>

            <p>È possibile modificare le impostazioni del browser, del dispositivo o di altro software per bloccare tali terze parti.<br /><br />
            Talvolta tali impostazioni possono risultare inefficaci.<br /><br /></p>

            <p>Venditori di terze parti<br /><br /></p>

            <p>Quando si effettua un ordine o ci si registra per un Servizio Giocattoli Caristia, se le transazioni sono gestite da un fornitore di terze parti (per esempio PayPal), tali transazioni sono effettuate tramite il sito web del fornitore.<br /><br /></p>

            <p>È necessario leggere i termini e le condizioni e l’informativa sulla privacy del sito web della terza parte prima di inviare i dati personali o impegnarsi in qualsiasi transazione attraverso un sito di terze parti.<br /><br /></p>

            <p>Giocattoli Caristia non è responsabile di eventuali transazioni effettuate con terze parti, o dei loro contenuti, termini e condizioni o informative sulla privacy.<br /><br /></p>

            <p>Partner di terze parti e partner tecnologici di terze parti<br /><br /></p>

            <p>Collaboriamo con partner di terze parti per offrire i Servizi Giocattoli Caristia.<br /><br />
            Chiediamo loro di gestire con cura i dati che gli affidiamo.<br /><br /></p>

            <p>Collaboriamo anche con partner tecnologici di terze parti per fornire contenuti, comprendere i nostri utenti e fornire pubblicità sui Siti Giocattoli Caristia e su siti di terze parti.<br /><br />
            Consultare le<br /><br /></p>

            <p>Negozi di app per dispositivi mobili<br /><br /></p>

            <p>Può essere necessario registrarsi e accedere a negozi di app per dispositivi mobili di terze parti prima di poter scaricare o acquistare un’app Giocattoli Caristia o effettuare acquisti in-app utilizzando un’app Giocattoli Caristia.<br /><br /></p>

            <p>Quando si scarica un’applicazione Giocattoli Caristia o si utilizza un’app Giocattoli Caristia con funzioni online tramite piattaforma mobile, in genere il fornitore dell’app raccoglie alcuni dati relativi all’app e al dispositivo.<br /><br />
            Giocattoli Caristia non controllano i requisiti o le informative degli app store, pertanto è compito dell’utente rivedere l’informativa sulla privacy e i termini di utilizzo dei negozi di app mobili prima di scaricare o utilizzare qualsiasi app e verificare le impostazioni del dispositivo per le opzioni di controllo.<br /><br /></p>

            <h2 className="text-2xl font-black text-slate-900 uppercase mt-12 mb-4 border-l-4 border-indigo-600 pl-4">SCELTE E CONTROLLI DELL UTENTE</h2>
            <p>Le tue scelte<br /><br /></p>

            <p>Rispettiamo le scelte dell’utente in merito alla ricezione di offerte promozionali e aggiornamenti da parte nostra.<br /><br />
            È possibile modificare la ricezione di comunicazioni da parte nostra con PREFERENZE DI COMUNICAZIONE GIOCATTOLI CARISTIA.<br /><br /></p>

            <p>L’utente può effettuare scelte sui propri dati personali posseduti da Giocattoli Caristia sul PORTALE DI SCELTA GDPR DI GIOCATTOLI CARISTIA.<br /><br /></p>

            <p>Controlli dell’app<br /><br /></p>

            <p>Il dispositivo può consentire di bloccare o gestire notifiche push, dati sulla posizione, acquisti in-app o possibilità di accedere al web.<br /><br /></p>

            <p>Le scelte sulle comunicazioni<br /><br /></p>

            <p>Se si desidera interrompere la ricezione di aggiornamenti promozionali o informazione sui prodotti è possibile modificare in qualsiasi momento le proprie PREFERENZE DI COMUNICAZIONE GIOCATTOLI CARISTIA o le PREFERENZE DI COMUNICAZIONE AMERICAN GIRL.<br /><br />
            Inoltre, le nostre lettere ed e-mail includono le informazioni su come annullare l’iscrizione.<br /><br />
            Le richieste di annullamento per le e-mail saranno elaborate entro 10 giorni lavorativi.<br /><br />
            Le richieste di annullamento postale potrebbero richiedere più tempo.<br /><br /></p>

            <p>Scelte e controllo dell’utente sui propri dati personali<br /><br /></p>

            <p>Se si desidera accedere, aggiornare o eliminare i propri dati personali, ritirare il consenso alla raccolta o utilizzo da parte nostra dei propri dati personali, opporsi all’elaborazione da parte nostra dei propri dati personali o richiedere una copia portatile dei propri dati personali, è possibile accedere al PORTALE DI SCELTA GDPR DI GIOCATTOLI CARISTIA.<br /><br />
            È possibile usare questi portali per effettuare scelte sui propri dati in possesso di Giocattoli Caristia.<br /><br /></p>

            <p>Controlli dei genitori<br /><br /></p>

            <p>I genitori possono accedere ai dati dei propri bambini ed effettuare scelte su come Giocattoli Caristia utilizza tali dati, incluso l’aggiornamento o l’eliminazione dei dati, utilizzando il MODULO DI ACCESSO PER I GENITORI.<br /><br /></p>

            <p>Controlli dell’app<br /><br /></p>

            <p className="font-bold text-slate-900 italic">Con le app è possibile:</p>
            <p>Usare le impostazioni e i controlli incorporati del dispositivo mobile per:<br /><br /></p>

            <p>Bloccare la navigazione sul web disattivando l’accesso alla rete sul dispositivo o disattivando il browser.<br /><br /></p>

            <p>L’accesso o la disponibilità dei controlli può variare a seconda del dispositivo.<br /><br /></p>

            <h2 className="text-2xl font-black text-slate-900 uppercase mt-12 mb-4 border-l-4 border-indigo-600 pl-4">LA PRIVACY DEI BAMBINI</h2>
            <p>Questa sezione riassume la nostra INFORMATIVA SULLA PRIVACY DEI BAMBINI, che l’utente può consultare per i dettagli completi.<br /><br /></p>

            <p>Nota speciale per genitori e tutori legali<br /><br /></p>

            <p>Prendiamo misure speciali per la protezione dei bambini come definito nella presente Informativa sulla privacy.<br /><br />
            L’utente deve aiutarci a proteggere la privacy dei propri bambini insegnando loro a non fornire mai dati personali senza il permesso dei genitori.<br /><br /></p>

            <p>Proteggere la privacy dei bambini<br /><br /></p>

            <p>Noi non raccogliamo dati di contatto personali dai bambini con i Servizi Giocattoli Caristia diretti ai bambini senza il consenso di un genitore o di un tutore legale, a eccezione di circostanze limitate autorizzate dalla legge.<br /><br /></p>

            <p>Raccogliamo automaticamente alcuni dati (come indirizzo IP, UDID del dispositivo mobile, sistema operativo, etc.) e utilizziamo tecnologie come i cookie per fornire funzionalità e supportare le nostre operazioni.<br /><br />
            Otteniamo il consenso ove richiesto.<br /><br /></p>

            <p>Non chiediamo più dati personali di quanto necessario per la partecipazione del bambino all’attività.<br /><br /></p>

            <p>Prendiamo provvedimenti per prevenire la pubblicazione o divulgazione di dati personali da parte di bambini.<br /><br /></p>

            <p>Utilizziamo una tecnologia di monitoraggio e filtraggio nel tentativo di prevenire la divulgazione da parte di bambini di dati personali senza il consenso dei genitori nei Servizi Giocattoli Caristia diretti ai bambini.<br /><br /></p>

            <p>Possiamo richiedere ai visitatori di fornire data di nascita o dati sulla posizione geografica prima di accedere a un Servizio Giocattoli Caristia o prima di fornire dati personali.<br /><br /></p>

            <p>I genitori possono accedere e chiederci di aggiornare o eliminare i dati dei bambini utilizzando il MODULO DI ACCESSO PER I GENITORI.<br /><br /></p>

            <p>Per ulteriori informazioni sulla privacy dei bambini, consultare la nostra INFORMATIVA SULLA PRIVACY DEI BAMBINI completa.<br /><br /></p>

            <h2 className="text-2xl font-black text-slate-900 uppercase mt-12 mb-4 border-l-4 border-indigo-600 pl-4">CONTENUTI GENERATI DALL’UTENTE</h2>
            <p>È possibile pubblicare o caricare contenuti generati dall’utente nei Servizi Giocattoli Caristia.<br /><br /></p>

            <p>Alcuni Servizi Giocattoli Caristia possono offrire l’opportunità di caricare contenuti generati dall’utente.<br /><br /></p>

            <p>Non tutti i Servizi Giocattoli Caristia permettono di pubblicare contenuti generati dall’utente.<br /><br /></p>

            <p>Può essere richiesta la registrazione dell’utente o di un genitore a nome del bambino per i Servizi Giocattoli Caristia diretti ai bambiniper attivare il Servizio Giocattoli Caristia o per accedere a tutte le funzionalità.<br /><br /></p>

            <p>Possono essere applicate regole speciali alle attività di social networking.<br /><br />
            Assicurarsi di rivedere attentamente tutte le regole aggiuntive pubblicate, nonché i<br /><br /></p>

            <h2 className="text-2xl font-black text-slate-900 uppercase mt-12 mb-4 border-l-4 border-indigo-600 pl-4">SICUREZZA</h2>
            <p>Ci impegniamo a mantenere la sicurezza dei dati ma non possiamo garantire che le misure di sicurezza dei dati siano infallibili.<br /><br /></p>

            <p>Ci sforziamo di proteggere i dati forniti dall’utente durante l’utilizzo dei Servizi Giocattoli Caristia attraverso mezzi commercialmente ragionevoli.<br /><br /></p>

            <p>Noi e i nostri agenti e affiliati utilizziamo la cifratura o altre misure di sicurezza per la protezione dei dati sul pagamento durante la trasmissione e adottiamo procedure interne per salvaguardare i dati nei nostri sistemi.<br /><br /></p>

            <p>Richiediamo ai nostri partner di terze parti di seguire le migliori pratiche del settore per salvaguardare i dati di contatto personali e gli altri dati che gestiscono.<br /><br /></p>

            <p>Tuttavia, l’utente deve essere consapevole del fatto che, anche se ci impegniamo al massimo per la protezione dei dati, nessun metodo è sicuro al 100%.<br /><br /></p>

            <p>Non possiamo dare garanzie sulle procedure di sicurezza utilizzare da terze parti.<br /><br /></p>

            <p>Si consiglia di imparare a utilizzare strumenti, abitudini e pratiche per proteggere la propria sicurezza e quella della propria famiglia.<br /><br />
            Per esempio, si consiglia di utilizzare password univoche difficili da copiare o da indovinare.<br /><br /></p>

            <h2 className="text-2xl font-black text-slate-900 uppercase mt-12 mb-4 border-l-4 border-indigo-600 pl-4">TRASFERIMENTI INTERNAZIONALI DI DATI</h2>
            <p>I server e i Servizi Giocattoli Caristia sono regolati dalla legge statunitense, che potrebbe avere requisiti di privacy dei dati diversi rispetto al paese in cui l’utente vive.<br /><br /></p>

            <p>I nostri server si trovano negli Stati Uniti e nel Regno Unito.<br /><br />
            Possiamo anche utilizzare servizi cloud.<br /><br /></p>

            <p>Utilizziamo clausole contrattuali standard per il trasferimento di dati personali dallo Spazio economico europeo (SEE) o dalla Svizzera verso paesi non SEE.<br /><br /></p>

            <p>L’utilizzo da parte dell’utente dei Servizi Giocattoli Caristia è soggetto alla raccolta, al trasferimento, all’elaborazione e all’utilizzo dei dati in conformità con la presente Informativa sulla privacy.<br /><br /></p>

            <p>Non usare i Servizi Giocattoli Caristia se non si accetta la presente informativa sulla privacy.<br /><br /></p>

            <p>I Servizi Giocattoli Caristia, i server che rendono disponibili i Servizi Giocattoli Caristia e i database in cui conserviamo i dati possono trovarsi in paesi con leggi sulla privacy diverse da quello in cui l’utente vive.<br /><br /></p>

            <p>I server per i Servizi Giocattoli Caristia si trovano negli Stati Uniti e nel Regno Unito.<br /><br />
            Possiamo utilizzare servizi cloud, i cui server possono trovarsi in qualsiasi parte del mondo.<br /><br /></p>

            <p>Per gli utenti il cui utilizzo di Servizi Giocattoli Caristia comporta trasferimento di dati personali dallo Spazio economico europeo (SEE) o dalla Svizzera a paesi non SEE, ci affidiamo a clausole contrattuali standard.<br /><br /></p>

            <p>Utilizzando i Servizi Giocattoli Caristia, il trasferimento, la raccolta, l’elaborazione e l’utilizzo dei dati avverranno secondo quanto specificato nella presente Informativa sulla privacy, nei<br /><br /></p>

            <p>Se non si vuole fornire il consenso al trasferimento, alla raccolta, all’elaborazione o all’utilizzo di tali dati in base a tali termini, evitare di utilizzare i Servizi.<br /><br /></p>

            <h2 className="text-2xl font-black text-slate-900 uppercase mt-12 mb-4 border-l-4 border-indigo-600 pl-4">AGGIORNAMENTI ALLA PRESENTE INFORMATIVA SULLA PRIVACY</h2>
            <p>Aggiorneremo la presente Informativa sulla privacy di volta in volta pubblicandola qui.<br /><br /></p>

            <p>Non cambieremo senza preavviso il modo di gestire i dati raccolti in precedenza.<br /><br />
            Ove applicabile, otterremo anche il consenso dell’utente.<br /><br /></p>

            <p>Possiamo aggiornare di volta in volta la nostra Informativa sulla privacy.<br /><br />
            Quando ciò accadrà, informeremo gli utenti sulle nuove disposizioni pubblicandole sui nostri Siti Giocattoli Caristia.<br /><br /></p>

            <p>Non effettueremo cambiamenti sostanziali nella gestione dei dati personali raccolti la precedenza senza preavviso e, se richiesto, con il consenso.<br /><br /></p>

            <h2 className="text-2xl font-black text-slate-900 uppercase mt-12 mb-4 border-l-4 border-indigo-600 pl-4">I DIRITTI SULLA PRIVACY IN CALIFORNIA</h2>
            <p>I residenti della California hanno determinati diritti.<br /><br /></p>

            <p>Ai sensi del Codice Civile, i residenti in Italia hanno diritto di ricevere, una volta all’anno, informazioni sulle terze parti con cui abbiamo condiviso i dati dell’utente a scopi di marketing durante l’anno solare precedente e una descrizione delle categorie dei dati personali condivisi.<br /><br />
            Per effettuare tale richiesta, compilare e inviare il<br /><br /></p>

            <p>MODULO DI RICHIESTA DI PRIVACY.<br /><br />
            Risponderemo entro 30 giorni dalla ricezione della richiesta.<br /><br /></p>

            <h2 className="text-2xl font-black text-slate-900 uppercase mt-12 mb-4 border-l-4 border-indigo-600 pl-4">I DIRITTI SULLA PRIVACY IN EUROPA</h2>
            <p>I cittadini degli Stati membri dello Spazio economico europeo (SEE) che hanno domande sulle prassi di Giocattoli Caristia in materia di privacy possono contattare le autorità competenti del SEE per esporre i propri dubbi.<br /><br /></p>

            <p>I cittadini degli Stati membri dello Spazio economico europeo (SEE) possono esercitare i propri diritti in base al Regolamento generale sulla protezione dei dati (GDPR) visitando il<br /><br /></p>

            <p>PORTALE DI SCELTA GDPR DI GIOCATTOLI CARISTIA.<br /><br />
            È inoltre possibile contattare le autorità competenti del SEE, incluso il proprio Stato membro, in merito alle questioni relative alle pratiche in materia di privacy di Giocattoli Caristia.<br /><br />
            L’autorità di controllo principale per i Servizi Giocattoli Caristia offerti nel SEE è l’autorità olandese per la protezione dei dati.<br /><br /></p>

            <h2 className="text-2xl font-black text-slate-900 uppercase mt-12 mb-4 border-l-4 border-indigo-600 pl-4">“DO NOT TRACK”</h2>
            <p>Non rispondiamo ai segnali “do not track” disponibili su alcuni browser.<br /><br /></p>

            <p>Alcuni browser web possono trasmettere segnali “do not track”.<br /><br />
            I browser web possono incorporare o attivare queste funzionalità in modo diverso, pertanto è difficile capire se gli utenti le hanno attivate consapevolmente.<br /><br />
            Di conseguenza, al momento non adottiamo misure per rispondere a tali segnali.<br /><br />
            È possibile gestire le proprie preferenze sui cookie utilizzando le impostazioni del browser per accettare o bloccare alcuni o tutti i cookie o ricevere notifiche in modo da poter favorire i cookie.<br /><br />
            Se si bloccano tutti i cookie, alcune funzionalità dei Siti Giocattoli Caristia potrebbero non essere disponibile.<br /><br /></p>

            <h2 className="text-2xl font-black text-slate-900 uppercase mt-12 mb-4 border-l-4 border-indigo-600 pl-4">CERTIFICAZIONI</h2>
            <p>I Servizi Giocattoli Caristia che presentano i seguenti sigilli sono certificati dalle rispettive organizzazioni:<br /><br /></p>

            <h2 className="text-2xl font-black text-slate-900 uppercase mt-12 mb-4 border-l-4 border-indigo-600 pl-4">IN CASO DI DOMANDE SIETE PREGATI DI CONTATTARCI</h2>
            <p>Cerchiamo sempre di essere trasparenti e chiari sulle nostre pratiche.<br /><br />
            Contattateci se avete domande.<br /><br /></p>

            <p>Se avete domande, non esitate a contattarci! Se un genitore vuole accedere ai dati del bambino, utilizzare il MODULO DI ACCESSO PER I GENITORI.<br /><br />
            Se si desidera aggiornare o modificare le proprie preferenze nella ricezione di messaggi di marketing da parte nostra, visitare PREFERENZE DI COMUNICAZIONE GIOCATTOLI CARISTIA.<br /><br />
            Per scoprire quali dati dell’utente possiede Giocattoli Caristia o effettuare scelte al riguardo, usare il PORTALE DI SCELTA GDPR DI GIOCATTOLI CARISTIA.<br /><br /></p>

          </div>
        </article>

        <footer className="mt-20 pt-12 border-t-4 border-slate-900">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-sm font-bold uppercase tracking-widest text-slate-500">
              © {new Date().getFullYear()} Giocattoli Caristia. Sicurezza dei dati garantita.
            </p>
            <div className="flex gap-8 text-xs font-black uppercase tracking-widest">
              <Link href="/termini-condizioni" className="hover:text-indigo-600">Termini e Condizioni</Link>
              <Link href="/cookie" className="hover:text-indigo-600">Gestione Cookie</Link>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
