---
name: external-weapon-buffs
description: Guidelines and architectural standard for implementing Genshin Impact external weapon team buff sources, modular 1-file-per-weapon registries, character and supportive weapon filtering, refinement scaling (R1–R5), mechanic condition resolvers, Prisma and MySQL database schema syncing, and engine integration.
---

# External Weapon Team Buff Skill & Implementation Standard

This skill documents the exact architectural patterns, data structures, calculation engine, UI components, database schema synchronization, and verification workflow for implementing or extending **External Weapon Team Buff Sources** in `gi-dmg-calculator`.

---

## 1. Core Architecture & Philosophy

The External Weapon Buff system allows weapons equipped by party members (supportive weapons) or signature weapons equipped by the active DPS character to inject buffs into the damage calculation pipeline.

### Key Principles

1. **Character-Specific & Supportive Weapon Filtering (`getWeaponsForCharacter`)**:
   - For any active DPS character (e.g. Arlecchino, Polearm), available weapons in the selection dropdown MUST follow strict rules:
     - **Matching Weapon Class**: All weapons of the character's weapon type (e.g., all Polearms for Arlecchino).
     - **Team Supportive Weapons**: All weapons marked with `isSupport: true` across *all* weapon classes (e.g. *A Thousand Floating Dreams* [Catalyst], *Freedom-Sworn* [Sword], *Elegy for the End* [Bow], *Song of Broken Pines* [Claymore], *Key of Khaj-Nisut* [Sword], *TTDS* [Catalyst], *Peak Patrol Song* [Sword], etc.).
     - Non-support weapons of non-matching classes (e.g. *Tome of the Eternal Flow* [Catalyst] for Arlecchino) are strictly excluded.
2. **Modular 1-File-Per-Weapon Registry**:
   - Every weapon is defined in its own isolated file under its category directory (`src/data/registry/weapons/<category>/<id>.ts`).
   - Grouped into 5 weapon categories (`catalysts/`, `swords/`, `polearms/`, `claymores/`, `bows/`), each with a category `index.ts` barrel aggregator.
   - Unified central entrypoint: `src/data/registry/weapons/index.ts`.
3. **Dual Toggle Granularity**:
   - **Master Toggle (`externalWeaponBuffsEnabled`)**: Global switch in the calculator header/panel to apply or bypass all external weapon buffs.
   - **Per-Weapon Toggle (`enabled`)**: Individual checkbox on each weapon card. A weapon's buffs apply if and only if **both** the master toggle and that weapon's individual toggle are enabled.
4. **Refinement Scaling (R1–R5)**:
   - Every buff definition provides explicit 5-element arrays (`refinementValues: [R1, R2, R3, R4, R5]`) or custom computation logic.
