import { WEAPON_REGISTRY } from "./weapons";
import type { WeaponConfig, WeaponType } from "./types";

export * from "./types";
export { WEAPON_REGISTRY as WEAPONS } from "./weapons";

export const weaponById = (id: string): WeaponConfig | undefined =>
  WEAPON_REGISTRY.find(w => w.id === id);

export const weaponsByType = (type: WeaponType): WeaponConfig[] =>
  WEAPON_REGISTRY.filter(w => w.type === type);

export const supportWeapons = (): WeaponConfig[] =>
  WEAPON_REGISTRY.filter(w => w.isSupport);
