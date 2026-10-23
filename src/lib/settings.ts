/**
 * Settings the admin changes at runtime (stored in the Setting table). Each one
 * falls back to its env var, so a fresh database behaves like before.
 */
import { unstable_cache } from "next/cache";
import { DEFAULT_SHIPPING_FEE } from "@/lib/money";
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

/* ------------------------------------------------------------ checkout copy */

const PAYMENT_TITLE = "checkout.paymentTitle";
const PAYMENT_SUBTITLE = "checkout.paymentSubtitle";

export const PAYMENT_TEXT_DEFAULTS = {
  title: "PayFast",
  subtitle: "Debit / credit card, bank account or mobile wallet. You'll complete payment on PayFast's secure page.",
};

/** The payment method's title and subheading shown at checkout. */
export async function getPaymentText() {
  const rows = await prisma.setting
    .findMany({ where: { key: { in: [PAYMENT_TITLE, PAYMENT_SUBTITLE] } } })
    .catch(() => []);
  const get = (key: string) => rows.find((r) => r.key === key)?.value.trim();
  return {
    title: get(PAYMENT_TITLE) || PAYMENT_TEXT_DEFAULTS.title,
    subtitle: get(PAYMENT_SUBTITLE) || PAYMENT_TEXT_DEFAULTS.subtitle,
  };
}

/** Empty strings fall back to the defaults. */
export async function setPaymentText(text: { title: string; subtitle: string }) {
  await prisma.$transaction(
    [[PAYMENT_TITLE, text.title], [PAYMENT_SUBTITLE, text.subtitle]].map(([key, value]) =>
      prisma.setting.upsert({ where: { key }, update: { value }, create: { key, value } }),
    ),
  );
}

/* ------------------------------------------------------------ delivery */

const SHIPPING_FEE_KEY = "shipping.fee";
export const SETTINGS_TAG = "settings";

/**
 * Flat delivery charge in rupees for orders with a physical disc; 0 = free.
 * Cached because product pages show it — saving the setting calls updateTag.
 */
export const getShippingFee = unstable_cache(
  async (): Promise<number> => {
    const row = await prisma.setting.findUnique({ where: { key: SHIPPING_FEE_KEY } }).catch(() => null);
    const value = Number(row?.value);
    return row && Number.isInteger(value) && value >= 0 ? value : DEFAULT_SHIPPING_FEE;
  },
  ["shippingFee"],
  { tags: [SETTINGS_TAG], revalidate: 600 },
);

export async function setShippingFee(fee: number) {
  const value = String(Math.max(0, Math.round(fee)));
  await prisma.setting.upsert({ where: { key: SHIPPING_FEE_KEY }, update: { value }, create: { key: SHIPPING_FEE_KEY, value } });
}
