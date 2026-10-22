/**
 * Fills the catalogue, a few vouchers and the first admin. Idempotent: run
 * `npm run db:seed` as often as you like.
 */
import { randomBytes, scryptSync } from "node:crypto";
import { existsSync } from "node:fs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/index.js";
import { games, steamArt } from "../src/data/games.ts";

if (existsSync(".env.local")) process.loadEnvFile(".env.local");
if (existsSync(".env")) process.loadEnvFile(".env");

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is not set.");
const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });

const slugify = (v: string) => v.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f'’]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
const hash = (password: string) => {
  const salt = randomBytes(16).toString("hex");
  return `${salt}:${scryptSync(password, salt, 64).toString("hex")}`;
};

for (const g of games) {
  const data = {
    title: g.title, tagline: g.tagline, description: g.description, genre: g.genre, platform: g.platform,
    edition: g.edition, price: g.price, comparePrice: g.comparePrice ?? null, image: steamArt(g.steamId),
    developer: g.developer, releaseYear: g.releaseYear, rating: g.rating, featured: g.featured ?? false,
    stock: g.edition === "DIGITAL" ? 999 : 25,
  };
  const slug = slugify(g.title);
  await prisma.product.upsert({ where: { slug }, update: data, create: { slug, ...data } });
}
console.log(`✓ ${games.length} games`);

const vouchers = [
  { code: "NITRO10", percent: true, value: 10, minTotal: 0 },
  { code: "XVERIA20", percent: true, value: 20, minTotal: 30000 },
  { code: "WELCOME1000", percent: false, value: 1000, minTotal: 10000 },
];
for (const v of vouchers) await prisma.voucher.upsert({ where: { code: v.code }, update: {}, create: v });
console.log(`✓ ${vouchers.length} vouchers`);

const email = (process.env.ADMIN_EMAIL || "admin@gamingxveria.com").toLowerCase();
const password = process.env.ADMIN_PASSWORD || "Xveria@2026";
await prisma.user.upsert({
  where: { email },
  update: { role: "ADMIN" },
  create: { email, name: "Admin", role: "ADMIN", passwordHash: hash(password) },
});
console.log(`✓ admin ${email}`);

await prisma.$disconnect();
