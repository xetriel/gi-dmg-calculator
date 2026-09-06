import type { ArtifactConfig, ArtifactBuffContext } from "./types";

function getCinderBonus(ctx: ArtifactBuffContext): number {
  const nightsoul = (ctx.inputs?.["cinder-nightsoul-active"] ?? "1") === "1" || Number(ctx.inputs?.["cinder-nightsoul-active"] ?? 1) > 0;
  return nightsoul ? 40 : 12;
}

function isReactionOn(ctx: ArtifactBuffContext, key: string): boolean {
  return (ctx.inputs?.[key] ?? "0") === "1" || Number(ctx.inputs?.[key] ?? 0) > 0;
}

export const scrollOfTheHeroOfCinderCity: ArtifactConfig = {
  id: "scroll-of-the-hero-of-cinder-city",
  name: "Scroll of the Hero of Cinder City",
  rarity: 5,
  twoPieceDesc: "When a nearby party member triggers a Nightsoul Burst, the equipping character regenerates 6 Elemental Energy.",
  fourPieceDesc: "After the equipping character triggers a reaction related to their Elemental Type, all nearby party members gain a 12% Elemental DMG Bonus for the Elemental Types involved in the elemental reaction for 15s. If the equipping character is in the Nightsoul's Blessing state when triggering this effect, all nearby party members gain an additional 28% Elemental DMG Bonus for the Elemental Types involved in the elemental reaction for 20s. The equipping character can trigger this effect while off-field, and the DMG bonus from Artifact Sets with the same name do not stack.",
  isSupport: true,
  buffType: "both",
  mechanicDefs: [
    {
      id: "cinder-nightsoul-active",
      label: "In Nightsoul's Blessing State (+28% Extra, Total +40%)",
      control: "toggle",
      defaultValue: 1,
      hint: "Increases party Elemental DMG Bonus by an additional 28% (Total +40%)",
    },
    // Geo Reactions (Crystallize)
    {
      id: "cinder-crystallize-pyro",
      label: "Crystallize: Pyro (Geo + Pyro DMG)",
      control: "toggle",
      defaultValue: 0,
      hint: "Triggered Geo + Pyro reaction: party members gain Geo & Pyro DMG Bonus (+12%/+40%)",
    },
    {
      id: "cinder-crystallize-hydro",
      label: "Crystallize: Hydro (Geo + Hydro DMG)",
      control: "toggle",
      defaultValue: 0,
      hint: "Triggered Geo + Hydro reaction: party members gain Geo & Hydro DMG Bonus (+12%/+40%)",
    },
    {
      id: "cinder-crystallize-electro",
      label: "Crystallize: Electro (Geo + Electro DMG)",
      control: "toggle",
      defaultValue: 0,
      hint: "Triggered Geo + Electro reaction: party members gain Geo & Electro DMG Bonus (+12%/+40%)",
    },
    {
      id: "cinder-crystallize-cryo",
      label: "Crystallize: Cryo (Geo + Cryo DMG)",
      control: "toggle",
      defaultValue: 0,
      hint: "Triggered Geo + Cryo reaction: party members gain Geo & Cryo DMG Bonus (+12%/+40%)",
    },
    // Anemo Reactions (Swirl)
    {
      id: "cinder-swirl-pyro",
      label: "Swirl: Pyro (Anemo + Pyro DMG)",
      control: "toggle",
      defaultValue: 0,
      hint: "Triggered Anemo + Pyro reaction: party members gain Anemo & Pyro DMG Bonus (+12%/+40%)",
    },
    {
      id: "cinder-swirl-hydro",
      label: "Swirl: Hydro (Anemo + Hydro DMG)",
      control: "toggle",
      defaultValue: 0,
      hint: "Triggered Anemo + Hydro reaction: party members gain Anemo & Hydro DMG Bonus (+12%/+40%)",
    },
    {
      id: "cinder-swirl-electro",
      label: "Swirl: Electro (Anemo + Electro DMG)",
      control: "toggle",
      defaultValue: 0,
      hint: "Triggered Anemo + Electro reaction: party members gain Anemo & Electro DMG Bonus (+12%/+40%)",
    },
    {
      id: "cinder-swirl-cryo",
      label: "Swirl: Cryo (Anemo + Cryo DMG)",
      control: "toggle",
      defaultValue: 0,
      hint: "Triggered Anemo + Cryo reaction: party members gain Anemo & Cryo DMG Bonus (+12%/+40%)",
    },
    // Other Dual-Element Reactions
    {
      id: "cinder-vaporize",
      label: "Vaporize (Pyro + Hydro DMG)",
      control: "toggle",
      defaultValue: 0,
      hint: "Triggered Pyro + Hydro reaction: party members gain Pyro & Hydro DMG Bonus (+12%/+40%)",
    },
    {
      id: "cinder-melt",
      label: "Melt (Pyro + Cryo DMG)",
      control: "toggle",
      defaultValue: 0,
      hint: "Triggered Pyro + Cryo reaction: party members gain Pyro & Cryo DMG Bonus (+12%/+40%)",
    },
    {
      id: "cinder-overloaded",
      label: "Overloaded (Pyro + Electro DMG)",
      control: "toggle",
      defaultValue: 0,
      hint: "Triggered Pyro + Electro reaction: party members gain Pyro & Electro DMG Bonus (+12%/+40%)",
    },
    {
      id: "cinder-burning",
      label: "Burning (Pyro + Dendro DMG)",
      control: "toggle",
      defaultValue: 0,
      hint: "Triggered Pyro + Dendro reaction: party members gain Pyro & Dendro DMG Bonus (+12%/+40%)",
    },
    {
      id: "cinder-electro-charged",
      label: "Electro-Charged / Lunar-Charged (Electro + Hydro DMG)",
      control: "toggle",
      defaultValue: 0,
      hint: "Triggered Electro + Hydro reaction: party members gain Electro & Hydro DMG Bonus (+12%/+40%)",
    },
    {
      id: "cinder-superconduct",
      label: "Superconduct / Stellar-Conduct (Cryo + Electro DMG)",
      control: "toggle",
      defaultValue: 0,
      hint: "Triggered Cryo + Electro reaction: party members gain Cryo & Electro DMG Bonus (+12%/+40%)",
    },
    {
      id: "cinder-frozen",
      label: "Frozen (Cryo + Hydro DMG)",
      control: "toggle",
      defaultValue: 0,
      hint: "Triggered Cryo + Hydro reaction: party members gain Cryo & Hydro DMG Bonus (+12%/+40%)",
    },
    {
      id: "cinder-quicken",
      label: "Quicken / Aggravate / Spread (Dendro + Electro DMG)",
      control: "toggle",
      defaultValue: 0,
      hint: "Triggered Dendro + Electro reaction: party members gain Dendro & Electro DMG Bonus (+12%/+40%)",
    },
    {
      id: "cinder-bloom",
      label: "Bloom / Lunar-Bloom (Dendro + Hydro DMG)",
      control: "toggle",
      defaultValue: 0,
      hint: "Triggered Dendro + Hydro reaction: party members gain Dendro & Hydro DMG Bonus (+12%/+40%)",
    },
  ],
  buffs: [
    {
      id: "cinder-4pc-geo",
      label: "4-Piece Geo DMG% (Scroll of Cinder City)",
      stat: "geoDmgBonus",
      pieceRequirement: 4,
      isTeamBuff: true,
      compute: (ctx) => {
        const isGeoActive =
          isReactionOn(ctx, "cinder-crystallize-pyro") ||
          isReactionOn(ctx, "cinder-crystallize-hydro") ||
          isReactionOn(ctx, "cinder-crystallize-electro") ||
          isReactionOn(ctx, "cinder-crystallize-cryo") ||
          (isReactionOn(ctx, "cinder-reaction-active") && ctx.charElement === "Geo");
        return isGeoActive ? getCinderBonus(ctx) : 0;
      },
    },
    {
      id: "cinder-4pc-pyro",
      label: "4-Piece Pyro DMG% (Scroll of Cinder City)",
      stat: "pyroDmgBonus",
      pieceRequirement: 4,
      isTeamBuff: true,
      compute: (ctx) => {
        const isPyroActive =
          isReactionOn(ctx, "cinder-crystallize-pyro") ||
          isReactionOn(ctx, "cinder-swirl-pyro") ||
          isReactionOn(ctx, "cinder-vaporize") ||
          isReactionOn(ctx, "cinder-melt") ||
          isReactionOn(ctx, "cinder-overloaded") ||
          isReactionOn(ctx, "cinder-burning") ||
          (isReactionOn(ctx, "cinder-reaction-active") && (ctx.charElement === "Pyro" || !ctx.charElement));
        return isPyroActive ? getCinderBonus(ctx) : 0;
      },
    },
    {
      id: "cinder-4pc-hydro",
      label: "4-Piece Hydro DMG% (Scroll of Cinder City)",
      stat: "hydroDmgBonus",
      pieceRequirement: 4,
      isTeamBuff: true,
      compute: (ctx) => {
        const isHydroActive =
          isReactionOn(ctx, "cinder-crystallize-hydro") ||
          isReactionOn(ctx, "cinder-swirl-hydro") ||
          isReactionOn(ctx, "cinder-vaporize") ||
          isReactionOn(ctx, "cinder-electro-charged") ||
          isReactionOn(ctx, "cinder-frozen") ||
          isReactionOn(ctx, "cinder-bloom") ||
          (isReactionOn(ctx, "cinder-reaction-active") && ctx.charElement === "Hydro");
        return isHydroActive ? getCinderBonus(ctx) : 0;
      },
    },
    {
      id: "cinder-4pc-electro",
      label: "4-Piece Electro DMG% (Scroll of Cinder City)",
      stat: "electroDmgBonus",
      pieceRequirement: 4,
      isTeamBuff: true,
      compute: (ctx) => {
        const isElectroActive =
          isReactionOn(ctx, "cinder-crystallize-electro") ||
          isReactionOn(ctx, "cinder-swirl-electro") ||
          isReactionOn(ctx, "cinder-overloaded") ||
          isReactionOn(ctx, "cinder-electro-charged") ||
          isReactionOn(ctx, "cinder-superconduct") ||
          isReactionOn(ctx, "cinder-quicken") ||
          (isReactionOn(ctx, "cinder-reaction-active") && ctx.charElement === "Electro");
        return isElectroActive ? getCinderBonus(ctx) : 0;
      },
    },
    {
      id: "cinder-4pc-cryo",
      label: "4-Piece Cryo DMG% (Scroll of Cinder City)",
      stat: "cryoDmgBonus",
      pieceRequirement: 4,
      isTeamBuff: true,
      compute: (ctx) => {
        const isCryoActive =
          isReactionOn(ctx, "cinder-crystallize-cryo") ||
          isReactionOn(ctx, "cinder-swirl-cryo") ||
          isReactionOn(ctx, "cinder-melt") ||
          isReactionOn(ctx, "cinder-superconduct") ||
          isReactionOn(ctx, "cinder-frozen") ||
          (isReactionOn(ctx, "cinder-reaction-active") && ctx.charElement === "Cryo");
        return isCryoActive ? getCinderBonus(ctx) : 0;
      },
    },
    {
      id: "cinder-4pc-anemo",
      label: "4-Piece Anemo DMG% (Scroll of Cinder City)",
      stat: "anemoDmgBonus",
      pieceRequirement: 4,
      isTeamBuff: true,
      compute: (ctx) => {
        const isAnemoActive =
          isReactionOn(ctx, "cinder-swirl-pyro") ||
          isReactionOn(ctx, "cinder-swirl-hydro") ||
          isReactionOn(ctx, "cinder-swirl-electro") ||
          isReactionOn(ctx, "cinder-swirl-cryo") ||
          (isReactionOn(ctx, "cinder-reaction-active") && ctx.charElement === "Anemo");
        return isAnemoActive ? getCinderBonus(ctx) : 0;
      },
    },
    {
      id: "cinder-4pc-dendro",
      label: "4-Piece Dendro DMG% (Scroll of Cinder City)",
      stat: "dendroDmgBonus",
      pieceRequirement: 4,
      isTeamBuff: true,
      compute: (ctx) => {
        const isDendroActive =
          isReactionOn(ctx, "cinder-burning") ||
          isReactionOn(ctx, "cinder-quicken") ||
          isReactionOn(ctx, "cinder-bloom") ||
          (isReactionOn(ctx, "cinder-reaction-active") && ctx.charElement === "Dendro");
        return isDendroActive ? getCinderBonus(ctx) : 0;
      },
    },
  ],
};
