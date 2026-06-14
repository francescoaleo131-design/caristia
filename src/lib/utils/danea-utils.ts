
export const mapDaneaToSupabase = (daneaRow: any) => {
  return {
    sku: daneaRow['Codice'],
    name: daneaRow['Descrizione'],
    price: parseFloat(daneaRow['Prezzo Listino 1'].replace(',', '.')),
    stock: parseInt(daneaRow['Disponibilità']),
    specs: {
      eta_consigliata: daneaRow['Campo_Personalizzato_1'], 
      materiale: daneaRow['Campo_Personalizzato_2'],
      brand: daneaRow['Produttore']
    },
    updated_at: new Date()
  };
};