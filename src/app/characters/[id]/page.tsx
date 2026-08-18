import { byId } from "@/data/registry/characters";
import { CharacterCalculator } from "@/components/CharacterCalculator";
import { prisma } from "@/lib/prisma";
import type { TalentScalingData } from "@/lib/talent-scaling";
import { decodeBuild } from "@/lib/engine/share";

// Reads live TalentScaling data from the DB, so render per-request.
export const dynamic = "force-dynamic";

import { TALENT_SEED, flattenSeed } from "@/data/talents";

async function loadScaling(characterId: string): Promise<TalentScalingData> {
  let rows: Array<{ talentType: string; hitKey: string; level: number; value: number }> = [];
  try {
    rows = await prisma.talentScaling.findMany({
      where: { characterId },
      select: { talentType: true, hitKey: true, level: true, value: true },
    });
  } catch (err) {
    console.warn(`[loadScaling] DB connection error for ${characterId}, falling back to TALENT_SEED:`, err);
  }
  const out: TalentScalingData = {};
  if (rows.length > 0) {
    for (const r of rows) {
      const t = (out[r.talentType] ??= { levels: [], byLevel: {} });
      (t.byLevel[r.level] ??= {})[r.hitKey] = r.value;
    }
  } else {
    const seedRows = flattenSeed(TALENT_SEED.filter((s) => s.characterId === characterId));
    for (const r of seedRows) {
      const t = (out[r.talentType] ??= { levels: [], byLevel: {} });
      (t.byLevel[r.level] ??= {})[r.hitKey] = r.value;
    }
  }
  for (const t of Object.values(out)) {
    t.levels = Object.keys(t.byLevel).map(Number).sort((a, b) => a - b);
  }
  return out;
}

// Next.js 16: route `params` and `searchParams` are async and must be awaited.
export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { id } = await params;
  const sParams = await searchParams;
  const config = byId(id);
  if (!config) return <p>Unknown character.</p>;
  const scaling = await loadScaling(id);

  let initialBuildData: unknown = null;
  let isShared = false;

  if (typeof sParams.share === "string") {
    initialBuildData = decodeBuild(sParams.share);
    isShared = !!initialBuildData;
  }

  let savedBuilds: { id: string; name: string; characterId: string; data: unknown; updatedAt: Date }[] = [];
  let initialBuildId: string | null = null;
  let initialBuildName: string | null = null;

  try {
    const list = await prisma.build.findMany({
      where: { characterId: id },
      orderBy: { updatedAt: "desc" },
    });
    savedBuilds = list.map(b => ({
      id: b.id,
      name: b.name,
      characterId: b.characterId,
      data: b.data,
      updatedAt: b.updatedAt,
    }));
  } catch {
    // If table doesn't exist or DB is offline/restarting, fail silently with empty builds
    savedBuilds = [];
  }

  if (!initialBuildData && savedBuilds.length > 0) {
    initialBuildData = savedBuilds[0].data;
    initialBuildId = savedBuilds[0].id;
    initialBuildName = savedBuilds[0].name;
  }

  const initialBuildProp = initialBuildData
    ? { id: initialBuildId, name: initialBuildName, data: initialBuildData }
    : null;
  // Extract ?from= param for support editing navigation
  const fromCharacterId = typeof sParams.from === "string" ? sParams.from : null;

  return (
    <CharacterCalculator
      config={config}
      scaling={scaling}
      initialBuild={initialBuildProp}
      savedBuilds={savedBuilds}
      isSharedBuild={isShared}
      fromCharacterId={fromCharacterId}
    />
  );
}
