# Genshin Damage Calculator — Plan 2: Persistence & Rotation Export

_Companion to Plan 1. This plan assumes the locked stack and focuses on the two new features: **saving builds to a database** and **exporting damage outputs for a chosen rotation**. It is written for **personal, single-user** scope — auth, community features, and hardening are deliberately minimized._

**Locked stack**

- **Frontend:** Next.js (React) + TypeScript
- **Backend:** Node.js — Next.js API routes / Server Actions, **plus** Express + Pug
- **Database:** MySQL + Prisma

---

## 0. Two decisions to make up front (read this first)

### 0.1 What Express + Pug is _for_

Next.js already owns routing, SSR, and view rendering through React. If Express + Pug just re-renders pages, you'd be running two view engines (JSX **and** Pug) for no gain. To make it earn its place, give it **one distinct job: rendering exportable rotation reports.**

That job is a real one. Your export feature needs a clean, print-styled HTML document (a "damage sheet" for the chosen rotation), and optionally a PDF/PNG of it. A tiny **Express service whose only route renders a Pug report template → HTML → (via headless Chrome) PDF/PNG** is a coherent, non-redundant use of exactly the tools you picked.

**The alternative (so you can choose deliberately):** you can produce the same PDF without Pug or a second process — e.g. `@react-pdf/renderer` (build the report as React components) or Next API route + Puppeteer rendering a React page. If you'd rather not run two processes, take that path and drop Express/Pug. This plan keeps Express + Pug because you chose them and gives them the export role; swapping to the React-only path later changes only §6.

### 0.2 Where the math runs

Unchanged from Plan 1: the **pure-TypeScript engine** computes damage. It runs **client-side** for the live UI, and the **same module** is imported by the export service so a PDF is guaranteed to match what you saw on screen. The database stores **inputs and definitions** (builds, rotations), never computed outputs as the source of truth — outputs are always regenerated from inputs so they can't go stale when you fix a formula.

---

## 1. Updated architecture

```mermaid
flowchart TD
    subgraph Next["Next.js app (port 3000) — main UI + CRUD"]
        UI["React UI<br/>build editor · rotation builder · results"]
        ENGINE["Pure TS engine + character configs<br/>(shared, from Plan 1)"]
        ACTIONS["Server Actions / API routes<br/>save & load builds/rotations"]
        UI --> ENGINE
        UI --> ACTIONS
    end

    PRISMA["Prisma Client"]
    DB[("MySQL<br/>Build · Rotation<br/>build data as JSON columns")]
    ACTIONS --> PRISMA --> DB

    subgraph Export["Express + Pug service (port 4000) — reports only"]
        PUG["Pug report template"]
        PPTR["Puppeteer → PDF / PNG"]
        ENGINE2["same TS engine (imported)"]
        PUG --> PPTR
        ENGINE2 --> PUG
    end

    UI -->|"POST rotation+build JSON"| Export
    Export -->|"PDF / PNG / HTML"| UI

    UI -->|"CSV · JSON · XLSX<br/>generated in-browser"| LOCAL["Direct download<br/>(no server)"]
```

Two processes, one shared engine, one database. Client-side handles the cheap exports (CSV/JSON/XLSX); the Express+Pug service handles the polished PDF/PNG report.

---

## 2. Data model (MySQL + Prisma)

For **personal use**, keep it minimal: no `User` table, no accounts. A build is a named snapshot of inputs; a rotation belongs to a build. Store the flexible, character-varying input bags as **`Json` columns** (MySQL has a native `JSON` type; Prisma maps it to `Json`). This mirrors Plan 1's "a build is a bag of ~40 fields whose shape varies by character."

