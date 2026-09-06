import React, { Suspense } from "react";
import type { Metadata } from "next";
import { BuildsView } from "@/components/builds/BuildsView";

export const metadata: Metadata = {
  title: "Character Equipment & Builds Focus | GI Damage Calculator",
  description: "Configure character equipment, weapon passives, and supportive artifact set bonuses for team buff calculations.",
};

export default function BuildsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-sm font-semibold text-gray-400 dark:text-zinc-500 animate-pulse">
            Loading Character Builds &amp; Equipment...
          </div>
        </div>
      }
    >
      <BuildsView />
    </Suspense>
  );
}
