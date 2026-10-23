"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/components/CartProvider";
import { formatPrice } from "@/lib/money";
import { goToPayfast } from "@/lib/payfast-client";

interface Prefill { name: string; email: string; phone: string }

export function CheckoutForm({ user, payment, shippingFee }: { user: Prefill | null; payment: { title: string; subtitle: string }; shippingFee: number }) {
  const { lines, subtotal, ready } = useCart();
  const [form, setForm] = useState({ name: user?.name ?? "", email: user?.email ?? "", phone: user?.phone ?? "", address: "", city: "" });
  const [code, setCode] = useState("");
  const [voucher, setVoucher] = useState<{ code: string; discount: number } | null>(null);
  const [voucherError, setVoucherError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // Coming back from PayFast with the Back button restores this page from the
  // bfcache with the button still busy — release it.
  useEffect(() => {
    const reset = (event: PageTransitionEvent) => { if (event.persisted) setBusy(false); };
    window.addEventListener("pageshow", reset);
    return () => window.removeEventListener("pageshow", reset);
  }, []);

  const hasPhysical = lines.some((l) => l.edition === "PHYSICAL");
  const hasDigital = lines.some((l) => l.edition === "DIGITAL");
  const shipping = hasPhysical ? shippingFee : 0;
  const discount = voucher?.discount ?? 0;
  const total = subtotal - discount + shipping;
  const items = lines.map((l) => ({ productId: l.productId, quantity: l.quantity }));

  async function applyVoucher() {
    setVoucherError(null);
    const response = await fetch("/api/vouchers/check", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, items }),
    });
    const data = await response.json();
    if (!response.ok) {
      setVoucher(null);
      setVoucherError(data.error ?? "That code did not work.");
      return;
    }
    setVoucher({ code: data.code, discount: data.discount });
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, voucher: voucher?.code, items }),
    });
    const data = await response.json();
    if (!response.ok) {
      setError(data.error ?? "Something went wrong. Please try again.");
      setBusy(false);
      return;
    }
    // Straight to PayFast — no intermediate page. If the handoff fails the order
    // stays unpaid and can be retried from its order page.
    const handoffError = await goToPayfast(data.orderId);
    setError(handoffError);
    setBusy(false);
  }

  if (!ready) return null;
  if (!lines.length) {
    return (
      <div className="cut mt-10 border border-line bg-panel p-12 text-center">
        <p className="font-display text-xl font-bold">Nothing to check out.</p>
        <Link href="/games" className="btn-volt mt-6">Browse games</Link>
      </div>
    );
  }

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  return (
    <form onSubmit={submit} className="mt-10 grid gap-8 lg:grid-cols-[1fr_400px]">
      <div className="space-y-8">
        <fieldset className="cut border border-line bg-panel p-6">
          <legend className="sr-only">Contact</legend>
          <h2 className="font-display text-sm font-black uppercase tracking-[0.15em]"><span className="text-neon">01</span> · Contact</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="sm:col-span-2"><span className="label">Full name</span><input required className="field" value={form.name} onChange={set("name")} /></label>
            <label><span className="label">Email {hasDigital && <span className="text-neon">· keys sent here</span>}</span><input required type="email" className="field" value={form.email} onChange={set("email")} /></label>
            <label><span className="label">Mobile</span><input required className="field" placeholder="03XX XXXXXXX" value={form.phone} onChange={set("phone")} /></label>
          </div>
          {hasDigital && (
            <p className="mt-4 border-l-2 border-neon bg-neon/5 p-3 text-sm text-ink-dim">
              ⚡ Your cart has digital games. The activation key and download link will be emailed to <b className="text-ink">{form.email || "this address"}</b> after payment.
            </p>
          )}
        </fieldset>

        {hasPhysical && (
          <fieldset className="cut border border-line bg-panel p-6">
            <legend className="sr-only">Delivery</legend>
            <h2 className="font-display text-sm font-black uppercase tracking-[0.15em]"><span className="text-neon">02</span> · Delivery address</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              <label className="sm:col-span-2"><span className="label">Street address</span><input required minLength={8} className="field" value={form.address} onChange={set("address")} /></label>
              <label><span className="label">City</span><input required className="field" value={form.city} onChange={set("city")} /></label>
            </div>
          </fieldset>
        )}

        <fieldset className="cut border border-neon/50 bg-panel p-6">
          <legend className="sr-only">Payment</legend>
          <h2 className="font-display text-sm font-black uppercase tracking-[0.15em]"><span className="text-neon">{hasPhysical ? "03" : "02"}</span> · Payment</h2>
          <div className="mt-5 flex items-center gap-4 border border-neon bg-neon/10 p-4">
            <span className="grid h-5 w-5 place-items-center rounded-full border-2 border-neon"><span className="h-2 w-2 rounded-full bg-neon" /></span>
            <div>
              <p className="font-display font-black text-neon">{payment.title}</p>
              <p className="text-sm text-ink-dim">{payment.subtitle}</p>
            </div>
          </div>
        </fieldset>
      </div>

      <aside className="cut h-fit border border-neon/40 bg-panel p-6">
        <h2 className="font-display text-sm font-black uppercase tracking-[0.15em]">Order summary</h2>
        <ul className="mt-5 space-y-3">
          {lines.map((l) => (
            <li key={l.productId} className="flex gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={l.image} alt="" className="h-12 w-24 object-cover" />
              <div className="flex-1 text-sm">
                <p className="line-clamp-1 font-semibold">{l.title}</p>
                <p className="text-ink-dim">{l.edition === "DIGITAL" ? "⚡ Email key" : "◆ Disc"} · ×{l.quantity}</p>
              </div>
              <p className="text-sm">{formatPrice(l.price * l.quantity)}</p>
            </li>
          ))}
        </ul>

        <div className="mt-6 flex gap-2">
          <input className="field uppercase" placeholder="Voucher code" value={code} onChange={(e) => setCode(e.target.value)} />
          <button type="button" className="btn-neon !px-4" onClick={applyVoucher} disabled={!code.trim()}>Apply</button>
        </div>
        {voucherError && <p className="mt-2 text-sm text-danger">{voucherError}</p>}
        {voucher && <p className="mt-2 text-sm text-ok">✓ {voucher.code} applied</p>}

        <dl className="mt-6 space-y-2 border-t border-line pt-4">
          <div className="flex justify-between"><dt className="text-ink-dim">Subtotal</dt><dd>{formatPrice(subtotal)}</dd></div>
          {discount > 0 && <div className="flex justify-between text-ok"><dt>Discount</dt><dd>−{formatPrice(discount)}</dd></div>}
          <div className="flex justify-between"><dt className="text-ink-dim">Delivery</dt><dd className={shipping ? "" : "text-ok"}>{shipping ? formatPrice(shipping) : "Free"}</dd></div>
          <div className="flex justify-between border-t border-line pt-3 font-display text-xl font-black">
            <dt>Total</dt><dd className="text-volt">{formatPrice(total)}</dd>
          </div>
        </dl>

        {error && <p className="mt-4 border border-danger/50 bg-danger/10 p-3 text-sm text-danger">{error}</p>}
        <button className="btn-volt mt-6 w-full" disabled={busy}>{busy ? "Connecting to PayFast…" : `Pay ${formatPrice(total)}`}</button>
        <p className="mt-3 text-center text-xs text-ink-dim">
          By placing the order you agree to our <Link href="/terms" className="underline">terms</Link> and <Link href="/refund-policy" className="underline">refund policy</Link>.
        </p>
      </aside>
    </form>
  );
}
