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
  ];
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => setOpen(false), [pathname]);

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 backdrop-blur-xl bg-[#070814]/70">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-semibold neon-text">HMPS Teknik Informatika</Link>

        <div className="hidden sm:flex items-center gap-2">
          {links.map(l => (
            <Link key={l.href} href={l.href} className="px-3 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10">
              {l.label}
            </Link>
          ))}
          <ThemeToggle /> {/* <-- ini yang dipakai */}
        </div>

        {/* mobile … (boleh taruh ThemeToggle juga di sini) */}
      </div>
    </nav>
  );
}
