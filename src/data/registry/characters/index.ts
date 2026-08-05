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
import { ineffa } from "./ineffa";
import { skirk } from "./skirk";
import { varesa } from "./varesa";
import { gaming } from "./gaming";
import { durin } from "./durin";
import { alhaitham } from "./alhaitham";
import { ayaka } from "./ayaka";
import { ayato } from "./ayato";
import { dehya } from "./dehya";
import { diluc } from "./diluc";
import { cyno } from "./cyno";
import { aloy } from "./aloy";
import { eula } from "./eula";
import { ganyu } from "./ganyu";
import { heizou } from "./heizou";
import { itto } from "./itto";
import { mavuika } from "./mavuika";

// Each character's full definition lives in its own file (mirrors src/data/talents/),
// so growing the roster only ever means adding a file + one line here.
export { arlecchino, huTao, neuvillette, clorinde, sandrone, zibai, nefer, flins, columbina, varka, linnea, ineffa, skirk, varesa, gaming, durin, alhaitham, ayaka, ayato, dehya, diluc, cyno, aloy, eula, ganyu, heizou, itto, mavuika };
export const CHARACTERS: CharacterConfig[] = [arlecchino, huTao, neuvillette, clorinde, sandrone, zibai, nefer, flins, columbina, varka, linnea, ineffa, skirk, varesa, gaming, durin, alhaitham, ayaka, ayato, dehya, diluc, cyno, aloy, eula, ganyu, heizou, itto, mavuika];
export const byId = (id: string) => CHARACTERS.find(c => c.id === id);
