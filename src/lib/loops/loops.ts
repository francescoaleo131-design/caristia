import {LoopsClient} from "loops"

if (!process.env.LOOPS_API_KEY) {
  throw new Error("Manca la variabile d'ambiente LOOPS_API_KEY");
}

export const loops = new LoopsClient(process.env.LOOPS_API_KEY);