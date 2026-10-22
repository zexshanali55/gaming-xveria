import { ok } from "@/lib/http";
import { readResult } from "@/lib/payfast";
import { settlePayfastResult } from "@/lib/payments";

/**
 * PayFast's server-to-server notification (CHECKOUT_URL) — the authoritative
 * result. Always 200 so PayFast does not retry forever; idempotent because the
 * settlement claims the attempt in one conditional update.
 */
export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";
  const params = new URLSearchParams();

  if (contentType.includes("application/json")) {
    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    for (const [key, value] of Object.entries(body)) params.set(key, String(value));
  } else {
    const form = await request.formData().catch(() => null);
    if (form) for (const [key, value] of form.entries()) params.set(key, String(value));
  }
  for (const [key, value] of new URL(request.url).searchParams.entries()) {
    if (!params.has(key)) params.set(key, value);
  }

  const settlement = await settlePayfastResult(readResult(params), "ipn");
  return ok({ received: true, status: settlement.verdict });
}

/** PayFast's portal pings the URL before it will save it. */
export function GET() {
  return ok({ ok: true, endpoint: "payfast-ipn" });
}
