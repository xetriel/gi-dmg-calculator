import React from "react";
import { SupportsWikiView } from "@/components/wiki/SupportsWikiView";

export const metadata = {
  title: "Universal Support Matrix | GI Damage Calculator Wiki",
  description: "Cross-character comparison matrix for all 46 party support characters with ATK buffs, RES shred, DMG bonuses, and Moonsign multipliers.",
};

export default function SupportsWikiPage() {
  return <SupportsWikiView />;
}
