import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ClearCart } from "@/components/ClearCart";
import { formatPrice } from "@/lib/money";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Your order", robots: { index: false } };

type Search = Promise<{ paid?: string; failed?: string; confirming?: string }>;

export default async function OrderPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Search }) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const order = await prisma.order.findUnique({ where: { id }, include: { items: true } });
  if (!order) notFound();

  const paid = order.paymentStatus === "PAID";
  const hasDigital = order.items.some((i) => i.edition === "DIGITAL");
  const hasPhysical = order.items.some((i) => i.edition === "PHYSICAL");

  return (
    <div className="shell max-w-3xl py-14">
      {paid && <ClearCart />}
      <div className={`cut border p-8 text-center ${paid ? "border-ok/50 bg-ok/5" : "border-volt/50 bg-volt/5"}`}>
        <p className="font-display text-[0.65rem] tracking-[0.3em] text-ink-dim">ORDER {order.number}</p>
        <h1 className="mt-3 font-display text-3xl font-black uppercase">
          {paid ? <span className="text-ok">Payment confirmed</span> : query.failed ? <span className="text-danger">Payment failed</span> : "Awaiting payment"}
        </h1>
        {paid && hasDigital && (
          <p className="mx-auto mt-4 max-w-lg text-ink-dim">
            ⚡ Your activation key{order.items.filter((i) => i.edition === "DIGITAL").length > 1 ? "s" : ""} and download link will be emailed to <b className="text-ink">{order.email}</b> shortly.
          </p>
        )}
        {paid && hasPhysical && (
          <p className="mx-auto mt-3 max-w-lg text-ink-dim">◆ Your disc{order.items.length > 1 ? "s" : ""} will be dispatched to {order.city} within 24 hours.</p>
        )}
        {!paid && query.failed && <p className="mt-4 text-ink-dim">PayFast said: {query.failed}. Your cart is still saved.</p>}
        {!paid && query.confirming && <p className="mt-4 text-ink-dim">We are confirming your payment with PayFast. Refresh in a minute.</p>}
        {!paid && (
          <Link href={`/checkout/pay/${order.id}`} className="btn-volt mt-6">Pay {formatPrice(order.total)} with PayFast</Link>
        )}
      </div>

      <div className="cut mt-8 border border-line bg-panel p-6">
        <ul className="divide-y divide-line">
          {order.items.map((item) => (
            <li key={item.id} className="flex items-center gap-4 py-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.image} alt="" className="h-12 w-24 object-cover" />
              <div className="flex-1">
                <p className="font-semibold">{item.title}</p>
                <p className="text-sm text-ink-dim">{item.platform} · {item.edition === "DIGITAL" ? "Digital key via email" : "Physical disc"} · ×{item.quantity}</p>
              </div>
              <p>{formatPrice(item.price * item.quantity)}</p>
            </li>
          ))}
        </ul>
        <dl className="mt-4 space-y-1 border-t border-line pt-4 text-sm">
          <div className="flex justify-between"><dt className="text-ink-dim">Subtotal</dt><dd>{formatPrice(order.subtotal)}</dd></div>
          {order.discount > 0 && <div className="flex justify-between text-ok"><dt>Voucher {order.voucherCode}</dt><dd>−{formatPrice(order.discount)}</dd></div>}
          <div className="flex justify-between"><dt className="text-ink-dim">Delivery</dt><dd>{order.shipping ? formatPrice(order.shipping) : "Free"}</dd></div>
          <div className="flex justify-between font-display text-lg font-black"><dt>Total</dt><dd className="text-volt">{formatPrice(order.total)}</dd></div>
        </dl>
      </div>
      <div className="mt-8 text-center"><Link href="/games" className="btn-neon cut-sm">Keep shopping</Link></div>
    </div>
  );
}
