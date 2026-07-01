// Seeds the TalentScaling table from src/data/talents (idempotent upserts).
// Run with: npm run db:seed  (uses tsx). Uses relative imports so no "@/" alias
// resolution is needed at runtime.
import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../src/generated/prisma/client";
import { flattenSeed } from "../src/data/talents";

async function main() {
  const adapter = new PrismaMariaDb(process.env.DATABASE_URL as string);
  const prisma = new PrismaClient({ adapter });
  const rows = flattenSeed();
  console.log(`Seeding ${rows.length} TalentScaling rows...`);

  for (const r of rows) {
    await prisma.talentScaling.upsert({
      where: {
        characterId_talentType_hitKey_level: {
          characterId: r.characterId,
          talentType: r.talentType,
          hitKey: r.hitKey,
          level: r.level,
        },
      },
      update: { value: r.value, kind: r.kind },
      create: r,
    });
  }

  const total = await prisma.talentScaling.count();
  console.log(`Done. TalentScaling total rows: ${total}`);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
