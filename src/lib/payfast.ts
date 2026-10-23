/**
 * PayFast (Pakistan / APPS — Bank Alfalah IPG). Ported from the Kavé store.
 *
 *   1. Server-to-server GetAccessToken with merchant id + secured key, basket
 *      id and amount.
 *   2. The browser is POSTed to PostTransaction with that token. PayFast shows
 *      its hosted page, sends the shopper back to SUCCESS_URL / FAILURE_URL and
 *      calls CHECKOUT_URL server-to-server with the same result.
 *
 * The mode is picked in Admin → Settings (stored in the DB, see lib/settings.ts),
 * falling back to PAYFAST_MODE:
 *   mock    — no network call, an approved payment is simulated (signed by us)
 *   sandbox — https://ipguat.apps.net.pk with test credentials
 *   live    — https://ipg1.apps.net.pk
 *
 * The secured key never reaches the browser, and nothing is marked paid on the
 * strength of a URL — only on PayFast's validation_hash.
 */

import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { siteOrigin } from "@/lib/site-url";

export type PayfastMode = "mock" | "sandbox" | "live";

const ENDPOINTS = {
  sandbox: "https://ipguat.apps.net.pk/Ecommerce/api/Transaction",
  live: "https://ipg1.apps.net.pk/Ecommerce/api/Transaction",
} as const;

export interface PayfastConfig {
  mode: PayfastMode;
  merchantId: string;
  merchantName: string;
  secureKey: string;
  storeId: string;
  currency: string;
  baseUrl: string;
}

export function asMode(value: string | null | undefined): PayfastMode {
  return value === "sandbox" || value === "live" ? value : "mock";
}

const env = (key: string) => (process.env[key] ?? "").trim();

/** Sandbox and live are two merchant accounts, so both pairs can be set at once. */
export function payfastConfigFor(mode: PayfastMode): PayfastConfig {
  const prefix = mode === "live" ? "PAYFAST_LIVE" : "PAYFAST_SANDBOX";
  return {
    mode,
    merchantId: env(`${prefix}_MERCHANT_ID`) || env("PAYFAST_MERCHANT_ID"),
    merchantName: env("PAYFAST_MERCHANT_NAME") || "Gaming Xveria",
    secureKey: env(`${prefix}_SECURED_KEY`) || env("PAYFAST_SECURED_KEY"),
    storeId: env(`${prefix}_STORE_ID`) || env("PAYFAST_STORE_ID"),
    currency: env("PAYFAST_CURRENCY") || "PKR",
    baseUrl: siteOrigin(),
  };
}

export function configProblem(config: PayfastConfig): string | null {
  if (config.mode === "mock") return null;
  const prefix = config.mode === "live" ? "PAYFAST_LIVE" : "PAYFAST_SANDBOX";
  const missing: string[] = [];
  if (!config.merchantId) missing.push(`${prefix}_MERCHANT_ID`);
  if (!config.secureKey) missing.push(`${prefix}_SECURED_KEY`);
  return missing.length
    ? `${missing.join(" and ")} not set on the server, so ${config.mode} payments cannot be taken.`
    : null;
}

export function payfastEndpoint(config: PayfastConfig, path: "GetAccessToken" | "PostTransaction") {
  return `${config.mode === "live" ? ENDPOINTS.live : ENDPOINTS.sandbox}/${path}`;
}

/** YYYY-MM-DD in Karachi — the UTC day is yesterday between midnight and 5am. */
export function payfastDate(date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Karachi" }).format(date);
}

/** Fresh per attempt: PayFast refuses a basket id it has already seen. */
export function newBasketId(orderNumber: string): string {
  return `${orderNumber}-${randomBytes(3).toString("hex")}`;
}

export function payfastAmount(rupees: number): string {
  return rupees.toFixed(2);
}

export interface AccessTokenResult {
  ok: boolean;
  token?: string;
  generatedAt?: string;
  error?: string;
}

export async function requestAccessToken(
  config: PayfastConfig,
  basketId: string,
  amount: number,
): Promise<AccessTokenResult> {
  if (config.mode === "mock") {
    return { ok: true, token: `MOCK-${basketId}`, generatedAt: payfastDate() };
  }

  const problem = configProblem(config);
  if (problem) return { ok: false, error: problem };

  const body = new URLSearchParams({
    MERCHANT_ID: config.merchantId,
    SECURED_KEY: config.secureKey,
    BASKET_ID: basketId,
    TXNAMT: payfastAmount(amount),
    CURRENCY_CODE: config.currency,
  });

  try {
    const response = await fetch(payfastEndpoint(config, "GetAccessToken"), {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
      cache: "no-store",
    });
    if (!response.ok) {
      return { ok: false, error: `PayFast token request failed (HTTP ${response.status}).` };
    }

    // PayFast has answered JSON typed as text/html, so parse the text either way.
    const text = await response.text();
    let data: { ACCESS_TOKEN?: string; GENERATED_DATE_TIME?: string; message?: string };
    try {
      data = JSON.parse(text) as typeof data;
    } catch {
      return { ok: false, error: "PayFast returned something that was not a token." };
    }
    if (!data.ACCESS_TOKEN) {
      return { ok: false, error: data.message ?? "PayFast did not return an access token." };
    }
    return {
      ok: true,
      token: data.ACCESS_TOKEN,
      generatedAt: data.GENERATED_DATE_TIME?.slice(0, 10) || payfastDate(),
    };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Could not reach PayFast." };
  }
}

