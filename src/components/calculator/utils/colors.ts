import React from "react";

export const DMG_COLORS = {
  Pyro: "rgb(255, 60, 50)",
  Hydro: "rgb(86, 128, 255)",
  Electro: "rgb(178, 93, 205)",
  Cryo: "rgb(119, 162, 230)",
  Anemo: "rgb(97, 219, 187)",
  Geo: "rgb(248, 186, 78)",
  Dendro: "rgb(165, 200, 59)",
  Physical: "rgb(170, 170, 170)",
  Overloaded: "rgb(255, 126, 154)",
  "Electro-Charged": "rgb(226, 153, 253)",
  Superconduct: "rgb(183, 177, 255)",
  Shattered: "rgb(152, 255, 253)",
  Burning: "rgb(191, 40, 24)",
  Bloom: "rgb(71, 200, 59)",
  Burgeon: "rgb(200, 179, 59)",
  Hyperbloom: "rgb(59, 141, 200)",
  Aggravate: "rgb(59, 160, 200)",
  Spread: "rgb(59, 200, 167)",
  "Lunar-Charged": "rgb(236, 184, 255)",
  "Lunar-Bloom": "rgb(200, 239, 196)",
  "Lunar-Crystallize": "rgb(255, 242, 186)",
  "Stellar-Conduct": "rgb(228, 209, 255)",
  "Swirl DMG Bonus": "rgb(102, 255, 203)",
  "Heal-related": "rgb(192, 232, 108)",
  "Vaporize / Melt": "rgb(255, 203, 101)",
  "Shield-related": "rgb(86, 128, 255)",
};

const KEYWORDS = [
  // Lunar / Stellar Special Reactions
  { pattern: /\bLunar-Crystallize\b/i, colorKey: "Lunar-Crystallize" as const },
  { pattern: /\bLunar-Charged\b/i, colorKey: "Lunar-Charged" as const },
  { pattern: /\bLunar-Bloom\b/i, colorKey: "Lunar-Bloom" as const },
  { pattern: /\bStellar-Conduct\b/i, colorKey: "Stellar-Conduct" as const },

  // Infused Swirl variants
  { pattern: /\bHydro[- ]Swirl\b/i, colorKey: "Hydro" as const },
  { pattern: /\bPyro[- ]Swirl\b/i, colorKey: "Pyro" as const },
  { pattern: /\bElectro[- ]Swirl\b/i, colorKey: "Electro" as const },
  { pattern: /\bCryo[- ]Swirl\b/i, colorKey: "Cryo" as const },
  { pattern: /\bSwirl\b/i, colorKey: "Anemo" as const },

  // Infused Crystallize variants
  { pattern: /\bHydro[- ]Crystallize\b/i, colorKey: "Hydro" as const },
  { pattern: /\bPyro[- ]Crystallize\b/i, colorKey: "Pyro" as const },
  { pattern: /\bElectro[- ]Crystallize\b/i, colorKey: "Electro" as const },
  { pattern: /\bCryo[- ]Crystallize\b/i, colorKey: "Cryo" as const },
  { pattern: /\bCrystallize\b/i, colorKey: "Geo" as const },

  // Other Transformative / Amplifying Reactions
  { pattern: /\bElectro-Charged\b/i, colorKey: "Electro-Charged" as const },
  { pattern: /\bSuperconduct\b/i, colorKey: "Superconduct" as const },
  { pattern: /\bOverloaded\b/i, colorKey: "Overloaded" as const },
  { pattern: /\bHyperbloom\b/i, colorKey: "Hyperbloom" as const },
  { pattern: /\bBurgeon\b/i, colorKey: "Burgeon" as const },
  { pattern: /\bShattered\b/i, colorKey: "Shattered" as const },
  { pattern: /\bAggravate\b/i, colorKey: "Aggravate" as const },
  { pattern: /\bVaporize\b/i, colorKey: "Vaporize / Melt" as const },
  { pattern: /\bPhysical\b/i, colorKey: "Physical" as const },
  { pattern: /\bBurning\b/i, colorKey: "Burning" as const },
  { pattern: /\bSpread\b/i, colorKey: "Spread" as const },
  { pattern: /\bStellar\b/i, colorKey: "Stellar-Conduct" as const },
  
  // Elements
  { pattern: /\bDendro\b/i, colorKey: "Dendro" as const },
  { pattern: /\bElectro\b/i, colorKey: "Electro" as const },
  { pattern: /\bAnemo\b/i, colorKey: "Anemo" as const },
  { pattern: /\bHydro\b/i, colorKey: "Hydro" as const },
  { pattern: /\bBloom\b/i, colorKey: "Bloom" as const },
  { pattern: /\bMelt\b/i, colorKey: "Vaporize / Melt" as const },
  { pattern: /\bPyro\b/i, colorKey: "Pyro" as const },
  { pattern: /\bCryo\b/i, colorKey: "Cryo" as const },
  { pattern: /\bGeo\b/i, colorKey: "Geo" as const },

  // Heals & Shields (including HP)
  { pattern: /\bhealing\b/i, colorKey: "Heal-related" as const },
  { pattern: /\bheals\b/i, colorKey: "Heal-related" as const },
  { pattern: /\bheal\b/i, colorKey: "Heal-related" as const },
  { pattern: /\bHP\b/i, colorKey: "Heal-related" as const },
  { pattern: /\bshields\b/i, colorKey: "Shield-related" as const },
  { pattern: /\bshield\b/i, colorKey: "Shield-related" as const },
];

