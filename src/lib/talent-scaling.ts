// Per-character talent multiplier data, loaded from the TalentScaling table and
// passed from the server page into the client calculator. Keyed by talent type
// ("normal" | "skill" | "burst"). Only damage hits are included.
export interface TalentScalingData {
  [talentType: string]: {
    levels: number[];                              // sorted available levels
    byLevel: Record<number, Record<string, number>>; // level -> hitKey -> multiplier %
  };
}
