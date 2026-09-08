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

> [!IMPORTANT]
> **Multiplier vs. Base DMG Multiplier Terminology**:
> - In standard talent hits: `baseDmgMultiplier` directly scales the ability multiplier: $(\text{Talent\%} \times \text{Stat} \times \text{baseDmgMultiplier})$.
> - In Lunar and Stellar reactions:
>   - **Multiplier** $\equiv$ **Base Reaction Coefficient (BRC)** (e.g., 1.0 to 2.0 for Stellar-Conduct; 0.75, 2.0, or 3.0 for Stellar Swirl; 1.6 for Lunar-Crystallize; 3.0 for Lunar-Charged).
>   - **Base DMG Multiplier** $\equiv$ **\%Reaction Base DMG Bonus** (e.g., Moonsign Lunar Base DMG, Stellar Base DMG from talents, weapons, or support passives).

### C. DMG Bonus % (`bonusDmgPct`)
Adds directly to the character's elemental / category DMG Bonus pool:
- *Klee A1*: `bonusDmgPct: 50` (+50% Charged Attack DMG Bonus).
- *Mualani C4*: `bonusDmgPct: 75` (+75% Burst DMG Bonus).

### D. Stat Deltas (`statDeltas`)
Global stat modifications computed prior to hit calculation:
- `res.statDeltas.pyroDmgBonus`: Global Pyro DMG Bonus %.
- `res.statDeltas.cryoDmgBonus` / `electroDmgBonus`: Global Cryo / Electro DMG Bonus % (e.g. Polestar Field +20% to +40%).
- `res.statDeltas.atk`: Flat ATK bonus (e.g. Klee C1 +60% Base ATK = `0.60 * baseAtk`).
- `res.statDeltas.defReduction`: Enemy DEF reduction % (e.g. Klee C2 -23% DEF).
- `res.statDeltas.enemyPhysicalRes`: Enemy Physical RES reduction % (e.g. Polestar Field -40%).
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

## 5. Reaction Variants: Lunar & Stellar Glimmer

