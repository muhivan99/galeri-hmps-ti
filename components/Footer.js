'use client';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import ContactForm from '@/components/ContactForm';

// Render efek kanvas di client saja (lebih aman di Vercel)
const LogoPlanetOrbit = dynamic(() => import('@/components/LogoPlanetOrbit'), { ssr: false });

export default function Footer() {
  return (
    <footer className="relative mt-20 border-t border-white/10">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <div className="font-semibold mb-2 neon-text">HMPS Teknik Informatika</div>
            <p className="text-slate-400 text-sm">
              Kolaborasi, donasi, atau liputan kegiatan? Kirim pesan melalui formulir.
            </p>

            <div className="mt-4 flex items-center gap-4">
              <LogoPlanetOrbit
                src="/logos/organisasi.png"
                alt="Logo Organisasi"
                size={132}
                particles={56}
                speed={0.65}
                inner={0.36}
                outer={0.92}
                tiltDeg={28}
                ellip={0.62}
              />
              <LogoPlanetOrbit
                src="/logos/kampus.png"
                alt="Logo Kampus"
                size={132}
                particles={52}
                speed={0.6}
                inner={0.38}
                outer={0.95}
                tiltDeg={-28}
                ellip={0.62}
              />
            </div>
          </div>

          <div>
            <h4 className="text-white font-medium mb-2">Navigasi</h4>
            <ul className="text-slate-400 text-sm space-y-1">
              <li><Link className="hover:text-white/90" href="/">Home</Link></li>
              <li><Link className="hover:text-white/90" href="/galeri">Galeri</Link></li>
              <li><Link className="hover:text-white/90" href="/kepengurusan">Kepengurusan</Link></li>
            </ul>
          </div>

          <div>
            <ContactForm />
          </div>
        </div>

        <div className="mt-10 text-xs text-slate-500">
          © {new Date().getFullYear()} HMPS Teknik Informatika. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
