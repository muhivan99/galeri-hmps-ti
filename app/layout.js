// app/layout.js
import './globals.css';
import ThemeScript from '@/components/ThemeScript';
import ThemeProvider from '@/components/ThemeProvider';
import NeonBackground from '@/components/NeonBackground';
import Nav from '@/components/Nav';

export const metadata = { title: 'HMPS Teknik Informatika' };

export default function RootLayout({ children }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className="min-h-dvh relative bg-[var(--bg)] text-[var(--text)] antialiased">
        <ThemeScript />          {/* anti-flash, set data-theme lebih dulu */}
        <ThemeProvider>
          <NeonBackground />    {/* anim background, tema-aware */}
          <Nav />
          <main className="relative z-10">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
