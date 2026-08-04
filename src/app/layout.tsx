import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { getDbStatus } from "@/app/actions/db-status";
import { DbStatusBadge, SavedBuildsBadge } from "@/components/DbStatusBadge";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GI Damage Calculator",
  description: "Genshin Impact per-character damage calculator",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const dbStatus = await getDbStatus();

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="h-full overflow-hidden">
        <div className="flex h-screen flex-col">
          <header className="flex h-14 shrink-0 items-center justify-between border-b border-gray-200 dark:border-zinc-800 px-4 bg-white dark:bg-zinc-950/85 backdrop-blur-md z-10 select-none">
            {/* Left Brand Section */}
            <div className="flex items-center gap-3">
              <Link href="/" className="font-bold flex items-center gap-2 text-zinc-900 dark:text-zinc-100 hover:text-zinc-700 dark:hover:text-zinc-350 transition-colors">
                <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span className="text-sm tracking-tight">GI Damage Calculator</span>
              </Link>
              <span className="text-[9px] font-bold font-mono bg-zinc-100 dark:bg-zinc-800/80 text-zinc-500 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700 px-2 py-0.5 rounded-full">
                v1.2.0-Beta
              </span>
              <DbStatusBadge initialStatus={dbStatus} />
            </div>

            {/* Right Meta Section */}
            <div className="flex items-center gap-4 text-[11px] font-semibold text-gray-500 dark:text-zinc-400">
              <Link href="/history" className="flex items-center gap-1 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors" title="Export history">
                <span>🕑</span>
                <span>History</span>
              </Link>
              <SavedBuildsBadge
                initialCount={dbStatus.buildsCount}
                isOnline={dbStatus.status === "online"}
              />
              <a
                href="https://github.com/xetriel/gi-dmg-calculator"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                title="GitHub Repository"
              >
                <svg className="w-4.5 h-4.5" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
                </svg>
              </a>
            </div>
          </header>
          <div className="flex flex-1 overflow-hidden">
            <Sidebar />
            <main className="flex-1 overflow-y-auto p-6 bg-zinc-50/30 dark:bg-zinc-950/30">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
