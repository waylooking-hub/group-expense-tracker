'use client';

import { formatAmount } from '@/lib/currencies';
import { useI18n } from '@/lib/i18n-context';
import type { ExpenseWithMember } from '@/types';

interface ExpenseCardProps {
  expense: ExpenseWithMember;
}

export default function ExpenseCard({ expense }: ExpenseCardProps) {
  const { t, lang } = useI18n();
  const locale = lang === 'pl' ? 'pl-PL' : 'en-GB';

  const date = new Date(expense.created_at).toLocaleDateString(locale, {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
      <div className="flex justify-between items-start">
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 truncate">{expense.description}</p>
          <p className="text-sm text-gray-500 mt-1">
            {expense.member?.name ?? t('expenses.unknown')} &middot; {date}
          </p>
        </div>
        <div className="text-right ml-3">
          <p className="font-bold text-lg text-gray-900">
            {formatAmount(expense.amount, expense.currency)}
          </p>
        </div>
      </div>
      {expense.receipt_url && (
        <a
          href={expense.receipt_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-2 text-sm text-blue-600 hover:underline"
        >
          {t('expenses.viewReceipt')}
        </a>
      )}
    </div>
  );
}
