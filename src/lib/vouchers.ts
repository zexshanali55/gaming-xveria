import { prisma } from "@/lib/prisma";

export type VoucherCheck =
  | { ok: true; code: string; discount: number; label: string }
  | { ok: false; error: string };

/** Validates a code against a subtotal and works out the rupees off. */
export async function checkVoucher(rawCode: string, subtotal: number): Promise<VoucherCheck> {
  const code = rawCode.trim().toUpperCase();
  if (!code) return { ok: false, error: "Enter a voucher code." };

  const voucher = await prisma.voucher.findUnique({ where: { code } });
  if (!voucher || !voucher.active) return { ok: false, error: "That code is not valid." };
  if (voucher.expiresAt && voucher.expiresAt < new Date()) return { ok: false, error: "That code has expired." };
  if (voucher.maxUses != null && voucher.used >= voucher.maxUses) {
    return { ok: false, error: "That code has been fully redeemed." };
  }
  if (subtotal < voucher.minTotal) {
    return { ok: false, error: `Spend Rs ${voucher.minTotal.toLocaleString("en-PK")} or more to use this code.` };
  }

  const discount = Math.min(
    subtotal,
    voucher.percent ? Math.round((subtotal * voucher.value) / 100) : voucher.value,
  );
  const label = voucher.percent ? `${voucher.value}% off` : `Rs ${voucher.value.toLocaleString("en-PK")} off`;
  return { ok: true, code, discount, label };
}
