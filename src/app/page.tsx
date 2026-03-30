'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Member } from '@/types';
import CurrencySelector from '@/components/CurrencySelector';
import LangSwitcher from '@/components/LangSwitcher';
import { useI18n } from '@/lib/useI18n';

type Step = 'pin' | 'select-member' | 'create-group';

export default function HomePage() {
  const router = useRouter();
  const { lang, setLang, t } = useI18n();
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
        setError(t('invalidPin'));
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
      setError(t('connectionError'));
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
      setError(t('failedCreate'));
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
        setError(data.error || t('failedCreate'));
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
      setError(t('connectionError'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <LangSwitcher lang={lang} onChange={setLang} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">{t('appTitle')}</h1>
          <p className="text-gray-500 mt-2">{t('appSubtitle')}</p>
        </div>

        {step === 'pin' && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <form onSubmit={handleVerifyPin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('enterPin')}
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
                {loading ? t('checking') : t('joinGroup')}
              </button>
            </form>
            <div className="mt-4 text-center">
              <button
                onClick={() => setStep('create-group')}
                className="text-sm text-blue-600 hover:underline"
              >
                {t('createNewGroup')}
              </button>
            </div>
          </div>
        )}

        {step === 'create-group' && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('createGroup')}</h2>
            <form onSubmit={handleCreateGroup} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('groupName')}
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
                  {t('pinCode')}
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
                  {t('defaultCurrency')}
                </label>
                <CurrencySelector value={currency} onChange={setCurrency} className="w-full" />
              </div>
              {error && <p className="text-red-500 text-sm text-center">{error}</p>}
              <button
                type="submit"
                disabled={loading || !groupName.trim() || newPin.length < 4}
                className="w-full bg-blue-600 text-white rounded-lg py-3 font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {loading ? t('creating') : t('createGroup')}
              </button>
            </form>
            <div className="mt-4 text-center">
              <button
                onClick={() => { setStep('pin'); setError(''); }}
                className="text-sm text-blue-600 hover:underline"
              >
                {t('joinExisting')}
              </button>
            </div>
          </div>
        )}

        {step === 'select-member' && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('whoAreYou')}</h2>

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
                  placeholder={t('yourName')}
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  disabled={loading || !newName.trim()}
                  className="bg-blue-600 text-white rounded-lg px-4 py-3 font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {t('join')}
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
