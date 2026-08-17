'use client';

import React from 'react';
import { Languages } from 'lucide-react';

export default function LanguageToggle({ language, setLanguage }) {
  return (
    <div className="inline-flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 shadow-inner transition-colors">
      <div className="px-2 py-1 text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center space-x-1">
        <Languages className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Language:</span>
      </div>
      <button
        onClick={() => setLanguage('romanUrdu')}
        className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
          language === 'romanUrdu'
            ? 'bg-emerald-600 text-white shadow-sm'
            : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
        }`}
      >
        🇵🇰 Roman Urdu
      </button>
      <button
        onClick={() => setLanguage('english')}
        className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
          language === 'english'
            ? 'bg-emerald-600 text-white shadow-sm'
            : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
        }`}
      >
        🇬🇧 English
      </button>
    </div>
  );
}
