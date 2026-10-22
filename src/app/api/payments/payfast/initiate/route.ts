import { z } from "zod";
import { fail, ok, parseBody } from "@/lib/http";
import {
  buildTransactionForm,
  logPayment,
  mockSignature,
  newBasketId,
  payfastConfig,
  requestAccessToken,
} from "@/lib/payfast";
import { prisma } from "@/lib/prisma";

const schema = z.object({ orderId: z.string().min(1) });

/**
 * Step one of the PayFast handshake. The amount comes from the order row, never
 * the request. The secured key is used here and never appears in the response.
 */
export async function POST(request: Request) {
  const { data, error } = await parseBody(request, schema);
  if (error) return error;

  const order = await prisma.order.findUnique({ where: { id: data.orderId } });
  if (!order) return fail("We could not find that order.", 404);
  if (order.paymentStatus === "PAID") return fail("This order is already paid.", 409);
  if (order.total <= 0) return fail("There is nothing to pay on that order.", 409);

  const config = payfastConfig();
  const basketId = newBasketId(order.number);
  const mobile = order.phone.replace(/[^0-9]/g, "");

  const token = await requestAccessToken(config, basketId, order.total);
  if (!token.ok || !token.token) {
    logPayment("initiate", { basketId, outcome: `no token: ${token.error ?? "unknown"}` });
    return fail(token.error ?? "PayFast is not responding right now.", 502);
  }

  // Written before the shopper leaves — the result is checked against this row.
  await prisma.paymentAttempt.create({
    data: { basketId, orderId: order.id, amount: order.total, mode: config.mode },
  });
  logPayment("initiate", { basketId, outcome: `handing over (${config.mode})` });

  if (config.mode === "mock") {
    const params = new URLSearchParams({
      basket_id: basketId,
      err_code: "000",
      err_msg: "Approved",
      transaction_id: `MOCK-${basketId}`,
      transaction_amount: order.total.toFixed(2),
      mock_sig: mockSignature(basketId),
    });
    return ok({ mode: "mock" as const, redirectTo: `/api/payments/payfast/callback?${params}` });
  }

  const form = buildTransactionForm(config, {
    token: token.token,
    generatedAt: token.generatedAt,
    basketId,
    amount: order.total,
    description: `Gaming Xveria order ${order.number}`,
    customerName: order.name,
    customerEmail: order.email,
    customerMobile: mobile,
    customerIp:
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      undefined,
    orderId: order.id,
  });

  return ok({ mode: config.mode, ...form });
}
