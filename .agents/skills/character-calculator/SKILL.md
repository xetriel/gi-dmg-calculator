---
name: character-calculator
description: Guidelines and architectural standard for implementing Genshin Impact character calculators, talent scaling seeds, mechanics resolvers, reaction variants (Lunar-Charged, Lunar-Bloom, Lunar-Crystallize, Stellar-Conduct, Stellar-Swirl), Bond of Life multipliers, and constellation logic.
---

# Character Calculator Skill & Implementation Standard

This skill documents the exact patterns, file architecture, formula interpretations, reaction variants, and verification steps for adding or modifying character calculators in `gi-dmg-calculator`.

---

## 1. File Architecture & Required Modules

Every character calculator consists of **5 primary files**:

| File Path | Purpose |
| --- | --- |
| `src/data/registry/characters/<id>.ts` | Character definition (`CharacterConfig`), base stats at Lv90, scaling source (`atk`/`hp`/`def`), ascension stat, talent hit definitions, `mechanicDefs` UI controls, and `constellations`. |
| `src/data/talents/<id>.ts` | Talent seed multipliers (`CharacterTalentSeed`) containing level 1–14 arrays for every hit definition. |
| `src/lib/engine/characters/<id>.ts` | Pure mechanics resolver (`resolve<CharId>`), computing `statDeltas`, `perHit` mods, and notes. |
| `src/lib/engine/characters/<id>.test.ts` | Vitest unit test suite covering mechanics, stat deltas, flat DMG bonuses, per-hit mods, and talent seed row counts. |
| `prisma/seed.ts` | Execution command (`npx tsx prisma/seed.ts`) to flatten and sync seed rows into the `TalentScaling` database table. |

### Central Registry Exports
Whenever a new character file is created, it **must** be exported and registered in:
1. `src/data/registry/characters/index.ts` -> Export character & add to `CHARACTERS` array.
2. `src/data/talents/index.ts` -> Export talent seed & add to `TALENT_SEED` array.
3. `src/lib/engine/mechanics.ts` -> Import resolver & register in `CHARACTER_RESOLVERS` map.

---

## 2. Core Formula Interpretations

### A. Flat DMG Bonus (`flatDmgBonus`)
Additive base damage applied directly inside the damage formula:
$$\text{Base DMG} = (\text{Talent\%} \times \text{Stat} \times \text{BaseMultiplier}) + \text{flatDmgBonus}$$

- **HP/DEF Scaling Flat DMG**:
  - *Mualani A1*: `flatDmgBonus = 0.15 * stacks * maxHp` (+15%/+30%/+45% Max HP on Sharky's Bites).
  - *Mualani A4*: `flatDmgBonus = 0.15 * stacks * maxHp` (+15%/+30% Max HP on Burst DMG).
  - *Mualani C1/C6*: `flatDmgBonus = 0.66 * maxHp` (+66% Max HP on Surging Bite).
- **Bond of Life (BoL) Flat DMG**:
  - *Arlecchino Masque of the Red Death*:
    $$\text{flatDmgBonus} = \frac{\text{Masque\%}}{100} \times \frac{\text{BoL\%}}{100} \times \text{ATK}$$
    *(C1 adds +100 percentage points to Masque%)*.
  - *Clorinde A1 Dark-Shattering Flame*:
    $$\text{flatDmgBonus} = \min(\text{stacks} \times \text{perStack\%} \times \text{ATK}, \text{cap})$$

### B. Base DMG Multiplier (`baseDmgMultiplier`)
Multiplies the base talent scaling:
- *Klee Hexerei Boom Badges*: `baseDmgMultiplier = 1.15` (1 stack), `1.30` (2 stacks), `1.50` (3 stacks).
- **Constellation / State Hit Disabling**:
  Setting `baseDmgMultiplier: 0` disables a hit instance (e.g. C1 / C4 exclusive hits when below required constellation level), causing the damage table to render `"-"`:
  ```ts
  if (cons < 4) {
    addMods(res.perHit, "c4-sparkly-explosion", { baseDmgMultiplier: 0 });
  }
  ```

### C. DMG Bonus % (`bonusDmgPct`)
Adds directly to the character's elemental / category DMG Bonus pool:
- *Klee A1*: `bonusDmgPct: 50` (+50% Charged Attack DMG Bonus).
- *Mualani C4*: `bonusDmgPct: 75` (+75% Burst DMG Bonus).

### D. Stat Deltas (`statDeltas`)
Global stat modifications computed prior to hit calculation:
- `res.statDeltas.pyroDmgBonus`: Global Pyro DMG Bonus %.
- `res.statDeltas.atk`: Flat ATK bonus (e.g. Klee C1 +60% Base ATK = `0.60 * baseAtk`).
- `res.statDeltas.defReduction`: Enemy DEF reduction % (e.g. Klee C2 -23% DEF).
- `res.statDeltas.critRate` / `critDmg`: Global CRIT Rate / CRIT DMG.

---

## 3. Reaction Variants

### A. Lunar Reactions
Consists of **Lunar-Charged**, **Lunar-Bloom**, and **Lunar-Crystallize**.
- **Direct Lunar Damage**:
  Applied via `PerHitMods.directReaction`:
  ```ts
  addMods(res.perHit, hitKey, {
    directReaction: {
      coefficient: 1.6,
      baseDmgBonusPct: 14,
      reactionBonusPct: 30,
      lunarType: "lunar-crystallize",
    }
  });
  ```
  - Ignores enemy DEF and standard DMG Bonus%.
  - Uses Special EM Bonus: $6 \times \text{EM} / (\text{EM} + 2000)$.
- **Indirect Lunar Damage**:
  Evaluated in `indirectLunarDamage` panel using `lunarBaseBonusPct` and character element/EM.

### B. Stellar Glimmer Reactions
Consists of **Stellar-Conduct** and **Stellar-Swirl**.
- **Direct Stellar Conduct**:
  Configured directly on talent hit definition with `direct: "stellar"` or via `PerHitMods.directReaction`.
  - Ignores enemy DEF and standard DMG Bonus%.
  - Uses Stellar Reaction Coefficient and Special EM Bonus.

---

## 4. Special Mechanics Patterns

### Bond of Life (BoL) Pattern
- Input: `bond-of-life` (0–200% of Max HP).
- Arlecchino: Converts BoL% to flat DMG on Normal Attacks via `hitKeysOfCategory(config, "normal", "normal")`.
- Clorinde: Checks BoL% thresholds (≥100% BoL) to grant A4 CRIT Rate stacks and C4 Burst DMG bonus.

### Natlan Nightsoul's Blessing
- Input: `nightsoul-state` toggle.
- Tracks Nightsoul Burst triggers from party members for A4 passives (e.g., Mualani A4 Till the Final Wave +15%/+30% Max HP flat Burst DMG).

---

## 5. Verification & Checklist

Before completing any character calculator task:
1. **Seed Row Count**: Verify total talent seed rows equals:
   $$\text{Total Rows} = \text{Total Hit Definitions} \times 14 \text{ Levels}$$
2. **Database Sync**: Execute `npx tsx prisma/seed.ts` and confirm output line `characterId: synced X rows`.
3. **Unit Tests**: Run `npm run test` and ensure all test files pass.
4. **Production Build**: Run `npm run build` and ensure Next.js compiles with zero TypeScript or page generation errors.
