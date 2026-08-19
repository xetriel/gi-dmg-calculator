// Syncs the TalentScaling table from src/data/talents: per character, delete existing
// rows and insert the current seed inside a transaction, so corrected or removed hits
// never linger. Run with: npm run db:seed
import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../src/generated/prisma/client";
import { TALENT_SEED, flattenSeed } from "../src/data/talents";
import { WEAPONS } from "../src/data/registry/weapons";

async function main() {
  const adapter = new PrismaMariaDb(process.env.DATABASE_URL as string);
  const prisma = new PrismaClient({ adapter });

  for (const seed of TALENT_SEED) {
    const rows = flattenSeed([seed]);
    await prisma.talentScaling.deleteMany({ where: { characterId: seed.characterId } });
    await prisma.talentScaling.createMany({ data: rows });
    console.log(`${seed.characterId}: synced ${rows.length} rows`);
  }

  const total = await prisma.talentScaling.count();
  console.log(`Done. TalentScaling total rows: ${total}`);

  // Sync weapons
  for (const weapon of WEAPONS) {
    const buffConfigJson = weapon.buffs.length > 0 ? JSON.parse(JSON.stringify(weapon.buffs)) : undefined;
    await prisma.weapon.upsert({
      where: { id: weapon.id },
      update: {
        name: weapon.name,
        type: weapon.type,
        rarity: weapon.rarity,
        baseAtk: weapon.baseAtk,
        subStatType: weapon.subStat?.type ?? null,
        subStatValue: weapon.subStat?.value ?? null,
        passiveName: weapon.passiveName,
        passiveDesc: weapon.passiveDesc,
        isSupport: weapon.isSupport,
        buffType: weapon.buffType,
        buffConfig: buffConfigJson,
      },
      create: {
        id: weapon.id,
        name: weapon.name,
        type: weapon.type,
        rarity: weapon.rarity,
        baseAtk: weapon.baseAtk,
        subStatType: weapon.subStat?.type ?? null,
        subStatValue: weapon.subStat?.value ?? null,
        passiveName: weapon.passiveName,
        passiveDesc: weapon.passiveDesc,
        isSupport: weapon.isSupport,
        buffType: weapon.buffType,
        buffConfig: buffConfigJson,
      },
    });
  }

  const weaponCount = await prisma.weapon.count();
  console.log(`Done. Weapon total rows: ${weaponCount}`);

  await prisma.$disconnect();
}


main().catch((e) => {
  console.error(e);
  process.exit(1);
});
