'use client';

import { useState } from 'react';
import { CURRENCIES } from '@/lib/currencies';

interface CurrencySelectorProps {
  value: string;
  onChange: (currency: string) => void;
  className?: string;
  otherLabel?: string;
}

export default function CurrencySelector({ value, onChange, className = '', otherLabel = 'Other...' }: CurrencySelectorProps) {
  const isCustom = value !== '' && !CURRENCIES.some(c => c.code === value);
  const [showCustom, setShowCustom] = useState(isCustom);

  if (showCustom) {
    return (
      <div className={`flex gap-1 ${className}`}>
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value.toUpperCase())}
          placeholder="GBP"
          maxLength={4}
          className="w-20 rounded-lg border border-gray-300 px-2 py-2 text-sm text-center uppercase focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="button"
          onClick={() => { setShowCustom(false); onChange('PLN'); }}
          className="text-xs text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      </div>
    );
  }

  return (
    <select
      value={value}
      onChange={e => {
        if (e.target.value === '__custom__') {
          setShowCustom(true);
          onChange('');
        } else {
          onChange(e.target.value);
        }
      }}
      className={`rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
    >
      {CURRENCIES.map(c => (
        <option key={c.code} value={c.code}>
          {c.symbol} {c.code}
        </option>
      ))}
      <option value="__custom__">{otherLabel}</option>
    </select>
  );
}
