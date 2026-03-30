'use client';

import type { Lang } from '@/lib/i18n';

const LANGS: { code: Lang; label: string }[] = [
  { code: 'uk', label: 'UA' },
  { code: 'en', label: 'EN' },
  { code: 'pl', label: 'PL' },
];

interface LangSwitcherProps {
  lang: Lang;
  onChange: (lang: Lang) => void;
}

export default function LangSwitcher({ lang, onChange }: LangSwitcherProps) {
  return (
    <div className="flex gap-1">
      {LANGS.map(l => (
        <button
          key={l.code}
          onClick={() => onChange(l.code)}
          className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
            lang === l.code
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}
