import { byId } from "@/data/registry/characters";
import { prisma } from "@/lib/prisma";
import type { TalentScalingData } from "@/lib/talent-scaling";
import { decodeBuild } from "@/lib/engine/share";
import { FormulaBreakdownView } from "@/components/calculator/FormulaBreakdownView";

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

export default async function FormulaPage({
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
  if (typeof sParams.share === "string") {
    initialBuildData = decodeBuild(sParams.share);
  }

  let initialBuildId: string | null = null;
  let initialBuildName: string | null = null;

  if (!initialBuildData) {
    try {
      const b = await prisma.build.findFirst({
        where: { characterId: id },
        orderBy: { updatedAt: "desc" },
      });
      if (b) {
        initialBuildData = b.data;
        initialBuildId = b.id;
        initialBuildName = b.name;
      }
    } catch (err) {
      console.error("Failed to query build from database:", err);
    }
  }

  const initialSetupId = typeof sParams.setup === "string" ? sParams.setup : null;

  const initialBuildProp = initialBuildData
    ? { id: initialBuildId, name: initialBuildName, data: initialBuildData }
    : null;

  return (
    <FormulaBreakdownView
      config={config}
      scaling={scaling}
      initialBuild={initialBuildProp}
      initialSetupId={initialSetupId}
    />
  );
}
