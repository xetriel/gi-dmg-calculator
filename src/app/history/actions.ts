"use server";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";

export type ExportFormat = "json" | "csv" | "txt" | "pdf" | "png";

export interface ExportSummary {
  setupCount: number;
  topHeadline: number;
  setups: { label: string; headline: number }[];
}

export interface ExportLogRow {
  id: string;
  characterId: string;
  format: string;
  label: string;
  snapshot: unknown;
  summary: ExportSummary;
  createdAt: Date;
}

// Best-effort: records one export/download event. Never throws — a logging
// failure (e.g. DB offline) must not break the user's download.
export async function logExport(
  characterId: string,
  format: ExportFormat,
  label: string,
  snapshot: unknown,
  summary: ExportSummary,
): Promise<void> {
  try {
    await prisma.exportLog.create({
      data: {
        characterId,
        format,
        label,
        snapshot: snapshot as Prisma.InputJsonValue,
        summary: summary as unknown as Prisma.InputJsonValue,
      },
    });
  } catch (err) {
    console.error("Failed to log export:", err);
  }
}

export async function getExportLogs(characterId?: string): Promise<ExportLogRow[]> {
  try {
    const rows = await prisma.exportLog.findMany({
      where: characterId ? { characterId } : undefined,
      orderBy: { createdAt: "desc" },
    });
    return rows as unknown as ExportLogRow[];
  } catch (err) {
    console.error("Failed to get export logs:", err);
    return [];
  }
}

export async function deleteExportLog(id: string): Promise<void> {
  try {
    await prisma.exportLog.delete({ where: { id } });
  } catch (err) {
    console.error("Failed to delete export log:", err);
    throw err;
  }
}
