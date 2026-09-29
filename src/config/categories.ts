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
    title: "Prima Infanzia",
    slug: "prima-infanzia",
    subcategories: [
      {
        name: "Prime Attività",
        items: ["Primi Passi", "Tappeti e Palestrine", "Sonagli e Massaggiagengive", "Palestrine"]
      },
      {
        name: "Carillon e Proiettori",
        items: ["Proiettori Notturni", "Giostrine Culla"]
      },
      {
        name: "Tricicli",
        items: ["Tricicli e Cavalcabili"]
      }
    ]
  },
  {
    title: "Bambine e Ragazze",
    slug: "bambine-e-ragazze",
    subcategories: [
      { name: "Bambole", items: ["Barbie", "Bambole di Pezza", "Bambolotti", "Accessori Bambole"] },
      { name: "Peluche", items: ["Peluche Interattivi", "Peluche Classici"] },
      { name: "Mini Mondi", items: ["Polly Pocket", "Sylvanian Families"] },
      { name: "Trucchi e Bellezza", items: ["Set Trucco", "Accessori Capelli"] },
      { name: "Moda e Gioielli", items: ["Set Gioielli", "Accessori Moda"] }
    ]
  },
  {
    title: "Bambini e Ragazzi",
    slug: "bambini-e-ragazzi",
    subcategories: [
      { name: "Action Figure e Personaggi", items: ["Supereroi", "Transformers", "Anime e Manga"] },
      { name: "Piste e Radiocomandi", items: ["Hot Wheels", "Piste Elettriche", "Auto Radiocomandate", "Droni"] },
      { name: "Armi Giocattolo", items: ["Blaster Nerf", "Pistole ad Acqua"] },
      { name: "Robot e Dinosauri", items: ["Dinosauri", "Robot Interattivi"] }
    ]
  },
  {
    title: "Costruzioni",
    slug: "costruzioni",
    subcategories: [
      { name: "LEGO", items: ["LEGO City", "LEGO Friends", "LEGO Technic", "LEGO Ninjago", "LEGO Duplo", "LEGO Star Wars"] },
      { name: "Mattoncini", items: ["Playmobil", "Meccano"] }
    ]
  },
  {
    title: "Giochi da Tavolo e Società",
    slug: "giochi-da-tavolo-e-societa",
    subcategories: [
      { name: "Classici", items: ["Monopoly", "Risiko", "Scacchi e Dama"] },
      { name: "Famiglia", items: ["Uno", "Cluedo", "Taboo", "Cranium"] },
      { name: "Carte", items: ["Pokémon", "Yu-Gi-Oh!", "Magic"] },
      { name: "Strategia e Ruolo", items: ["Giochi di Strategia", "Giochi di Ruolo"] }
    ]
  },
  {
    title: "Giochi Creativi e Scientifici",
    slug: "giochi-creativi-e-scientifici",
    subcategories: [
      { name: "Laboratori Scientifici", items: ["Clementoni Scienza", "Telescopi e Microscopi"] },
      { name: "Disegno e Pittura", items: ["Set Colori", "Lavagne", "Pasta da Modellare (Didò, Play-Doh)"] },
      { name: "Creazioni e Manualità", items: ["Braccialetti e Perline", "Set Ceramica"] }
    ]
  },
  {
    title: "Aperto e Giardino",
    slug: "aperto-e-giardino",
    subcategories: [
      { name: "Mezzi a Batteria e Pedali", items: ["Auto Elettriche", "Moto Elettriche", "Quad"] },
      { name: "Sport e Tempo Libero", items: ["Monopattini", "Biciclette", "Pattini", "Palloni e Porte"] },
      { name: "Estate e Mare", items: ["Piscine", "Materassini e Braccioli", "Giochi da Spiaggia"] },
      { name: "Strutture da Giardino", items: ["Scivoli", "Altalene", "Casette"] }
    ]
  },
  {
    title: "Feste e Travestimenti",
    slug: "feste-e-travestimenti",
    subcategories: [
      { name: "Costumi di Carnevale", items: ["Costumi Bambini", "Costumi Adulti", "Maschere"] },
      { name: "Articoli per Feste", items: ["Palloncini", "Festoni e Coordinati Tavola"] }
    ]
  },
  {
    title: "Cartoleria e Scuola",
    slug: "cartoleria-e-scuola",
    subcategories: [
      { name: "Scuola", items: ["Zaini", "Astucci", "Diari e Quaderni"] },
      { name: "Disegno", items: ["Matite e Pennarelli", "Album da Disegno"] }
    ]
  },
  {
    title: "Puzzle e Modellismo",
    slug: "puzzle-e-modellismo",
    subcategories: [
      { name: "Puzzle", items: ["Puzzle Bambini", "Puzzle Adulti (1000+ pezzi)", "Puzzle 3D"] },
      { name: "Modellismo", items: ["Modellini Dinamici", "Modellini da Montare"] }
    ]
  }
];
