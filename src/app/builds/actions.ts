"use server";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";

export async function createDemoBuild() {
  return prisma.build.create({
    data: { name: "Smoke Test", characterId: "arlecchino", data: {}, enemy: { levelEnemy: 100, enemyRes: 10 } },
  });
}

export async function countBuilds() {
  return prisma.build.count();
}

export async function saveBuildForCharacter(characterId: string, instances: unknown) {
  const existing = await prisma.build.findFirst({
    where: { characterId },
  });
  const payload = instances as Prisma.InputJsonValue;

  if (existing) {
    return prisma.build.update({
      where: { id: existing.id },
      data: {
        data: payload,
        updatedAt: new Date(),
      },
    });
  } else {
    return prisma.build.create({
      data: {
        name: `${characterId} Saved Build`,
        characterId,
        data: payload,
        enemy: {},
      },
    });
  }
}
