export function formatPrice(rupees: number): string {
  return `Rs ${Math.round(rupees).toLocaleString("en-PK")}`;
}

/** Flat delivery for boxed discs; digital-only orders ship free. */
/** Used until a fee is saved in Admin → Settings (see getShippingFee). */
export const DEFAULT_SHIPPING_FEE = 350;

export function deliveryLabel(fee: number): string {
  return fee > 0 ? `Flat ${formatPrice(fee)} delivery anywhere in Pakistan` : "Free delivery anywhere in Pakistan";
}
