"use client";

import React from "react";
import type { DbStatusInfo } from "@/app/actions/db-status";

interface DbStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  info: DbStatusInfo;
  onRecheck: () => void;
  isRechecking: boolean;
}

export function DbStatusModal({
  isOpen,
  onClose,
  info,
  onRecheck,
  isRechecking,
}: DbStatusModalProps) {
  if (!isOpen) return null;

  const isOnline = info.status === "online";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      {/* Modal Container */}
      <div
        className="relative w-full max-w-xl rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-150 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-950/40">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21 3.582 4 8 4s8-1.79 8-4"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                Database Diagnostics
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Connection status and configuration overview
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs">
          {/* Status Banner */}
          <div
            className={`p-4 rounded-xl border flex items-start justify-between gap-4 ${
              isOnline
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-950 dark:text-emerald-200"
                : "bg-rose-500/10 border-rose-500/20 text-rose-950 dark:text-rose-200"
            }`}
          >
            <div className="flex items-start gap-3">
              <span className="relative flex h-3 w-3 mt-1 shrink-0">
                <span
                  className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                    isOnline ? "bg-emerald-400" : "bg-rose-400"
                  }`}
                ></span>
                <span
                  className={`relative inline-flex rounded-full h-3 w-3 ${
                    isOnline ? "bg-emerald-500" : "bg-rose-500"
                  }`}
                ></span>
              </span>
              <div>
                <div className="font-bold text-sm flex items-center gap-2">
                  <span>{isOnline ? "Database Online" : "Database Offline / Unreachable"}</span>
                </div>
                <p className="mt-0.5 text-[11px] opacity-80">
                  {isOnline
                    ? "The application is successfully connected to your database."
                    : info.errorMessage || "Unable to establish database connection."}
                </p>
              </div>
            </div>
            <div className="text-right shrink-0 font-mono text-[10px] opacity-75">
              {isOnline && info.latencyMs !== undefined && (
                <div className="font-bold text-emerald-600 dark:text-emerald-400">
                  {info.latencyMs} ms
                </div>
              )}
              <div>Checked {info.lastChecked}</div>
            </div>
          </div>

          {/* Database Specs Grid */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-2">
              Database Configuration
            </h4>
            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/70 border border-zinc-200/80 dark:border-zinc-800">
                <span className="text-[10px] text-zinc-400 font-semibold block mb-0.5">
                  Database Engine
                </span>
                <span className="font-bold text-zinc-800 dark:text-zinc-200">
                  {info.databaseType}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/70 border border-zinc-200/80 dark:border-zinc-800">
                <span className="text-[10px] text-zinc-400 font-semibold block mb-0.5">
                  Host & Port
                </span>
                <span className="font-bold font-mono text-zinc-800 dark:text-zinc-200">
                  {info.host}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/70 border border-zinc-200/80 dark:border-zinc-800">
                <span className="text-[10px] text-zinc-400 font-semibold block mb-0.5">
                  Database Name
                </span>
                <span className="font-bold font-mono text-zinc-800 dark:text-zinc-200">
                  {info.databaseName}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/70 border border-zinc-200/80 dark:border-zinc-800">
                <span className="text-[10px] text-zinc-400 font-semibold block mb-0.5">
                  Saved Builds
                </span>
                <span className="font-bold text-zinc-800 dark:text-zinc-200">
                  {isOnline ? `${info.buildsCount} builds` : "N/A (DB Offline)"}
                </span>
              </div>
            </div>
            <div className="mt-2.5 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/70 border border-zinc-200/80 dark:border-zinc-800">
              <span className="text-[10px] text-zinc-400 font-semibold block mb-0.5">
                Redacted Connection String
              </span>
              <code className="text-[11px] font-mono text-amber-600 dark:text-amber-400 break-all select-all">
                {info.redactedUrl}
              </code>
            </div>
          </div>

          {/* Diagnostic & Troubleshooting Explanation */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-2">
              Status Breakdown & Diagnostics
            </h4>
            {isOnline ? (
              <div className="p-3.5 rounded-xl bg-emerald-500/5 border border-emerald-500/15 text-zinc-700 dark:text-zinc-300 leading-relaxed">
                <p>
                  <strong className="text-emerald-600 dark:text-emerald-400 font-semibold">
                    Everything is working properly.
                  </strong>{" "}
                  Your local MariaDB/MySQL instance is responding normally. Saved builds, export history, and calculations can write to and read from the database.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-amber-200 leading-relaxed">
                  <span className="font-bold block mb-1">Why is it offline?</span>
                  <p className="text-[11px]">{info.diagnosticTip}</p>
                </div>

                {info.errorDetails && (
                  <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase block mb-1">
                      Raw Error Message
                    </span>
                    <pre className="font-mono text-[10px] leading-tight overflow-x-auto text-rose-300 whitespace-pre-wrap max-h-24">
                      {info.errorDetails}
                    </pre>
                  </div>
                )}

                <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400">
                  <span className="font-bold text-zinc-800 dark:text-zinc-200 block mb-1">
                    Troubleshooting Steps:
                  </span>
                  <ol className="list-decimal list-inside space-y-1 text-[11px]">
                    <li>Open <strong>XAMPP Control Panel</strong> on your desktop.</li>
                    <li>Click <strong>Start</strong> next to the <strong>MySQL</strong> module.</li>
                    <li>
                      Wait for the status indicator to turn green, then click{" "}
                      <strong>Re-check Connection</strong> below.
                    </li>
                  </ol>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-150 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-950/40">
          <button
            onClick={onRecheck}
            disabled={isRechecking}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-zinc-100 dark:text-zinc-900 text-xs font-bold transition-all disabled:opacity-50 cursor-pointer shadow-xs"
          >
            <svg
              className={`w-3.5 h-3.5 ${isRechecking ? "animate-spin" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            <span>{isRechecking ? "Re-checking DB..." : "Re-check Connection"}</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-semibold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
