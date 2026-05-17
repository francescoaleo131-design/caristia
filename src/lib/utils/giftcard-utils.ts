// src/lib/giftcard-utils.ts

export function generateSecureGiftCode(): string {
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"; 
  
  const makeBlock = () => {
    let result = "";
    for (let i = 0; i < 4; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  // Restituisce CART-XXXX-XXXX-XXXX
  return `CAR-${makeBlock()}-${makeBlock()}-${makeBlock()}`;
}