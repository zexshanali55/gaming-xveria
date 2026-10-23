import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCart } from "@/components/AddToCart";
import { EditionBadge } from "@/components/EditionBadge";
import { ProductCard } from "@/components/ProductCard";
import { productBySlug } from "@/lib/catalog";
import { formatPrice } from "@/lib/money";

export const dynamic = "force-dynamic";

type Params = Promise<{ slug: string }>;

async function load(slug: string) {
  return (await productBySlug(slug))?.product ?? null;
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const product = await load((await params).slug);
  return product ? { title: product.title, description: product.tagline || product.description.slice(0, 150) } : {};
}

export default async function ProductPage({ params }: { params: Params }) {
  const data = await productBySlug((await params).slug);
  if (!data) notFound();
  const { product, related } = data;

  const digital = product.edition === "DIGITAL";
  const off = product.comparePrice && product.comparePrice > product.price
    ? Math.round(100 - (product.price / product.comparePrice) * 100) : 0;

  return (
    <div>
      <section className="relative overflow-hidden border-b border-line">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={product.image} alt="" className="absolute inset-0 h-full w-full scale-110 object-cover opacity-20 blur-2xl" />
        <div className="absolute inset-0 bg-gradient-to-b from-void/40 to-void" />

        <div className="shell relative py-10">
          <nav className="font-display text-[0.6rem] tracking-[0.2em] text-ink-dim">
            <Link href="/" className="hover:text-neon">HOME</Link> / <Link href="/games" className="hover:text-neon">GAMES</Link> /{" "}
            <Link href={`/games?genre=${product.genre}`} className="hover:text-neon">{product.genre.toUpperCase()}</Link>
          </nav>

          <div className="mt-8 grid gap-10 lg:grid-cols-[1.3fr_1fr]">
            <div className="cut relative h-fit border border-neon/40 bg-panel p-2 shadow-[0_0_60px_-15px_rgb(0_194_255/.6)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={product.image} alt={product.title} className="w-full" />
              {off > 0 && <span className="absolute left-0 top-6 bg-volt px-3 py-1 font-display text-sm font-black text-void">-{off}% OFF</span>}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <EditionBadge edition={product.edition} />
                <span className="border border-line px-2 py-0.5 font-display text-[0.55rem] font-bold tracking-[0.18em] text-ink-dim">{product.platform.toUpperCase()}</span>
                <span className="font-display text-xs text-volt">★ {product.rating.toFixed(1)}</span>
              </div>
              <h1 className="mt-4 font-display text-3xl font-black uppercase leading-tight sm:text-4xl">{product.title}</h1>
              {product.tagline && <p className="mt-2 text-xl text-neon">{product.tagline}</p>}

              <div className="mt-6 flex items-baseline gap-3">
                <span className="volt-text font-display text-4xl font-black text-volt">{formatPrice(product.price)}</span>
                {off > 0 && <span className="text-lg text-ink-dim line-through">{formatPrice(product.comparePrice!)}</span>}
              </div>

              <div className={`cut-sm mt-6 border p-4 ${digital ? "border-neon/50 bg-neon/5" : "border-volt/50 bg-volt/5"}`}>
                {digital ? (
                  <>
                    <p className="font-display text-xs font-bold tracking-[0.2em] text-neon">⚡ SOFT COPY · DIGITAL DELIVERY</p>
                    <p className="mt-2 text-ink-dim">
                      This is a digital game. After your PayFast payment is confirmed, your <b className="text-ink">activation key and download link will be sent to your email</b>. No disc is shipped.
                    </p>
                  </>
                ) : (
                  <>
                    <p className="font-display text-xs font-bold tracking-[0.2em] text-volt">◆ PHYSICAL DISC · HOME DELIVERY</p>
                    <p className="mt-2 text-ink-dim">
                      Sealed original {product.platform} disc, delivered to your address in 2–5 working days. Flat Rs 350 delivery anywhere in Pakistan.
                    </p>
                  </>
                )}
              </div>

              <div className="mt-6">
                <AddToCart
                  product={{
                    productId: product.id, slug: product.slug, title: product.title, price: product.price,
                    image: product.image, edition: product.edition, platform: product.platform,
                  }}
                  disabled={product.stock <= 0}
                />
              </div>

              <dl className="mt-8 grid grid-cols-2 gap-px border border-line bg-line text-sm">
                {[["Developer", product.developer || "—"], ["Release", product.releaseYear ?? "—"], ["Genre", product.genre], ["Availability", product.stock > 0 ? "In stock" : "Sold out"]].map(([k, v]) => (
                  <div key={k as string} className="bg-panel p-3">
                    <dt className="label !mb-1">{k}</dt>
                    <dd className="font-semibold">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </section>

      <section className="shell grid gap-10 py-14 lg:grid-cols-[1.3fr_1fr]">
        <div>
          <h2 className="font-display text-xl font-black uppercase">{"// "}About this game</h2>
          <p className="mt-4 whitespace-pre-line text-lg leading-relaxed text-ink-dim">{product.description}</p>
        </div>
        <div className="cut border border-line bg-panel p-6">
          <h2 className="font-display text-sm font-black uppercase tracking-[0.15em]">How you get it</h2>
          <ol className="mt-4 space-y-3 text-ink-dim">
            <li><b className="text-neon">01 ·</b> Add to cart and check out.</li>
            <li><b className="text-neon">02 ·</b> Pay securely on PayFast (cards, bank, wallets).</li>
            <li><b className="text-neon">03 ·</b> {digital ? "Key + download link arrives in your email." : "We dispatch your disc within 24 hours."}</li>
          </ol>
        </div>
      </section>

      {related.length > 0 && (
        <section className="shell pb-6">
          <h2 className="font-display text-2xl font-black uppercase">More {product.genre}</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => <ProductCard key={p.slug} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}
