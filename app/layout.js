// app/layout.js
import './globals.css';
import ThemeProvider from '@/components/ThemeProvider';
import Nav from '@/components/Nav';

export const metadata = { title: 'HMPS Teknik Informatika' };

export default function RootLayout({ children }) {
  return (
    <html lang="id" className="dark" suppressHydrationWarning>
      <body className="min-h-screen bg-[var(--bg)] text-[var(--text)] antialiased">
        <ThemeProvider>
          <Nav />
          <div className="site-bg" /> {/* ⬅ background kembali muncul di SEMUA route */}
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
