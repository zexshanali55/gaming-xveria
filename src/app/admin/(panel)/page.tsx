import Link from "next/link";
import { AdminTitle, Pill, Table } from "@/components/admin";
import { formatPrice } from "@/lib/money";
import { prisma } from "@/lib/prisma";
import { getPaymentMode } from "@/lib/settings";

export default async function Dashboard() {
  const [revenue, paidCount, pending, products, users, recent] = await Promise.all([
    prisma.order.aggregate({ where: { paymentStatus: "PAID" }, _sum: { total: true } }),
    prisma.order.count({ where: { paymentStatus: "PAID" } }),
    prisma.order.count({ where: { paymentStatus: { not: "PAID" } } }),
    prisma.product.count(),
    prisma.user.count(),
    prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 8 }),
  ]);
  const mode = await getPaymentMode();

  const stats = [
    ["Revenue", formatPrice(revenue._sum.total ?? 0)],
    ["Paid orders", paidCount],
    ["Unpaid orders", pending],
    ["Products", products],
    ["Users", users],
  ];

  return (
    <>
      <AdminTitle title="Dashboard">
        <span className={`border px-3 py-1 font-display text-[0.6rem] font-bold tracking-[0.2em] ${mode === "live" ? "border-ok text-ok" : "border-volt text-volt"}`}>
          PAYFAST · {mode.toUpperCase()}
        </span>
      </AdminTitle>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {stats.map(([label, value]) => (
          <div key={label as string} className="cut-sm border border-line bg-panel p-5">
            <p className="label">{label}</p>
            <p className="font-display text-2xl font-black text-neon">{value}</p>
          </div>
        ))}
      </div>
      <h2 className="mb-3 mt-10 font-display text-sm font-black uppercase tracking-[0.15em]">Recent orders</h2>
      <Table head={["Order", "Customer", "Total", "Payment", "Status"]}>
        {recent.map((o) => (
          <tr key={o.id} className="hover:bg-panel">
            <td className="px-3 py-3"><Link href={`/admin/orders/${o.id}`} className="text-neon hover:underline">{o.number}</Link></td>
            <td className="px-3 py-3">{o.name}<br /><span className="text-ink-dim">{o.email}</span></td>
            <td className="px-3 py-3">{formatPrice(o.total)}</td>
            <td className="px-3 py-3"><Pill value={o.paymentStatus} /></td>
            <td className="px-3 py-3"><Pill value={o.status} /></td>
          </tr>
        ))}
      </Table>
    </>
  );
}
