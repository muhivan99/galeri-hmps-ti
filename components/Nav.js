'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import ThemeToggleNav from '@/components/ThemeToggleNav'; // << pakai toggle baru

export default function Nav(){
  const links = [
    { href: '/', label: 'Home' },
    { href: '/galeri', label: 'Galeri' },
    { href: '/kepengurusan', label: 'Kepengurusan' }
  ];
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(()=>{ setOpen(false); }, [pathname]); // auto-close ketika pindah halaman
  useEffect(()=>{
    if (!open) return;
    const onKey = (e)=> { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', onKey);
    return ()=> document.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <nav className="
      sticky top-0 z-50 backdrop-blur-xl
      border-b border-black/10 dark:border-white/10
      bg-white/70 dark:bg-[#070814]/70
    ">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-semibold neon-text">HMPS Teknik Informatika</Link>

        {/* Desktop menu */}
        <div className="hidden sm:flex items-center gap-1">
          {links.map(l=> (
            <Link
              key={l.href}
              href={l.href}
              className="
                px-3 py-1.5 rounded-lg
                text-slate-700 dark:text-slate-300
                hover:text-slate-900 dark:hover:text-white
                hover:bg-black/5 dark:hover:bg-white/10
                focus:outline-none focus-visible:ring-2
                focus-visible:ring-cyan-400/60
              "
            >
              {l.label}
            </Link>
          ))}
          {/* Switch Glow ↔ Gelap */}
          <ThemeToggleNav />
        </div>

        {/* Mobile controls */}
        <div className="sm:hidden flex items-center gap-1">
          <ThemeToggleNav compact />  {/* versi icon untuk HP */}
          <button
            onClick={()=> setOpen(v=>!v)}
            className="p-2 rounded-lg text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10"
            aria-label={open? 'Tutup menu' : 'Buka menu'}
            aria-expanded={open}
            aria-controls="mobile-menu-panel"
          >
            {open? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="sm:hidden border-t border-black/10 dark:border-white/10 bg-white/90 dark:bg-[#070814]/95 backdrop-blur"
          >
            <div className="container mx-auto px-4 py-2 flex flex-col gap-1" id="mobile-menu-panel">
              {links.map(l => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="px-3 py-2 rounded-lg text-slate-800 dark:text-slate-200 hover:bg-black/5 dark:hover:bg-white/10"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
