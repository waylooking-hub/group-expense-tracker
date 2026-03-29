export const LANGUAGES = ['en', 'pl'] as const;
export type Lang = (typeof LANGUAGES)[number];

export const LANG_LABELS: Record<Lang, string> = {
  en: 'EN',
  pl: 'PL',
};

const translations = {
  // Landing page
  'app.title': { en: 'Trip Expenses', pl: 'Wydatki z podróży' },
  'app.subtitle': { en: 'Track group spending together', pl: 'Wspólne śledzenie wydatków' },
  'pin.label': { en: 'Enter group PIN', pl: 'Wpisz PIN grupy' },
  'pin.join': { en: 'Join Group', pl: 'Dołącz do grupy' },
  'pin.checking': { en: 'Checking...', pl: 'Sprawdzam...' },
  'pin.invalid': { en: 'Invalid PIN', pl: 'Nieprawidłowy PIN' },
  'pin.createNew': { en: 'Create new group', pl: 'Utwórz nową grupę' },
  'pin.joinExisting': { en: 'Join existing group', pl: 'Dołącz do istniejącej grupy' },

  // Create group
  'create.title': { en: 'Create Group', pl: 'Utwórz grupę' },
  'create.name': { en: 'Group name', pl: 'Nazwa grupy' },
  'create.namePlaceholder': { en: 'Summer Trip 2026', pl: 'Wakacje 2026' },
  'create.pin': { en: 'PIN code (min 4 chars)', pl: 'Kod PIN (min 4 znaki)' },
  'create.currency': { en: 'Default currency', pl: 'Domyślna waluta' },
  'create.submit': { en: 'Create Group', pl: 'Utwórz grupę' },
  'create.creating': { en: 'Creating...', pl: 'Tworzę...' },

  // Select member
  'member.title': { en: 'Who are you?', pl: 'Kim jesteś?' },
  'member.namePlaceholder': { en: 'Your name', pl: 'Twoje imię' },
  'member.join': { en: 'Join', pl: 'Dołącz' },
  'member.createFailed': { en: 'Failed to create member', pl: 'Nie udało się dodać osoby' },

  // Dashboard
  'dashboard.leave': { en: 'Leave', pl: 'Wyjdź' },
  'dashboard.totalSpent': { en: 'Total Spent', pl: 'Łączne wydatki' },
  'dashboard.noExpenses': { en: 'No expenses yet', pl: 'Brak wydatków' },
  'dashboard.expenseCount': { en: 'expense', pl: 'wydatek' },
  'dashboard.expensesCount': { en: 'expenses', pl: 'wydatki' },
  'dashboard.memberCount': { en: 'member', pl: 'osoba' },
  'dashboard.membersCount': { en: 'members', pl: 'osoby' },
  'dashboard.breakdown': { en: 'Breakdown', pl: 'Podział' },
  'dashboard.paid': { en: 'Paid', pl: 'Zapłacił(a)' },
  'dashboard.share': { en: 'Share', pl: 'Udział' },
  'dashboard.settlements': { en: 'Settlements', pl: 'Rozliczenia' },
  'dashboard.allSettled': { en: 'All settled up!', pl: 'Wszystko rozliczone!' },

  // Expenses list
  'expenses.title': { en: 'All Expenses', pl: 'Wszystkie wydatki' },
  'expenses.addFirst': { en: 'Add first expense', pl: 'Dodaj pierwszy wydatek' },
  'expenses.viewReceipt': { en: 'View receipt', pl: 'Zobacz paragon' },
  'expenses.unknown': { en: 'Unknown', pl: 'Nieznany' },

  // Add expense
  'expense.addTitle': { en: 'Add Expense', pl: 'Dodaj wydatek' },
  'expense.amount': { en: 'Amount', pl: 'Kwota' },
  'expense.description': { en: 'Description', pl: 'Opis' },
  'expense.descPlaceholder': { en: 'Dinner, taxi, groceries...', pl: 'Kolacja, taxi, zakupy...' },
  'expense.paidBy': { en: 'Paid by', pl: 'Zapłacił(a)' },
  'expense.receipt': { en: 'Receipt photo (optional)', pl: 'Zdjęcie paragonu (opcjonalne)' },
  'expense.submit': { en: 'Add Expense', pl: 'Dodaj wydatek' },
  'expense.adding': { en: 'Adding...', pl: 'Dodaję...' },

  // Navigation
  'nav.dashboard': { en: 'Dashboard', pl: 'Podsumowanie' },
  'nav.add': { en: 'Add', pl: 'Dodaj' },
  'nav.history': { en: 'History', pl: 'Historia' },

  // Common
  'error.connection': { en: 'Connection error', pl: 'Błąd połączenia' },
  'loading': { en: 'Loading...', pl: 'Ładowanie...' },
} as const;

export type TranslationKey = keyof typeof translations;

export function t(key: TranslationKey, lang: Lang): string {
  return translations[key][lang];
}
