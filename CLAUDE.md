# Group Expense Tracker

Трекер групових витрат під час подорожі. PIN-based доступ, Supabase backend.

## Stack
- Next.js 16 (App Router)
- Supabase (PostgreSQL + Storage)
- Tailwind CSS 4
- TypeScript 5

## Commands
- `npm run dev` — Next.js dev server
- `npm run build` — production build
- `npm run lint` — ESLint

## Key Files
- `supabase-setup.sql` — DB schema (run in Supabase SQL Editor)
- `src/lib/settlements.ts` — settlement calculation algorithm
- `src/lib/supabase.ts` — Supabase client
- `src/app/api/` — API routes (group verify, members, expenses)

## Auth Flow
PIN-code per group → select/create member → localStorage session

## Secrets
- `~/secrets/group-expense-tracker/.env` → `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
