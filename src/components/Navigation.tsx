'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useI18n } from '@/lib/i18n-context';
import type { TranslationKey } from '@/lib/i18n';

const NAV_ITEMS: { href: string; labelKey: TranslationKey; icon: string }[] = [
  { href: '/dashboard', labelKey: 'nav.dashboard', icon: '📊' },
  { href: '/expenses/new', labelKey: 'nav.add', icon: '➕' },
  { href: '/expenses', labelKey: 'nav.history', icon: '📋' },
];

export default function Navigation() {
  const pathname = usePathname();
  const { t } = useI18n();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
        {NAV_ITEMS.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-1 px-4 py-2 text-xs font-medium transition-colors ${
              pathname === item.href
                ? 'text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span>{t(item.labelKey)}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
