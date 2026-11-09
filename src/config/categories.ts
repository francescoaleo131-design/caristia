export interface SubCategory {
  name: string;
  slug?: string;
  items?: string[];
}

export interface Category {
  title: string;
  slug: string;
  subcategories: SubCategory[];
}

export const SHOP_CATEGORIES: Category[] = [
  {
    title: "area aperta",
    slug: "area-aperta",
    subcategories: [
      { name: "altalene e dondoli" },
      { name: "biciclette femminili" },
      { name: "biciclette maschili" },
      { name: "biliardo" },
      { name: "calcetto" },
      { name: "casette e accessori" },
      { name: "giochi aria aperta" },
      { name: "scivoli" },
      { name: "vari" },
      { name: "veicoli elettrici" }
    ]
  },
  {
    title: "biciclette e pattini",
    slug: "biciclette-e-pattini",
    subcategories: [
      { name: "12" },
      { name: "14" },
      { name: "16" },
      { name: "20" },
      { name: "24" },
      { name: "26" },
      { name: "27,5" },
      { name: "28" }
    ]
  },
  {
    title: "carnevale",
    slug: "carnevale",
    subcategories: [
      { name: "accessori" },
      { name: "accessori carnevale" },
      { name: "costume adulto" },
      { name: "costume adulto femminile" },
      { name: "costume adulto maschile" },
      { name: "costume bimba" },
      { name: "costume bimbo" },
      { name: "maschera" },
      { name: "parrucca" },
      { name: "spade" },
      { name: "trucchi" }
    ]
  },
  {
    title: "collezionabili",
    slug: "collezionabili",
    subcategories: []
  },
  {
    title: "costruzioni e mattoncini",
    slug: "costruzioni-e-mattoncini",
    subcategories: [
      { name: "altre costruzioni" },
      { name: "blokees" },
      { name: "cadfi" },
      { name: "costruzioni magnetiche" },
      { name: "lego" },
      { name: "playmobil" },
      { name: "unico plus" }
    ]
  },
  {
    title: "elettronica",
    slug: "elettronica",
    subcategories: [
      { name: "batterie" },
      { name: "computer e tablet" },
      { name: "macchina fotografica" },
      { name: "videogiochi tascabili" }
    ]
  },
  {
    title: "estivo",
    slug: "estivo",
    subcategories: [
      { name: "accessori campeggio" },
      { name: "braccioli e salvagenti" },
      { name: "canotti" },
      { name: "piscine" },
      { name: "pistole ad acqua" },
      { name: "racchettoni e tamburelli" },
      { name: "secchielli" },
      { name: "tavole e materassi" }
    ]
  },
  {
    title: "giochi bimba",
    slug: "giochi-bimba",
    subcategories: [
      { name: "accessori femminile" },
      { name: "bambole reborn e accessori" },
      { name: "bombolotti" },
      { name: "cucina" },
      { name: "fashion dolls e accessori" },
      { name: "peluche interrativi" },
      { name: "personaggi e accessori" }
    ]
  },
  {
    title: "giochi bimbo",
    slug: "giochi-bimbo",
    subcategories: [
      { name: "animali e soldatini" },
      { name: "attrezzi" },
      { name: "calcetto e biliardo" },
      { name: "dinosauri" },
      { name: "interattivi" },
      { name: "mezzi da lavoro e trattori" },
      { name: "modellini" },
      { name: "nerf" },
      { name: "personaggi e accessori maschili" },
      { name: "piste e veicoli" },
      { name: "pistole e armi" },
      { name: "playset" },
      { name: "transformer" },
      { name: "vari" }
    ]
  },
  {
    title: "giochi creativi",
    slug: "giochi-creativi",
    subcategories: [
      { name: "lavagna" },
      { name: "libri da colorare" },
      { name: "manga" },
      { name: "panting" },
      { name: "peluche" },
      { name: "plastillina" },
      { name: "proiettore" },
      { name: "sabbia cinetica" },
      { name: "slime" },
      { name: "timbrini" }
    ]
  },
  {
    title: "giochi educativi",
    slug: "giochi-educativi",
    subcategories: [
      { name: "banco scuola" },
      { name: "carotina" },
      { name: "computer" },
      { name: "faba" },
      { name: "heau" },
      { name: "lavagna" },
      { name: "libri" },
      { name: "mappamondo" },
      { name: "quizzy" },
      { name: "sapientino" },
      { name: "scienze e gioco" },
      { name: "vari" }
    ]
  },
  {
    title: "giochi estivi",
    slug: "giochi-estivi",
    subcategories: [
      { name: "canotti" },
      { name: "piscine" },
      { name: "pistole ad acqua" },
      { name: "salvagenti" },
      { name: "secchielli e accessori" },
      { name: "tamburelli e racchette" },
      { name: "vari" }
    ]
  },
  {
    title: "giochi legno",
    slug: "giochi-legno",
    subcategories: [
      { name: "accessori in legno" },
      { name: "cavalcabili e balance bike" },
      { name: "cucine" },
      { name: "lavagna" },
      { name: "orologi" },
      { name: "specchiera" }
    ]
  },
  {
    title: "giochi musicali",
    slug: "giochi-musicali",
    subcategories: [
      { name: "casse bluetooth" },
      { name: "chitarre" },
      { name: "microfono" },
      { name: "tastiere" },
      { name: "trombe e tamburi" },
      { name: "vari" }
    ]
  },
  {
    title: "gioco di società",
    slug: "gioco-di-societa",
    subcategories: [
      { name: "adulto" },
      { name: "bambino" },
      { name: "carte" },
      { name: "in legno" },
      { name: "rompicapo" }
    ]
  },
  {
    title: "gioco sportivi",
    slug: "gioco-sportivi",
    subcategories: [
      { name: "basket" },
      { name: "palloni" },
      { name: "pattini e monopattini" },
      { name: "porte da calcio" },
      { name: "skateboard" }
    ]
  },
  {
    title: "halloween",
    slug: "halloween",
    subcategories: [
      { name: "accessori halloween" },
      { name: "costumi adulti femminili" },
      { name: "costumi adulto maschili" },
      { name: "costumi bimba" },
      { name: "costumi bimbo" }
    ]
  },
  {
    title: "idee regalo e peluche",
    slug: "idee-regalo-e-peluche",
    subcategories: [
      { name: "bigiotteria" },
      { name: "braccialetti" },
      { name: "cappellini" },
      { name: "cappellini sciarpe e guanti" },
      { name: "cassa e cuffie" },
      { name: "cuffie" },
      { name: "cuscini" },
      { name: "dispenser" },
      { name: "lampade" },
      { name: "lavagna" },
      { name: "occhiali e occhiali da sole" },
      { name: "ombrello" },
      { name: "orologi" },
      { name: "palline" },
      { name: "peluche" },
      { name: "peluche interattivi" },
      { name: "pochette e borse" },
      { name: "portachiavi" },
      { name: "portafogli" },
      { name: "portaoggettino" },
      { name: "rompicapo" },
      { name: "salvadanaio" },
      { name: "set da colazione" },
      { name: "slime" },
      { name: "squadre" },
      { name: "squishi" },
      { name: "sveglia" },
      { name: "valigia" },
      { name: "zaino" }
    ]
  },
  {
    title: "modellismo",
    slug: "modellismo",
    subcategories: [
      { name: "auto" },
      { name: "elicotteri" },
      { name: "hotwheels" },
      { name: "mezzi da lavoro" },
      { name: "moto" },
      { name: "vari" }
    ]
  },
  {
    title: "natale",
    slug: "natale",
    subcategories: [
      { name: "accessori natale" },
      { name: "epifania" }
    ]
  },
  {
    title: "party",
    slug: "party",
    subcategories: [
      { name: "accessori party" },
      { name: "baby shower" },
      { name: "palloncini" },
      { name: "spara coriandoli" }
    ]
  },
  {
    title: "pasqua",
    slug: "pasqua",
    subcategories: []
  },
  {
    title: "peluche",
    slug: "peluche",
    subcategories: [
      { name: "interattivo" }
    ]
  },
  {
    title: "prima infanzia",
    slug: "prima-infanzia",
    subcategories: [
      { name: "altalena" },
      { name: "balance bike" },
      { name: "in legno" },
      { name: "peluche interattivi" },
      { name: "primi passi e cavalcabili" },
      { name: "tricicli" }
    ]
  },
  {
    title: "prodotti da consumo",
    slug: "prodotti-da-consumo",
    subcategories: []
  },
  {
    title: "puzzle",
    slug: "puzzle",
    subcategories: [
      { name: "1000" },
      { name: "adulti" },
      { name: "bambini" },
      { name: "puzzle 100" },
      { name: "puzzle 104" },
      { name: "puzzle 125" },
      { name: "puzzle 150" },
      { name: "puzzle 1500" },
      { name: "puzzle 180" },
      { name: "puzzle 200" },
      { name: "puzzle 250" },
      { name: "puzzle 300" },
      { name: "puzzle 350" },
      { name: "puzzle 3d" },
      { name: "puzzle 3d led" },
      { name: "puzzle 500" },
      { name: "puzzle in legno" },
      { name: "puzzle max 104" },
      { name: "puzzle max 24" },
      { name: "puzzle max 60" }
    ]
  },
  {
    title: "scolastica",
    slug: "scolastica",
    subcategories: [
      { name: "astucci e portacolori" },
      { name: "borracce" },
      { name: "colori e accessori" },
      { name: "diari" },
      { name: "penne e matite" },
      { name: "porta merende" },
      { name: "timbrini" },
      { name: "tovaglietta" },
      { name: "tracolla e borsoni" },
      { name: "vari" },
      { name: "zaini" },
      { name: "zaini asilo" }
    ]
  },
  {
    title: "veicoli radiocomandati",
    slug: "veicoli-radiocomandati",
    subcategories: [
      { name: "auto" },
      { name: "droni" },
      { name: "elicotteri" },
      { name: "mezzi da lavoro" },
      { name: "moto" },
      { name: "robot" },
      { name: "vari" }
    ]
  }
];