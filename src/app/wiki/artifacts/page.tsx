import React from "react";
import { ArtifactsWikiView } from "@/components/wiki/ArtifactsWikiView";

export const metadata = {
  title: "Artifacts Encyclopedia | GI Damage Calculator Wiki",
  description: "Complete canonical catalog of 64 artifact sets with authentic acquisition drop tiers (4★–5★, 3★–4★, 1★–3★) and set bonuses.",
};

export default function ArtifactsWikiPage() {
  return <ArtifactsWikiView />;
}
