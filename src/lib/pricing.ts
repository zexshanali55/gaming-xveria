import { prisma } from "@/lib/prisma";
import { SHIPPING_FEE } from "@/lib/money";
import { checkVoucher } from "@/lib/vouchers";

export interface RequestedLine {
  productId: string;
  quantity: number;
}

/** Prices the cart from the database — never from what the browser says. */
export async function priceCart(requested: RequestedLine[], voucherCode?: string) {
  const ids = [...new Set(requested.map((l) => l.productId))];
  const products = await prisma.product.findMany({ where: { id: { in: ids }, active: true } });

  const lines = requested.flatMap((line) => {
    const product = products.find((p) => p.id === line.productId);
    if (!product) return [];
    return [{ product, quantity: Math.max(1, Math.min(10, Math.floor(line.quantity))) }];
  });

  const subtotal = lines.reduce((n, l) => n + l.product.price * l.quantity, 0);
  const hasPhysical = lines.some((l) => l.product.edition === "PHYSICAL");
  const shipping = hasPhysical ? SHIPPING_FEE : 0;

  let discount = 0;
  let appliedCode: string | null = null;
  let voucherError: string | null = null;
  if (voucherCode?.trim()) {
    const check = await checkVoucher(voucherCode, subtotal);
    if (check.ok) {
      discount = check.discount;
      appliedCode = check.code;
    } else {
      voucherError = check.error;
    }
  }

  return { lines, subtotal, shipping, discount, appliedCode, voucherError, hasPhysical, total: subtotal - discount + shipping };
}
