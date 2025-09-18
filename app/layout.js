// app/layout.js
import './globals.css';
import NeonBackground from '@/components/NeonBackground';
import ThemeProvider from '@/components/ThemeProvider';
import Nav from '@/components/Nav';

export const metadata = { title: 'HMPS Teknik Informatika' };

export default function RootLayout({ children }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className="min-h-dvh relative bg-[var(--bg)] text-[var(--text)] antialiased">
        <ThemeProvider>
          <NeonBackground />        {/* canvas animasi, fixed -z-10 */}
          <Nav />                   {/* z-50 di komponennya sudah oke */}
          <main className="relative z-10">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
