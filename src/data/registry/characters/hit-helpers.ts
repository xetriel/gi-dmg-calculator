import type { TalentHit } from "../types";

// Build a hit that scales off ATK or HP. `key` is the stable id joined to the
// TalentScaling table; `name` is the display label. Per-hit scaling matters
// because a character's hits are not always uniform (e.g. Neuvillette mixes ATK/HP).
export const atk = (key: string, name: string): TalentHit => ({ key, name, scaling: "atk" });
export const hp = (key: string, name: string): TalentHit => ({ key, name, scaling: "hp" });
// Healing row (% Max HP): displayed as a heal amount, no crit columns.
export const healHp = (key: string, name: string): TalentHit => ({ key, name, scaling: "hp", kind: "heal" });
// Stellar-Conduct reaction hit (ATK-scaled): computed via the stellar formula branch.
export const stellarAtk = (key: string, name: string): TalentHit => ({ key, name, scaling: "atk", stellar: true });
