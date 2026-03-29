'use client';

import { formatAmount } from '@/lib/currencies';
import { useI18n } from '@/lib/i18n-context';
import type { Settlement } from '@/types';

interface SettlementListProps {
  settlements: Settlement[];
}

export default function SettlementList({ settlements }: SettlementListProps) {
  const { t } = useI18n();

  if (settlements.length === 0) {
    return (
      <p className="text-gray-500 text-sm text-center py-4">
        {t('dashboard.allSettled')}
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {settlements.map((s, i) => (
        <div
          key={i}
          className="flex items-center justify-between bg-amber-50 rounded-lg px-4 py-3 border border-amber-200"
        >
          <div className="text-sm">
            <span className="font-semibold text-gray-900">{s.from.name}</span>
            <span className="text-gray-500 mx-2">&rarr;</span>
            <span className="font-semibold text-gray-900">{s.to.name}</span>
          </div>
          <span className="font-bold text-amber-700">
            {formatAmount(s.amount, s.currency)}
          </span>
        </div>
      ))}
    </div>
  );
}
