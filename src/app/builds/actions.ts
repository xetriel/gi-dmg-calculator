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
