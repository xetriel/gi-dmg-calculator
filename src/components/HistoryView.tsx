"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { byId } from "@/data/registry/characters";
import { encodeBuild } from "@/lib/engine/share";
import { deleteExportLog, type ExportLogRow, type ExportSummary } from "@/app/history/actions";

const fmtNum = (n: number) => Math.round(n).toLocaleString("en-US");
const fmtTime = (d: Date) => new Date(d).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });

const FORMAT_STYLE: Record<string, string> = {
  json: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  csv: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  txt: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20",
  pdf: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
  png: "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20",
};

// Δ% vs a baseline, colored like the calculator's comparison cells.
function Delta({ value, base }: { value: number; base: number }) {
  if (!base) return null;
  const pct = (value / base - 1) * 100;
  const cls =
    Math.abs(pct) < 0.05 ? "text-gray-400 dark:text-zinc-500"
      : pct > 0 ? "text-green-500 dark:text-green-400" : "text-red-500 dark:text-red-400";
  return <span className={`ml-1.5 text-[10px] font-semibold ${cls}`}>{pct >= 0 ? "+" : ""}{pct.toFixed(1)}%</span>;
}

// Tiny dependency-free sparkline of headline over time (values passed oldest→newest).
function Sparkline({ values }: { values: number[] }) {
  if (values.length < 2) return null;
  const w = 160, h = 32, pad = 3;
  const max = Math.max(...values), min = Math.min(...values);
  const span = max - min || 1;
  const pts = values.map((v, i) => {
    const x = pad + (i / (values.length - 1)) * (w - 2 * pad);
    const y = h - pad - ((v - min) / span) * (h - 2 * pad);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");
  return (
    <svg width={w} height={h} className="overflow-visible">
      <polyline points={pts} fill="none" stroke="currentColor" strokeWidth={1.5}
        className="text-zinc-500 dark:text-zinc-400" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function HistoryView({ logs }: { logs: ExportLogRow[] }) {
  const router = useRouter();
  const [characterFilter, setCharacterFilter] = useState<string>("all");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [busyId, setBusyId] = useState<string | null>(null);

  const characterIds = useMemo(
    () => Array.from(new Set(logs.map(l => l.characterId))),
    [logs],
  );
  const visible = useMemo(
    () => (characterFilter === "all" ? logs : logs.filter(l => l.characterId === characterFilter)),
    [logs, characterFilter],
  );

  const toggle = (id: string) =>
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });

  // Selected logs, oldest → newest (for evolution/compare).
  const compareLogs = useMemo(
    () => logs.filter(l => selected.has(l.id)).sort((a, b) => +new Date(a.createdAt) - +new Date(b.createdAt)),
    [logs, selected],
  );

  const onDelete = async (id: string) => {
    if (!confirm("Delete this export record?")) return;
    setBusyId(id);
    try {
      await deleteExportLog(id);
      setSelected(prev => { const n = new Set(prev); n.delete(id); return n; });
      router.refresh();
    } catch {
      alert("Failed to delete record.");
    } finally {
      setBusyId(null);
    }
  };

  const charLabel = (id: string) => byId(id)?.name ?? id;

  return (
    <div className="max-w-5xl mx-auto">
      <header className="mb-6 border-b border-gray-200 dark:border-zinc-800 pb-4">
        <h1 className="text-2xl font-semibold">Export History</h1>
        <p className="text-sm text-gray-500 mt-1">
          Every download is recorded here. Select two or more to compare how your damage output evolved.
        </p>
      </header>

      {logs.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-200 dark:border-zinc-800 py-16 text-center">
          <p className="text-sm text-gray-500 dark:text-zinc-400 font-medium">No exports yet</p>
          <p className="text-xs text-gray-400 dark:text-zinc-500 mt-1">
            Open a character calculator and use Export (JSON / CSV / TXT / PDF / PNG) — records appear here.
          </p>
        </div>
      ) : (
        <>
          {/* Filter + selection status */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <label className="flex items-center gap-2 text-xs text-gray-500">
              Character
              <select
                className="border border-gray-300 dark:border-zinc-700 rounded px-2 py-1 text-sm bg-white dark:bg-zinc-800 text-black dark:text-white"
                value={characterFilter}
                onChange={e => setCharacterFilter(e.target.value)}
              >
                <option value="all">All ({logs.length})</option>
                {characterIds.map(id => (
                  <option key={id} value={id}>{charLabel(id)}</option>
                ))}
              </select>
            </label>
            {selected.size > 0 && (
              <button onClick={() => setSelected(new Set())}
                className="text-xs text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 underline">
                Clear selection ({selected.size})
              </button>
            )}
          </div>

          {/* Compare panel */}
          {compareLogs.length >= 2 && (
            <ComparePanel logs={compareLogs} charLabel={charLabel} />
          )}

          {/* List table */}
          <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-zinc-800">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[10px] uppercase tracking-wider text-gray-400 bg-gray-50/60 dark:bg-zinc-900/40">
                  <th className="py-2.5 px-3 font-normal w-8"></th>
                  <th className="py-2.5 px-3 font-normal">When</th>
                  <th className="py-2.5 px-3 font-normal">Character</th>
                  <th className="py-2.5 px-3 font-normal">Format</th>
                  <th className="py-2.5 px-3 font-normal">Label</th>
                  <th className="py-2.5 px-3 font-normal text-right">Top DMG</th>
                  <th className="py-2.5 px-3 font-normal text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {visible.map(l => {
                  const summary = l.summary as ExportSummary;
                  return (
                    <tr key={l.id} className="border-t border-gray-100 dark:border-zinc-800/60">
                      <td className="py-2 px-3">
                        <input type="checkbox" className="h-4 w-4 accent-zinc-900 dark:accent-zinc-100 cursor-pointer"
                          checked={selected.has(l.id)} onChange={() => toggle(l.id)} />
                      </td>
                      <td className="py-2 px-3 text-gray-600 dark:text-gray-400 whitespace-nowrap">{fmtTime(l.createdAt)}</td>
                      <td className="py-2 px-3 font-medium">{charLabel(l.characterId)}</td>
                      <td className="py-2 px-3">
                        <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded border ${FORMAT_STYLE[l.format] ?? "bg-zinc-500/10 border-zinc-500/20"}`}>
                          {l.format}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-gray-600 dark:text-gray-400">{l.label}</td>
                      <td className="py-2 px-3 text-right tabular-nums font-semibold">{fmtNum(summary.topHeadline)}</td>
                      <td className="py-2 px-3 text-right whitespace-nowrap">
                        <Link
                          href={`/characters/${l.characterId}?share=${encodeBuild(l.snapshot)}`}
                          className="text-xs font-semibold text-zinc-700 hover:text-black dark:text-zinc-300 dark:hover:text-white underline mr-3"
                        >
                          Open
                        </Link>
                        <button onClick={() => onDelete(l.id)} disabled={busyId === l.id}
                          className="text-xs font-semibold text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 disabled:opacity-50">
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

function ComparePanel({ logs, charLabel }: { logs: ExportLogRow[]; charLabel: (id: string) => string }) {
  const summaries = logs.map(l => l.summary as ExportSummary);
  const base = summaries[0];
  // Union of setup labels across the selected exports.
  const setupLabels = Array.from(new Set(summaries.flatMap(s => s.setups.map(x => x.label))));
  const headlineFor = (s: ExportSummary, label: string) => s.setups.find(x => x.label === label)?.headline;

  return (
    <div className="mb-4 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white/60 dark:bg-zinc-900/40 p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold">Comparison ({logs.length} exports, oldest → newest)</h2>
        <div className="text-zinc-500 dark:text-zinc-400"><Sparkline values={summaries.map(s => s.topHeadline)} /></div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-left text-[10px] uppercase tracking-wider text-gray-400">
              <th className="py-1.5 pr-3 font-normal">Metric</th>
              {logs.map(l => (
                <th key={l.id} className="py-1.5 px-3 font-normal text-right whitespace-nowrap">
                  {charLabel(l.characterId)} · {new Date(l.createdAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-gray-100 dark:border-zinc-800/60 font-semibold">
              <td className="py-1.5 pr-3">Top DMG</td>
              {summaries.map((s, i) => (
                <td key={i} className="py-1.5 px-3 text-right tabular-nums">
                  {fmtNum(s.topHeadline)}{i > 0 && <Delta value={s.topHeadline} base={base.topHeadline} />}
                </td>
              ))}
            </tr>
            {setupLabels.map(label => (
              <tr key={label} className="border-t border-gray-100 dark:border-zinc-800/60">
                <td className="py-1.5 pr-3 text-gray-600 dark:text-gray-400">{label}</td>
                {summaries.map((s, i) => {
                  const v = headlineFor(s, label);
                  const b = headlineFor(base, label);
                  return (
                    <td key={i} className="py-1.5 px-3 text-right tabular-nums">
                      {v == null ? "—" : fmtNum(v)}
                      {i > 0 && v != null && b != null && <Delta value={v} base={b} />}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
