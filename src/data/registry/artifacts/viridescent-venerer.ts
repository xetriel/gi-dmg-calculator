import type { ArtifactConfig, ArtifactBuffContext } from "./types";

function isSwirlOn(ctx: ArtifactBuffContext, key: string, targetElem: string): boolean {
  const hasSpecificSwirl =
    ctx.inputs?.["vv-swirl-pyro"] !== undefined ||
    ctx.inputs?.["vv-swirl-hydro"] !== undefined ||
    ctx.inputs?.["vv-swirl-electro"] !== undefined ||
    ctx.inputs?.["vv-swirl-cryo"] !== undefined;

  // 1. If any specific swirl toggle is in inputs, follow the explicit toggles
  if (hasSpecificSwirl) {
    return (ctx.inputs?.[key] ?? "0") === "1" || Number(ctx.inputs?.[key] ?? 0) > 0;
  }

  // 2. Legacy toggle check ("vv-res-shred-active")
  if (ctx.inputs?.["vv-res-shred-active"] !== undefined) {
    return ctx.inputs["vv-res-shred-active"] === "1" || Number(ctx.inputs["vv-res-shred-active"]) > 0;
  }

  // 3. Fallback when no swirl toggles provided in inputs:
  // Automatically activate for the active character's element if it matches this swirl element
  if (ctx.charElement === targetElem) {
    return true;
  }

  return false;
}

export const viridescentVenerer: ArtifactConfig = {
  id: "viridescent-venerer",
  name: "Viridescent Venerer",
  rarity: 5,
  twoPieceDesc: "Anemo DMG Bonus +15%",
  fourPieceDesc: "Increases Swirl Reaction DMG dealt by 60%, and Stellar Swirl reaction DMG dealt by 20%. Decreases opponent's Elemental RES to the element infused in the Swirl by 40% for 10s. Upon triggering a Stellar Swirl in the opponent, will also decrease their Cryo RES by 40%. RES debuffs of the same elemental type do not stack.",
  isSupport: true,
  buffType: "both",
  mechanicDefs: [
    {
      id: "vv-swirl-pyro",
      label: "Swirl: Pyro (Pyro RES -40%)",
      control: "toggle",
      defaultValue: 0,
      hint: "Decreases opponent's Pyro RES by 40% for 10s upon triggering Pyro Swirl",
    },
    {
      id: "vv-swirl-hydro",
      label: "Swirl: Hydro (Hydro RES -40%)",
      control: "toggle",
      defaultValue: 0,
      hint: "Decreases opponent's Hydro RES by 40% for 10s upon triggering Hydro Swirl",
    },
    {
      id: "vv-swirl-electro",
      label: "Swirl: Electro (Electro RES -40%)",
      control: "toggle",
      defaultValue: 0,
      hint: "Decreases opponent's Electro RES by 40% for 10s upon triggering Electro Swirl",
    },
    {
      id: "vv-swirl-cryo",
      label: "Swirl: Cryo / Stellar Swirl (Cryo RES -40%)",
      control: "toggle",
      defaultValue: 0,
      hint: "Decreases opponent's Cryo RES by 40% for 10s upon triggering Cryo Swirl or Stellar Swirl",
    },
  ],
  buffs: [
    {
      id: "vv-2pc-anemo",
      label: "2-Piece Anemo DMG Bonus%",
      stat: "anemoDmgBonus",
      pieceRequirement: 2,
      isTeamBuff: false,
      value: 15,
      compute: () => 15,
    },
    {
      id: "vv-4pc-stellar-swirl",
      label: "4-Piece Stellar Swirl DMG%",
      stat: "stellarSwirlDmgBonus",
      pieceRequirement: 4,
      isTeamBuff: false,
      value: 20,
      compute: () => 20,
    },
    {
      id: "vv-4pc-pyro",
      label: "4-Piece Pyro RES Shred",
      stat: "enemyPyroRes",
      pieceRequirement: 4,
      isTeamBuff: true,
      value: -40,
      isPercent: true,
      compute: (ctx) => (isSwirlOn(ctx, "vv-swirl-pyro", "Pyro") ? -40 : 0),
    },
    {
      id: "vv-4pc-hydro",
      label: "4-Piece Hydro RES Shred",
      stat: "enemyHydroRes",
      pieceRequirement: 4,
      isTeamBuff: true,
      value: -40,
      isPercent: true,
      compute: (ctx) => (isSwirlOn(ctx, "vv-swirl-hydro", "Hydro") ? -40 : 0),
    },
    {
      id: "vv-4pc-electro",
      label: "4-Piece Electro RES Shred",
      stat: "enemyElectroRes",
      pieceRequirement: 4,
      isTeamBuff: true,
      value: -40,
      isPercent: true,
      compute: (ctx) => (isSwirlOn(ctx, "vv-swirl-electro", "Electro") ? -40 : 0),
    },
    {
      id: "vv-4pc-cryo",
      label: "4-Piece Cryo RES Shred",
      stat: "enemyCryoRes",
      pieceRequirement: 4,
      isTeamBuff: true,
      value: -40,
      isPercent: true,
      compute: (ctx) => (isSwirlOn(ctx, "vv-swirl-cryo", "Cryo") ? -40 : 0),
    },
  ],
};
