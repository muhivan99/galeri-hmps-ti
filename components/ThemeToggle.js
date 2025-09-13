'use client';
import { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';

const themes = ['aurora','limesky','sunset'];

export default function ThemeToggle(){
  const [idx, setIdx] = useState(0);
  useEffect(()=>{
    const saved = typeof window !== 'undefined' ? localStorage.getItem('theme') : null;
    const name = (saved && themes.includes(saved)) ? saved : 'aurora';
    document.documentElement.setAttribute('data-theme', name);
    setIdx(themes.indexOf(name));
  },[]);
  const cycle = ()=>{
    const next = (idx + 1) % themes.length;
    const name = themes[next];
    document.documentElement.setAttribute('data-theme', name);
    try{ localStorage.setItem('theme', name); }catch{}
    setIdx(next);
  };
  return (
    <button onClick={cycle} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10" aria-label="Ganti tema neon">
      <Sparkles className="h-4 w-4" /><span className="hidden sm:inline">Tema</span>
    </button>
  );
}
