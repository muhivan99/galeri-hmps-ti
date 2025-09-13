export const metadata = {
  title: 'Komunitas Aksi Pentur — Galeri & Struktur',
  description: 'Dokumentasi kegiatan warga, struktur pengurus, dan divisi organisasi. Bernuansa futuristik neon glow.',
  openGraph: {
    title: 'Komunitas Aksi Pentur',
    description: 'Galeri kegiatan & struktur organisasi',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com',
    siteName: 'Komunitas Aksi Pentur',
    images: [{ url: '/og.png', width: 1200, height: 630 }],
    locale: 'id_ID', type: 'website'
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'),
  manifest: '/manifest.webmanifest',
  appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: 'Komunitas Aksi Pentur' }
};

import './globals.css';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import NeonBackground from '@/components/NeonBackground';
import SEO from '@/components/SEO';
import SkipLink from '@/components/SkipLink';
import PWA from '@/components/PWA';
import ThemeScript from '@/components/ThemeScript';

export default function RootLayout({ children }){
  return (
    <html lang="id" suppressHydrationWarning>
      <body className="text-slate-200 selection:bg-fuchsia-500/30">
        <SEO />
        <ThemeScript />
        <PWA />
        <NeonBackground />
        <SkipLink />
        <Nav />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
