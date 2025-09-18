// app/layout.js
import './globals.css';
import NeonBackground from '@/components/NeonBackground';
import ThemeProvider from '@/components/ThemeProvider';
import Nav from '@/components/Nav';

export const metadata = { title: 'HMPS Teknik Informatika' };

export default function RootLayout({ children }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className="min-h-screen bg-[var(--bg)] text-[var(--text)] antialiased">
        <ThemeProvider>
          <NeonBackground />           {/* ⬅️ background teknologi baru */}
          <Nav />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
