export function AdminTitle({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
      <h1 className="font-display text-2xl font-black uppercase">{title}</h1>
      {children}
    </div>
  );
}

export function Table({ head, children }: { head: string[]; children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto border border-line">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="bg-panel-2">
          <tr>{head.map((h) => <th key={h} className="px-3 py-3 font-display text-[0.6rem] font-bold uppercase tracking-[0.15em] text-ink-dim">{h}</th>)}</tr>
        </thead>
        <tbody className="divide-y divide-line">{children}</tbody>
      </table>
    </div>
  );
}

const TONE: Record<string, string> = {
  PAID: "text-ok border-ok/50", DELIVERED: "text-ok border-ok/50", SHIPPED: "text-neon border-neon/50",
  PROCESSING: "text-neon border-neon/50", PENDING: "text-volt border-volt/50", UNPAID: "text-volt border-volt/50",
  FAILED: "text-danger border-danger/50", CANCELLED: "text-danger border-danger/50",
};

export function Pill({ value }: { value: string }) {
  return <span className={`border px-2 py-0.5 font-display text-[0.55rem] font-bold tracking-[0.15em] ${TONE[value] ?? "border-line text-ink-dim"}`}>{value}</span>;
}
