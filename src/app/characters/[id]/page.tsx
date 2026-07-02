import { byId } from "@/data/registry/characters";
import { CharacterCalculator } from "@/components/CharacterCalculator";
import { prisma } from "@/lib/prisma";
import type { TalentScalingData } from "@/lib/talent-scaling";

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

// Next.js 16: route `params` is async and must be awaited.
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const config = byId(id);
  if (!config) return <p>Unknown character.</p>;
  const scaling = await loadScaling(id);
  return <CharacterCalculator config={config} scaling={scaling} />;
}
