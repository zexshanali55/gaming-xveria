"use server";

import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { hashPassword, requireAdmin } from "@/lib/auth";
import { CATALOG_TAG } from "@/lib/catalog";
import { asMode, payfastConfigFor, requestAccessToken } from "@/lib/payfast";
import { prisma } from "@/lib/prisma";
import { SETTINGS_TAG, setPaymentMode, setPaymentText, setShippingFee } from "@/lib/settings";
import type { Edition, OrderStatus } from "@/generated/prisma";

const text = (form: FormData, key: string) => String(form.get(key) ?? "").trim();
const int = (form: FormData, key: string) => {
  const value = text(form, key);
  return value === "" ? null : Math.round(Number(value));
};

function slugify(value: string) {
  return value.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f'’]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);
}

/* ------------------------------------------------------------ products */

export async function saveProduct(form: FormData) {
  await requireAdmin();
  const id = text(form, "id");
  const title = text(form, "title");
  const data = {
    title,
    slug: text(form, "slug") || slugify(title),
    tagline: text(form, "tagline"),
    description: text(form, "description"),
    genre: text(form, "genre"),
    platform: text(form, "platform"),
    edition: (text(form, "edition") === "PHYSICAL" ? "PHYSICAL" : "DIGITAL") as Edition,
    price: int(form, "price") ?? 0,
    comparePrice: int(form, "comparePrice"),
    image: text(form, "image"),
    developer: text(form, "developer"),
    releaseYear: int(form, "releaseYear"),
    rating: Number(text(form, "rating") || 4.5),
    stock: int(form, "stock") ?? 0,
    featured: form.get("featured") === "on",
    active: form.get("active") === "on",
  };
  if (!data.title || !data.image || !data.genre || !data.platform || data.price <= 0) {
    throw new Error("Title, image, genre, platform and a price are required.");
  }

  if (id) await prisma.product.update({ where: { id }, data });
  else await prisma.product.create({ data });

  updateTag(CATALOG_TAG);
  revalidatePath("/", "layout");
  redirect("/admin/products");
}

export async function deleteProduct(form: FormData) {
  await requireAdmin();
  await prisma.product.delete({ where: { id: text(form, "id") } });
  updateTag(CATALOG_TAG);
  revalidatePath("/", "layout");
  redirect("/admin/products");
}

/* ------------------------------------------------------------ orders */

export async function updateOrderStatus(form: FormData) {
  await requireAdmin();
  const id = text(form, "id");
  await prisma.order.update({ where: { id }, data: { status: text(form, "status") as OrderStatus } });
  revalidatePath(`/admin/orders/${id}`);
  revalidatePath("/admin/orders");
}

/* ------------------------------------------------------------ vouchers */

export async function createVoucher(form: FormData) {
  await requireAdmin();
  const code = text(form, "code").toUpperCase().replace(/\s+/g, "");
  const value = int(form, "value") ?? 0;
  const percent = text(form, "kind") !== "flat";
  if (!code || value <= 0 || (percent && value > 100)) throw new Error("Enter a code and a valid value.");
  const expires = text(form, "expiresAt");
  await prisma.voucher.upsert({
    where: { code },
    update: { percent, value, minTotal: int(form, "minTotal") ?? 0, maxUses: int(form, "maxUses"), expiresAt: expires ? new Date(expires) : null, active: true },
    create: { code, percent, value, minTotal: int(form, "minTotal") ?? 0, maxUses: int(form, "maxUses"), expiresAt: expires ? new Date(expires) : null },
  });
  revalidatePath("/admin/vouchers");
}

export async function toggleVoucher(form: FormData) {
  await requireAdmin();
  const id = text(form, "id");
  const voucher = await prisma.voucher.findUniqueOrThrow({ where: { id } });
  await prisma.voucher.update({ where: { id }, data: { active: !voucher.active } });
  revalidatePath("/admin/vouchers");
}

export async function deleteVoucher(form: FormData) {
  await requireAdmin();
  await prisma.voucher.delete({ where: { id: text(form, "id") } });
  revalidatePath("/admin/vouchers");
}

/* ------------------------------------------------------------ users */

export async function setUserRole(form: FormData) {
  const admin = await requireAdmin();
  const id = text(form, "id");
  if (id === admin.id) return; // never demote yourself out of the panel
  await prisma.user.update({ where: { id }, data: { role: text(form, "role") === "ADMIN" ? "ADMIN" : "CUSTOMER" } });
  revalidatePath("/admin/users");
}

export type PasswordState = { ok?: boolean; error?: string };

/** Sets a new password for any user (also turns a guest into a registered account). */
export async function setUserPassword(_prev: PasswordState, form: FormData): Promise<PasswordState> {
  await requireAdmin();
  const id = text(form, "id");
  const password = String(form.get("password") ?? "");
  const confirm = String(form.get("confirm") ?? "");
  if (password.length < 8) return { error: "Use at least 8 characters." };
  if (password.length > 128) return { error: "That password is too long." };
  if (password !== confirm) return { error: "The two passwords don't match." };
  await prisma.user.update({ where: { id }, data: { passwordHash: hashPassword(password) } });
  revalidatePath("/admin/users");
  return { ok: true };
}

/* ------------------------------------------------------------ settings */

export async function savePaymentMode(form: FormData) {
  await requireAdmin();
  await setPaymentMode(asMode(text(form, "mode")));
  revalidatePath("/admin", "layout");
}

export async function saveShippingFee(form: FormData) {
  await requireAdmin();
  const fee = int(form, "fee") ?? 0;
  if (fee < 0 || fee > 100000) throw new Error("Enter a delivery charge between 0 and 100,000.");
  await setShippingFee(fee);
  updateTag(SETTINGS_TAG);
  revalidatePath("/", "layout");
}

export async function savePaymentText(form: FormData) {
  await requireAdmin();
  await setPaymentText({ title: text(form, "title").slice(0, 60), subtitle: text(form, "subtitle").slice(0, 240) });
  revalidatePath("/admin/settings");
  revalidatePath("/checkout");
}

/**
 * Asks PayFast for an access token with the chosen mode's credentials — the
 * same first step a real checkout takes. Nothing is charged.
 */
export async function testPayfast(form: FormData) {
  await requireAdmin();
  const mode = asMode(text(form, "mode"));
  const result = await requestAccessToken(payfastConfigFor(mode), `TEST-${Date.now()}`, 10);
  const status = result.ok ? "ok" : "fail";
  const message = result.ok ? `${mode}: PayFast returned an access token.` : `${mode}: ${result.error}`;
  redirect(`/admin/settings?test=${status}&msg=${encodeURIComponent(message)}`);
}
