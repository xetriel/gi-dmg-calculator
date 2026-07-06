import { getExportLogs } from "./actions";
import { HistoryView } from "@/components/HistoryView";

// Reads the live ExportLog table, so render per-request.
export const dynamic = "force-dynamic";

export default async function HistoryPage() {
  const logs = await getExportLogs();
  return <HistoryView logs={logs} />;
}
