"use client";

import React, { useState } from "react";
import { getDbStatus, type DbStatusInfo } from "@/app/actions/db-status";
import { DbStatusModal } from "./DbStatusModal";

interface DbStatusBadgeProps {
  initialStatus: DbStatusInfo;
}

export function DbStatusBadge({ initialStatus }: DbStatusBadgeProps) {
  const [statusInfo, setStatusInfo] = useState<DbStatusInfo>(initialStatus);
  const [isOpen, setIsOpen] = useState(false);
  const [isRechecking, setIsRechecking] = useState(false);

  const isOnline = statusInfo.status === "online";
  const isChecking = statusInfo.status === "checking";

  const handleRecheck = async () => {
    setIsRechecking(true);
    try {
      const updated = await getDbStatus();
      setStatusInfo(updated);
    } catch {
      setStatusInfo((prev) => ({
        ...prev,
        status: "offline",
        errorMessage: "Failed to perform health check query.",
      }));
    } finally {
      setIsRechecking(false);
    }
  };

  return (
    <>
      {/* Clickable DB Status Badge in Header */}
      <button
        onClick={() => setIsOpen(true)}
        className={`flex items-center gap-1.5 text-[9px] px-2 py-0.5 border rounded-full font-bold transition-all cursor-pointer hover:scale-105 active:scale-95 ${
          isOnline
            ? "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 dark:bg-emerald-500/10 border-emerald-500/25 hover:border-emerald-500/50 hover:bg-emerald-500/20"
            : isChecking
            ? "text-amber-600 dark:text-amber-400 bg-amber-500/10 dark:bg-amber-500/10 border-amber-500/25 hover:border-amber-500/50 hover:bg-amber-500/20"
            : "text-rose-600 dark:text-rose-400 bg-rose-500/10 dark:bg-rose-500/10 border-rose-500/25 hover:border-rose-500/50 hover:bg-rose-500/20"
        }`}
        title="Click to view database diagnostics & connection details"
      >
        <span className="relative flex h-1.5 w-1.5">
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
              isOnline ? "bg-emerald-400" : isChecking ? "bg-amber-400" : "bg-rose-400"
            }`}
          ></span>
          <span
            className={`relative inline-flex rounded-full h-1.5 w-1.5 ${
              isOnline ? "bg-emerald-500" : isChecking ? "bg-amber-500" : "bg-rose-500"
            }`}
          ></span>
        </span>
        <span>
          {isOnline ? "DB Online" : isChecking ? "Checking DB..." : "DB Offline"}
        </span>
      </button>

      {/* Database Diagnostic Modal */}
      <DbStatusModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        info={statusInfo}
        onRecheck={handleRecheck}
        isRechecking={isRechecking}
      />
    </>
  );
}

export function SavedBuildsBadge({ initialCount, isOnline }: { initialCount: number; isOnline: boolean }) {
  return (
    <div
      className={`flex items-center gap-1 border px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
        isOnline
          ? "bg-zinc-50 dark:bg-zinc-900/60 border-zinc-250/60 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400"
          : "bg-rose-500/5 border-rose-500/20 text-rose-500 dark:text-rose-400"
      }`}
      title={isOnline ? `${initialCount} saved builds in database` : "Database is offline"}
    >
      <span>📂</span>
      <span>{isOnline ? `${initialCount} Saved Builds` : "DB Offline"}</span>
    </div>
  );
}
