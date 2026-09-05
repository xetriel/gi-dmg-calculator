import React from "react";
import { ScalingWikiView } from "@/components/wiki/ScalingWikiView";

export const metadata = {
  title: "Talent Multipliers & Scaling | GI Damage Calculator Wiki",
  description: "Hit-by-hit scaling multiplier progression across levels 1 through 15 for all character talents.",
};

export default function ScalingWikiPage() {
  return <ScalingWikiView />;
}
