'use client';

import { useI18n } from '@/lib/i18n-context';
import { LANGUAGES, LANG_LABELS } from '@/lib/i18n';

export default function LangSwitcher() {
  const { lang, setLang } = useI18n();

  return (
    <div className="flex gap-1">
      {LANGUAGES.map(l => (
        <button
          key={l}
          onClick={() => setLang(l)}
          className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
            lang === l
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
          }`}
        >
          {LANG_LABELS[l]}
        </button>
      ))}
    </div>
  );
}
