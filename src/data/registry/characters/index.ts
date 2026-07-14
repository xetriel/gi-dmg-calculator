import type { CharacterConfig } from "../types";
import { arlecchino } from "./arlecchino";
import { huTao } from "./hu-tao";
import { neuvillette } from "./neuvillette";
import { clorinde } from "./clorinde";
import { sandrone } from "./sandrone";
import { zibai } from "./zibai";
import { nefer } from "./nefer";
import { flins } from "./flins";
import { columbina } from "./columbina";
import { varka } from "./varka";
import { linnea } from "./linnea";

// Each character's full definition lives in its own file (mirrors src/data/talents/),
// so growing the roster only ever means adding a file + one line here.
export { arlecchino, huTao, neuvillette, clorinde, sandrone, zibai, nefer, flins, columbina, varka, linnea };
export const CHARACTERS: CharacterConfig[] = [arlecchino, huTao, neuvillette, clorinde, sandrone, zibai, nefer, flins, columbina, varka, linnea];
export const byId = (id: string) => CHARACTERS.find(c => c.id === id);
