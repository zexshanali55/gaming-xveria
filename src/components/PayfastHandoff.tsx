"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { formatPrice } from "@/lib/money";
import { goToPayfast } from "@/lib/payfast-client";

/**
 * Retry page for an unpaid order (linked from the order page). Checkout itself
 * skips this and goes straight to PayFast.
 */
export function PayfastHandoff({ order }: { order: { id: string; number: string; total: number } }) {
  const [error, setError] = useState<string | null>(null);

  const start = useCallback(async () => {
    setError(await goToPayfast(order.id));
  }, [order.id]);

  useEffect(() => {
    const frame = requestAnimationFrame(() => void start());
    return () => cancelAnimationFrame(frame);
  }, [start]);

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
          <span className="load-bar mt-8 block w-56" />
        </>
      )}
      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <button className="btn-volt" onClick={() => { setError(null); void start(); }}>Try again</button>
        <Link href="/checkout" className="btn-neon cut-sm">Back to checkout</Link>
      </div>
    </div>
  );
}
