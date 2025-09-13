'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';

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
    <nav className="sticky top-0 z-50 border-b border-white/10 backdrop-blur-xl bg-[#070814]/70">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-semibold neon-text">HMPS Teknik Informatika</Link>

        {/* Desktop menu */}
        <div className="hidden sm:flex items-center gap-1">
          {links.map(l=> (
            <Link key={l.href} href={l.href} className="px-3 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400">{l.label}</Link>
          ))}
          <ThemeToggle />
        </div>

        {/* Mobile controls */}
        <div className="sm:hidden flex items-center gap-1">
          <ThemeToggle />
          <button
            onClick={()=> setOpen(v=>!v)}
            className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10"
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
            className="sm:hidden border-t border-white/10 bg-[#070814]/95 backdrop-blur"
          >
            <div className="container mx-auto px-4 py-2 flex flex-col gap-1">
              {links.map(l => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="px-3 py-2 rounded-lg text-slate-200 hover:bg-white/10"
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
