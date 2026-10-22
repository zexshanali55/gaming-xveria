import { AdminTitle, Table } from "@/components/admin";
import { prisma } from "@/lib/prisma";
import { setUserRole } from "../actions";

export default async function AdminUsers() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { orders: true } } },
  });

  return (
    <>
      <AdminTitle title={`Users (${users.length})`} />
      <Table head={["Name", "Email", "Phone", "Account", "Orders", "Joined", "Role"]}>
        {users.map((u) => (
          <tr key={u.id} className="hover:bg-panel">
            <td className="px-3 py-3 font-semibold">{u.name}</td>
            <td className="px-3 py-3">{u.email}</td>
            <td className="px-3 py-3 text-ink-dim">{u.phone ?? "—"}</td>
            <td className="px-3 py-3">{u.passwordHash ? "Registered" : <span className="text-ink-dim">Guest</span>}</td>
            <td className="px-3 py-3">{u._count.orders}</td>
            <td className="px-3 py-3 text-ink-dim">{u.createdAt.toLocaleDateString("en-PK")}</td>
            <td className="px-3 py-3">
              <form action={setUserRole} className="flex items-center gap-2">
                <input type="hidden" name="id" value={u.id} />
                <input type="hidden" name="role" value={u.role === "ADMIN" ? "CUSTOMER" : "ADMIN"} />
                <span className={u.role === "ADMIN" ? "text-volt" : ""}>{u.role}</span>
                {u.passwordHash && <button className="text-xs text-neon hover:underline">{u.role === "ADMIN" ? "Demote" : "Make admin"}</button>}
              </form>
            </td>
          </tr>
        ))}
      </Table>
    </>
  );
}
