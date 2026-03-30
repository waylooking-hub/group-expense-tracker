'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
import ExpenseCard from '@/components/ExpenseCard';
import type { ExpenseWithMember, Member } from '@/types';

export default function ExpensesPage() {
  const router = useRouter();
  const [expenses, setExpenses] = useState<ExpenseWithMember[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const groupId = localStorage.getItem('groupId');
    if (!groupId) {
      router.push('/');
      return;
    }

    Promise.all([
      fetch(`/api/expenses?groupId=${groupId}`).then(r => r.json()),
      fetch(`/api/members?groupId=${groupId}`).then(r => r.json()),
    ])
      .then(([expData, memData]) => {
        setExpenses(expData);
        setMembers(memData);
      })
      .finally(() => setLoading(false));
  }, [router]);

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
          <h1 className="text-xl font-bold text-gray-900">All Expenses</h1>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6">
        {expenses.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No expenses yet</p>
            <button
              onClick={() => router.push('/expenses/new')}
              className="mt-4 text-blue-600 font-medium hover:underline"
            >
              Add first expense
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {expenses.map(expense => (
              <ExpenseCard key={expense.id} expense={expense} members={members} />
            ))}
          </div>
        )}
      </main>

      <Navigation />
    </div>
  );
}
