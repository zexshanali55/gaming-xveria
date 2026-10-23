import Link from "next/link";
import { Glitch } from "@/components/Glitch";
import { ProductCard } from "@/components/ProductCard";
import { homeRows } from "@/lib/catalog";
import { formatPrice } from "@/lib/money";
import { steamArt } from "@/data/games";

export const dynamic = "force-dynamic";

const GENRES = [
  { name: "Racing", icon: "🏁" }, { name: "Action", icon: "⚔️" }, { name: "RPG", icon: "🗡️" },
  { name: "Shooter", icon: "🎯" }, { name: "Horror", icon: "☠️" }, { name: "Sports", icon: "⚽" },
  { name: "Fighting", icon: "👊" }, { name: "Survival", icon: "🔥" },
];

export default async function Home() {
  const { featured, racing, latest, hero } = await homeRows();

  return (
    <>
      {/* ----------------------------------------------------------- hero */}
      <section className="relative overflow-hidden border-b border-line">
        <picture>
          {/* The 3840px hero art only for big screens; phones get the small header art. */}
          <source media="(min-width: 1024px)" srcSet={steamArt(1551360, "library_hero")} />
          { }
          <img src={steamArt(1551360, "header")} alt="" fetchPriority="high" decoding="async" className="absolute inset-0 h-full w-full object-cover opacity-45" />
        </picture>
        <div className="absolute inset-0 bg-gradient-to-r from-void via-void/85 to-void/20" />
        <div className="absolute inset-x-0 bottom-0 h-40 grid-floor [mask-image:linear-gradient(to_top,black,transparent)] [transform:perspective(400px)_rotateX(55deg)] origin-bottom" />
        <div className="absolute inset-x-0 bottom-24 h-1 speed-lines opacity-60" />

        <div className="shell relative grid items-center py-12 sm:py-20 lg:min-h-[78vh] lg:grid-cols-[1.2fr_1fr]">
          <div>
            <p className="rise flicker cursor font-display text-[0.7rem] font-bold uppercase tracking-[0.45em] text-volt">{"// "}Season 01 · Night Drive</p>
            <h1 className="rise rise-1 mt-5 font-display text-[2.6rem] font-black uppercase leading-[0.95] sm:text-7xl">
              <span className="block">Full</span>
              <span className="neon-text block text-neon"><Glitch text="Throttle" auto /></span>
              <span className="volt-text block text-volt">Gaming.</span>
            </h1>
            <p className="rise rise-2 mt-5 max-w-lg text-lg text-ink-dim sm:mt-6 sm:text-xl">
              Pakistan&apos;s neon-lit game store. PC keys hit your inbox the moment you pay. PS5 &amp; Xbox discs hit your doorstep.
            </p>
            <div className="rise rise-3 mt-8 grid grid-cols-2 gap-3 sm:mt-9 sm:flex sm:flex-wrap sm:gap-4">
              <Link href="/games" className="btn-volt">Shop all games →</Link>
              <Link href="/games?genre=Racing" className="btn-neon cut-sm">Racing zone</Link>
            </div>
            <dl className="rise rise-4 mt-10 grid max-w-md grid-cols-3 gap-4 border-t border-line pt-6 sm:mt-12">
              {[["60+", "Titles"], ["24/7", "Key delivery"], ["100%", "Original"]].map(([v, l]) => (
                <div key={l}>
                  <dt className="font-display text-2xl font-black text-neon">{v}</dt>
                  <dd className="font-display text-[0.6rem] tracking-[0.2em] text-ink-dim">{l.toUpperCase()}</dd>
                </div>
              ))}
            </dl>
          </div>

          {hero && (
            <Link href={`/games/${hero.slug}`} className="cut card-glow group relative mt-12 hidden border border-neon/50 bg-panel/80 p-3 backdrop-blur lg:block">
              <span className="absolute -top-3 left-6 bg-volt px-3 py-1 font-display text-[0.6rem] font-black tracking-[0.2em] text-void">GAME OF THE WEEK</span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={hero.image} alt={hero.title} className="w-full" />
              <div className="flex items-end justify-between p-3">
                <div>
                  <p className="font-display text-[0.6rem] tracking-[0.2em] text-neon">{hero.platform.toUpperCase()} · DIGITAL KEY</p>
                  <p className="font-display text-xl font-bold">{hero.title}</p>
                </div>
                <p className="font-display text-xl font-black text-volt">{formatPrice(hero.price)}</p>
              </div>
            </Link>
          )}
        </div>
      </section>

      {/* ----------------------------------------------------------- genres */}
      <section className="reveal shell py-10 sm:py-16">
        <SectionTitle kicker="Pick your lane" title="Browse by genre" />
        <div className="mt-6 grid grid-cols-4 gap-2 sm:mt-8 sm:gap-3 lg:grid-cols-8">
          {GENRES.map((g) => (
            <Link key={g.name} href={`/games?genre=${g.name}`} className="card-glow glitch-host hud cut-sm border border-line bg-panel px-1 py-3 text-center sm:p-4">
              <div className="text-xl sm:text-2xl">{g.icon}</div>
              <div className="mt-1.5 font-display text-[0.5rem] font-bold uppercase tracking-[0.12em] sm:mt-2 sm:text-[0.65rem] sm:tracking-[0.2em]"><Glitch text={g.name} /></div>
            </Link>
          ))}
        </div>
      </section>

      <ProductRow kicker="Hot right now" title="Featured drops" products={featured} href="/games" />

      {/* ----------------------------------------------------------- delivery split */}
      <section className="reveal shell py-8 sm:py-10">
        <div className="grid gap-4 md:grid-cols-2">
          <Link href="/games?edition=DIGITAL" className="card-glow glitch-host hud cut group relative overflow-hidden border border-neon/40 bg-gradient-to-br from-neon-deep/30 to-panel p-6 sm:p-8">
            <p className="font-display text-[0.65rem] tracking-[0.3em] text-neon">⚡ INSTANT</p>
            <h3 className="mt-2 font-display text-3xl font-black uppercase"><Glitch text="PC Digital Keys" /></h3>
            <p className="mt-3 max-w-sm text-ink-dim">Pay with PayFast and your activation key plus download link lands in your email. No waiting, no shipping.</p>
            <span className="mt-6 inline-block font-display text-xs font-bold tracking-[0.2em] text-neon group-hover:underline">SHOP KEYS →</span>
          </Link>
          <Link href="/games?edition=PHYSICAL" className="card-glow glitch-host hud hud-volt cut group relative overflow-hidden border border-volt/40 bg-gradient-to-br from-volt/15 to-panel p-6 sm:p-8">
            <p className="font-display text-[0.65rem] tracking-[0.3em] text-volt">◆ BOXED</p>
            <h3 className="mt-2 font-display text-3xl font-black uppercase"><Glitch text="PS5 & Xbox Discs" /></h3>
            <p className="mt-3 max-w-sm text-ink-dim">Sealed, original discs delivered anywhere in Pakistan in 2–5 working days. Collect the case, keep the legacy.</p>
            <span className="mt-6 inline-block font-display text-xs font-bold tracking-[0.2em] text-volt group-hover:underline">SHOP DISCS →</span>
          </Link>
        </div>
      </section>

      <ProductRow kicker="Asphalt & adrenaline" title="Racing zone" products={racing} href="/games?genre=Racing" />
      <ProductRow kicker="Fresh off the grid" title="New releases" products={latest} href="/games?sort=newest" />
    </>
  );
}

function SectionTitle({ kicker, title }: { kicker: string; title: string }) {
  return (
    <div>
      <p className="font-display text-[0.65rem] font-bold uppercase tracking-[0.4em] text-volt">{"// "}{kicker}</p>
      <h2 className="mt-2 font-display text-2xl font-black uppercase sm:text-4xl"><Glitch text={title} /></h2>
    </div>
  );
}

function ProductRow({ kicker, title, products, href }: { kicker: string; title: string; products: Parameters<typeof ProductCard>[0]["product"][]; href: string }) {
  if (!products.length) return null;
  return (
    <section className="reveal shell py-8 sm:py-12">
      <div className="flex items-end justify-between gap-4">
        <SectionTitle kicker={kicker} title={title} />
        <Link href={href} className="glitch-hover shrink-0 font-display text-xs font-bold tracking-[0.2em] text-neon">VIEW ALL →</Link>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-3 sm:mt-8 sm:gap-5 lg:grid-cols-4">
        {products.map((p) => <ProductCard key={p.slug} product={p} />)}
      </div>
    </section>
  );
}
