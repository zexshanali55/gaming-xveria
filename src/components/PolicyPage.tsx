export function PolicyPage({ kicker, title, children }: { kicker: string; title: string; children: React.ReactNode }) {
  return (
    <div className="shell max-w-3xl py-14">
      <p className="font-display text-[0.65rem] font-bold uppercase tracking-[0.4em] text-volt">{"// "}{kicker}</p>
      <h1 className="mt-2 font-display text-4xl font-black uppercase">{title}</h1>
      <div className="mt-8 space-y-5 text-lg leading-relaxed text-ink-dim [&_b]:text-ink [&_h2]:mt-10 [&_h2]:font-display [&_h2]:text-lg [&_h2]:font-black [&_h2]:uppercase [&_h2]:text-ink [&_li]:ml-5 [&_li]:list-disc">
        {children}
      </div>
    </div>
  );
}
