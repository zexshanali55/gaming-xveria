import Link from "next/link";
import { AdminTitle, Table } from "@/components/admin";
import { formatPrice } from "@/lib/money";
import { prisma } from "@/lib/prisma";

export default async function AdminProducts({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  const products = await prisma.product.findMany({
    where: q ? { title: { contains: q, mode: "insensitive" } } : {},
    orderBy: { title: "asc" },
  });

  return (
    <>
      <AdminTitle title={`Products (${products.length})`}>
        <div className="flex gap-2">
          <form><input name="q" defaultValue={q} placeholder="Search…" className="field !py-2" /></form>
          <Link href="/admin/products/new" className="btn-volt !py-2.5">+ New product</Link>
        </div>
      </AdminTitle>
      <Table head={["", "Title", "Platform", "Type", "Price", "Stock", "Status"]}>
        {products.map((p) => (
          <tr key={p.id} className="hover:bg-panel">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <td className="px-3 py-2"><img src={p.image} alt="" className="h-9 w-20 object-cover" /></td>
            <td className="px-3 py-2"><Link href={`/admin/products/${p.id}`} className="font-semibold text-neon hover:underline">{p.title}</Link>{p.featured && <span className="ml-2 text-volt">★</span>}</td>
            <td className="px-3 py-2">{p.platform}</td>
            <td className="px-3 py-2">{p.edition === "DIGITAL" ? "⚡ Digital" : "◆ Physical"}</td>
            <td className="px-3 py-2">{formatPrice(p.price)}</td>
            <td className={`px-3 py-2 ${p.stock <= 5 ? "text-danger" : ""}`}>{p.stock}</td>
            <td className="px-3 py-2">{p.active ? <span className="text-ok">Live</span> : <span className="text-ink-dim">Hidden</span>}</td>
          </tr>
        ))}
      </Table>
    </>
  );
}
