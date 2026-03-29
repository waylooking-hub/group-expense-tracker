# Group Expense Tracker TODO

## In Progress
- [ ] Supabase: запустити `supabase-setup.sql` в SQL Editor (таблиці + RLS)
- [ ] Supabase: створити storage bucket `receipts` (public)
- [ ] Додати env vars в Vercel Dashboard (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY)
- [ ] Перевірити деплой на Vercel — знайти URL і протестувати

## Planned
- [ ] Видалення витрат (кнопка delete на ExpenseCard)
- [ ] Стиснення фото receipt перед upload (canvas API, max 1200px)
- [ ] Додати українську мову (uk) до i18n
- [ ] Route group layout `(app)/layout.tsx` з auth guard і Nav
- [ ] Responsive покращення для десктопу
- [ ] PWA manifest для додавання на home screen

## Done
- [x] Scaffolding проєкту (Next.js 16, Tailwind 4, Supabase)
- [x] Database schema (`supabase-setup.sql`)
- [x] API routes: verify PIN, create group, members, expenses
- [x] Landing page з PIN entry, створення групи, вибір учасника
- [x] Dashboard з totals, per-person breakdown, settlements
- [x] Settlement algorithm (мінімум транзакцій, per-currency)
- [x] Add expense form з receipt upload
- [x] Expense list page
- [x] Bottom navigation
- [x] i18n: EN/PL переклади + language switcher
- [x] GitHub Actions CI/CD → Vercel deploy