export function renderStyledText(text: string): React.ReactNode {
  if (!text) return "";
  
  const regex = new RegExp(`(${KEYWORDS.map(k => k.pattern.source).join("|")})`, "gi");
  const parts = text.split(regex);
  
  return parts.map((part, index) => {
    const match = KEYWORDS.find(k => k.pattern.test(part));
    if (match) {
      const color = DMG_COLORS[match.colorKey];
      return React.createElement(
        "span",
        { key: index, style: { color }, className: "font-semibold" },
        part
      );
    }
    return part;
  });
}

export function getHitColor(
  element: string,
  reaction?: string,
  direct?: string,
  hitName?: string
): string {
  if (direct === "stellar") {
    return DMG_COLORS["Stellar-Conduct"];
  }
  if (direct === "lunar") {
    const nameLower = hitName?.toLowerCase() || "";
    if (nameLower.includes("charged")) {
      return DMG_COLORS["Lunar-Charged"];
    }
    if (nameLower.includes("bloom") || nameLower.includes("cleanse")) {
      return DMG_COLORS["Lunar-Bloom"];
    }
    if (nameLower.includes("crystallize")) {
      return DMG_COLORS["Lunar-Crystallize"];
    }
    
    // Element fallbacks
    if (element === "Electro") return DMG_COLORS["Lunar-Charged"];
    if (element === "Geo") return DMG_COLORS["Lunar-Crystallize"];
    if (element === "Dendro" || element === "Hydro") return DMG_COLORS["Lunar-Bloom"];
    return DMG_COLORS["Lunar-Bloom"];
  }

  if (reaction && reaction !== "none") {
    const rx = reaction.toLowerCase();
    if (rx === "vaporize" || rx === "melt") {
      return DMG_COLORS["Vaporize / Melt"];
    }
    if (rx === "overloaded") return DMG_COLORS["Overloaded"];
    if (rx === "electro-charged") return DMG_COLORS["Electro-Charged"];
    if (rx === "superconduct") return DMG_COLORS["Superconduct"];
    if (rx === "shattered") return DMG_COLORS["Shattered"];
    if (rx === "burning") return DMG_COLORS["Burning"];
    if (rx === "bloom") return DMG_COLORS["Bloom"];
    if (rx === "burgeon") return DMG_COLORS["Burgeon"];
    if (rx === "hyperbloom") return DMG_COLORS["Hyperbloom"];
    if (rx === "aggravate") return DMG_COLORS["Aggravate"];
    if (rx === "spread") return DMG_COLORS["Spread"];
  }

  return DMG_COLORS[element as keyof typeof DMG_COLORS] || DMG_COLORS["Physical"];
}
