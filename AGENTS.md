<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know
This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Project: biz-manager — "Lizy Liquor Store" Business Management App

A complete, working inventory/sales/expense/profit management web app for a liquor
store. Built by a BEGINNER who is learning. Explain changes clearly. This is
Next.js 16 — verify conventions against local docs / terminal behavior, not memory.

## CURRENT TASK: VISUAL REDESIGN ONLY
The owner wants a premium SaaS visual refresh. RULES:
- Do NOT change logic, database queries, Server Actions, auth, or schema.
- Keep ALL functionality identical. Restyle only.
- Do NOT touch: services/, prisma/, auth.ts, proxy.ts, lib/prisma.ts, or the
  /api/auth/[...nextauth]/route.ts file.
- After each file changed, briefly say what changed so the owner can review.
- One assistant at a time — you are the only one editing now.

## Desired look
- Dark sidebar (bg-slate-900) with lucide icons + grouped sections (DONE).
- Clean white content pages, blue (#2563EB) accent.
- Login & signup pages: dark amber/gold theme — public/bg.jpg (warm bar/bottles
  photo) as full background with a dark overlay; auth form in a floating glass
  (translucent dark) card with amber accents. (Decided over the white-card/blue
  alternative — keep this direction unless told otherwise.)
- Consistent across pages: rounded-xl cards, shadow-sm, uppercase tracking-wide
  table headers, hover:bg-gray-50 rows, status pills, blue focus rings.
- Branding: "Lizy Liquor Store" — amber "LL" initials badge used as the logo
  (sidebar, dashboard header, login/signup). No separate Logo.tsx component yet.

## Tech stack (in use, working)
- Next.js 16 (App Router, TypeScript, Turbopack), Tailwind CSS
- PostgreSQL on Neon (NOT Supabase). NOTE: Neon free tier auto-sleeps; "Can't reach
  database server P1001" just means wake it at neon.tech. connect_timeout=30 is set
  in DATABASE_URL to ride out cold starts. Plan to upgrade to always-on before
  client launch.
- Prisma ORM (lib/prisma.ts singleton)
- Auth.js / NextAuth v5 (Credentials + bcrypt + JWT). AUTH_SECRET in .env.local.
- lucide-react (icons), recharts (charts), SheetJS/xlsx (Excel import)
- Page protection: proxy.ts (Next.js 16 renamed middleware.ts -> proxy.ts)

## Architecture / conventions
- Route group app/(app)/ holds all authed pages; app/(app)/layout.tsx renders the
  Sidebar + TopBar (fetches session + low-stock for the notification bell), then
  <main>{children}</main>. Public pages (login, signup, /) sit OUTSIDE the group.
- Root app/layout.tsx holds <html>/<body>/fonts/globals.css ONLY (title:
  "Lizy Liquor Store"). It MUST keep <html> and <body> tags.
- DB logic in services/*.ts ("use server"); stats.ts/reports.ts/settings.ts read-only.
- Pages reading data = async Server Components; interactive bits (basket, modal,
  bell, import) = "use client" components getting props.
- After DB writes: revalidatePath(...). Money = BigInt whole TZS (Number() to compute).

## FEATURES — all built & working (do not break)
- Auth: signup, login, logout (sidebar button), JWT sessions, AUTH_SECRET set.
- proxy.ts guards /dashboard /products /stock /sales /expenses /analytics /reports
  /settings; login/signup/(/) public.
- Sidebar: dark, grouped (Main Menu / Reports), lucide icons, Lizy logo + name
  (passed down from app/(app)/layout.tsx, which reads BusinessProfile.storeName).
- TopBar (components/TopBar.tsx): notification bell (real low-stock dropdown via
  components/NotificationBell.tsx), settings gear -> /settings, profile (initial + name).
- Dashboard: store name + amber logo badge header, 4 icon-badge cards (Revenue,
  Net Profit, Expenses, Products), monthly chart (components/MonthlyChartWrapper.tsx
  wraps MonthlyChart with next/dynamic ssr:false — REQUIRED, recharts breaks under
  SSR in Next 16), recent-sales panel with status pills.
- Products: full CRUD. Add form + table; edit via components/EditProductButton.tsx
  (modal, props, client state); delete; low-stock qty shows red.
- Excel import (app/(app)/products/import): SheetJS parse -> preview table ->
  bulkCreateProducts. NOTE: a validated version (rejects bad rows w/ reasons,
  duplicate check) was built earlier but the file may have reverted to the simple
  version — re-add validation if missing.
- Stock receiving (app/(app)/stock + services/stock.ts -> receiveStock): records
  stockEntry AND updates product qty + WEIGHTED-AVERAGE COST in prisma.$transaction.
- Sales (components/SaleForm.tsx + services/sales.ts -> createSale): full basket,
  server looks up real prices/costs, creates Sale + SaleItems + decrements stock in
  one transaction, captures unitPrice + unitCost per item (for profit).
- Expenses (services/expenses.ts): create + delete + list + total; category pills.
- Reports (services/reports.ts -> getMonthlyReport): monthly revenue/cogs/expenses/
  profit table; profit as green/red pill.
- Analytics (app/(app)/analytics): summary cards (Revenue/Expenses/Net Profit),
  MonthlyChartWrapper bar chart (revenue/profit by month), top-5-products table.
- Settings (app/(app)/settings + services/settings.ts + components/SettingsForm.tsx):
  BusinessProfile (storeName, address, phone, currency) single-row read/update via
  useActionState, shows a success banner after saving. Migration applied.

## Schema notes
Product: BigInt sellingPrice + avgCost (weighted avg, updated on stock receive),
quantityInStock, reorderLevel. SaleItem stores unitPrice + unitCost (snapshot at
sale) = basis for profit. Do NOT switch money to DECIMAL. BusinessProfile = settings.

## Known issues / gotchas
- Neon sleeps (P1001) — wake it; not a code bug. connect_timeout=30 added to
  DATABASE_URL to soften this.
- Watch for empty/reverted/scrambled files (happened repeatedly) — verify with
  (Get-Content path).Count after edits.
- Terminal is Windows PowerShell: chain with ; not &; quote paths with parens:
  "app\(app)\...".
- recharts MUST be loaded via next/dynamic ssr:false in a "use client" wrapper.
- After editing prisma/schema.prisma, run `npx prisma migrate dev` AND
  `npx prisma generate` — the dev server locks the query engine DLL on Windows
  (EPERM on rename), so stop `npm run dev` before regenerating, then restart it.

## NOT built (Phase 2 — do NOT add during a styling pass)
Customers, Suppliers, Purchase Orders, Users/roles, Profile page, dedicated
Notifications page, Help/Support, PDF/Excel export, dark mode, backups.

## Next after redesign
Test build (npm run build), push to GitHub, deploy to Vercel (env vars: DATABASE_URL,
AUTH_SECRET), upgrade Neon to always-on.
