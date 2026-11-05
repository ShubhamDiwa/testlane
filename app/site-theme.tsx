'use client';

import { Moon, Sun } from 'lucide-react';
import { ThemeProvider, useTheme } from 'next-themes';
import type { ReactNode } from 'react';

export function SiteTheme({ children }: { children: ReactNode }) {
  return <ThemeProvider defaultTheme="system" enableSystem>{children}</ThemeProvider>;
}

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  return <button className="theme-toggle" type="button" aria-label="Toggle dark mode"
    onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}>
    <Moon className="theme-moon" size={17} aria-hidden="true"/>
    <Sun className="theme-sun" size={17} aria-hidden="true"/>
  </button>;
}
