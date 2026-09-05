import React from "react";
import { WeaponsWikiView } from "@/components/wiki/WeaponsWikiView";

export const metadata = {
  title: "Weapons Compendium | GI Damage Calculator Wiki",
  description: "Complete canonical list of 246 weapons with stats, substats, passives, and dynamic refinement sliders.",
};

export default function WeaponsWikiPage() {
  return <WeaponsWikiView />;
}
