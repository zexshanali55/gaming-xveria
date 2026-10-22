import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma";

/**
 * The database client, through node-postgres rather than Prisma's Rust engine
 * so nothing native has to load on shared hosting (same reason as Kavé).
 * Built on first use so a build with no DATABASE_URL does not crash at import.
 */
const globalForPrisma = globalThis as unknown as { __xveriaPrisma?: PrismaClient };

function client(): PrismaClient {
  if (!globalForPrisma.__xveriaPrisma) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) throw new Error("DATABASE_URL is not set.");
    globalForPrisma.__xveriaPrisma = new PrismaClient({
      adapter: new PrismaPg({ connectionString, max: Number(process.env.DATABASE_POOL_MAX ?? 5) }),
      log: ["error"],
    });
  }
  return globalForPrisma.__xveriaPrisma;
}

export const prisma: PrismaClient = new Proxy({} as PrismaClient, {
  get(_target, property) {
    const instance = client();
    const value = Reflect.get(instance, property) as unknown;
    return typeof value === "function" ? value.bind(instance) : value;
  },
});
