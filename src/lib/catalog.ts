import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma";

export const cardSelect = {
  id: true, slug: true, title: true, image: true, price: true, comparePrice: true,
  platform: true, edition: true, genre: true, rating: true,
} satisfies Prisma.ProductSelect;

export interface CatalogFilters {
  q?: string;
  genre?: string;
  platform?: string;
  edition?: string;
  sort?: string;
}

export async function listProducts(filters: CatalogFilters) {
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
}

export async function facets() {
  const [genres, platforms] = await Promise.all([
    prisma.product.groupBy({ by: ["genre"], where: { active: true }, _count: true, orderBy: { genre: "asc" } }),
    prisma.product.groupBy({ by: ["platform"], where: { active: true }, _count: true, orderBy: { platform: "asc" } }),
  ]);
  return {
    genres: genres.map((g) => ({ value: g.genre, count: g._count })),
    platforms: platforms.map((p) => ({ value: p.platform, count: p._count })),
  };
}