```prisma
// schema.prisma
generator client { provider = "prisma-client-js" }

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

model Build {
  id          String     @id @default(cuid())
  name        String
  characterId String                    // "arlecchino", "hu-tao", ... (matches a character config)
  data        Json                       // full input snapshot: base/flat stats, %s, CRIT, weapon/artifact refs
  enemy       Json                       // { levelChar, levelTarget, resPercent, defReduction, defIgnore, ... }
  notes       String?    @db.Text
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
  rotations   Rotation[]

  @@index([characterId])
}

model Rotation {
  id        String   @id @default(cuid())
  name      String
  buildId   String
  build     Build    @relation(fields: [buildId], references: [id], onDelete: Cascade)
  steps     Json                         // ordered array of RotationStep (see §4)
  totalTime Float?                        // seconds; optional, only if you want DPS
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([buildId])
}
```

**Why JSON columns instead of fully normalized tables:** for a single user, a build's stat set and a rotation's step list are always read and written as a whole; you gain simplicity and lose nothing you'd actually query on. If you later want to query _across_ rotations (e.g. "every step that used Vaporize"), promote `steps` to a normalized `RotationStep` table — but don't pay that cost now.

**Setup checklist**

- `DATABASE_URL="mysql://user:pass@localhost:3306/gi_calc"` in `.env`.
- Run MySQL locally (a Docker `mysql:8` container is the least-friction option) → `npx prisma migrate dev --name init` → `npx prisma generate`.
- **Prisma singleton (real gotcha):** Next.js dev hot-reload re-instantiates modules and will exhaust MySQL connections unless you cache the client on `globalThis`:

```ts
// lib/prisma.ts
import { PrismaClient } from "@prisma/client";
const g = globalThis as unknown as { prisma?: PrismaClient };
export const prisma = g.prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== "production") g.prisma = prisma;
```

- **`prisma studio`** gives you a free GUI to view/edit saved builds — handy for personal use, no admin panel needed.

---

## 3. Saving & loading builds (CRUD)

Use **Server Actions** for in-app mutations — they're typed, need no `fetch` boilerplate, and can import Prisma directly. Expose an **API route** only for what the _Express service_ must call.

```ts
// app/builds/actions.ts
"use server";
import { prisma } from "@/lib/prisma";
import { BuildInputSchema } from "@/lib/schemas"; // Zod

export async function saveBuild(input: unknown) {
  const data = BuildInputSchema.parse(input);   // validate for correctness
  return prisma.build.upsert({
    where: { id: data.id ?? "" },
    create: { name: data.name, characterId: data.characterId, data: data.data, enemy: data.enemy, notes: data.notes },
    update: { name: data.name, data: data.data, enemy: data.enemy, notes: data.notes },
  });
}

export async function listBuilds(characterId?: string) {
  return prisma.build.findMany({
    where: characterId ? { characterId } : undefined,
    orderBy: { updatedAt: "desc" },
    select: { id: true, name: true, characterId: true, updatedAt: true },
  });
}
export async function loadBuild(id: string) {
  return prisma.build.findUnique({ where: { id }, include: { rotations: true } });
}
```

**UI:** a "My Builds" panel in the sidebar (grouped by `characterId`, echoing your sheet-per-character structure): _Save_, _Save As_, _Load_, _Duplicate_, _Delete_. Loading a build hydrates the calculator's input state; the engine recomputes live. Since it's personal, Zod validation here is about **catching your own bad inputs**, not defending against attackers.

---

## 4. Rotations — the core new concept

A **rotation** is an ordered list of actions ("steps") you actually perform. Each step is one talent-hit instance with the reaction/crit context for that hit. Running a rotation = invoking the engine once per step against the build's stats, then aggregating.

```ts
// lib/rotation.ts
export type CritMode = "avg" | "crit" | "nonCrit";
export type ReactionType = "none" | "vaporize" | "melt" | "aggravate" | "spread" /* ...transformative */;

export interface RotationStep {
  id: string;
  talentKey: string;        // references a talent in the character config, e.g. "skill.spike" / "na.1Hit"
  label: string;            // display name
  count: number;            // how many times this hit occurs in the rotation
  reaction: ReactionType;   // reaction applied on this hit
  critMode: CritMode;       // usually "avg"
  modifiers?: Record<string, number>; // optional per-step buff deltas (e.g. a burst-window DMG% only some hits get)
  time?: number;            // seconds this step occupies (optional, only for DPS)
}

export interface RotationResultRow {
  label: string; reaction: ReactionType;
  perHit: number; count: number; subtotal: number; shareOfTotal: number;
}
export interface RotationResult {
  rows: RotationResultRow[];
  total: number;
  totalTime?: number;
  dps?: number;             // total / totalTime, if timing present
}
```

