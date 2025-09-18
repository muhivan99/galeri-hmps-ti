'use client';
import { createContext, useContext, useEffect, useState } from 'react';

const ThemeCtx = createContext({ theme: 'dark', setTheme: () => {} });
export const useTheme = () => useContext(ThemeCtx);

export default function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('dark');

  // load preferensi awal
  useEffect(() => {
    try {
      const saved = localStorage.getItem('theme');
      if (saved === 'light' || saved === 'dark') setTheme(saved);
    } catch {}
  }, []);

  // apply ke <html data-theme="...">
  useEffect(() => {
    const el = document.documentElement;
    // set atribut + fallback remove/kelas biar robust
    if (theme === 'light') {
      el.setAttribute('data-theme', 'light');
      el.classList.remove('dark');
    } else {
      el.setAttribute('data-theme', 'dark');   // aman walau default :root dark
      el.classList.add('dark');                // kalau masih ada style lama yg pakai .dark
    }
    try { localStorage.setItem('theme', theme); } catch {}
  }, [theme]);

  return (
    <ThemeCtx.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeCtx.Provider>
  );
}
