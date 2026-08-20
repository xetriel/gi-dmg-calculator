import type { ArtifactConfig } from "./types";
import { scarletProof } from "./scarlet-proof";
import { heartOfTheFurnace } from "./heart-of-the-furnace";

export * from "./types";
export { scarletProof } from "./scarlet-proof";
export { heartOfTheFurnace } from "./heart-of-the-furnace";

export const ARTIFACTS: ArtifactConfig[] = [
  scarletProof,
  heartOfTheFurnace,
];

const artifactMap = new Map<string, ArtifactConfig>();
for (const artifact of ARTIFACTS) {
  artifactMap.set(artifact.id, artifact);
}

export function artifactById(id: string): ArtifactConfig | undefined {
  return artifactMap.get(id);
}

export const supportArtifacts = ARTIFACTS.filter((a) => a.isSupport);
export const wielderArtifacts = ARTIFACTS.filter((a) => a.buffType === "self" || a.buffType === "both");
