'use client';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function ThemeToggleNav({ compact = false }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const isDark = resolvedTheme === 'dark';
  const next = () => setTheme(isDark ? 'light' : 'dark');

  if (compact) {
    return (
      <button
        onClick={next}
        aria-label={`Switch ke tema ${isDark ? 'terang' : 'gelap'}`}
        className="rounded-lg px-3 py-2 border border-black/10 dark:border-white/10
                   bg-white/70 dark:bg-white/5 hover:bg-white/90 dark:hover:bg-white/10
                   text-slate-800 dark:text-slate-100 transition"
      >
        {isDark ? '🌞' : '🌙'}
      </button>
    );
  }

  return (
    <button
      onClick={next}
      className="relative inline-flex items-center h-9 w-[120px] rounded-full
                 border border-black/10 dark:border-white/10
                 bg-white/70 dark:bg-white/5 transition
                 hover:bg-white/90 dark:hover:bg-white/10
                 text-slate-800 dark:text-slate-100"
      title="Ganti tema"
    >
      <motion.span
        layout
        transition={{ type:'spring', stiffness:500, damping:28 }}
        className={`absolute top-[3px] h-[30px] w-[58px] rounded-full
                    ${isDark ? 'translate-x-[59px] bg-white/10' : 'translate-x-[3px] bg-white'}`}
        style={{ boxShadow: isDark ? '0 0 0 1px rgba(255,255,255,.08)' : '0 8px 22px -12px rgba(15,23,42,.35)'}}
      />
      <span className={`z-10 flex-1 text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-900'}`}>Glow</span>
      <span className={`z-10 flex-1 text-xs font-medium text-right pr-2 ${isDark ? 'text-white' : 'text-slate-400'}`}>Gelap</span>
    </button>
  );
}