export interface TransactionInput {
  token: string;
  generatedAt?: string;
  basketId: string;
  amount: number;
  description: string;
  customerName: string;
  customerEmail: string;
  customerMobile: string;
  customerIp?: string;
  orderId: string;
}

/** The exact form PayFast expects. Every value is public — nothing secret here. */
export function buildTransactionForm(config: PayfastConfig, input: TransactionInput) {
  const fields: Record<string, string> = {
    MERCHANT_ID: config.merchantId,
    MERCHANT_NAME: config.merchantName,
    TOKEN: input.token,
    PROCCODE: "00",
    TRAN_TYPE: "ECOMM_PURCHASE",
    TXNAMT: payfastAmount(input.amount),
    BASKET_ID: input.basketId,
    ORDER_DATE: input.generatedAt || payfastDate(),
    CURRENCY_CODE: config.currency,
    CUSTOMER_MOBILE_NO: input.customerMobile,
    CUSTOMER_EMAIL_ADDRESS: input.customerEmail,
    // A placeholder in PayFast's own sample; must never be the secured key.
    SIGNATURE: env("PAYFAST_SIGNATURE") || "SOMERANDOM-STRING",
    VERSION: env("PAYFAST_VERSION") || "MERCHANTCART-0.1",
    TXNDESC: input.description,
    SUCCESS_URL: `${config.baseUrl}/api/payments/payfast/callback?result=success`,
    FAILURE_URL: `${config.baseUrl}/api/payments/payfast/callback?result=failure`,
    CHECKOUT_URL: `${config.baseUrl}/api/payments/payfast/ipn`,
    RECURRING_TXN: "false",
  };

  // PayFast is stricter about an empty field than an absent one.
  if (config.storeId) fields.STORE_ID = config.storeId;
  if (input.customerName) fields.CUSTOMER_NAME = input.customerName;
  if (input.customerIp) fields.CUSTOMER_IPADDRESS = input.customerIp;
  fields.MERCHANT_CUSTOMER_ID = input.orderId;
  fields.COUNTRY = "PK";

  return { action: payfastEndpoint(config, "PostTransaction"), fields };
}

/* ------------------------------------------------------------ the result */

export function isApproved(errCode: string | null | undefined): boolean {
  return !!errCode && ["000", "00", "0"].includes(errCode.trim());
}

/** SHA256(basket_id | secured_key | merchant_id | err_code) */
export function validationHash(config: PayfastConfig, basketId: string, errCode: string): string {
  return createHash("sha256")
    .update(`${basketId}|${config.secureKey}|${config.merchantId}|${errCode}`)
    .digest("hex");
}

export function hashMatches(expected: string, received: string | null | undefined): boolean {
  if (!received) return false;
  const a = Buffer.from(expected.trim().toLowerCase());
  const b = Buffer.from(received.trim().toLowerCase());
  return a.length === b.length && timingSafeEqual(a, b);
}

/** Mock mode signs its own simulated return so the callback never takes a URL's word. */
export function mockSignature(basketId: string): string {
  const secret = process.env.SESSION_SECRET || "xveria-dev-secret-change-me";
  return createHmac("sha256", secret).update(`payfast-mock|${basketId}`).digest("hex");
}

export function amountsMatch(reported: string | null | undefined, expected: number): boolean {
  if (!reported) return false;
  const value = Number(reported.replace(/,/g, "").trim());
  return Number.isFinite(value) && Math.round(value) === Math.round(expected);
}

export interface PayfastResult {
  basketId: string;
  errCode: string;
  errMessage: string;
  transactionId: string;
  amount: string;
  validationHash: string;
  paymentName: string;
  mockSig: string;
}

export function readResult(params: URLSearchParams): PayfastResult {
  const get = (...keys: string[]) => {
    for (const key of keys) {
      const value = params.get(key);
      if (value) return value;
    }
    return "";
  };
  return {
    basketId: get("basket_id", "BASKET_ID", "order"),
    errCode: get("err_code", "ERR_CODE", "Response_Code", "RESPONSE_CODE"),
    errMessage: get("err_msg", "ERR_MSG", "RESPONSE_MESSAGE", "Response_Message"),
    transactionId: get("transaction_id", "TRANSACTION_ID", "Instrument_token"),
    amount: get("transaction_amount", "TRANSACTION_AMOUNT", "merchant_amount", "TXNAMT"),
    validationHash: get("validation_hash", "VALIDATION_HASH"),
    paymentName: get("PaymentName", "payment_name", "PaymentMethod"),
    mockSig: get("mock_sig"),
  };
}

export function logPayment(
  source: "callback" | "ipn" | "initiate",
  detail: { basketId: string; transactionId?: string; errCode?: string; outcome: string },
) {
  console.log(
    `[payfast:${source}] basket=${detail.basketId || "-"} txn=${detail.transactionId || "-"} err=${detail.errCode || "-"} → ${detail.outcome}`,
  );
}
