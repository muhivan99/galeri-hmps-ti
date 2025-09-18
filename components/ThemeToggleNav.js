'use client';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function ThemeToggleNav({ compact = false }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const isDark = resolvedTheme === 'dark';
  const next = () => setTheme(isDark ? 'light' : 'dark');

  if (compact) {
    // versi icon-only (opsional)
    return (
      <button
        onClick={next}
        aria-label={`Switch ke tema ${isDark ? 'Glow' : 'Gelap'}`}
        className="rounded-lg px-3 py-2 border border-black/10 dark:border-white/10
                   bg-white/70 dark:bg-white/5 hover:bg-white/90 dark:hover:bg-white/10
                   text-slate-800 dark:text-slate-100 transition"
      >
        {isDark ? '🌞' : '🌙'}
      </button>
    );
  }

  // versi pill 'Glow | Gelap'
  return (
    <button
      onClick={next}
      role="switch"
      aria-checked={isDark}
      className="relative inline-flex items-center h-9 w-[112px] rounded-full
                 border border-black/10 dark:border-white/10
                 bg-white/70 dark:bg-white/5 transition
                 shadow-sm hover:bg-white/90 dark:hover:bg-white/10"
      title="Ganti tema"
    >
      {/* knob */}
      <span
        className={`absolute top-[3px] h-[30px] w-[54px] rounded-full
                    transition-transform
                    ${isDark ? 'translate-x-[55px] bg-white/10' : 'translate-x-[3px] bg-white'}`}
      />
      {/* label kiri-kanan */}
      <span className={`z-10 flex-1 text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-800'}`}>
        Glow
      </span>
      <span className={`z-10 flex-1 text-xs font-medium text-right pr-2 ${isDark ? 'text-white' : 'text-slate-400'}`}>
        Gelap
      </span>
    </button>
  );
}
