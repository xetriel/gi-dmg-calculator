"use server";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";

export async function createDemoBuild() {
  return prisma.build.create({
    data: { name: "Smoke Test", characterId: "arlecchino", data: {}, enemy: { levelEnemy: 100, enemyRes: 10 } },
  });
}

export async function countBuilds() {
  try {
    return await prisma.build.count();
  } catch (err) {
    console.error("Failed to count builds:", err);
    return 0;
  }
}

export async function getBuildsForCharacter(characterId: string) {
  try {
    return await prisma.build.findMany({
      where: { characterId },
      orderBy: { updatedAt: "desc" },
    });
  } catch (err) {
    console.error("Failed to get builds for character:", err);
    return [];
  }
}

export async function saveBuild(id: string | null, name: string, characterId: string, data: unknown) {
  const payload = data as Prisma.InputJsonValue;
  try {
    if (id) {
      return await prisma.build.update({
        where: { id },
        data: {
          name,
          data: payload,
          updatedAt: new Date(),
        },
      });
    } else {
      return await prisma.build.create({
        data: {
          name,
          characterId,
          data: payload,
          enemy: {},
        },
      });
    }
  } catch (err) {
    console.error("Failed to save build:", err);
    throw err;
  }
}

export async function deleteBuild(id: string) {
  try {
    return await prisma.build.delete({
      where: { id },
    });
  } catch (err) {
    console.error("Failed to delete build:", err);
    throw err;
  }
}
