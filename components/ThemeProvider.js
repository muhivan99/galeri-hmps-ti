'use client';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

export default function ThemeProvider({ children }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"       // default GELAP
      enableSystem={false}      // abaikan tema OS
      disableTransitionOnChange // biar tidak kedip
    >
      {children}
    </NextThemesProvider>
  );
}
