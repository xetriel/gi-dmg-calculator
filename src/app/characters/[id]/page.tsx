import { byId } from "@/data/registry/characters";
import { CharacterCalculator } from "@/components/CharacterCalculator";
import { prisma } from "@/lib/prisma";
import type { TalentScalingData } from "@/lib/talent-scaling";
import { decodeBuild } from "@/lib/engine/share";

// Reads live TalentScaling data from the DB, so render per-request.
export const dynamic = "force-dynamic";

async function loadScaling(characterId: string): Promise<TalentScalingData> {
  // Load ALL kinds: damage rows drive the hit multipliers, heal rows display healing,
  // and buff rows (Masque, ATK-Increase) feed the mechanics resolver. Hit keys are
  // distinct across kinds, so one byLevel map holds them all.
  const rows = await prisma.talentScaling.findMany({
    where: { characterId },
    select: { talentType: true, hitKey: true, level: true, value: true },
  });
  const out: TalentScalingData = {};
  for (const r of rows) {
    const t = (out[r.talentType] ??= { levels: [], byLevel: {} });
    (t.byLevel[r.level] ??= {})[r.hitKey] = r.value;
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

  let initialBuildData: any = null;
  let isShared = false;

  if (typeof sParams.share === "string") {
    initialBuildData = decodeBuild(sParams.share);
    isShared = !!initialBuildData;
  }

  if (!initialBuildData) {
    const initialBuild = await prisma.build.findFirst({
      where: { characterId: id },
    });
    initialBuildData = initialBuild?.data;
  }

  const initialBuildProp = initialBuildData ? { data: initialBuildData } : null;

  return (
    <CharacterCalculator
      config={config}
      scaling={scaling}
      initialBuild={initialBuildProp}
      isSharedBuild={isShared}
    />
  );
}
