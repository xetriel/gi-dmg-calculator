// Prisma 7 uses driver adapters: the `prisma-client` generator (see
// prisma/schema.prisma) emits a client whose constructor requires an adapter.
// For MySQL we use @prisma/adapter-mariadb (built on the `mariadb` driver).
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "@/generated/prisma/client";

const g = globalThis as unknown as { prisma?: PrismaClient };

function createPrismaClient(): PrismaClient {
  const adapter = new PrismaMariaDb(process.env.DATABASE_URL as string);
  return new PrismaClient({ adapter });
}

export const prisma = g.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") g.prisma = prisma;
