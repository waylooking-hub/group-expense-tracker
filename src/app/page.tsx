'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Member } from '@/types';
import CurrencySelector from '@/components/CurrencySelector';

type Step = 'pin' | 'select-member' | 'create-group';

export default function HomePage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('pin');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [members, setMembers] = useState<Member[]>([]);
  const [groupId, setGroupId] = useState('');
  const [newName, setNewName] = useState('');

  // Create group state
  const [groupName, setGroupName] = useState('');
  const [newPin, setNewPin] = useState('');
  const [currency, setCurrency] = useState('PLN');

  async function handleVerifyPin(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/group/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin }),
      });

      if (!res.ok) {
        setError('Invalid PIN');
        return;
      }

      const data = await res.json();
      setGroupId(data.group.id);
      localStorage.setItem('groupId', data.group.id);
      localStorage.setItem('groupName', data.group.name);
      localStorage.setItem('defaultCurrency', data.group.default_currency);
      setMembers(data.members);
      setStep('select-member');
    } catch {
      setError('Connection error');
    } finally {
      setLoading(false);
    }
  }

  async function handleSelectMember(member: Member) {
    localStorage.setItem('memberId', member.id);
    localStorage.setItem('memberName', member.name);
    router.push('/dashboard');
  }

  async function handleCreateMember(e: React.FormEvent) {
    e.preventDefault();
    if (!newName.trim()) return;
    setLoading(true);

    try {
      const res = await fetch('/api/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ group_id: groupId, name: newName.trim() }),
      });

      if (res.ok) {
        const member = await res.json();
        handleSelectMember(member);
      }
    } catch {
      setError('Failed to create member');
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateGroup(e: React.FormEvent) {
    e.preventDefault();
    if (!groupName.trim() || !newPin) return;
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/group/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: groupName.trim(),
          pin: newPin,
          default_currency: currency,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to create group');
        return;
      }

      const data = await res.json();
      setGroupId(data.group.id);
      localStorage.setItem('groupId', data.group.id);
      localStorage.setItem('groupName', data.group.name);
      localStorage.setItem('defaultCurrency', data.group.default_currency);
      setMembers([]);
      setStep('select-member');
    } catch {
      setError('Connection error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Trip Expenses</h1>
          <p className="text-gray-500 mt-2">Track group spending together</p>
        </div>

        {step === 'pin' && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <form onSubmit={handleVerifyPin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Enter group PIN
                </label>
                <input
                  type="password"
                  value={pin}
                  onChange={e => setPin(e.target.value)}
                  placeholder="****"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-center text-2xl tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
              </div>
              {error && <p className="text-red-500 text-sm text-center">{error}</p>}
              <button
                type="submit"
                disabled={loading || !pin}
                className="w-full bg-blue-600 text-white rounded-lg py-3 font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {loading ? 'Checking...' : 'Join Group'}
              </button>
            </form>
            <div className="mt-4 text-center">
              <button
                onClick={() => setStep('create-group')}
                className="text-sm text-blue-600 hover:underline"
              >
                Create new group
              </button>
            </div>
          </div>
        )}

        {step === 'create-group' && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Create Group</h2>
            <form onSubmit={handleCreateGroup} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Group name
                </label>
                <input
                  type="text"
                  value={groupName}
                  onChange={e => setGroupName(e.target.value)}
                  placeholder="Summer Trip 2026"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  PIN code (min 4 chars)
                </label>
                <input
                  type="password"
                  value={newPin}
                  onChange={e => setNewPin(e.target.value)}
                  placeholder="****"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-center text-2xl tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Default currency
                </label>
                <CurrencySelector value={currency} onChange={setCurrency} className="w-full" />
              </div>
              {error && <p className="text-red-500 text-sm text-center">{error}</p>}
              <button
                type="submit"
                disabled={loading || !groupName.trim() || newPin.length < 4}
                className="w-full bg-blue-600 text-white rounded-lg py-3 font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {loading ? 'Creating...' : 'Create Group'}
              </button>
            </form>
            <div className="mt-4 text-center">
              <button
                onClick={() => { setStep('pin'); setError(''); }}
                className="text-sm text-blue-600 hover:underline"
              >
                Join existing group
              </button>
            </div>
          </div>
        )}

        {step === 'select-member' && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Who are you?</h2>

            {members.length > 0 && (
              <div className="space-y-2 mb-6">
                {members.map(member => (
                  <button
                    key={member.id}
                    onClick={() => handleSelectMember(member)}
                    className="w-full text-left rounded-lg border border-gray-200 px-4 py-3 hover:bg-blue-50 hover:border-blue-300 transition-colors font-medium"
                  >
                    {member.name}
                  </button>
                ))}
              </div>
            )}

            <form onSubmit={handleCreateMember} className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  placeholder="Your name"
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  disabled={loading || !newName.trim()}
                  className="bg-blue-600 text-white rounded-lg px-4 py-3 font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  Join
                </button>
              </div>
            </form>
            {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}
          </div>
        )}
      </div>
    </div>
  );
}
