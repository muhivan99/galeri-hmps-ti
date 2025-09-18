export const metadata = {
  title: 'Galeri HMPS-TI',
  description: 'Dokumentasi kegiatan warga, struktur pengurus, dan divisi organisasi',
  openGraph: {
    title: 'HMPS Teknik Informatika',
    description: 'Galeri kegiatan & struktur organisasi',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://galerihmpsti.com',
    siteName: 'HMPS Teknik Informatika',
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
import ThemeProvider from '@/components/ThemeProvider';

export default function RootLayout({ children }) {
  return (
    <html lang="id" className="dark" suppressHydrationWarning>
      <body className="min-h-screen bg-[var(--bg)] text-[var(--text)] antialiased">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
