// Syncs the TalentScaling table from src/data/talents: per character, delete existing
// rows and insert the current seed inside a transaction, so corrected or removed hits
// never linger. Run with: npm run db:seed
import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../src/generated/prisma/client";
import { TALENT_SEED, flattenSeed } from "../src/data/talents";

async function main() {
  const adapter = new PrismaMariaDb(process.env.DATABASE_URL as string);
  const prisma = new PrismaClient({ adapter });

  for (const seed of TALENT_SEED) {
    const rows = flattenSeed([seed]);
    await prisma.$transaction([
      prisma.talentScaling.deleteMany({ where: { characterId: seed.characterId } }),
      prisma.talentScaling.createMany({ data: rows }),
    ]);
    console.log(`${seed.characterId}: synced ${rows.length} rows`);
  }

  const total = await prisma.talentScaling.count();
  console.log(`Done. TalentScaling total rows: ${total}`);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
