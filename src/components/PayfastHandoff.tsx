"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { formatPrice } from "@/lib/money";

interface InitiateResponse {
  mode: "mock" | "sandbox" | "live";
  redirectTo?: string;
  action?: string;
  fields?: Record<string, string>;
  error?: string;
}

/**
 * Hands the shopper over to PayFast. The gateway wants a form POST, so a hidden
 * form is built from what /initiate returns and submitted. Mock mode returns a
 * plain redirect instead.
 */
export function PayfastHandoff({ order }: { order: { id: string; number: string; total: number } }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<{ action: string; fields: Record<string, string> } | null>(null);

  const start = useCallback(async () => {
    const response = await fetch("/api/payments/payfast/initiate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId: order.id }),
    });
    const data = (await response.json()) as InitiateResponse;
    if (!response.ok) {
      setError(data.error ?? "We could not reach PayFast. Please try again.");
      return;
    }
    if (data.redirectTo) {
      window.location.href = data.redirectTo;
      return;
    }
    if (data.action && data.fields) setForm({ action: data.action, fields: data.fields });
  }, [order.id]);

  useEffect(() => {
    const frame = requestAnimationFrame(() => void start());
    return () => cancelAnimationFrame(frame);
  }, [start]);

  useEffect(() => {
    if (form) formRef.current?.submit();
  }, [form]);

  return (
    <div className="shell flex min-h-[70vh] flex-col items-center justify-center py-16 text-center">
      <div className="cut-sm grid h-16 w-16 place-items-center bg-volt font-display text-3xl font-black text-void">X</div>
      {error ? (
        <>
          <h1 className="mt-8 font-display text-3xl font-black uppercase">Could not reach PayFast</h1>
          <p className="mt-3 max-w-md text-danger">{error}</p>
        </>
      ) : (
        <>
          <h1 className="mt-8 font-display text-3xl font-black uppercase">Taking you to <span className="text-neon">PayFast</span></h1>
          <p className="mt-3 max-w-md text-ink-dim">
            Hold on — handing you to PayFast&apos;s secure page to pay <span className="text-volt">{formatPrice(order.total)}</span> for order {order.number}. Don&apos;t close this tab.
          </p>
          <span className="mt-8 block h-1 w-56 overflow-hidden bg-line"><span className="speed-lines block h-1 w-full" /></span>
        </>
      )}
      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <button className="btn-volt" onClick={() => { setError(null); void start(); }}>Try again</button>
        <Link href="/checkout" className="btn-neon cut-sm">Back to checkout</Link>
      </div>
      {form && (
        <form ref={formRef} action={form.action} method="POST" className="hidden">
          {Object.entries(form.fields).map(([name, value]) => (
            <input key={name} type="hidden" name={name} value={value} readOnly />
          ))}
        </form>
      )}
    </div>
  );
}
