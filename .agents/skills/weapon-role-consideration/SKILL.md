---
name: weapon-role-consideration
description: Architectural standard and guidelines for implementing Genshin Impact weapon role considerations, categorizing weapons into Own Wielder vs Party Support, filtering contracts, refinement curves, mechanic resolvers, and category-by-category engine rollout starting with Claymores.
---

# Weapon Role Consideration Skill & Implementation Standard

This skill defines the authoritative standard for weapon role classification, filtering rules, data modeling, calculation closures, rarity-focused UI styling, and test verification in `gi-dmg-calculator`.

---

## 1. Core Concepts: Own Wielder vs Party Support

Every weapon in Genshin Impact serves one or both of two distinct roles in combat calculations:

```
                               ┌───────────────────────────────────────────┐
                               │             WEAPONS REGISTRY              │
                               │               (246 Total)                 │
                               └─────────────────────┬─────────────────────┘
                                                     │
                         ┌───────────────────────────┴───────────────────────────┐
                         ▼                                                       ▼
          ┌─────────────────────────────┐                         ┌─────────────────────────────┐
          │      PARTY SUPPORT          │                         │        OWN WIELDER          │
          │    (`isSupport: true`)      │                         │    (`isSupport: false`)     │
          │   `buffType: team | both`   │                         │     `buffType: "self"`      │
          └──────────────┬──────────────┘                         └──────────────┬──────────────┘
                         │                                                       │
                         ▼                                                       ▼
           Applies team buffs to ANY                               Only available & applied if
           active DPS character on the                             the character wields that
           team, regardless of weapon class.                       specific weapon class.
           (e.g., Freedom-Sworn, WGS, Pines)                       (e.g., Sandrone equipping Claymores)
```

### A. Own Wielder Weapons (`isSupport: false`, `buffType: "self"`)
- **Scope**: Exclusively equipable and active for characters whose base weapon class matches the weapon's type (`charConfig.weapon === weapon.type`).
- **Example**: If the active character is **Sandrone** (Claymore), all Claymores (*Redhorn Stonethresher*, *Beacon of the Reed Sea*, *A Thousand Blazing Suns*, *Serpent Spine*, *Whiteblind*, *Earth Shaker*, etc.) are displayed in her catalog and can be equipped.
- **Restrictions**: Non-support Claymores cannot be equipped by or provide buffs to Sword, Polearm, Bow, or Catalyst characters.

### B. Party Support Weapons (`isSupport: true`, `buffType: "team" | "both"`)
- **Scope**: Weapons with team-wide supportive passives that provide buffs to any character in the party.
- **Example**:
  - *Song of Broken Pines* (Claymore): Millennial Movement grants **+16~32% NA/CA/Plunge DMG** and **+20~40% ATK** to all party members.
  - *Wolf's Gravestone* (Claymore): Grants **+40~80% ATK** to all party members against targets < 30% HP.
  - *Makhaira Aquamarine* (Claymore): Wielder converts EM into **+7.2~14.4% ATK share** to all party members.
  - *Forest Regalia* (Claymore): Generates Leaf of Consciousness granting **+60~120 EM** to the picking character.
  - *Freedom-Sworn* (Sword), *Key of Khaj-Nisut* (Sword), *Peak Patrol Song* (Sword), *Thrilling Tales of Dragon Slayers* (Catalyst), *A Thousand Floating Dreams* (Catalyst).
- **Behavior**: Any character (e.g. Arlecchino [Polearm], Neuvillette [Catalyst], Sandrone [Claymore], Traveler [Sword]) can receive these supportive buffs through the External Weapon Buffs toggle.

---

## 2. Filtering Contract (`getWeaponsForCharacter`)

Located in `src/data/registry/weapons/types.ts`:
```ts
export function getWeaponsForCharacter(
  charConfig: CharacterConfig,
  weapons: WeaponConfig[]
): WeaponConfig[] {
  return weapons.filter((w) => {
    // 1. All weapons matching the character's weapon type (Own Wielder)
    if (w.type === charConfig.weapon) return true;

    // 2. All supportive weapons from ANY category (Party Support)
    if (w.isSupport) return true;

    // 3. Exclude non-support weapons of other categories
    return false;
  });
}
```

---

## 3. Rarity-Focused UI Theming & Layout Integration

All weapon role components integrate with the centralized **Rarity-Focused Design System** (`src/components/calculator/rarity-theme.ts`):

- **5★ Weapons (Gold-ish)**: `amber-500` / `amber-400` / `amber-950/20` (Pines, WGS, Freedom-Sworn, Floating Dreams).
- **4★ Weapons (Purple-ish)**: `purple-600` / `purple-400` / `purple-950/20` (Makhaira, Forest Regalia, Favonius, Sacrificial, Xiphos).
- **3★ Weapons (Blue-ish)**: `sky-600` / `sky-400` / `sky-950/20` (Thrilling Tales of Dragon Slayers, Harbinger of Dawn).

### Placement in Character Calculator
- Embedded via `<ExternalWeaponBuffPanel>` in the **top container (inputs & configuration)** above the draggable horizontal splitter bar.
- Panel header uses neutral white text (`text-gray-900 dark:text-white`) with a neutral zinc icon badge and `{activeCount}/{total}` in white and `(Max 3)` in grey.
- Aggregated buff pills in the panel footer dynamically inherit the source weapon's rarity vibe via `getRarityTheme(s.rarity).sourceBuffPill`.

---

## 4. Claymore Category Role Specification

### Party Support Claymores (`isSupport: true`)

