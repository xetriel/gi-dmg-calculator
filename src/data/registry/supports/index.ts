import { ineffaSupport } from "./ineffa";
import { bennettSupport } from "./bennett";
import type { SupportConfig } from "./types";

export type { SupportConfig, SupportCtx, SupportBuff, SupportStatField, BriefStatPill } from "./types";

export const SUPPORT_CONFIGS: SupportConfig[] = [ineffaSupport, bennettSupport];
export const supportById = (id: string) => SUPPORT_CONFIGS.find(s => s.id === id);
