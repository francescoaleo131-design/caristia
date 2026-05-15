import { getUserGiftCardBalance } from "@/lib/wallet";
import CarrelloClient from "@/app/carrello/CarrelloClient";

export default async function CarrelloPage() {
  // Recupera il saldo reale dell'utente dal database (lato server)
  const giftCardBalance = await getUserGiftCardBalance();

  return <CarrelloClient giftCardBalance={giftCardBalance} />;
}