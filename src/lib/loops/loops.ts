import {LoopsClient} from "loops"

if (!process.env.LOOPS_API_KEY) {
  throw new Error("Manca la variabile d'ambiente LOOPS_API_KEY");
}

// Inizializziamo il client unico da esportare ovunque nel backend
export const loops = new LoopsClient(process.env.LOOPS_API_KEY);