import type { CharacterConfig } from "../types";
import { arlecchino } from "./arlecchino";
import { huTao } from "./hu-tao";
import { neuvillette } from "./neuvillette";
import { clorinde } from "./clorinde";
import { sandrone } from "./sandrone";

// Each character's full definition lives in its own file (mirrors src/data/talents/),
// so growing the roster only ever means adding a file + one line here.
export { arlecchino, huTao, neuvillette, clorinde, sandrone };
export const CHARACTERS: CharacterConfig[] = [arlecchino, huTao, neuvillette, clorinde, sandrone];
export const byId = (id: string) => CHARACTERS.find(c => c.id === id);
