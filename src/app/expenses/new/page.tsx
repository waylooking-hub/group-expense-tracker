'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
import CurrencySelector from '@/components/CurrencySelector';
import type { Member } from '@/types';

export default function NewExpensePage() {
  const router = useRouter();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('PLN');
  const [description, setDescription] = useState('');
  const [paidBy, setPaidBy] = useState('');
  const [receipt, setReceipt] = useState<File | null>(null);

  useEffect(() => {
    const groupId = localStorage.getItem('groupId');
    if (!groupId) {
      router.push('/');
      return;
    }
    setCurrency(localStorage.getItem('defaultCurrency') ?? 'PLN');
    const memberId = localStorage.getItem('memberId');

    fetch(`/api/members?groupId=${groupId}`)
      .then(res => res.json())
      .then(data => {
        setMembers(data);
        setPaidBy(memberId ?? data[0]?.id ?? '');
      })
      .finally(() => setLoading(false));
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    const groupId = localStorage.getItem('groupId');
    if (!groupId) return;

    const formData = new FormData();
    formData.append('group_id', groupId);
    formData.append('paid_by', paidBy);
    formData.append('amount', amount);
    formData.append('currency', currency);
    formData.append('description', description);
    if (receipt) {
      formData.append('receipt', receipt);
    }

    try {
      const res = await fetch('/api/expenses', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        router.push('/dashboard');
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to add expense');
      }
    } catch {
      setError('Connection error');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-lg mx-auto">
          <h1 className="text-xl font-bold text-gray-900">Add Expense</h1>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6">
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 space-y-4">
          {/* Amount + Currency */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
            <div className="flex gap-2">
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="0.00"
                className="flex-1 rounded-lg border border-gray-300 px-4 py-3 text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
                required
              />
              <CurrencySelector value={currency} onChange={setCurrency} />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <input
              type="text"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Dinner, taxi, groceries..."
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Paid By */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Paid by</label>
            <select
              value={paidBy}
              onChange={e => setPaidBy(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              {members.map(m => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>

          {/* Receipt */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Receipt photo (optional)
            </label>
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={e => setReceipt(e.target.files?.[0] ?? null)}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 file:font-medium hover:file:bg-blue-100"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={submitting || !amount || !description || !paidBy}
            className="w-full bg-blue-600 text-white rounded-lg py-3 font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {submitting ? 'Adding...' : 'Add Expense'}
          </button>
        </form>
      </main>

      <Navigation />
    </div>
  );
}
