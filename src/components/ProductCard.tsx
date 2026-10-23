import Link from "next/link";
import { formatPrice } from "@/lib/money";
import { EditionBadge } from "@/components/EditionBadge";
import { Glitch } from "@/components/Glitch";

export interface CardProduct {
  slug: string;
  title: string;
  image: string;
  price: number;
  comparePrice: number | null;
  platform: string;
  edition: "DIGITAL" | "PHYSICAL";
  genre: string;
  rating: number;
}

export function ProductCard({ product }: { product: CardProduct }) {
  const off = product.comparePrice && product.comparePrice > product.price
    ? Math.round(100 - (product.price / product.comparePrice) * 100)
    : 0;

  return (
    <Link href={`/games/${product.slug}`} className="card-glow glitch-host hud cut group block border border-line bg-panel">
      <div className="relative aspect-[460/215] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={product.image} alt={product.title} loading="lazy" decoding="async" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        {/* Tinted copies of the art that slice across it on hover (same URL, so no extra download). */}
        <span className="glitch-img r" style={{ backgroundImage: `url(${product.image})` }} />
        <span className="glitch-img c" style={{ backgroundImage: `url(${product.image})` }} />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-panel to-transparent" />
        {off > 0 && (
          <span className="absolute left-0 top-3 bg-volt px-2 py-0.5 font-display text-[0.65rem] font-black text-void">-{off}%</span>
        )}
        <span className="absolute right-2 top-2"><EditionBadge edition={product.edition} /></span>
      </div>
      <div className="p-3 sm:p-4">
        <div className="flex items-center justify-between gap-2 font-display text-[0.5rem] tracking-[0.15em] text-ink-dim sm:text-[0.6rem] sm:tracking-[0.2em]">
          <span className="truncate">{product.platform.toUpperCase()}<span className="hidden sm:inline"> · {product.genre.toUpperCase()}</span></span>
          <span className="text-volt">★ {product.rating.toFixed(1)}</span>
        </div>
        <h3 className="mt-1.5 line-clamp-1 text-base font-bold leading-tight text-ink transition-colors sm:mt-2 sm:text-lg"><Glitch text={product.title} className="block truncate" /></h3>
        <div className="mt-2 flex flex-wrap items-baseline gap-x-2 sm:mt-3">
          <span className="font-display text-sm font-bold text-volt sm:text-lg">{formatPrice(product.price)}</span>
          {off > 0 && <span className="text-xs text-ink-dim line-through sm:text-sm">{formatPrice(product.comparePrice!)}</span>}
        </div>
      </div>
    </Link>
  );
}
