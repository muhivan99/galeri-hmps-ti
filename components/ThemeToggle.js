'use client';
import { useTheme } from '@/components/ThemeProvider';

export default function ThemeToggle({ className = '' }) {
  const { theme, setTheme } = useTheme();
  const isLight = theme === 'light';

  return (
    <div className={`inline-flex rounded-full border border-[var(--cardBorder)] bg-[var(--card)] p-1 ${className}`}>
      <button
        onClick={() => setTheme('light')}
        className={`px-3 py-1.5 rounded-full text-sm transition
          ${isLight ? 'bg-white/80 text-black shadow' : 'text-muted hover:text-[var(--text)]'}`}
        aria-pressed={isLight}
      >
        Glow
      </button>
      <button
        onClick={() => setTheme('dark')}
        className={`px-3 py-1.5 rounded-full text-sm transition
          ${!isLight ? 'bg-white/10 text-white shadow' : 'text-muted hover:text-[var(--text)]'}`}
        aria-pressed={!isLight}
      >
        Gelap
      </button>
    </div>
  );
}
