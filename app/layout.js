// app/layout.js
import './globals.css';
import ThemeProvider from '@/components/ThemeProvider';
import Nav from '@/components/Nav';            // ⬅️ pastikan file ini ada
// import Footer from '@/components/Footer';   // optional

export const metadata = {
  title: 'HMPS Teknik Informatika',
  description: 'Galeri kegiatan & struktur organisasi',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className="dark" suppressHydrationWarning>
      {/* class "dark" = fallback biar gak sempat putih sebelum hydrate */}
      <body className="min-h-screen bg-[var(--bg)] text-[var(--text)] antialiased">
        <ThemeProvider>
          <Nav />          {/* ⬅️ navbar muncul lagi */}
          {children}
          {/* <Footer /> */}
        </ThemeProvider>
      </body>
    </html>
  );
}
