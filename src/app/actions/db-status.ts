"use server";

import { prisma } from "@/lib/prisma";

export interface DbStatusInfo {
  status: "online" | "offline" | "checking";
  databaseType: string;
  host: string;
  databaseName: string;
  redactedUrl: string;
  buildsCount: number;
  latencyMs?: number;
  lastChecked: string;
  errorMessage?: string;
  errorDetails?: string;
  diagnosticTip?: string;
}

function parseDatabaseUrl(urlStr: string | undefined): {
  databaseType: string;
  host: string;
  databaseName: string;
  redactedUrl: string;
} {
  const defaultRes = {
    databaseType: "MySQL / MariaDB (XAMPP)",
    host: "localhost:3306",
    databaseName: "gi_calc",
    redactedUrl: "mysql://root:****@localhost:3306/gi_calc",
  };

  if (!urlStr) return defaultRes;

  try {
    const parsed = new URL(urlStr);
    const protocol = parsed.protocol.replace(":", "").toLowerCase();
    const type =
      protocol === "mysql" || protocol === "mariadb"
        ? "MySQL / MariaDB (XAMPP)"
        : protocol.toUpperCase();
    const host = `${parsed.hostname || "localhost"}:${parsed.port || "3306"}`;
    const dbName = parsed.pathname.replace(/^\//, "") || "gi_calc";

    let auth = "";
    if (parsed.username) {
      auth = `${parsed.username}:****@`;
    }
    const redactedUrl = `${parsed.protocol}//${auth}${host}/${dbName}`;

    return {
      databaseType: type,
      host,
      databaseName: dbName,
      redactedUrl,
    };
  } catch {
    return defaultRes;
  }
}

export async function getDbStatus(): Promise<DbStatusInfo> {
  const dbConfig = parseDatabaseUrl(process.env.DATABASE_URL);
  const startTime = performance.now();
  const lastChecked = new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const timeoutMs = 2500;

  try {
    // Timeout race wrapper to avoid 10s pool timeout delays when XAMPP is off
    const dbProbe = async (): Promise<number> => {
      return await prisma.build.count();
    };

    const timeoutPromise = new Promise<never>((_, reject) => {
      const timer = setTimeout(() => {
        reject(new Error(`Connection timed out after ${timeoutMs}ms`));
      }, timeoutMs);
      // Ensure timer doesn't keep node event loop alive
      if (typeof timer === "object" && "unref" in timer) {
        (timer as { unref: () => void }).unref();
      }
    });

    const buildsCount = await Promise.race([dbProbe(), timeoutPromise]);
    const latencyMs = Math.round(performance.now() - startTime);

    return {
      status: "online",
      databaseType: dbConfig.databaseType,
      host: dbConfig.host,
      databaseName: dbConfig.databaseName,
      redactedUrl: dbConfig.redactedUrl,
      buildsCount,
      latencyMs,
      lastChecked,
    };
  } catch (err: unknown) {
    const errorObj = err as Error;
    const rawMessage = errorObj?.message || String(err);

    let shortError = rawMessage;
    let diagnosticTip = "XAMPP MySQL service is likely stopped or port 3306 is blocked.";

    if (rawMessage.includes("timed out") || rawMessage.includes("pool timeout")) {
      shortError = "Connection Pool Timeout (DB connection unreachable)";
      diagnosticTip =
        "The application attempted to connect to MySQL on localhost:3306, but the server did not respond. Check if MySQL is started in XAMPP Control Panel.";
    } else if (rawMessage.includes("ECONNREFUSED")) {
      shortError = "Connection Refused (ECONNREFUSED)";
      diagnosticTip =
        "MySQL port 3306 is closed or rejecting connections. Ensure MySQL service is running in XAMPP Control Panel.";
    } else if (rawMessage.includes("ER_ACCESS_DENIED") || rawMessage.includes("Access denied")) {
      shortError = "Database Access Denied";
      diagnosticTip = "Check database credentials (username/password) in your .env file.";
    }

    return {
      status: "offline",
      databaseType: dbConfig.databaseType,
      host: dbConfig.host,
      databaseName: dbConfig.databaseName,
      redactedUrl: dbConfig.redactedUrl,
      buildsCount: 0,
      lastChecked,
      errorMessage: shortError,
      errorDetails: rawMessage,
      diagnosticTip,
    };
  }
}