| Claymore | Rarity | Buff Type | Team Buff Effects | Mechanic Controls |
| :--- | :---: | :---: | :--- | :--- |
| **Song of Broken Pines** | 5★ | `"both"` | Team: **+16~32% NA/CA/Plunge DMG** & **+20~40% ATK**<br>Self: +16~32% ATK | `pines-banner-active` (toggle) |
| **Wolf's Gravestone** | 5★ | `"both"` | Team: **+40~80% ATK** against <30% HP enemies<br>Self: +20~40% ATK | `wgs-party-buff-active` (toggle) |
| **Makhaira Aquamarine** | 4★ | `"both"` | Team: **+7.2~14.4% of Wielder EM as ATK** (30% share)<br>Self: +24~48% of EM as ATK | `makhaira-wielder-em` (numeric input) |
| **Forest Regalia** | 4★ | `"team"` | Team: **+60~120 Elemental Mastery** (Leaf of Consciousness) | `regalia-leaf-picked` (toggle) |
| **Favonius Greatsword** | 4★ | `"team"` | Team Energy Generation | Passive |
| **Sacrificial Greatsword** | 4★ | `"self"` | Skill CD Reset Utility | Passive |

### Own Wielder Claymores (`isSupport: false`, `buffType: "self"`)

All 39 other Claymores are self-buffing weapons active solely for Claymore wielders (45 Total Claymores: 6 Party Support + 39 Own Wielder):
- **5-Star**: *A Thousand Blazing Suns*, *A Teaspoon of Transcendence*, *Beacon of the Reed Sea*, *Fang of the Mountain King*, *Gest of the Mighty Wolf*, *Redhorn Stonethresher*, *Skyward Pride*, *The Unforged*, *Verdict*.
- **4-Star**: *"Ultimate Overlord's Mega Magic Sword"*, *Akuoumaru*, *Blackcliff Slasher*, *Blade of Atonement*, *Earth Shaker*, *Flame-Forged Insight*, *Forged by the Golden Melody*, *Fruitful Hook*, *Katsuragikiri Nagamasa*, *Lithic Blade*, *Luxurious Sea-Lord*, *Mailed Flower*, *Master Key*, *Portable Power Saw*, *Prototype Archaic*, *Rainslasher*, *Royal Greatsword*, *Serpent Spine*, *Snow-Tombed Starsilver*, *Talking Stick*, *The Bell*, *Tidal Shadow*, *Whiteblind*.
- **3-Star, 2-Star, 1-Star**: *Bloodtainted Greatsword*, *Debate Club*, *Ferrous Shadow*, *Skyrider Greatsword*, *White Iron Greatsword*, *Old Merc's Pal*, *Waster Greatsword*.

---

## 5. Implementation Template for Weapon Files

```ts
import type { WeaponConfig } from "../types";

export const wolfsGravestone: WeaponConfig = {
  id: "wolfs-gravestone",
  name: "Wolf's Gravestone",
  type: "Claymore",
  rarity: 5,
  baseAtk: 608,
  lvl1BaseAtk: 46,
  subStat: {
    type: "atkPct",
    label: "ATK%",
    value: 49.6,
    baseValue: 10.8,
  },
  passiveName: "Wolfish Tracker",
  passiveDesc:
    "Increases ATK by 20~40%. On hit, attacks against opponents with less than 30% HP increase all party members' ATK by 40~80% for 12s. Can only occur once every 30s.",
  isSupport: true, // Label: Party Support
  buffType: "both",
  mechanicDefs: [
    {
      id: "wgs-party-buff-active",
      label: "Target HP < 30% (+40~80% Party ATK)",
      control: "toggle",
      defaultValue: 1,
      hint: "Team buff: +40~80% ATK for 12s",
    },
  ],
  buffs: [
    {
      id: "wgs-party-atk",
      label: "Party ATK% (Wolf's Gravestone)",
      description: "Attacks against enemies with <30% HP grant +40~80% ATK to all party members",
      stat: "atk",
      refinementValues: [40, 50, 60, 70, 80],
      isTeamBuff: true, // Injected into party statDeltas
      isPercent: true,
      conditionKey: "wgs-party-buff-active",
      compute: (r, ctx) => {
        const on =
          (ctx.inputs?.["wgs-party-buff-active"] ?? "1") === "1" ||
          Number(ctx.inputs?.["wgs-party-buff-active"] ?? 1) > 0;
        return on ? ([40, 50, 60, 70, 80][r - 1] / 100) * ctx.baseAtk : 0;
      },
    },
    {
      id: "wgs-self-atk",
      label: "Self ATK% (Wolf's Gravestone Base)",
      stat: "atk",
      refinementValues: [20, 25, 30, 35, 40],
      isTeamBuff: false,
      isPercent: true,
      compute: (r, ctx) => ([20, 25, 30, 35, 40][r - 1] / 100) * ctx.baseAtk,
    },
  ],
};
```

---

## 6. Verification Checklist

When implementing or updating weapon roles:
1. **Filtering Assertions**: Assert that `getWeaponsForCharacter()` includes all same-category weapons and all supportive weapons, while excluding non-supportive foreign weapons.
2. **Team Buff Passthrough Tests**: Assert in Vitest that Party Support weapons correctly calculate and inject `statDeltas` into characters of different weapon classes.
3. **Own Wielder Isolation**: Assert that self-only buffs on own-wielder weapons only apply when equipped on matching character weapon types.
4. **Rarity Theming Verification**: Verify that weapon cards, badges, and buff pills render with the proper rarity vibe token.
5. **Zero Type Errors**: Run `npm test` and `npm run build` to confirm complete type compliance and clean production compilation.
