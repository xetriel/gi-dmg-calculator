"use server";
import { prisma } from "@/lib/prisma";

export async function createDemoBuild() {
  return prisma.build.create({
    data: { name: "Smoke Test", characterId: "arlecchino", data: {}, enemy: { levelEnemy: 100, enemyRes: 10 } },
  });
}

export async function countBuilds() {
  return prisma.build.count();
}

export async function saveBuildForCharacter(characterId: string, instances: any) {
  const existing = await prisma.build.findFirst({
    where: { characterId },
  });

  if (existing) {
    return prisma.build.update({
      where: { id: existing.id },
      data: {
        data: instances,
        updatedAt: new Date(),
      },
    });
  } else {
    return prisma.build.create({
      data: {
        name: `${characterId} Saved Build`,
        characterId,
        data: instances,
        enemy: {},
      },
    });
  }
}
