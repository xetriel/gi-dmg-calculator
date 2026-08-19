import { CATALYSTS } from "./catalysts";
import { SWORDS } from "./swords";
import { POLEARMS } from "./polearms";
import { CLAYMORES } from "./claymores";
import { BOWS } from "./bows";
import type { WeaponConfig, WeaponType } from "./types";

export * from "./types";
export * from "./catalysts";
export * from "./swords";
export * from "./polearms";
export * from "./claymores";
export * from "./bows";

export const WEAPONS: WeaponConfig[] = [
  ...CATALYSTS,
  ...SWORDS,
  ...POLEARMS,
  ...CLAYMORES,
  ...BOWS,
];

export const WEAPON_REGISTRY = WEAPONS;

export const weaponById = (id: string): WeaponConfig | undefined =>
  WEAPONS.find(w => w.id === id);

export const weaponsByType = (type: WeaponType): WeaponConfig[] =>
  WEAPONS.filter(w => w.type === type);

export const supportWeapons = (): WeaponConfig[] =>
  WEAPONS.filter(w => w.isSupport);
