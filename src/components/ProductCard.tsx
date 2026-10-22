import Link from "next/link";
import { formatPrice } from "@/lib/money";
import { EditionBadge } from "@/components/EditionBadge";

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
    <Link href={`/games/${product.slug}`} className="card-glow cut group block border border-line bg-panel">
      <div className="relative aspect-[460/215] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={product.image} alt={product.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-panel to-transparent" />
        {off > 0 && (
          <span className="absolute left-0 top-3 bg-volt px-2 py-0.5 font-display text-[0.65rem] font-black text-void">-{off}%</span>
        )}
        <span className="absolute right-2 top-2"><EditionBadge edition={product.edition} /></span>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between font-display text-[0.6rem] tracking-[0.2em] text-ink-dim">
          <span>{product.platform.toUpperCase()} · {product.genre.toUpperCase()}</span>
          <span className="text-volt">★ {product.rating.toFixed(1)}</span>
        </div>
        <h3 className="mt-2 line-clamp-1 text-lg font-bold leading-tight text-ink group-hover:text-neon">{product.title}</h3>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="font-display text-lg font-bold text-volt">{formatPrice(product.price)}</span>
          {off > 0 && <span className="text-sm text-ink-dim line-through">{formatPrice(product.comparePrice!)}</span>}
        </div>
      </div>
    </Link>
  );
}
