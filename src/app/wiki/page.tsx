import React from "react";
import Link from "next/link";
import { WEAPONS } from "@/data/registry/weapons";
import { ARTIFACTS } from "@/data/registry/artifacts";
import { CHARACTERS } from "@/data/registry/characters";

export const metadata = {
  title: "Wiki Hub | GI Damage Calculator",
  description: "Comprehensive Genshin Impact weapons, artifacts, characters, and damage formula knowledge base.",
};

export default function WikiHubPage() {
  const fiveStarWeaponsCount = WEAPONS.filter((w) => w.rarity === 5).length;
  const fiveStarArtifactsCount = ARTIFACTS.filter((a) => a.rarity === 5).length;
  const supportWeaponsCount = WEAPONS.filter((w) => w.isSupport).length;
  const supportArtifactsCount = ARTIFACTS.filter((a) => a.isSupport).length;

  const categories = [
    {
      id: "weapons",
      title: "Weapons Compendium",
      icon: "⚔️",
      href: "/wiki/weapons",
      badge: `${WEAPONS.length} Weapons`,
      badgeColor: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30",
      description:
        "Full database of all 246 canonical weapons across all 5 classes. Includes Lv1 and Lv90 Base ATK, substats, interactive R1–R5 refinement sliders, and party support flags.",
      highlights: [
        `${fiveStarWeaponsCount} 5-Star Weapons`,
        `${supportWeaponsCount} Party Support Weapons`,
        "Interactive R1–R5 dynamic scaling",
      ],
    },
    {
      id: "artifacts",
      title: "Artifacts Encyclopedia",
      icon: "🛡️",
      href: "/wiki/artifacts",
      badge: `${ARTIFACTS.length} Sets`,
      badgeColor: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30",
      description:
        "Complete catalog of all 64 artifact sets with authentic acquisition drop tiers (4★–5★, 3★–4★, 1★–3★), verbatim 2-Piece and 4-Piece bonuses, and mechanics preview.",
      highlights: [
        `${fiveStarArtifactsCount} 4★–5★ Sets`,
        `${supportArtifactsCount} Team Support Sets`,
        "Interactive mechanics sandbox",
      ],
    },
    {
      id: "characters",
      title: "Characters Dossier",
      icon: "👤",
      href: "/wiki/characters",
      badge: `${CHARACTERS.length} Characters`,
      badgeColor: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30",
      description:
        "Comprehensive profiles for 48 characters covering scaling attributes, ascension stat curves, Normal/Skill/Burst hits, C1–C6 constellations, and universal support kits.",
      highlights: [
        "Ascension stat progressions",
        "Full C1–C6 constellation tagging",
        "Direct 'Open in Calculator' links",
      ],
    },
    {
      id: "reactions",
      title: "Reactions & Formula Lab",
      icon: "🧪",
      href: "/wiki/reactions",
      badge: "5 Reaction Classes",
      badgeColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
      description:
        "Mathematical breakdown of Amplifying (Vape/Melt), Catalyze (Aggravate/Spread), Transformative, custom Lunar reactions, and Stellar direct reaction formulas with interactive EM sandbox.",
      highlights: [
        "Vaporize & Melt formulas",
        "Lunar-Charged / Crystallize / Bloom",
        "Stellar direct reaction formulas",
      ],
    },
    {
      id: "mechanics",
      title: "Combat Mechanics Compendium",
      icon: "⚙️",
      href: "/wiki/mechanics",
      badge: "Formula Breakdown",
      badgeColor: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30",
      description:
        "In-depth explanation of core calculation layers: Enemy DEF Multipliers (reduction vs ignore), piecewise Enemy RES curves, Bond of Life mechanics, and Nightsoul systems.",
      highlights: [
        "Enemy DEF & Level scaling",
        "Piecewise RES shred math",
        "Bond of Life & Nightsoul rules",
      ],
    },
    {
      id: "supports",
      title: "Universal Support Matrix",
      icon: "🤝",
      href: "/wiki/supports",
      badge: "46 Supports",
      badgeColor: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/30",
      description:
        "Cross-character comparison matrix for all 46 party support members. Filter who provides Flat ATK, RES Shred, Elemental DMG Bonus, CRIT stats, and Moonsign Lunar Base DMG.",
      highlights: [
        "ATK / EM / CRIT buffer filters",
        "Elemental RES shredding index",
        "Moonsign Lunar Base amplifiers",
      ],
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-gray-200 dark:border-zinc-800 bg-gradient-to-br from-white via-zinc-50 to-amber-50/20 dark:from-zinc-900 dark:via-zinc-900/60 dark:to-amber-950/20 p-6 md:p-8 shadow-xs">
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30">
            <span>✨ Pure Information & Mechanics Wiki</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
            Genshin Impact Knowledge Base
          </h1>
          <p className="max-w-3xl text-sm md:text-base text-gray-600 dark:text-zinc-400 leading-relaxed">
            Independent reference library directly integrated with the calculation engine. Explore canonical stats, dynamic weapon refinement curves, artifact drop tier ranges, full character kits, and authentic damage reaction formulas with zero data drift.
          </p>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-zinc-800/80">
          <div className="p-3 rounded-xl bg-white/60 dark:bg-zinc-800/40 border border-gray-200/80 dark:border-zinc-700/60">
            <div className="text-2xl font-black text-amber-600 dark:text-amber-400 font-mono">246</div>
            <div className="text-xs font-semibold text-gray-500 dark:text-zinc-400">Canonical Weapons</div>
          </div>
          <div className="p-3 rounded-xl bg-white/60 dark:bg-zinc-800/40 border border-gray-200/80 dark:border-zinc-700/60">
            <div className="text-2xl font-black text-purple-600 dark:text-purple-400 font-mono">64</div>
            <div className="text-xs font-semibold text-gray-500 dark:text-zinc-400">Artifact Sets</div>
          </div>
          <div className="p-3 rounded-xl bg-white/60 dark:bg-zinc-800/40 border border-gray-200/80 dark:border-zinc-700/60">
            <div className="text-2xl font-black text-blue-600 dark:text-blue-400 font-mono">48</div>
            <div className="text-xs font-semibold text-gray-500 dark:text-zinc-400">Characters Profiled</div>
          </div>
          <div className="p-3 rounded-xl bg-white/60 dark:bg-zinc-800/40 border border-gray-200/80 dark:border-zinc-700/60">
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">100%</div>
            <div className="text-xs font-semibold text-gray-500 dark:text-zinc-400">Calculator Sync</div>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={cat.href}
            className="group flex flex-col justify-between p-5 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 hover:border-amber-500/50 dark:hover:border-amber-500/50 hover:shadow-md transition-all duration-200"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-3xl">{cat.icon}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${cat.badgeColor}`}>
                  {cat.badge}
                </span>
              </div>
              <div>
                <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                  {cat.title}
                </h2>
                <p className="mt-1 text-xs text-gray-500 dark:text-zinc-400 leading-relaxed">
                  {cat.description}
                </p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100 dark:border-zinc-800/80 space-y-1">
              {cat.highlights.map((item, idx) => (
                <div key={idx} className="flex items-center gap-1.5 text-[11px] text-gray-600 dark:text-zinc-300 font-medium">
                  <span className="text-amber-500 text-[10px]">✔</span>
                  <span>{item}</span>
                </div>
              ))}
              <div className="mt-3 flex items-center text-xs font-bold text-amber-600 dark:text-amber-400 group-hover:translate-x-1 transition-transform">
                <span>Explore {cat.title} →</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
