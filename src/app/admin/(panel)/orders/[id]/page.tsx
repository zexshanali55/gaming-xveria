import { notFound } from "next/navigation";
import { AdminTitle, Pill } from "@/components/admin";
import { formatPrice } from "@/lib/money";
import { prisma } from "@/lib/prisma";
import { updateOrderStatus } from "../../actions";
import { SubmitButton } from "@/components/Buttons";

const STATUSES = ["PENDING", "PAID", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "FAILED"];

export default async function AdminOrder({ params }: { params: Promise<{ id: string }> }) {
  const order = await prisma.order.findUnique({
    where: { id: (await params).id },
    include: { items: true, attempts: { orderBy: { createdAt: "desc" } } },
  });
  if (!order) notFound();

  return (
    <>
      <AdminTitle title={`Order ${order.number}`}>
        <div className="flex gap-2"><Pill value={order.paymentStatus} /><Pill value={order.status} /></div>
      </AdminTitle>
      <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <section className="cut-sm border border-line bg-panel p-5">
            <h2 className="label">Items</h2>
            <ul className="divide-y divide-line">
              {order.items.map((i) => (
                <li key={i.id} className="flex items-center gap-3 py-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={i.image} alt="" className="h-10 w-20 object-cover" />
                  <div className="flex-1"><p className="font-semibold">{i.title}</p><p className="text-sm text-ink-dim">{i.platform} · {i.edition === "DIGITAL" ? "⚡ email key + download link" : "◆ ship disc"} · ×{i.quantity}</p></div>
                  <p>{formatPrice(i.price * i.quantity)}</p>
                </li>
              ))}
            </ul>
            <dl className="mt-3 space-y-1 border-t border-line pt-3 text-sm">
              <div className="flex justify-between"><dt>Subtotal</dt><dd>{formatPrice(order.subtotal)}</dd></div>
              {order.discount > 0 && <div className="flex justify-between text-ok"><dt>Voucher {order.voucherCode}</dt><dd>−{formatPrice(order.discount)}</dd></div>}
              <div className="flex justify-between"><dt>Delivery</dt><dd>{formatPrice(order.shipping)}</dd></div>
              <div className="flex justify-between font-bold text-volt"><dt>Total</dt><dd>{formatPrice(order.total)}</dd></div>
            </dl>
          </section>
          <section className="cut-sm border border-line bg-panel p-5">
            <h2 className="label">PayFast attempts</h2>
            {order.attempts.length === 0 ? <p className="text-ink-dim">None yet.</p> : (
              <ul className="space-y-2 text-sm">
                {order.attempts.map((a) => (
                  <li key={a.basketId} className="flex flex-wrap justify-between gap-2 border-b border-line pb-2">
                    <span className="font-mono">{a.basketId}</span>
                    <span>{a.mode} · {a.status}{a.errorMessage ? ` · ${a.errorMessage}` : ""}</span>
                    <span className="text-ink-dim">{a.transactionId ?? ""}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
        <div className="space-y-6">
          <section className="cut-sm border border-line bg-panel p-5 text-sm">
            <h2 className="label">Customer</h2>
            <p className="font-semibold">{order.name}</p>
            <p>{order.email}</p>
            <p>{order.phone}</p>
            {order.address && <p className="mt-2 text-ink-dim">{order.address}, {order.city}</p>}
          </section>
          <form action={updateOrderStatus} className="cut-sm border border-line bg-panel p-5">
            <input type="hidden" name="id" value={order.id} />
            <label className="label" htmlFor="status">Fulfilment status</label>
            <select id="status" name="status" defaultValue={order.status} className="field">
              {STATUSES.map((s) => <option key={s}>{s}</option>)}
            </select>
            <SubmitButton className="btn-volt mt-4 w-full" loadingText="Updating">Update</SubmitButton>
          </form>
        </div>
      </div>
    </>
  );
}
