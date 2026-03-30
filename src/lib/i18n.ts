export type Lang = 'uk' | 'en' | 'pl';

const t = {
  // App
  appTitle: { uk: 'Витрати подорожі', en: 'Trip Expenses', pl: 'Wydatki podróży' },
  appSubtitle: { uk: 'Спільний облік витрат', en: 'Track group spending together', pl: 'Wspólne śledzenie wydatków' },

  // Auth / PIN
  enterPin: { uk: 'Введіть PIN групи', en: 'Enter group PIN', pl: 'Wprowadź PIN grupy' },
  invalidPin: { uk: 'Невірний PIN', en: 'Invalid PIN', pl: 'Nieprawidłowy PIN' },
  joinGroup: { uk: 'Увійти в групу', en: 'Join Group', pl: 'Dołącz do grupy' },
  checking: { uk: 'Перевірка...', en: 'Checking...', pl: 'Sprawdzanie...' },
  createNewGroup: { uk: 'Створити нову групу', en: 'Create new group', pl: 'Utwórz nową grupę' },
  joinExisting: { uk: 'Увійти в існуючу групу', en: 'Join existing group', pl: 'Dołącz do istniejącej grupy' },

  // Create group
  createGroup: { uk: 'Створити групу', en: 'Create Group', pl: 'Utwórz grupę' },
  groupName: { uk: 'Назва групи', en: 'Group name', pl: 'Nazwa grupy' },
  pinCode: { uk: 'PIN-код (мін. 4 символи)', en: 'PIN code (min 4 chars)', pl: 'Kod PIN (min 4 znaki)' },
  defaultCurrency: { uk: 'Валюта за замовчуванням', en: 'Default currency', pl: 'Domyślna waluta' },
  creating: { uk: 'Створення...', en: 'Creating...', pl: 'Tworzenie...' },

  // Select member
  whoAreYou: { uk: 'Хто ви?', en: 'Who are you?', pl: 'Kim jesteś?' },
  yourName: { uk: "Ваше ім'я", en: 'Your name', pl: 'Twoje imię' },
  join: { uk: 'Увійти', en: 'Join', pl: 'Dołącz' },

  // Dashboard
  totalSpent: { uk: 'Загальні витрати', en: 'Total Spent', pl: 'Łączne wydatki' },
  noExpensesYet: { uk: 'Ще немає витрат', en: 'No expenses yet', pl: 'Brak wydatków' },
  expenses: { uk: 'витрат', en: 'expenses', pl: 'wydatków' },
  expense: { uk: 'витрата', en: 'expense', pl: 'wydatek' },
  members: { uk: 'учасників', en: 'members', pl: 'członków' },
  member: { uk: 'учасник', en: 'member', pl: 'członek' },
  breakdown: { uk: 'Деталі', en: 'Breakdown', pl: 'Podział' },
  paid: { uk: 'Заплатив', en: 'Paid', pl: 'Zapłacił' },
  share: { uk: 'Частка', en: 'Share', pl: 'Udział' },
  settlements: { uk: 'Розрахунки', en: 'Settlements', pl: 'Rozliczenia' },
  allSettled: { uk: 'Все розраховано!', en: 'All settled up!', pl: 'Wszystko rozliczone!' },
  leave: { uk: 'Вийти', en: 'Leave', pl: 'Wyjdź' },

  // Add expense
  addExpense: { uk: 'Додати витрату', en: 'Add Expense', pl: 'Dodaj wydatek' },
  amount: { uk: 'Сума', en: 'Amount', pl: 'Kwota' },
  description: { uk: 'Опис', en: 'Description', pl: 'Opis' },
  descriptionPlaceholder: { uk: 'Вечеря, таксі, продукти...', en: 'Dinner, taxi, groceries...', pl: 'Kolacja, taxi, zakupy...' },
  paidBy: { uk: 'Хто заплатив', en: 'Paid by', pl: 'Zapłacił' },
  splitAmong: { uk: 'Розділити між', en: 'Split among', pl: 'Podziel między' },
  everyone: { uk: 'Усіма', en: 'Everyone', pl: 'Wszystkimi' },
  selectPeople: { uk: 'Обрати людей', en: 'Select people', pl: 'Wybierz osoby' },
  perPerson: { uk: 'на людину', en: 'per person', pl: 'na osobę' },
  selectAtLeastOne: { uk: 'Оберіть хоча б одну людину', en: 'Select at least one person', pl: 'Wybierz co najmniej jedną osobę' },
  receiptPhoto: { uk: 'Фото чеку (необов\'язково)', en: 'Receipt photo (optional)', pl: 'Zdjęcie paragonu (opcjonalne)' },
  adding: { uk: 'Додавання...', en: 'Adding...', pl: 'Dodawanie...' },

  // Edit expense
  editExpense: { uk: 'Редагувати витрату', en: 'Edit Expense', pl: 'Edytuj wydatek' },
  saving: { uk: 'Збереження...', en: 'Saving...', pl: 'Zapisywanie...' },
  save: { uk: 'Зберегти', en: 'Save', pl: 'Zapisz' },
  cancel: { uk: 'Скасувати', en: 'Cancel', pl: 'Anuluj' },
  delete: { uk: 'Видалити', en: 'Delete', pl: 'Usuń' },
  deleteConfirm: { uk: 'Точно видалити цю витрату?', en: 'Delete this expense?', pl: 'Usunąć ten wydatek?' },

  // Expense card
  forMembers: { uk: 'За', en: 'For', pl: 'Za' },
  each: { uk: 'кожному', en: 'each', pl: 'każdy' },
  viewReceipt: { uk: 'Переглянути чек', en: 'View receipt', pl: 'Zobacz paragon' },
  edit: { uk: 'Редагувати', en: 'Edit', pl: 'Edytuj' },

  // Nav
  navDashboard: { uk: 'Головна', en: 'Dashboard', pl: 'Panel' },
  navAdd: { uk: 'Додати', en: 'Add', pl: 'Dodaj' },
  navHistory: { uk: 'Історія', en: 'History', pl: 'Historia' },

  // Expenses list
  allExpenses: { uk: 'Усі витрати', en: 'All Expenses', pl: 'Wszystkie wydatki' },
  addFirstExpense: { uk: 'Додати першу витрату', en: 'Add first expense', pl: 'Dodaj pierwszy wydatek' },

  // Common
  loading: { uk: 'Завантаження...', en: 'Loading...', pl: 'Ładowanie...' },
  connectionError: { uk: 'Помилка з\'єднання', en: 'Connection error', pl: 'Błąd połączenia' },
  failedCreate: { uk: 'Не вдалося створити', en: 'Failed to create', pl: 'Nie udało się utworzyć' },
} as const;

export type TKey = keyof typeof t;

export function translate(key: TKey, lang: Lang): string {
  return t[key][lang];
}

export function getLang(): Lang {
  if (typeof window === 'undefined') return 'uk';
  return (localStorage.getItem('lang') as Lang) || 'uk';
}

export function setLang(lang: Lang) {
  localStorage.setItem('lang', lang);
}
