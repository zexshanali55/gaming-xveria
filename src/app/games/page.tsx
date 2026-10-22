import type { Metadata } from "next";
import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { facets, listProducts } from "@/lib/catalog";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "All games" };

type Search = Promise<Record<string, string | undefined>>;

export default async function GamesPage({ searchParams }: { searchParams: Search }) {
  const params = await searchParams;
  const [products, { genres, platforms }] = await Promise.all([listProducts(params), facets()]);

  const link = (patch: Record<string, string | undefined>) => {
    const next = new URLSearchParams();
    for (const [k, v] of Object.entries({ ...params, ...patch })) if (v) next.set(k, v);
    const s = next.toString();
    return s ? `/games?${s}` : "/games";
  };

  const chip = (active: boolean) =>
    `block border px-3 py-2 text-left font-display text-[0.65rem] font-bold uppercase tracking-[0.15em] transition-colors ${
      active ? "border-volt bg-volt/10 text-volt" : "border-line text-ink-dim hover:border-neon hover:text-neon"
    }`;

  return (
    <div className="shell py-12">
      <p className="font-display text-[0.65rem] font-bold uppercase tracking-[0.4em] text-volt">{"// "}The arsenal</p>
      <h1 className="mt-2 font-display text-4xl font-black uppercase sm:text-5xl">
        {params.genre ?? (params.edition === "DIGITAL" ? "PC Keys" : params.edition === "PHYSICAL" ? "Physical discs" : "All games")}
      </h1>

      <div className="mt-10 grid gap-10 lg:grid-cols-[240px_1fr]">
        <aside className="space-y-8">
          <form action="/games" className="flex gap-2">
            {Object.entries(params).filter(([k]) => k !== "q").map(([k, v]) => v && <input key={k} type="hidden" name={k} value={v} />)}
            <input name="q" defaultValue={params.q} placeholder="Search games…" className="field" />
          </form>

          <div>
            <h2 className="label">Delivery</h2>
            <div className="space-y-2">
              <Link className={chip(!params.edition)} href={link({ edition: undefined })}>Any</Link>
              <Link className={chip(params.edition === "DIGITAL")} href={link({ edition: "DIGITAL" })}>⚡ Digital key (email)</Link>
              <Link className={chip(params.edition === "PHYSICAL")} href={link({ edition: "PHYSICAL" })}>◆ Physical disc</Link>
            </div>
          </div>

          <div>
            <h2 className="label">Platform</h2>
            <div className="space-y-2">
              <Link className={chip(!params.platform)} href={link({ platform: undefined })}>All platforms</Link>
              {platforms.map((p) => (
                <Link key={p.value} className={chip(params.platform === p.value)} href={link({ platform: p.value })}>
                  {p.value} <span className="opacity-60">({p.count})</span>
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h2 className="label">Genre</h2>
            <div className="flex flex-wrap gap-2">
              <Link className={chip(!params.genre)} href={link({ genre: undefined })}>All</Link>
              {genres.map((g) => (
                <Link key={g.value} className={chip(params.genre === g.value)} href={link({ genre: g.value })}>
                  {g.value}
                </Link>
              ))}
            </div>
          </div>
        </aside>

        <div>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
            <p className="font-display text-xs tracking-[0.2em] text-ink-dim">{products.length} GAMES FOUND</p>
            <div className="flex flex-wrap gap-2">
              {[["", "Featured"], ["price-asc", "Price ↑"], ["price-desc", "Price ↓"], ["rating", "Top rated"], ["newest", "Newest"]].map(([v, l]) => (
                <Link key={v} href={link({ sort: v || undefined })} className={chip((params.sort ?? "") === v)}>{l}</Link>
              ))}
            </div>
          </div>

          {products.length ? (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {products.map((p) => <ProductCard key={p.slug} product={p} />)}
            </div>
          ) : (
            <div className="cut border border-line bg-panel p-12 text-center">
              <p className="font-display text-xl font-bold">No games match.</p>
              <Link href="/games" className="btn-neon mt-6">Clear filters</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
