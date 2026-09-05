import React from "react";
import { MechanicsWikiView } from "@/components/wiki/MechanicsWikiView";

export const metadata = {
  title: "Combat Mechanics Compendium | GI Damage Calculator Wiki",
  description: "Detailed mathematical breakdown of the Genshin Impact general damage formula, Enemy Defense, piecewise Resistance, and special mechanics.",
};

export default function MechanicsWikiPage() {
  return <MechanicsWikiView />;
}