**Compute** by mapping each step through the Plan-1 engine (`composeDamage(build, enemy, hit)`), multiplying by `count`, summing to `total`, and computing each row's `shareOfTotal`. If steps carry `time`, sum it for `totalTime` and derive `dps`. This single `RotationResult` object is the **one source of truth** that the on-screen table _and_ every export format consume — so what you see always equals what you export.

**Rotation builder UI:** an ordered, drag-to-reorder list. Each row: pick talent (from the character config's talent list — the same list your sheet enumerates, e.g. Arlecchino's 1-Hit…6-Hit, Spike/Cleave, Blood-Debt Directive, Skill DMG), set count, pick reaction, pick crit mode. A live totals footer shows rotation total (and DPS if timing is on). Save rotations to the `Rotation` table against the current build.

---

## 5. Export — the cheap formats (client-side, no server)

Generate these **in the browser** directly from the `RotationResult`; no round-trip, no Pug, instant download:

- **CSV** — `papaparse` (or a two-line join). Columns: `Step, Talent, Reaction, CritMode, Per-Hit, Count, Subtotal, % of Total`, then a totals row and DPS.
- **JSON** — serialize the `RotationResult` plus the build snapshot and `dataVersion`, so an export is self-describing and re-importable.
- **XLSX** — `SheetJS (xlsx)`; nice if you want a spreadsheet that echoes your original Excel's layout (per-hit, subtotal, % diff columns). One sheet per rotation, or a summary sheet plus per-rotation sheets.

These cover most day-to-day "export the numbers" needs with zero infrastructure.

---

## 6. Export — the polished report (Express + Pug + Puppeteer)

This is the distinct job that justifies Express + Pug. The flow:

1. Next UI `POST`s `{ build, enemy, rotation }` (inputs only) to the Express service.
2. Express **imports the shared engine**, recomputes the `RotationResult` (guaranteeing fidelity), and renders a **Pug template** into a print-styled HTML report — title, character, build summary, the rotation table with per-hit/subtotal/% columns, totals, DPS, and `dataVersion`/timestamp.
3. For PDF/PNG, **Puppeteer** loads that HTML in headless Chrome and prints it. Return the file (or the raw HTML if you just want a printable page).

```js
// export-service/server.js  (Express, port 4000)
const express = require("express");
const puppeteer = require("puppeteer");
const { computeRotation } = require("../engine");   // same TS engine, compiled
const app = express();
app.use(express.json());

app.post("/report", async (req, res) => {
  const result = computeRotation(req.body);                 // recompute from inputs
  const html = req.app.render("report", { ...req.body, result }); // Pug → HTML
  if (req.query.format === "html") return res.type("html").send(html);

  const browser = await puppeteer.launch({ args: ["--no-sandbox"] });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle0" });
  const buf = req.query.format === "png"
    ? await page.screenshot({ fullPage: true })
    : await page.pdf({ format: "A4", printBackground: true });
  await browser.close();
  res.type(req.query.format === "png" ? "png" : "pdf").send(buf);
});
app.set("view engine", "pug");
app.listen(4000);
```

```pug
//- export-service/views/report.pug
doctype html
html
  head
    style :include(styles.css)
  body
    h1= character.name + " — " + rotation.name
    section.build
      p Build: #{build.name}  |  Enemy Lv #{enemy.levelTarget}, RES #{enemy.resPercent}%
    table
      thead: tr
        th Step
        th Reaction
        th Per-Hit
        th Count
        th Subtotal
        th % of Total
      tbody
        each row in result.rows
          tr
            td= row.label
            td= row.reaction
            td= Math.round(row.perHit)
            td= row.count
            td= Math.round(row.subtotal)
            td= (row.shareOfTotal * 100).toFixed(1) + "%"
    p.total Total: #{Math.round(result.total)}
    if result.dps
      p.dps DPS: #{Math.round(result.dps)}  (over #{result.totalTime}s)
    footer Data patch #{dataVersion} · generated #{new Date().toISOString()}
```

