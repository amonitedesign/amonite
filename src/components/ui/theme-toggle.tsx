'use client';

import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

function applyTheme(t: 'dark' | 'light') {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  if (t === 'dark') {
    root.classList.add('dark');
    root.classList.remove('light');
  } else {
    root.classList.remove('dark');
    root.classList.add('light');
  }
  try {
    localStorage.setItem('amonite_theme', t);
  } catch {
    // Ignore restricted localStorage contexts
  }
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('amonite_theme');
      if (saved === 'light' || saved === 'dark') {
        applyTheme(saved);
        return;
      }
    } catch {
      // fallback
    }
    applyTheme('dark');
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    applyTheme(next);
  };

  return (
    <button
      onClick={toggleTheme}
      type="button"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      className="w-8 h-8 rounded-lg border border-zinc-200 dark:border-white/10 bg-zinc-50 hover:bg-zinc-100 dark:bg-white/[0.04] dark:hover:bg-white/[0.08] text-zinc-700 dark:text-zinc-300 transition-colors flex items-center justify-center"
    >
      {theme === 'dark' ? (
        <Sun className="w-4 h-4 text-zinc-300 hover:text-white" />
      ) : (
        <Moon className="w-4 h-4 text-zinc-700 hover:text-black" />
      )}
    </button>
  );
}
