import { AdminTitle, Table } from "@/components/admin";
import { formatPrice } from "@/lib/money";
import { prisma } from "@/lib/prisma";
import { createVoucher, deleteVoucher, toggleVoucher } from "../actions";

export default async function AdminVouchers() {
  const vouchers = await prisma.voucher.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <>
      <AdminTitle title="Voucher codes" />
      <form action={createVoucher} className="cut-sm mb-8 grid gap-4 border border-line bg-panel p-5 sm:grid-cols-3 lg:grid-cols-7 lg:items-end">
        <label className="lg:col-span-2"><span className="label">Code</span><input name="code" required className="field uppercase" placeholder="NITRO10" /></label>
        <label><span className="label">Type</span><select name="kind" className="field"><option value="percent">% off</option><option value="flat">Rs off</option></select></label>
        <label><span className="label">Value</span><input name="value" type="number" min={1} required className="field" /></label>
        <label><span className="label">Min order</span><input name="minTotal" type="number" min={0} className="field" placeholder="0" /></label>
        <label><span className="label">Max uses</span><input name="maxUses" type="number" min={1} className="field" placeholder="∞" /></label>
        <label><span className="label">Expires</span><input name="expiresAt" type="date" className="field" /></label>
        <button className="btn-volt sm:col-span-3 lg:col-span-7 lg:justify-self-start">Create / update voucher</button>
      </form>
      <Table head={["Code", "Discount", "Min order", "Used", "Expires", "Status", ""]}>
        {vouchers.map((v) => (
          <tr key={v.id} className="hover:bg-panel">
            <td className="px-3 py-3 font-display font-bold text-volt">{v.code}</td>
            <td className="px-3 py-3">{v.percent ? `${v.value}%` : formatPrice(v.value)}</td>
            <td className="px-3 py-3">{v.minTotal ? formatPrice(v.minTotal) : "—"}</td>
            <td className="px-3 py-3">{v.used}{v.maxUses ? ` / ${v.maxUses}` : ""}</td>
            <td className="px-3 py-3 text-ink-dim">{v.expiresAt ? v.expiresAt.toLocaleDateString("en-PK") : "Never"}</td>
            <td className="px-3 py-3">
              <form action={toggleVoucher}><input type="hidden" name="id" value={v.id} /><button className={v.active ? "text-ok" : "text-ink-dim"}>{v.active ? "● Active" : "○ Off"}</button></form>
            </td>
            <td className="px-3 py-3"><form action={deleteVoucher}><input type="hidden" name="id" value={v.id} /><button className="text-xs text-danger hover:underline">Delete</button></form></td>
          </tr>
        ))}
      </Table>
    </>
  );
}
