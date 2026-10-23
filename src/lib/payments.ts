/**
 * Deciding whether a PayFast payment happened. Both the browser return and the
 * IPN land here. An order is marked paid only when:
 *   1. the basket id names a handover this shop made,
 *   2. validation_hash matches (or, in mock, our own signature),
 *   3. the amount equals the one signed at handover,
 *   4. err_code is an approval.
 */
import {
  amountsMatch,
  asMode,
  hashMatches,
  isApproved,
  logPayment,
  mockSignature,
  payfastConfigFor,
  validationHash,
  type PayfastResult,
} from "@/lib/payfast";
import { revalidateTag } from "next/cache";
import { CATALOG_TAG } from "@/lib/catalog";
import { prisma } from "@/lib/prisma";

export type Settlement =
  | { verdict: "paid"; orderId: string }
  | { verdict: "declined"; orderId: string; reason: string }
  | { verdict: "unverified"; orderId: string | null; reason: string };

export async function settlePayfastResult(
  result: PayfastResult,
  source: "callback" | "ipn",
): Promise<Settlement> {
  const attempt = result.basketId
    ? await prisma.paymentAttempt.findUnique({ where: { basketId: result.basketId } })
    : null;

  if (!attempt) {
    logPayment(source, { basketId: result.basketId, errCode: result.errCode, outcome: "no such basket — ignored" });
    return { verdict: "unverified", orderId: null, reason: "unknown-basket" };
  }

  // Checked under the mode the handover was signed in, not whatever is set now.
  const config = payfastConfigFor(asMode(attempt.mode));
  const signed =
    attempt.mode === "mock"
      ? hashMatches(mockSignature(attempt.basketId), result.mockSig)
      : hashMatches(validationHash(config, attempt.basketId, result.errCode), result.validationHash);

  if (!signed) {
    logPayment(source, { basketId: attempt.basketId, errCode: result.errCode, outcome: "signature did not match — order left alone" });
    return { verdict: "unverified", orderId: attempt.orderId, reason: "bad-signature" };
  }

  if (isApproved(result.errCode)) {
    if (!amountsMatch(result.amount, attempt.amount)) {
      logPayment(source, { basketId: attempt.basketId, errCode: result.errCode, outcome: `amount ${result.amount || "(none)"} ≠ ${attempt.amount} — order left alone` });
      return { verdict: "unverified", orderId: attempt.orderId, reason: "amount-mismatch" };
    }

    // Claimed in one conditional update so the IPN and the browser racing each
    // other can only fulfil once.
    const claimed = await prisma.paymentAttempt.updateMany({
      where: { basketId: attempt.basketId, settledAt: null },
      data: {
        status: "PAID",
        settledAt: new Date(),
        transactionId: result.transactionId || attempt.basketId,
        errorCode: result.errCode,
        errorMessage: result.errMessage,
        paymentName: result.paymentName || null,
      },
    });

    if (claimed.count === 1) {
      const order = await prisma.order.update({
        where: { id: attempt.orderId },
        data: { paymentStatus: "PAID", status: "PAID", transactionId: result.transactionId || attempt.basketId },
        include: { items: true },
      });
      // Count the voucher and take the stock only once money has moved.
      if (order.voucherCode) {
        await prisma.voucher.updateMany({ where: { code: order.voucherCode }, data: { used: { increment: 1 } } });
      }
      for (const item of order.items) {
        if (item.productId) {
          await prisma.product.updateMany({
            where: { id: item.productId, stock: { gte: item.quantity } },
            data: { stock: { decrement: item.quantity } },
          });
        }
      }
      // Stock changed, so the cached "In stock / Sold out" may be stale.
      revalidateTag(CATALOG_TAG, "max");
    }

    logPayment(source, { basketId: attempt.basketId, transactionId: result.transactionId, errCode: result.errCode, outcome: claimed.count ? "paid" : "paid already" });
    return { verdict: "paid", orderId: attempt.orderId };
  }

  await prisma.paymentAttempt.updateMany({
    where: { basketId: attempt.basketId, settledAt: null },
    data: { status: "FAILED", errorCode: result.errCode, errorMessage: result.errMessage },
  });
  await prisma.order.updateMany({
    where: { id: attempt.orderId, paymentStatus: { not: "PAID" } },
    data: { paymentStatus: "FAILED" },
  });
  logPayment(source, { basketId: attempt.basketId, errCode: result.errCode, outcome: "declined" });
  return { verdict: "declined", orderId: attempt.orderId, reason: result.errMessage || "Payment was declined." };
}
