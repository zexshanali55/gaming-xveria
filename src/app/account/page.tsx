import type { Metadata } from "next";
import Link from "next/link";
import { AuthTabs } from "@/components/AuthForms";
import { currentUser } from "@/lib/auth";
import { formatPrice } from "@/lib/money";
import { prisma } from "@/lib/prisma";
import { logout } from "./actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Account" };

export default async function AccountPage() {
  const user = await currentUser();

  if (!user) {
    return (
      <div className="shell py-16">
        <h1 className="mb-10 text-center font-display text-4xl font-black uppercase">Player <span className="text-neon">login</span></h1>
        <AuthTabs />
      </div>
    );
  }

  const orders = await prisma.order.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" }, include: { items: true } });

  return (
    <div className="shell max-w-4xl py-14">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-display text-[0.65rem] font-bold uppercase tracking-[0.4em] text-volt">{"// "}Player profile</p>
          <h1 className="mt-2 font-display text-4xl font-black uppercase">{user.name}</h1>
          <p className="text-ink-dim">{user.email}</p>
        </div>
        <div className="flex gap-3">
          {user.role === "ADMIN" && <Link href="/admin" className="btn-neon cut-sm">Admin panel</Link>}
          <form action={logout}><button className="btn-neon cut-sm">Log out</button></form>
        </div>
      </div>

      <h2 className="mt-12 font-display text-xl font-black uppercase">Your orders</h2>
      {orders.length === 0 ? (
        <p className="mt-4 text-ink-dim">No orders yet. <Link href="/games" className="text-neon underline">Go shopping</Link>.</p>
      ) : (
        <ul className="mt-5 space-y-3">
          {orders.map((o) => (
            <li key={o.id}>
              <Link href={`/order/${o.id}`} className="card-glow cut-sm flex flex-wrap items-center justify-between gap-3 border border-line bg-panel p-4">
                <div>
                  <p className="font-display text-sm font-bold">{o.number}</p>
                  <p className="text-sm text-ink-dim">{o.items.map((i) => i.title).join(", ")}</p>
                </div>
                <div className="text-right">
                  <p className="font-display font-bold text-volt">{formatPrice(o.total)}</p>
                  <p className="font-display text-[0.6rem] tracking-[0.2em] text-ink-dim">{o.status}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
