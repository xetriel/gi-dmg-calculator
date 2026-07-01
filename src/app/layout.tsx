import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="h-full overflow-hidden">
        <div className="flex h-screen flex-col">
          <header className="flex h-14 shrink-0 items-center border-b border-gray-200 dark:border-zinc-800 px-4 bg-white dark:bg-zinc-950/80 backdrop-blur-md z-10">
            <Link href="/" className="font-semibold">GI Damage Calculator</Link>
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
