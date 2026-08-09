import { ineffaSupport } from "./ineffa";
import type { SupportConfig } from "./types";

export type { SupportConfig, SupportCtx, SupportBuff, SupportStatField } from "./types";

export const SUPPORT_CONFIGS: SupportConfig[] = [ineffaSupport];
export const supportById = (id: string) => SUPPORT_CONFIGS.find(s => s.id === id);
