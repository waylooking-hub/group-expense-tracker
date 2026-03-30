'use client';

import { useState } from 'react';
import { formatAmount } from '@/lib/currencies';
import CurrencySelector from './CurrencySelector';
import type { ExpenseWithMember, Member } from '@/types';
import type { TKey } from '@/lib/i18n';

interface ExpenseCardProps {
  expense: ExpenseWithMember;
  members: Member[];
  currentMemberId: string;
  t: (key: TKey) => string;
  onUpdate?: (updated: ExpenseWithMember) => void;
  onDelete?: (id: string) => void;
}

export default function ExpenseCard({ expense, members, currentMemberId, t, onUpdate, onDelete }: ExpenseCardProps) {
  const [editing, setEditing] = useState(false);
  const [amount, setAmount] = useState(String(expense.amount));
  const [currency, setCurrency] = useState(expense.currency);
  const [description, setDescription] = useState(expense.description);
  const [paidBy, setPaidBy] = useState(expense.paid_by);
  const [splitMode, setSplitMode] = useState<'all' | 'custom'>(
    expense.split_between && expense.split_between.length > 0 ? 'custom' : 'all'
  );
  const [selectedMembers, setSelectedMembers] = useState<Set<string>>(
    new Set(expense.split_between ?? [])
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const isOwner = expense.paid_by === currentMemberId;

  const date = new Date(expense.created_at).toLocaleDateString('uk-UA', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });

  const splitNames = expense.split_between && expense.split_between.length > 0
    ? expense.split_between
        .map(id => members.find(m => m.id === id)?.name)
        .filter(Boolean)
        .join(', ')
    : null;

  const splitCount = expense.split_between?.length || members.length;

  function toggleMember(id: string) {
    setSelectedMembers(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function handleSave() {
    setError('');
    if (splitMode === 'custom' && selectedMembers.size === 0) {
      setError(t('selectAtLeastOne'));
      return;
    }
    setSaving(true);
    try {
      const res = await fetch('/api/expenses', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: expense.id,
          member_id: currentMemberId,
          paid_by: paidBy,
          amount: parseFloat(amount),
          currency,
          description,
          split_between: splitMode === 'custom' ? [...selectedMembers] : null,
        }),
      });
      if (res.ok) {
        const updated = await res.json();
        onUpdate?.(updated);
        setEditing(false);
      } else {
        const data = await res.json();
        setError(data.error || 'Error');
      }
    } catch {
      setError(t('connectionError'));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm(t('deleteConfirm'))) return;
    try {
      const res = await fetch('/api/expenses', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: expense.id, member_id: currentMemberId }),
      });
      if (res.ok) {
        onDelete?.(expense.id);
      }
    } catch {
      // ignore
    }
  }

  if (editing) {
    return (
      <div className="bg-white rounded-xl border-2 border-blue-300 p-4 shadow-sm space-y-3">
        <div className="flex gap-2">
          <input
            type="number"
            step="0.01"
            min="0.01"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <CurrencySelector value={currency} onChange={setCurrency} />
        </div>
        <input
          type="text"
          value={description}
          onChange={e => setDescription(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={paidBy}
          onChange={e => setPaidBy(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {members.map(m => (
            <option key={m.id} value={m.id}>{m.name}</option>
          ))}
        </select>

        {/* Split among */}
        <div>
          <div className="flex gap-2 mb-2">
            <button
              type="button"
              onClick={() => setSplitMode('all')}
              className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-medium border transition-colors ${
                splitMode === 'all'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300'
              }`}
            >
              {t('everyone')}
            </button>
            <button
              type="button"
              onClick={() => setSplitMode('custom')}
              className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-medium border transition-colors ${
                splitMode === 'custom'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300'
              }`}
            >
              {t('selectPeople')}
            </button>
          </div>
          {splitMode === 'custom' && (
            <div className="space-y-1">
              {members.map(m => (
                <label key={m.id} className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer text-sm ${
                  selectedMembers.has(m.id) ? 'bg-blue-50 border-blue-300' : 'border-gray-200'
                }`}>
                  <input
                    type="checkbox"
                    checked={selectedMembers.has(m.id)}
                    onChange={() => toggleMember(m.id)}
                    className="w-4 h-4 rounded text-blue-600"
                  />
                  {m.name}
                </label>
              ))}
            </div>
          )}
        </div>

        {error && <p className="text-red-500 text-xs">{error}</p>}

        <div className="flex gap-2">
          <button
            onClick={handleSave}
            disabled={saving || !amount || !description}
            className="flex-1 bg-blue-600 text-white rounded-lg py-2 text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? t('saving') : t('save')}
          </button>
          <button
            onClick={() => setEditing(false)}
            className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            {t('cancel')}
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 text-sm text-red-600 border border-red-300 rounded-lg hover:bg-red-50"
          >
            {t('delete')}
          </button>
        </div>
      </div>
    );
  }

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
              {t('forMembers')}: {splitNames}
            </p>
          )}
        </div>
        <div className="text-right ml-3">
          <p className="font-bold text-lg text-gray-900">
            {formatAmount(expense.amount, expense.currency)}
          </p>
          {splitNames && (
            <p className="text-xs text-gray-400">
              {formatAmount(expense.amount / splitCount, expense.currency)} {t('each')}
            </p>
          )}
        </div>
      </div>
      <div className="flex items-center justify-between mt-2">
        <div>
          {expense.receipt_url && (
            <a
              href={expense.receipt_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:underline"
            >
              {t('viewReceipt')}
            </a>
          )}
        </div>
        {isOwner && (
          <button
            onClick={() => setEditing(true)}
            className="text-xs text-gray-500 hover:text-blue-600 font-medium"
          >
            {t('edit')}
          </button>
        )}
      </div>
    </div>
  );
}
