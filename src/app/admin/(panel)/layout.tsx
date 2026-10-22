import Link from "next/link";
import { Logo } from "@/components/Logo";
import { logout } from "@/app/account/actions";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin", robots: { index: false } };

const NAV = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/vouchers", label: "Vouchers" },
  { href: "/admin/users", label: "Users" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[230px_1fr]">
      <aside className="border-b border-line bg-panel p-5 lg:min-h-screen lg:border-b-0 lg:border-r">
        <Logo />
        <nav className="mt-8 flex gap-1 overflow-x-auto lg:flex-col">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="whitespace-nowrap px-3 py-2.5 font-display text-[0.7rem] font-bold uppercase tracking-[0.18em] text-ink-dim hover:bg-neon/10 hover:text-neon">
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="mt-8 hidden border-t border-line pt-5 text-sm text-ink-dim lg:block">
          <p>{admin.name}</p>
          <p className="truncate">{admin.email}</p>
          <div className="mt-3 flex gap-3">
            <Link href="/" className="text-neon hover:underline">View store</Link>
            <form action={logout}><button className="hover:text-danger">Log out</button></form>
          </div>
        </div>
      </aside>
      <div className="p-5 sm:p-8">{children}</div>
    </div>
  );
}
