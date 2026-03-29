# AI Session Summary

## Last Updated: 2026-03-29

### Session Goal
Додати EN/PL мовну підтримку до group expense tracker та задеплоїти на Vercel через GitHub Actions.

### Changes Made
- `src/lib/i18n.ts`: Словник перекладів EN/PL (~40 ключів)
- `src/lib/i18n-context.tsx`: React context для мови з localStorage persistence
- `src/components/LangSwitcher.tsx`: Компонент перемикання мови (EN/PL кнопки)
- `src/app/layout.tsx`: Обгортка I18nProvider
- `src/app/page.tsx`: Всі тексти через `t()` + LangSwitcher на landing
- `src/app/dashboard/page.tsx`: Переклади + LangSwitcher в header
- `src/app/expenses/page.tsx`: Переклади
- `src/app/expenses/new/page.tsx`: Переклади
- `src/components/Navigation.tsx`: Label через translation keys
- `src/components/SettlementList.tsx`: Переклад "All settled up"
- `src/components/ExpenseCard.tsx`: Локалізація дат (pl-PL/en-GB) + переклади
- `.github/workflows/deploy.yml`: CI/CD — GitHub Actions → Vercel prod deploy

### Key Decisions
- i18n без зовнішніх бібліотек — простий context + словник (достатньо для 2 мов)
- Деплой через GitHub Actions замість прямого Vercel CLI (sandbox не має доступу до Vercel API)
- Код пушиться на GitHub через `git subtree push` (підпроєкт з монорепо)
- Supabase env vars передаються як GitHub Actions secrets

### Next Steps
- [ ] Запустити SQL schema в Supabase
- [ ] Створити receipts storage bucket
- [ ] Перевірити Vercel URL і протестувати повний flow
- [ ] Додати delete expense функціональність

### Notes
- GitHub repo: https://github.com/waylooking-hub/group-expense-tracker
- Supabase project: evinhptfhtngedawyumz
- Vercel деплоїться автоматично при push в main через GitHub Actions
- `git subtree push --prefix=group-expense-tracker github main` для синхронізації з GitHub
