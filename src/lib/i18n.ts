export const LANGUAGES = ['en', 'pl', 'uk'] as const;
export type Lang = (typeof LANGUAGES)[number];

export const LANG_LABELS: Record<Lang, string> = {
  en: 'EN',
  pl: 'PL',
  uk: 'UA',
};

const translations = {
  // Landing page
  'app.title': { en: 'Trip Expenses', pl: 'Wydatki z podróży', uk: 'Витрати подорожі' },
  'app.subtitle': { en: 'Track group spending together', pl: 'Wspólne śledzenie wydatków', uk: 'Спільний облік витрат' },
  'pin.label': { en: 'Enter group PIN', pl: 'Wpisz PIN grupy', uk: 'Введіть PIN групи' },
  'pin.join': { en: 'Join Group', pl: 'Dołącz do grupy', uk: 'Приєднатись' },
  'pin.checking': { en: 'Checking...', pl: 'Sprawdzam...', uk: 'Перевіряю...' },
  'pin.invalid': { en: 'Invalid PIN', pl: 'Nieprawidłowy PIN', uk: 'Невірний PIN' },
  'pin.createNew': { en: 'Create new group', pl: 'Utwórz nową grupę', uk: 'Створити нову групу' },
  'pin.joinExisting': { en: 'Join existing group', pl: 'Dołącz do istniejącej grupy', uk: 'Приєднатись до групи' },

  // Create group
  'create.title': { en: 'Create Group', pl: 'Utwórz grupę', uk: 'Створити групу' },
  'create.name': { en: 'Group name', pl: 'Nazwa grupy', uk: 'Назва групи' },
  'create.namePlaceholder': { en: 'Summer Trip 2026', pl: 'Wakacje 2026', uk: 'Літня подорож 2026' },
  'create.pin': { en: 'PIN code (min 4 chars)', pl: 'Kod PIN (min 4 znaki)', uk: 'PIN-код (мін 4 символи)' },
  'create.currency': { en: 'Default currency', pl: 'Domyślna waluta', uk: 'Валюта за замовчуванням' },
  'create.submit': { en: 'Create Group', pl: 'Utwórz grupę', uk: 'Створити групу' },
  'create.creating': { en: 'Creating...', pl: 'Tworzę...', uk: 'Створюю...' },

  // Select member
  'member.title': { en: 'Who are you?', pl: 'Kim jesteś?', uk: 'Хто ти?' },
  'member.namePlaceholder': { en: 'Your name', pl: 'Twoje imię', uk: 'Твоє ім\'я' },
  'member.join': { en: 'Join', pl: 'Dołącz', uk: 'Увійти' },
  'member.createFailed': { en: 'Failed to create member', pl: 'Nie udało się dodać osoby', uk: 'Не вдалось додати учасника' },

  // Dashboard
  'dashboard.leave': { en: 'Leave', pl: 'Wyjdź', uk: 'Вийти' },
  'dashboard.totalSpent': { en: 'Total Spent', pl: 'Łączne wydatki', uk: 'Загальні витрати' },
  'dashboard.noExpenses': { en: 'No expenses yet', pl: 'Brak wydatków', uk: 'Витрат ще немає' },
  'dashboard.expenseCount': { en: 'expense', pl: 'wydatek', uk: 'витрата' },
  'dashboard.expensesCount': { en: 'expenses', pl: 'wydatki', uk: 'витрат' },
  'dashboard.memberCount': { en: 'member', pl: 'osoba', uk: 'учасник' },
  'dashboard.membersCount': { en: 'members', pl: 'osoby', uk: 'учасників' },
  'dashboard.breakdown': { en: 'Breakdown', pl: 'Podział', uk: 'Розбивка' },
  'dashboard.paid': { en: 'Paid', pl: 'Zapłacił(a)', uk: 'Сплатив(ла)' },
  'dashboard.share': { en: 'Share', pl: 'Udział', uk: 'Частка' },
  'dashboard.settlements': { en: 'Settlements', pl: 'Rozliczenia', uk: 'Розрахунки' },
  'dashboard.allSettled': { en: 'All settled up!', pl: 'Wszystko rozliczone!', uk: 'Все розраховано!' },

  // Expenses list
  'expenses.title': { en: 'All Expenses', pl: 'Wszystkie wydatki', uk: 'Усі витрати' },
  'expenses.addFirst': { en: 'Add first expense', pl: 'Dodaj pierwszy wydatek', uk: 'Додати першу витрату' },
  'expenses.viewReceipt': { en: 'View receipt', pl: 'Zobacz paragon', uk: 'Переглянути чек' },
  'expenses.unknown': { en: 'Unknown', pl: 'Nieznany', uk: 'Невідомий' },

  // Add expense
  'expense.addTitle': { en: 'Add Expense', pl: 'Dodaj wydatek', uk: 'Додати витрату' },
  'expense.amount': { en: 'Amount', pl: 'Kwota', uk: 'Сума' },
  'expense.description': { en: 'Description', pl: 'Opis', uk: 'Опис' },
  'expense.descPlaceholder': { en: 'Dinner, taxi, groceries...', pl: 'Kolacja, taxi, zakupy...', uk: 'Вечеря, таксі, продукти...' },
  'expense.paidBy': { en: 'Paid by', pl: 'Zapłacił(a)', uk: 'Сплатив(ла)' },
  'expense.receipt': { en: 'Receipt photo (optional)', pl: 'Zdjęcie paragonu (opcjonalne)', uk: 'Фото чеку (необов\'язково)' },
  'expense.submit': { en: 'Add Expense', pl: 'Dodaj wydatek', uk: 'Додати витрату' },
  'expense.adding': { en: 'Adding...', pl: 'Dodaję...', uk: 'Додаю...' },

  // Navigation
  'nav.dashboard': { en: 'Dashboard', pl: 'Podsumowanie', uk: 'Головна' },
  'nav.add': { en: 'Add', pl: 'Dodaj', uk: 'Додати' },
  'nav.history': { en: 'History', pl: 'Historia', uk: 'Історія' },

  // Common
  'error.connection': { en: 'Connection error', pl: 'Błąd połączenia', uk: 'Помилка з\'єднання' },
  'loading': { en: 'Loading...', pl: 'Ładowanie...', uk: 'Завантаження...' },
} as const;

export type TranslationKey = keyof typeof translations;

export function t(key: TranslationKey, lang: Lang): string {
  return translations[key][lang];
}
