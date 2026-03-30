'use client';

import { formatAmount } from '@/lib/currencies';
import type { ExpenseWithMember, Member } from '@/types';

interface ExpenseCardProps {
  expense: ExpenseWithMember;
  members: Member[];
}

export default function ExpenseCard({ expense, members }: ExpenseCardProps) {
  const date = new Date(expense.created_at).toLocaleDateString('uk-UA', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });

  // Resolve split_between UUIDs to names
  const splitNames = expense.split_between && expense.split_between.length > 0
    ? expense.split_between
        .map(id => members.find(m => m.id === id)?.name)
        .filter(Boolean)
        .join(', ')
    : null;

  const splitCount = expense.split_between?.length || members.length;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
      <div className="flex justify-between items-start">
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 truncate">{expense.description}</p>
          <p className="text-sm text-gray-500 mt-1">
            {expense.member?.name ?? 'Unknown'} &middot; {date}
          </p>
          {splitNames && (
            <p className="text-xs text-blue-600 mt-1">
              For: {splitNames}
            </p>
          )}
        </div>
        <div className="text-right ml-3">
          <p className="font-bold text-lg text-gray-900">
            {formatAmount(expense.amount, expense.currency)}
          </p>
          {splitNames && (
            <p className="text-xs text-gray-400">
              {formatAmount(expense.amount / splitCount, expense.currency)} each
            </p>
          )}
        </div>
      </div>
      {expense.receipt_url && (
        <a
          href={expense.receipt_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-2 text-sm text-blue-600 hover:underline"
        >
          View receipt
        </a>
      )}
    </div>
  );
}
