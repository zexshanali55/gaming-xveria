import { NextResponse } from "next/server";
import { readResult } from "@/lib/payfast";
import { settlePayfastResult } from "@/lib/payments";
import { siteOrigin } from "@/lib/site-url";

/**
 * Where PayFast sends the shopper back (GET in mock, form POST from the real
 * gateway). The URL proves nothing; settlement checks PayFast's signature.
 * Redirects are built from SITE_URL and use 303 so a POST lands as a GET.
 */
async function handle(request: Request) {
  const params = new URLSearchParams(new URL(request.url).searchParams);
  if (request.method === "POST") {
    const form = await request.formData().catch(() => null);
    if (form) for (const [key, value] of form.entries()) params.set(key, String(value));
  }

  const settlement = await settlePayfastResult(readResult(params), "callback");
  const seeOther = (path: string) => NextResponse.redirect(new URL(path, siteOrigin()), 303);

  if (settlement.verdict === "paid") return seeOther(`/order/${settlement.orderId}?paid=1`);
  if (settlement.verdict === "declined") {
    return seeOther(`/order/${settlement.orderId}?failed=${encodeURIComponent(settlement.reason)}`);
  }
  if (!settlement.orderId) return seeOther("/checkout?error=order-not-found");
  return seeOther(`/order/${settlement.orderId}?confirming=1`);
}

export const GET = handle;
export const POST = handle;
