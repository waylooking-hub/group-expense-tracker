'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
import ExpenseCard from '@/components/ExpenseCard';
import { useI18n } from '@/lib/useI18n';
import type { ExpenseWithMember, Member } from '@/types';

export default function ExpensesPage() {
  const router = useRouter();
  const { t } = useI18n();
  const [expenses, setExpenses] = useState<ExpenseWithMember[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentMemberId, setCurrentMemberId] = useState('');

  useEffect(() => {
    const groupId = localStorage.getItem('groupId');
    if (!groupId) {
      router.push('/');
      return;
    }
    setCurrentMemberId(localStorage.getItem('memberId') ?? '');

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

  function handleUpdate(updated: ExpenseWithMember) {
    setExpenses(prev => prev.map(e => e.id === updated.id ? updated : e));
  }

  function handleDelete(id: string) {
    setExpenses(prev => prev.filter(e => e.id !== id));
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">{t('loading')}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-lg mx-auto">
          <h1 className="text-xl font-bold text-gray-900">{t('allExpenses')}</h1>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6">
        {expenses.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">{t('noExpensesYet')}</p>
            <button
              onClick={() => router.push('/expenses/new')}
              className="mt-4 text-blue-600 font-medium hover:underline"
            >
              {t('addFirstExpense')}
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {expenses.map(expense => (
              <ExpenseCard
                key={expense.id}
                expense={expense}
                members={members}
                currentMemberId={currentMemberId}
                t={t}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </main>

      <Navigation />
    </div>
  );
}