**Running two processes:** for personal use, a `concurrently` script (`next dev` + `node export-service/server.js`) or a small `docker-compose` (mysql + next + export-service) is enough. No orchestration, no scaling concerns.

> If you decide the second process isn't worth it: delete this section, render the same report as a React component with `@react-pdf/renderer` inside a Next API route, and you lose nothing but the Pug syntax. Keeping Pug is fine — just make sure it _only_ lives here.

---

## 7. What "personal use only" lets you skip (and the few things to keep)

**Safely skip:** user accounts/auth, password/session handling, rate limiting, CSRF/XSS hardening beyond framework defaults, moderation, audit logs, multi-tenant data isolation, GDPR/privacy plumbing.

**Still worth keeping (cheap, and they're about _correctness_, not security):**

- **Zod validation** on inputs — catches your own typos and malformed saved data, not attackers.
- **The Prisma singleton** (§2) — otherwise dev hot-reload crashes on connection limits.
- **A backup habit** — `mysqldump` occasionally, or just rely on `prisma studio` + the fact that builds are cheap to recreate. Even personal data is annoying to lose.
- **Consistent rounding in the engine** (flagged in Plan 1) — matters more now, because exported numbers are ones you'll compare against the game.

**Deployment note:** if you ever move off `localhost` to a serverless host (Vercel), Prisma + MySQL needs a connection pooler (direct MySQL connections don't survive serverless fan-out well). For local/home-server/small-VPS personal use, a direct connection is completely fine — just be aware the pooler requirement appears the moment you go serverless.

---

## 8. Schema-to-feature map (ER view)

```mermaid
erDiagram
    BUILD ||--o{ ROTATION : "has many"
    BUILD {
        string id PK
        string name
        string characterId "matches a character config"
        json   data "stat/input snapshot (grey cells)"
        json   enemy "levels, RES, DEF params"
        text   notes
        datetime createdAt
        datetime updatedAt
    }
    ROTATION {
        string id PK
        string name
        string buildId FK
        json   steps "ordered RotationStep[]"
        float  totalTime "optional, for DPS"
        datetime createdAt
        datetime updatedAt
    }
```

---

## 9. Build roadmap for these features

- **Phase A — Database foundation.** Add Prisma + MySQL, write `schema.prisma` (§2), `migrate dev`, add the Prisma singleton. Verify with `prisma studio`.
- **Phase B — Save/Load builds.** Server Actions (§3) + a "My Builds" sidebar panel (Save / Save As / Load / Duplicate / Delete), grouped by character. Hydrate calculator state on load.
- **Phase C — Rotation builder.** The ordered-step UI (§4), computing `RotationResult` live via the engine; persist rotations against a build.
- **Phase D — Cheap exports.** CSV / JSON / XLSX generated client-side from `RotationResult` (§5).
- **Phase E — Report service.** Express + Pug + Puppeteer PDF/PNG report (§6), fed the same inputs and recomputed with the shared engine. Wire an "Export report" button that POSTs to it.
- **Phase F — Quality of life.** Rotation templates/presets, duplicate-and-tweak, a build-vs-build or rotation-vs-rotation diff view (reusing your Excel's "% dif / Flat dif" idea), and periodic `mysqldump` backups.

---

### Bottom line

Keep the **pure engine** as the single source of damage math, store **only inputs** (builds + rotations) in **MySQL as JSON columns via Prisma**, compute rotations by running the engine per step into one `RotationResult`, and drive **all** exports from that object: **CSV/JSON/XLSX in the browser** for speed, and a **Pug + Puppeteer report** in the small Express service for the polished PDF/PNG — that report role being the one thing that makes Express + Pug pull its weight next to Next.js. Because it's personal-use, drop auth and hardening entirely and spend that saved effort on validation, rounding fidelity, and the rotation UX.