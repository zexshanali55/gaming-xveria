import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma";

export const cardSelect = {
  id: true, slug: true, title: true, image: true, price: true, comparePrice: true,
  platform: true, edition: true, genre: true, rating: true,
} satisfies Prisma.ProductSelect;

/**
 * Storefront reads are cached on the server under the "catalog" tag — every
 * round trip to Supabase costs ~300ms, so an uncached page is slow.
 * Admin product edits and paid orders call updateTag/revalidateTag("catalog").
 */
export const CATALOG_TAG = "catalog";
const cached = <A extends unknown[], R>(key: string, fn: (...args: A) => Promise<R>) =>
  unstable_cache(fn, [key], { tags: [CATALOG_TAG], revalidate: 600 });

export interface CatalogFilters {
  q?: string;
  genre?: string;
  platform?: string;
  edition?: string;
  sort?: string;
}

export const listProducts = cached("listProducts", async (filters: CatalogFilters) => {
  const where: Prisma.ProductWhereInput = { active: true };
  if (filters.q) where.title = { contains: filters.q, mode: "insensitive" };
  if (filters.genre) where.genre = filters.genre;
  if (filters.platform) where.platform = filters.platform;
  if (filters.edition === "DIGITAL" || filters.edition === "PHYSICAL") where.edition = filters.edition;

  const orderBy: Prisma.ProductOrderByWithRelationInput =
    filters.sort === "price-asc" ? { price: "asc" }
    : filters.sort === "price-desc" ? { price: "desc" }
    : filters.sort === "rating" ? { rating: "desc" }
    : filters.sort === "newest" ? { releaseYear: "desc" }
    : { featured: "desc" };

  return prisma.product.findMany({ where, orderBy: [orderBy, { title: "asc" }], select: cardSelect });
});

export const facets = cached("facets", async () => {
  const [genres, platforms] = await Promise.all([
    prisma.product.groupBy({ by: ["genre"], where: { active: true }, _count: true, orderBy: { genre: "asc" } }),
    prisma.product.groupBy({ by: ["platform"], where: { active: true }, _count: true, orderBy: { platform: "asc" } }),
  ]);
  return {
    genres: genres.map((g) => ({ value: g.genre, count: g._count })),
    platforms: platforms.map((p) => ({ value: p.platform, count: p._count })),
  };
});

export const homeRows = cached("homeRows", async () => {
  const [featured, racing, latest, hero] = await Promise.all([
    prisma.product.findMany({ where: { active: true, featured: true }, select: cardSelect, take: 8, orderBy: { rating: "desc" } }),
    prisma.product.findMany({ where: { active: true, genre: "Racing" }, select: cardSelect, take: 4, orderBy: { price: "desc" } }),
    prisma.product.findMany({ where: { active: true }, select: cardSelect, take: 8, orderBy: [{ releaseYear: "desc" }, { rating: "desc" }] }),
    prisma.product.findFirst({ where: { active: true, slug: "forza-horizon-5" }, select: cardSelect }),
  ]);
  return { featured, racing, latest, hero };
});

export const productBySlug = cached("productBySlug", async (slug: string) => {
  // Dates are left out: the cache stores JSON, so they would come back as strings.
  const product = await prisma.product.findFirst({ where: { slug, active: true }, omit: { createdAt: true, updatedAt: true } });
  if (!product) return null;
  const related = await prisma.product.findMany({
    where: { active: true, genre: product.genre, id: { not: product.id } },
    select: cardSelect,
    take: 4,
    orderBy: { rating: "desc" },
  });
  return { product, related };
});