Reference Standard: [Genshin Impact Damage Wiki](https://genshin-impact.fandom.com/wiki/Damage)

### A. Terminology & Multiplier Distinction
Do not confuse **Multiplier** with **Base DMG Multiplier**:
- **Multiplier** = **Base Reaction Coefficient (BRC)**. Sourced from the reaction type or dynamic combat mechanics (e.g. Stellar-Conduct's Polestar Field recorded hits, Stellar Swirl vortex levels, or gear multiplier bonuses).
- **Base DMG Multiplier** = **%Reaction Base DMG Bonus**. Sourced from Moonsign Lunar Base DMG, Stellar Base DMG, or talent passives.

---

### B. Indirect Lunar & Stellar Reaction DMG (Elemental Application)
Indirect Lunar and Stellar Glimmer Reaction DMG caused by applying elements can **only** be dealt by:
- **Lunar-Charged** (deals Electro DMG)
- **Lunar-Crystallize** (deals Geo DMG)
- **Stellar Swirl** (deals Anemo DMG initially, then AoE Cryo DMG on Vortex explosion)

> [!CAUTION]
> **Explicit Reaction Exclusions**:
> - **Lunar-Bloom**: Dendro Cores and Bountiful Cores created via Lunar-Bloom are identical to those created via Bloom; the DMG dealt by them is **not** considered Lunar-Bloom DMG and does not deal indirect reaction DMG.
> - **Stellar-Conduct**: Does **not** deal indirect reaction DMG upon elemental application; it sustains the Polestar Field and provides direct/supportive buffs.

#### 2-Step Calculation Engine
1. **Individual Contributor Calculation**:
   Calculated for every character in the party who applied elements contributing to the reaction:
   $$\text{DMG}_{\text{Individual}} = \text{Base Reaction Coefficient} \times \text{Level Multiplier}_{\text{Contributor}} \times (1 + \% \text{Reaction Base DMG Bonus}) \times (1 + \%\text{EM Bonus}_{\text{LS}} + \%\text{Reaction Bonus}) \times \text{Elevation Multiplier} \times \text{RES Multiplier}_{\text{Target}} \times \text{CRIT Multiplier}_{\text{Contributor}}$$
   - Special EM Bonus ($\%\text{EM Bonus}_{\text{LS}}$): $\frac{6 \times \text{EM}}{\text{EM} + 2000}$.
   - **Indirect Base Reaction Coefficients (BRC)**:
     - **0.75**: Stellar Swirl (Initial Anemo)
     - **1.6**: Lunar-Crystallize (Geo)
     - **2.0**: Stellar Swirl (Lv. 1 Vortex Cryo)
     - **3.0**: Stellar Swirl (Lv. 2 Vortex Cryo)
     - **3.0**: Lunar-Charged (Electro)

2. **Ranked 4-Slot Combination**:
   Individual DMG values are ranked from highest to lowest ($D_1 \ge D_2 \ge D_3 \ge D_4$):
   $$\text{DMG}_{\text{Indirect}} = 0.60 \times D_1 + 0.30 \times D_2 + 0.05 \times D_3 + 0.05 \times D_4$$
   - Unfilled slots contribute $D_k = 0$ (1 contributor = 60%, 2 = 90%, 3 = 95%, 4 = 100% capacity).
   - **Benchmark CRIT Ratio**: Dictated by the highest individual contributor ($D_1$).

---

### C. Direct Lunar & Stellar Reaction DMG (Talent Ability Hits)
Direct Lunar and Stellar DMG is dealt by a character's own talent abilities configured with `direct: "lunar" | "stellar"` or modified via `PerHitMods.directReaction`:

$$\text{DMG}_{\text{Direct}} = \left( \text{Base Reaction Coefficient} \times \%\text{Ability} \times \text{Stat}_{\text{Attacker}} \times \text{Base DMG Multiplier} \times (1 + \% \text{Reaction Base DMG Bonus}) \times (1 + \%\text{EM Bonus}_{\text{LS}} + \%\text{Reaction Bonus}) + \text{Reaction Additive Base DMG Bonus} \right) \times \text{Elevation Multiplier} \times \text{RES Multiplier}_{\text{Target}} \times \text{CRIT Multiplier}$$

- **Direct Damage Characteristics**:
  - Ignores enemy DEF and standard DMG Bonus%.
  - Uses Special EM Bonus: $\frac{6 \times \text{EM}}{\text{EM} + 2000}$.
- **Direct Base Reaction Coefficients (BRC)**:
  - **1.0**: Lunar-Bloom
  - **1.0**: Stellar Swirl (Base)
  - **1.0 to 2.0**: Stellar-Conduct (scales dynamically with Polestar Field recorded hits)
  - **1.6**: Lunar-Crystallize
  - **3.0**: Lunar-Charged

---

### D. Stellar-Conduct & Polestar Field Mechanics
- **Trigger**: Cryo + Electro.
- **Starlight Prism & Field**:
  - Spawns a **Starlight Prism** lasting **7s**, continuously sustaining a **Polestar Field**.
  - Inside the field, hits from Cryo and Electro attacks on enemies that apply an element (as limited by Internal Cooldown / ICD) are recorded by the Prism.
  - The initial hit that created the Prism is **not** included.
  - Every **4s**, the count is reset, and buffs lasting **4s** are granted based on the number of recorded hits (0 to 12):
    - **Base Reaction Coefficient (BRC)**: Starts at 1.0 (0 hits). If $\ge 1$ hit is recorded, increases by 40% plus an additional 5% per recorded hit:
      $$\text{BRC} = 1.40 + 0.05 \times \text{hits} \quad (\text{for } 1 \le \text{hits} \le 12)$$
    - **Cryo and Electro DMG Bonus**: 20% (0 hits). If $\ge 1$ hit is recorded, increases to $28\% + 1\% \times \text{hits}$ (up to 40% at 12 hits).
    - **Enemy Physical RES Reduction**: Reduced by **40%** (constant for all 0–12 hits).
    - **Snezhnayan Environmental & Energy Buffs**: Characters inside the field do not lose heat or Kresnik Energy in the Snezhnayan open world; if Kresnik Energy is $< 30\%$, it is immediately restored to 30%.
    - Buffs Prime Ice Constructs and firearms.

#### Polestar Field Scaling Table (0–12 Hits)

| Recorded Hits | Base Reaction Coefficient (BRC) | Cryo & Electro DMG Bonus | Enemy Physical RES Decrease |
| :---: | :---: | :---: | :---: |
| **0** | **1.00** | **20%** | **40%** |
| **1** | **1.45** | **29%** | **40%** |
| **2** | **1.50** | **30%** | **40%** |
| **3** | **1.55** | **31%** | **40%** |
| **4** | **1.60** | **32%** | **40%** |
| **5** | **1.65** | **33%** | **40%** |
| **6** | **1.70** | **34%** | **40%** |
| **7** | **1.75** | **35%** | **40%** |
| **8** | **1.80** | **36%** | **40%** |
| **9** | **1.85** | **37%** | **40%** |
| **10** | **1.90** | **38%** | **40%** |
| **11** | **1.95** | **39%** | **40%** |
| **12** | **2.00** | **40%** | **40%** |

#### Implementation Pattern in Mechanics Resolver
```ts
import { stellarConductFieldBuffs } from "@/lib/engine/stellar";

// In character resolver (e.g., character with Polestar Field mechanic toggle/slider):
const hits = Number(ctx.inputs["polestar-recorded-hits"] ?? 0);
const fieldBuffs = stellarConductFieldBuffs(hits);

res.statDeltas.cryoDmgBonus = (res.statDeltas.cryoDmgBonus ?? 0) + fieldBuffs.cryoDmgBonus;
res.statDeltas.electroDmgBonus = (res.statDeltas.electroDmgBonus ?? 0) + fieldBuffs.electroDmgBonus;
res.statDeltas.enemyPhysicalRes = (res.statDeltas.enemyPhysicalRes ?? 0) - fieldBuffs.enemyPhysicalResShred;

// Direct Stellar-Conduct hit scaling:
addMods(res.perHit, hitKey, {
  directReaction: {
    coefficient: fieldBuffs.brc,
    stellarType: "stellar-conduct",
  },
});
```

---

### E. Stellar Swirl & Stellar Vortex Progression
- **Trigger**: Anemo + Cryo.
- **Initial Anemo Hit**: Deals an instance of Anemo DMG to the target opponent, creating a **Lv. 1 Stellar Vortex** lasting **3s**.
- **Vortex Delay Explosion**: Explodes after a delay, dealing AoE Cryo DMG.
- **Vortex Progression**:
  - Triggering Stellar Swirl **3 times** upgrades the Vortex to **Lv. 2** (deals greater DMG across a wider AoE upon bursting).
  - Triggering Stellar Swirl **3 more times** (6 triggers total) causes the Vortex to **explode immediately**.
- **High Jump Enhancement**: For **5s** after a Stellar Vortex explodes, the player's next jump has its height increased (providing high synergy for plunge attack rotations).
- **Multiplier Increments**: While Stellar Swirl does not have an in-field hit increment like Stellar-Conduct's Polestar Field, characters, weapons, or artifacts can boost `stellarSwirlMultiplier` / `stellarReactionMultiplier`, which directly increments the Base Reaction Coefficient:
  $$\text{Effective BRC} = \text{Base Coeff} + \frac{\text{stellarSwirlMultiplier}}{100}$$

---

## 6. Verification & Checklist

Before completing any character calculator task:
1. **Seed Row Count**: Verify total talent seed rows equals:
   $$\text{Total Rows} = \text{Total Hit Definitions} \times 14 \text{ Levels}$$
2. **Database Sync**: Execute `npx tsx prisma/seed.ts` and confirm output line `characterId: synced X rows`.
3. **Split View Layout**: Verify that the horizontal splitter is positioned immediately above Normal Attack, resizes smoothly between 15% and 85%, and scrolls independently.
4. **Stellar & Lunar Direct Hits**: Verify talent hit definitions specify `direct: "stellar" | "lunar"` and apply correct Base Reaction Coefficients (BRC) and Special EM formulas.
5. **Polestar Field Input Bounds**: Verify any Polestar recorded hit slider/select is clamped between 0 and 12, applying exact BRC (1.0–2.0), Cryo/Electro DMG (20%–40%), and Enemy Phys RES shred (-40%).
6. **Unit Tests**: Run `npm test` and ensure all test files pass.
7. **Production Build**: Run `npm run build` and ensure Next.js compiles with zero TypeScript or page generation errors.

