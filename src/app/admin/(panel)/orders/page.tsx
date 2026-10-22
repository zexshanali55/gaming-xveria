import Link from "next/link";
import { AdminTitle, Pill, Table } from "@/components/admin";
import { formatPrice } from "@/lib/money";
import { prisma } from "@/lib/prisma";

export default async function AdminOrders({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status } = await searchParams;
  const orders = await prisma.order.findMany({
    where: status === "paid" ? { paymentStatus: "PAID" } : status === "unpaid" ? { paymentStatus: { not: "PAID" } } : {},
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { items: true } } },
  });

  return (
    <>
      <AdminTitle title={`Orders (${orders.length})`}>
        <div className="flex gap-2 font-display text-[0.65rem] font-bold tracking-[0.15em]">
          {[["", "All"], ["paid", "Paid"], ["unpaid", "Unpaid"]].map(([v, l]) => (
            <Link key={v} href={v ? `/admin/orders?status=${v}` : "/admin/orders"} className={`border px-3 py-2 ${(status ?? "") === v ? "border-volt text-volt" : "border-line text-ink-dim"}`}>{l.toUpperCase()}</Link>
          ))}
        </div>
      </AdminTitle>
      <Table head={["Order", "Date", "Customer", "Items", "Total", "Payment", "Status"]}>
        {orders.map((o) => (
          <tr key={o.id} className="hover:bg-panel">
            <td className="px-3 py-3"><Link href={`/admin/orders/${o.id}`} className="text-neon hover:underline">{o.number}</Link></td>
            <td className="px-3 py-3 text-ink-dim">{o.createdAt.toLocaleString("en-PK", { timeZone: "Asia/Karachi", dateStyle: "medium", timeStyle: "short" })}</td>
            <td className="px-3 py-3">{o.name}<br /><span className="text-ink-dim">{o.email}</span></td>
            <td className="px-3 py-3">{o._count.items}</td>
            <td className="px-3 py-3">{formatPrice(o.total)}</td>
            <td className="px-3 py-3"><Pill value={o.paymentStatus} /></td>
            <td className="px-3 py-3"><Pill value={o.status} /></td>
          </tr>
        ))}
      </Table>
    </>
  );
}
