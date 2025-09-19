'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';

export default function Nav() {
  const links = [
    { href: '/', label: 'Home' },
    { href: '/galeri', label: 'Galeri' },
    { href: '/kepengurusan', label: 'Kepengurusan' },
    { href: '/about', label: 'Tentang' }
  ];

  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 6);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`sticky top-0 z-50 glass-nav ${scrolled ? 'nav-scrolled' : ''}`}>
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-semibold brand-grad">
          HMPS Teknik Informatika
        </Link>

        {/* Desktop */}
        <div className="hidden sm:flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="nav-link"
              aria-current={pathname === l.href ? 'page' : undefined}
            >
              {l.label}
            </Link>
          ))}
          <ThemeToggle />
        </div>

        {/* Mobile */}
        <div className="sm:hidden flex items-center gap-1">
          <ThemeToggle />
          <button
            onClick={() => setOpen((v) => !v)}
            className="p-2 rounded-lg nav-link"
            aria-label={open ? 'Tutup menu' : 'Buka menu'}
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="sm:hidden border-t border-[var(--navBorder)] bg-[color:var(--navBg)]/90 backdrop-blur-md">
          <div className="container mx-auto px-4 py-2 flex flex-col gap-1">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className="px-3 py-2 rounded-lg nav-link">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
