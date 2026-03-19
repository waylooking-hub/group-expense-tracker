'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
import SettlementList from '@/components/SettlementList';
import { calculateBalances, calculateSettlements } from '@/lib/settlements';
import { formatAmount } from '@/lib/currencies';
import type { Expense, Member, Settlement, MemberBalance } from '@/types';

export default function DashboardPage() {
  const router = useRouter();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [settlements, setSettlements] = useState<Settlement[]>([]);
  const [balances, setBalances] = useState<Record<string, MemberBalance[]>>({});
  const [loading, setLoading] = useState(true);
  const [groupName, setGroupName] = useState('');

  useEffect(() => {
    const groupId = localStorage.getItem('groupId');
    if (!groupId) {
      router.push('/');
      return;
    }
    setGroupName(localStorage.getItem('groupName') ?? 'Trip');
    loadData(groupId);
  }, [router]);

  async function loadData(groupId: string) {
    try {
      const [expRes, memRes] = await Promise.all([
        fetch(`/api/expenses?groupId=${groupId}`),
        fetch(`/api/members?groupId=${groupId}`),
      ]);

      const expData = await expRes.json();
      const memData = await memRes.json();

      setExpenses(expData);
      setMembers(memData);

      const s = calculateSettlements(expData, memData);
      setSettlements(s);

      const currencies = [...new Set(expData.map((e: Expense) => e.currency))] as string[];
      const b: Record<string, MemberBalance[]> = {};
      for (const c of currencies) {
        b[c] = calculateBalances(expData, memData, c);
      }
      setBalances(b);
    } catch (err) {
      console.error('Failed to load data:', err);
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    localStorage.clear();
    router.push('/');
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  const totalsByCurrency: Record<string, number> = {};
  for (const e of expenses) {
    totalsByCurrency[e.currency] = (totalsByCurrency[e.currency] ?? 0) + e.amount;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">{groupName}</h1>
          <button onClick={handleLogout} className="text-sm text-gray-500 hover:text-gray-700">
            Leave
          </button>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Total Spent */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
          <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
            Total Spent
          </h2>
          {Object.keys(totalsByCurrency).length === 0 ? (
            <p className="text-gray-400">No expenses yet</p>
          ) : (
            <div className="space-y-1">
              {Object.entries(totalsByCurrency).map(([currency, total]) => (
                <p key={currency} className="text-2xl font-bold text-gray-900">
                  {formatAmount(total, currency)}
                </p>
              ))}
            </div>
          )}
          <p className="text-sm text-gray-500 mt-2">
            {expenses.length} expense{expenses.length !== 1 ? 's' : ''} &middot; {members.length} member{members.length !== 1 ? 's' : ''}
          </p>
        </section>

        {/* Per-Person Breakdown */}
        {Object.entries(balances).map(([currency, currencyBalances]) => (
          <section key={currency} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
            <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
              Breakdown ({currency})
            </h2>
            <div className="space-y-3">
              {currencyBalances.map(b => (
                <div key={b.member.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{b.member.name}</p>
                    <p className="text-xs text-gray-500">
                      Paid {formatAmount(b.totalPaid, currency)} / Share {formatAmount(b.fairShare, currency)}
                    </p>
                  </div>
                  <span
                    className={`font-bold text-sm ${
                      b.balance > 0.01
                        ? 'text-green-600'
                        : b.balance < -0.01
                          ? 'text-red-600'
                          : 'text-gray-400'
                    }`}
                  >
                    {b.balance > 0 ? '+' : ''}
                    {formatAmount(b.balance, currency)}
                  </span>
                </div>
              ))}
            </div>
          </section>
        ))}

        {/* Settlements */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
          <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
            Settlements
          </h2>
          <SettlementList settlements={settlements} />
        </section>
      </main>

      <Navigation />
    </div>
  );
}
