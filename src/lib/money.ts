export function formatPrice(rupees: number): string {
  return `Rs ${Math.round(rupees).toLocaleString("en-PK")}`;
}

/** Flat delivery for boxed discs; digital-only orders ship free. */
export const SHIPPING_FEE = 350;
