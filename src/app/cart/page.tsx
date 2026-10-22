"use client";

import Link from "next/link";
import { useCart } from "@/components/CartProvider";
import { EditionBadge } from "@/components/EditionBadge";
import { formatPrice, SHIPPING_FEE } from "@/lib/money";

export default function CartPage() {
  const { lines, subtotal, setQuantity, remove, ready } = useCart();
  const hasPhysical = lines.some((l) => l.edition === "PHYSICAL");
  const shipping = hasPhysical ? SHIPPING_FEE : 0;

  return (
    <div className="shell py-12">
      <p className="font-display text-[0.65rem] font-bold uppercase tracking-[0.4em] text-volt">{"// "}Loadout</p>
      <h1 className="mt-2 font-display text-4xl font-black uppercase">Your cart</h1>

      {!ready ? null : lines.length === 0 ? (
        <div className="cut mt-10 border border-line bg-panel p-12 text-center">
          <p className="font-display text-xl font-bold">Your cart is empty.</p>
          <p className="mt-2 text-ink-dim">Time to load up.</p>
          <Link href="/games" className="btn-volt mt-6">Browse games</Link>
        </div>
      ) : (
        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_360px]">
          <ul className="space-y-4">
            {lines.map((line) => (
              <li key={line.productId} className="cut flex flex-col gap-4 border border-line bg-panel p-3 sm:flex-row sm:items-center">
                <Link href={`/games/${line.slug}`} className="shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={line.image} alt={line.title} className="w-full sm:w-48" />
                </Link>
                <div className="flex-1">
                  <EditionBadge edition={line.edition} />
                  <Link href={`/games/${line.slug}`} className="mt-2 block text-lg font-bold hover:text-neon">{line.title}</Link>
                  <p className="text-sm text-ink-dim">
                    {line.platform} · {line.edition === "DIGITAL" ? "Key + download link by email" : "Disc delivered to your address"}
                  </p>
                </div>
                <div className="flex items-center justify-between gap-6 sm:flex-col sm:items-end">
                  <div className="flex items-center border border-line">
                    <button className="h-9 w-9 hover:text-neon" onClick={() => setQuantity(line.productId, line.quantity - 1)} aria-label="Decrease">−</button>
                    <span className="w-8 text-center font-display text-sm">{line.quantity}</span>
                    <button className="h-9 w-9 hover:text-neon" onClick={() => setQuantity(line.productId, line.quantity + 1)} aria-label="Increase">+</button>
                  </div>
                  <div className="text-right">
                    <p className="font-display font-bold text-volt">{formatPrice(line.price * line.quantity)}</p>
                    <button className="text-xs text-ink-dim hover:text-danger" onClick={() => remove(line.productId)}>Remove</button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <aside className="cut h-fit border border-neon/40 bg-panel p-6">
            <h2 className="font-display text-sm font-black uppercase tracking-[0.15em]">Summary</h2>
            <dl className="mt-5 space-y-3">
              <div className="flex justify-between"><dt className="text-ink-dim">Subtotal</dt><dd>{formatPrice(subtotal)}</dd></div>
              <div className="flex justify-between"><dt className="text-ink-dim">Delivery</dt><dd>{shipping ? formatPrice(shipping) : "Free (digital)"}</dd></div>
              <div className="flex justify-between border-t border-line pt-3 font-display text-lg font-black">
                <dt>Total</dt><dd className="text-volt">{formatPrice(subtotal + shipping)}</dd>
              </div>
            </dl>
            <p className="mt-3 text-sm text-ink-dim">Have a voucher? Apply it at checkout.</p>
            <Link href="/checkout" className="btn-volt mt-6 w-full">Checkout →</Link>
            <Link href="/games" className="mt-4 block text-center font-display text-[0.65rem] tracking-[0.2em] text-ink-dim hover:text-neon">CONTINUE SHOPPING</Link>
          </aside>
        </div>
      )}
    </div>
  );
}
