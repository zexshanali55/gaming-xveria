/**
 * Settings the admin changes at runtime (stored in the Setting table). Each one
 * falls back to its env var, so a fresh database behaves like before.
 */
import { asMode, type PayfastMode } from "@/lib/payfast";
import { prisma } from "@/lib/prisma";

const PAYMENT_MODE = "payfast.mode";

/** The mode new payments start in: admin setting first, then PAYFAST_MODE. */
export async function getPaymentMode(): Promise<PayfastMode> {
  const row = await prisma.setting.findUnique({ where: { key: PAYMENT_MODE } }).catch(() => null);
  return asMode(row?.value ?? process.env.PAYFAST_MODE);
}

export async function setPaymentMode(mode: PayfastMode) {
  await prisma.setting.upsert({
    where: { key: PAYMENT_MODE },
    update: { value: mode },
    create: { key: PAYMENT_MODE, value: mode },
  });
}
