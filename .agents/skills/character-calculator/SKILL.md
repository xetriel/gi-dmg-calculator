---
name: character-calculator
description: Guidelines and architectural standard for implementing Genshin Impact character calculators, talent scaling seeds, mechanics resolvers, reaction variants (Lunar-Charged, Lunar-Bloom, Lunar-Crystallize, Stellar-Conduct, Stellar-Swirl), Bond of Life multipliers, and constellation logic.
---

# Character Calculator Skill & Implementation Standard

This skill documents the exact patterns, file architecture, formula interpretations, vertical split-screen layout, reaction variants, constellation scaling, and verification steps for adding or modifying character calculators in `gi-dmg-calculator`.

---

## 1. File Architecture & Required Modules

Every character calculator consists of **5 primary files**:

| File Path | Purpose |
| --- | --- |
| `src/data/registry/characters/<id>.ts` | Character definition (`CharacterConfig`), base stats at Lv90, scaling source (`atk`/`hp`/`def`), ascension stat, talent hit definitions, `mechanicDefs` UI controls, `constellations`, and optional embedded `support` definition. |
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

## 2. Vertical (Top/Bottom) Split View Layout Standard

The character calculator supports both a standard continuous column view and a **Vertical (Top/Bottom) Split Screen Mode** (`isSplitView`):

### A. Layout Architecture & Proportions
1. **Setup Card Sizing**:
   - Card width is fixed at `w-[480px]` for both split and column views.
   - When `isSplitView` is enabled, the card applies `h-[75vh] min-h-[700px]` with `flex flex-col` and `overflow-hidden`.
2. **Top Container (Inputs & Configurations)**:
   - Contains:
     - `MechanicsPanel`: Constellations (C0–C6) and character-specific mechanic toggles/sliders.
     - `TeamBuffPanel`: Party support character selector, brief pills, and live computed buffs.
     - `ExternalWeaponBuffPanel`: External weapon buffs with refinement and condition toggles.
     - `ExternalArtifactBuffPanel`: External artifact sets with 2pc/4pc, wielder vs support slot routing.
     - `StatsGrid`: Core character baseline and artifact input fields.
     - `renderConfiguration()`: Reaction selector, Compare This button, Effective Stats & Buff Breakdown panel, Notes box, and general validation warnings.
   - Proportioned with `style={{ height: `${splitRatio}%` }}` and independent vertical scrolling (`overflow-y-auto`).
3. **Draggable Horizontal Splitter Bar**:
   - Located **strictly right before the Normal Attack panel (`DamageTable`)**, separating all inputs and configuration from output damage calculations.
   - Styled with `cursor-row-resize`, `h-1.5 hover:h-2`, rounded pill handle, and smooth transition.
   - Mouse drag tracking measures vertical movement (`clientY` relative to `split-container-${cardId}`) with percentage clamped safely between **15% and 85%**.
4. **Bottom Container (Damage Outputs)**:
   - Contains:
     - `renderDamageOutputs()`: Starts directly with `DamageTable` (Normal Attack, Elemental Skill, Elemental Burst), followed by Transformative Reactions and Combo Rotations DMG.
   - Proportioned with `style={{ height: `${100 - splitRatio}%` }}` and independent vertical scrolling (`overflow-y-auto`).
5. **Column View (`!isSplitView`)**:
   - In column view, elements flow sequentially down a single scrolling card: `Inputs` $\rightarrow$ `renderConfiguration()` $\rightarrow$ `renderDamageOutputs()`.

---

## 3. Core Formula Interpretations

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

## 4. Constellation & Mathematical Validation Rules

1. **Automatic +3 Talent Level Boost for Constellations**:
   - Whenever a character constellation increases talent level (e.g., Bennett C3 boosts Skill by 3, C5 boosts Burst by 3; Arlecchino C3 boosts Normal Attack by 3, C5 boosts Burst by 3):
     - The calculation engine automatically adds +3 to the effective talent level when retrieving talent seed scaling.
     - The base input remains in the range 1–10; the effective calculated talent level reaches 4–13.
2. **CRIT Rate Clamping & Mathematical Probability**:
   - Initial CRIT Rate is derived directly from character input fields (`inst.stats.critRate`), not hardcoded to 5%.
   - In all mathematical average damage and probability formulas:
     $$\text{Effective CRIT Rate} = \max(0, \min(\text{Total CRIT Rate}, 1.0))$$
   - A CRIT Rate $> 100\%$ is clamped to $100\%$ ($1.0$), adhering to the laws of mathematical probability.

---

## 5. Reaction Variants

### A. Lunar Reactions (Lunar-Charged, Lunar-Bloom, Lunar-Crystallize)
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

### B. Stellar Glimmer Reactions (Stellar-Conduct, Stellar-Swirl)
- **Direct Stellar Conduct**:
  Configured directly on talent hit definition with `direct: "stellar"` or via `PerHitMods.directReaction`.
  - Ignores enemy DEF and standard DMG Bonus%.
  - Uses Stellar Reaction Coefficient and Special EM Bonus.

---

## 6. Verification & Checklist

Before completing any character calculator task:
1. **Seed Row Count**: Verify total talent seed rows equals:
   $$\text{Total Rows} = \text{Total Hit Definitions} \times 14 \text{ Levels}$$
2. **Database Sync**: Execute `npx tsx prisma/seed.ts` and confirm output line `characterId: synced X rows`.
3. **Split View Layout**: Verify that the horizontal splitter is positioned immediately above Normal Attack, resizes smoothly between 15% and 85%, and scrolls independently.
4. **Unit Tests**: Run `npm test` and ensure all test files pass.
5. **Production Build**: Run `npm run build` and ensure Next.js compiles with zero TypeScript or page generation errors.