5. **Interactive Mechanic Inputs**:
   - Weapons with conditional passives (e.g., Bond of Life states on *Crimson Moon's Semblance*, wielder HP for *Key of Khaj-Nisut*, party element match stacks for *A Thousand Floating Dreams*) declare `mechanicDefs` with toggles or sliders that render dynamically in the UI.
6. **Pure Engine Stat Delta Accumulation**:
   - `resolveExternalWeaponBuffs` is a pure function that resolves all active weapon buffs into `statDeltas` (ATK, EM, CRIT, DMG Bonus%, ER, etc.) and a structured `sources` list for attribution.
   - Percentage ATK buffs (e.g. TTDS +48% ATK, Freedom-Sworn +20% ATK) multiply against active character's `baseAtk`: `(pct / 100) * baseAtk`.
7. **Formula Breakdown & Tooltip Attribution**:
   - Every buff is tracked with source name and label (e.g., `Freedom-Sworn (Weapon): +20.0% ATK (Freedom-Sworn Millennial Movement)`).
   - Displayed in the `Received Team Buffs` card on `/characters/[id]/formula` and in hover tooltip popovers on the character calculator page.
8. **Database Synchronization (Prisma & MySQL)**:
   - Database schema has `model Weapon` in `prisma/schema.prisma` and matching DDL in `gi_stat_db.sql`.
   - Seeded via `prisma/seed.ts` from the TypeScript registry.

---

## 2. File Architecture & Modules

| File Path | Purpose |
| --- | --- |
| `src/data/registry/weapons/types.ts` | Type definitions (`WeaponType`, `WeaponRarity`, `WeaponSubStat`, `WeaponBuffContext`, `WeaponBuffDef`, `WeaponConfig`, `ExternalWeaponInstance`) and `getWeaponsForCharacter()` filtering helper. |
| `src/data/registry/weapons/catalysts/<id>.ts` | Individual catalyst weapon definitions (e.g., `a-thousand-floating-dreams.ts`, `thrilling-tales-of-dragon-slayers.ts`). |
| `src/data/registry/weapons/swords/<id>.ts` | Individual sword weapon definitions (e.g., `freedom-sworn.ts`, `key-of-khaj-nisut.ts`, `peak-patrol-song.ts`). |
| `src/data/registry/weapons/polearms/<id>.ts` | Individual polearm weapon definitions (e.g., `crimson-moons-semblance.ts`, `staff-of-homa.ts`, `moonpiercer.ts`). |
| `src/data/registry/weapons/claymores/<id>.ts` | Individual claymore weapon definitions (e.g., `song-of-broken-pines.ts`, `wolfs-gravestone.ts`). |
| `src/data/registry/weapons/bows/<id>.ts` | Individual bow weapon definitions (e.g., `elegy-for-the-end.ts`, `favonius-warbow.ts`). |
| `src/data/registry/weapons/<category>/index.ts` | Category barrel exports (`CATALYSTS`, `SWORDS`, `POLEARMS`, `CLAYMORES`, `BOWS`). |
| `src/data/registry/weapons/index.ts` | Unified central registry export: `WEAPONS`, `weaponById`, `weaponsByType`, `supportWeapons`, and type re-exports. |
| `src/lib/engine/weapon-buffs.ts` | Pure calculation engine: `resolveExternalWeaponBuffs(weapons, baseAtk, charConfig, masterEnabled)`. |
| `src/lib/engine/weapon-buffs.test.ts` | Comprehensive Vitest suite testing character filtering, R1–R5 scaling, conditions, stacking, and toggle bypass. |
| `src/components/calculator/components/ExternalWeaponBuffPanel.tsx` | Collapsible UI panel with master toggle, filtered weapon dropdown, weapon cards with class icons, R1–R5 picker, mechanic controls, and live buff previews. |
| `src/components/calculator/types.ts` | State interfaces: `externalWeapons?: ExternalWeaponInstance[]`, `externalWeaponBuffsEnabled?: boolean`. |
| `src/components/CharacterCalculator.tsx` | Calculator integration: applies `statDeltas` in `computeInstance`, adds weapon sources to `StatBreakdownRow`, and embeds `<ExternalWeaponBuffPanel>`. |
| `src/lib/engine/formula-explainer.ts` | Explainer integration: includes weapon buff equations under "Received Team Buffs" on `/characters/[id]/formula`. |
| `prisma/schema.prisma` | Database schema: `model Weapon` with indexes on `type` and `isSupport`. |
| `prisma/seed.ts` | Database seed synchronization syncing `WEAPONS` into Prisma `prisma.weapon`. |
| `gi_stat_db.sql` | Raw MySQL DDL schema and initial seed inserts. |

---

## 3. Data Layer Standard (`WeaponConfig`)

### A. Core Interfaces

```ts
export type WeaponType = "Sword" | "Claymore" | "Polearm" | "Bow" | "Catalyst";
export type WeaponRarity = 1 | 2 | 3 | 4 | 5;

export interface WeaponBuffContext {
  refinement: number;                          // 1..5
  baseAtk: number;                             // active character's base ATK
  charElement?: Element;                       // active character's element
  charWeapon?: WeaponType;                     // active character's weapon type
  inputs?: Record<string, string | number>;    // weapon condition inputs (e.g. stacks, wielderHp)
  wielderElement?: Element;                    // for element comparison
}

export interface WeaponBuffDef {
  id: string;                                  // unique buff slug e.g. "freedom-party-atk"
  label: string;                               // display label
  description?: string;                        // detailed tooltip description
  stat: string;                                // target stat key ("atk", "em", "normalDmgBonus", "allDmgBonus", "energyRecharge", etc.)
  refinementValues: [number, number, number, number, number]; // [R1, R2, R3, R4, R5]
  isTeamBuff: boolean;                         // true if applies to team / active DPS
  isPercent?: boolean;                         // true if percentage based (e.g. +20% ATK)
  conditionKey?: string;                       // links to MechanicDef.id if conditional
  compute?: (refinement: number, ctx: WeaponBuffContext) => number;
}

export interface WeaponConfig {
  id: string;                                  // slug e.g. "crimson-moons-semblance"
  name: string;                                // display name
  type: WeaponType;
  rarity: WeaponRarity;
  baseAtk: number;                             // Lv90 Base ATK
  lvl1BaseAtk?: number;                        // Lv1 Base ATK
  subStat?: {
    type: string;                              // "critRate", "em", "atkPct", "energyRecharge", "hpPct", "defPct", etc.
    label: string;
    value: number;                             // Lv90 value
    baseValue?: number;                        // Lv1 value
  };
  passiveName: string;
  passiveDesc: string;
  isSupport: boolean;                          // true if provides team/party buffs
  buffType: "team" | "self" | "both";
  buffs: WeaponBuffDef[];
  mechanicDefs?: MechanicDef[];                // UI controls for conditional passives
  signatureFor?: string[];                     // Character slugs this weapon is signature for
}
```

---

### B. Implementation Examples

#### 1. Supportive Weapon Example (*Freedom-Sworn*)
`src/data/registry/weapons/swords/freedom-sworn.ts`:
```ts
import type { WeaponConfig } from "../types";

export const freedomSworn: WeaponConfig = {
  id: "freedom-sworn",
  name: "Freedom-Sworn",
  type: "Sword",
  rarity: 5,
  baseAtk: 608,
  lvl1BaseAtk: 46,
  subStat: {
    type: "em",
    label: "Elemental Mastery",
    value: 198,
    baseValue: 43,
  },
  passiveName: "Revolutionary Chorale",
  passiveDesc:
    "A part of the 'Millennial Movement' that wanders amidst the winds. Increases DMG by 10~20%. When triggering Elemental Reactions, the wielder gains Sigils of Rebellion. When you possess 2 Sigils, all nearby party members gain 'Millennial Movement: Song of Resistance': Normal, Charged, and Plunging Attack DMG is increased by 16~32% and ATK is increased by 20~40% for 12s.",
  isSupport: true,
  buffType: "both",
  buffs: [
    {
      id: "freedom-party-na-ca-plunge",
      label: "NA/CA/Plunge DMG Bonus (Freedom-Sworn Millennial Movement)",
      description: "All party members gain +16~32% Normal, Charged, and Plunging Attack DMG",
      stat: "normalDmgBonus",
      refinementValues: [16, 20, 24, 28, 32],
      isTeamBuff: true,
      compute: (r) => [16, 20, 24, 28, 32][r - 1],
    },
    {
      id: "freedom-party-atk",
      label: "ATK% (Freedom-Sworn Millennial Movement)",
      description: "All party members gain +20~40% ATK",
      stat: "atk",
      refinementValues: [20, 25, 30, 35, 40],
      isTeamBuff: true,
      isPercent: true,
      compute: (r, ctx) => {
        const pct = [20, 25, 30, 35, 40][r - 1];
        return (pct / 100) * ctx.baseAtk;
      },
    },
  ],
  signatureFor: ["kazuha"],
};
```

#### 2. Signature / Self-Buff Weapon Example (*Crimson Moon's Semblance*)
`src/data/registry/weapons/polearms/crimson-moons-semblance.ts`:
```ts
import type { WeaponConfig } from "../types";

export const crimsonMoonsSemblance: WeaponConfig = {
  id: "crimson-moons-semblance",
  name: "Crimson Moon's Semblance",
  type: "Polearm",
  rarity: 5,
  baseAtk: 674,
  lvl1BaseAtk: 48,
  subStat: {
    type: "critRate",
    label: "CRIT Rate%",
    value: 22.1,
    baseValue: 4.8,
  },
  passiveName: "Ashen Sun's Shadow",
  passiveDesc:
    "Grants a Bond of Life equal to 25% of Max HP when a Charged Attack hits an opponent. This effect can be triggered up to once every 14s. In addition, when the equipping character has a Bond of Life, they gain a 12~28% DMG Bonus; if the value of the Bond of Life is greater than or equal to 30% of Max HP, then gain an additional 24~56% DMG.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "has-bol",
      label: "Has Bond of Life",
      control: "toggle",
      defaultValue: 1,
      hint: "Grants +12~28% DMG Bonus while Bond of Life is active",
    },
    {
      id: "bol-ge-30",
      label: "Bond of Life >= 30% Max HP",
      control: "toggle",
      defaultValue: 1,
      hint: "Grants additional +24~56% DMG Bonus (Total +36~84% All DMG Bonus)",
    },
  ],
  buffs: [
    {
      id: "semblance-bol-dmg",
      label: "Bond of Life DMG Bonus (Crimson Moon's Semblance)",
      stat: "dmgBonus",
      refinementValues: [12, 16, 20, 24, 28],
      isTeamBuff: false,
      conditionKey: "has-bol",
      compute: (r, ctx) => {
        const on = (ctx.inputs?.["has-bol"] ?? "1") === "1" || Number(ctx.inputs?.["has-bol"] ?? 1) > 0;
        if (!on) return 0;
        return [12, 16, 20, 24, 28][r - 1];
      },
    },
    {
      id: "semblance-bol-30-dmg",
      label: "High BoL DMG Bonus (Crimson Moon's Semblance)",
      stat: "dmgBonus",
      refinementValues: [24, 32, 40, 48, 56],
      isTeamBuff: false,
      conditionKey: "bol-ge-30",
      compute: (r, ctx) => {
        const on = (ctx.inputs?.["bol-ge-30"] ?? "1") === "1" || Number(ctx.inputs?.["bol-ge-30"] ?? 1) > 0;
        if (!on) return 0;
        return [24, 32, 40, 48, 56][r - 1];
      },
    },
  ],
  signatureFor: ["arlecchino"],
};
```

---

## 4. Pure Calculation Engine Pattern (`weapon-buffs.ts`)

The resolver function must be pure, deterministic, and handle all refinement values and mechanic inputs:

```ts
export function resolveExternalWeaponBuffs(
  instances: ExternalWeaponInstance[] | undefined,
  baseAtk: number,
  charConfig?: CharacterConfig,
  masterEnabled: boolean = true
): ExternalWeaponBuffResult {
  const statDeltas: Record<string, number> = {};
  const sources: WeaponBuffSource[] = [];

  if (!masterEnabled || !instances?.length) {
    return { statDeltas, sources };
  }

  for (const inst of instances) {
    if (!inst.enabled) continue;

    const config = weaponById(inst.weaponId);
    if (!config) continue;

    const r = Math.max(1, Math.min(5, inst.refinement || 1));
    const ctx: WeaponBuffContext = {
      refinement: r,
      baseAtk,
      charElement: charConfig?.element,
      charWeapon: charConfig?.weapon,
      inputs: inst.inputs ?? {},
    };

    for (const buff of config.buffs) {
      // For external team buffs, only apply buffs applicable to team OR matching character's weapon
      const isEquippedWeapon = charConfig && config.type === charConfig.weapon;
      if (!buff.isTeamBuff && !isEquippedWeapon) continue;

      let value = 0;
      if (buff.compute) {
        value = buff.compute(r, ctx);
      } else {
        const rawVal = buff.refinementValues[r - 1] ?? 0;
        value = buff.isPercent ? (rawVal / 100) * baseAtk : rawVal;
      }

      if (value !== 0) {
        statDeltas[buff.stat] = (statDeltas[buff.stat] ?? 0) + value;
        sources.push({
          weaponId: config.id,
          weaponName: config.name,
          buffId: buff.id,
          label: `${buff.label} (R${r})`,
          stat: buff.stat,
          value,
          refinement: r,
          isTeamBuff: buff.isTeamBuff,
        });
      }
    }
  }

  return { statDeltas, sources };
}
```

---

## 5. Adding a New Weapon: Step-by-Step Workflow

When adding a new weapon to the system:

1. **Create the Weapon File**:
   - Location: `src/data/registry/weapons/<category>/<weapon-slug>.ts` (e.g. `src/data/registry/weapons/swords/mistsplitter-reforged.ts`).
   - Fill in Base ATK, Substat, R1–R5 refinement values, `mechanicDefs`, and `compute` callbacks.
2. **Register in Category Index**:
   - In `src/data/registry/weapons/<category>/index.ts`:
     - Import the weapon and export it.
     - Add to the category array (`SWORDS`, `POLEARMS`, etc.).
3. **Write Unit Tests**:
   - In `src/lib/engine/weapon-buffs.test.ts`:
     - Test R1 and R5 scaling.
     - Test conditional inputs / mechanic toggles.
     - Test character filtering (included for matching weapon type / support, excluded for non-support mismatched class).
4. **Run Test Suite & Build Verification**:
   - Run `npm test` to verify all Vitest tests pass.
   - Run `npm run build` to confirm zero TypeScript compilation errors.
5. **Sync Database**:
   - Run `npx prisma validate`.
   - Update `gi_stat_db.sql` with sample seed insert if applicable.
