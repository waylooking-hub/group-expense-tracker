'use client';

import { useState, useCallback, useEffect } from 'react';
import { type Lang, type TKey, translate, getLang, setLang as persistLang } from './i18n';

export function useI18n() {
  const [lang, setLangState] = useState<Lang>('uk');

  useEffect(() => {
    setLangState(getLang());
  }, []);

  const setLang = useCallback((l: Lang) => {
    persistLang(l);
    setLangState(l);
  }, []);

  const t = useCallback((key: TKey) => translate(key, lang), [lang]);

  return { lang, setLang, t };
}
