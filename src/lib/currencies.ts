export interface Currency {
  code: string;
  symbol: string;
}

export const CURRENCIES: Currency[] = [
  { code: 'PLN', symbol: 'zł' },
  { code: 'EUR', symbol: '€' },
  { code: 'USD', symbol: '$' },
  { code: 'UAH', symbol: '₴' },
];

export function getCurrencySymbol(code: string): string {
  return CURRENCIES.find(c => c.code === code)?.symbol ?? code;
}

export function formatAmount(amount: number, currency: string): string {
  const symbol = getCurrencySymbol(currency);
  return `${amount.toFixed(2)} ${symbol}`;
}
