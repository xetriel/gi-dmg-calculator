import React from "react";
import { CharactersWikiView } from "@/components/wiki/CharactersWikiView";

export const metadata = {
  title: "Characters Dossier | GI Damage Calculator Wiki",
  description: "Comprehensive profiles for 48 characters with scaling attributes, talent kits, C1–C6 constellations, and support definitions.",
};

export default function CharactersWikiPage() {
  return <CharactersWikiView />;
}
