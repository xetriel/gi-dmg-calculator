// Prisma 7 uses driver adapters: the `prisma-client` generator (see
// prisma/schema.prisma) emits a client whose constructor requires an adapter.
// For MySQL we use @prisma/adapter-mariadb (built on the `mariadb` driver).
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "@/generated/prisma/client";

const g = globalThis as unknown as { prisma?: PrismaClient; prismaUrl?: string };

function createPrismaClient(url: string): PrismaClient {
  const adapter = new PrismaMariaDb(url);
  return new PrismaClient({ adapter });
}

export function getPrisma(): PrismaClient {
  const currentUrl = process.env.DATABASE_URL || "mysql://root@127.0.0.1:3306/gi_dmg_calc";
  if (!g.prisma || g.prismaUrl !== currentUrl) {
    g.prisma = createPrismaClient(currentUrl);
    g.prismaUrl = currentUrl;
  }
  return g.prisma;
}

// Proxy ensures dynamic dispatch so process.env changes or HMR updates reconnect automatically
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const client = getPrisma() as unknown as Record<string, unknown>;
    const val = client[prop as string];
    if (typeof val === "function") {
      return val.bind(client);
    }
    return val;
  },
});
