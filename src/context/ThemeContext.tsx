'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

export type SiteTheme = 'gold' | 'neon-black' | 'elegant-green';

export interface ThemeOption {
  id: SiteTheme;
  name: string;
  badge: string;
  description: string;
  colors: {
    bg: string;
    card: string;
    accent: string;
    glow: string;
  };
}

export const THEME_OPTIONS: ThemeOption[] = [
  {
    id: 'gold',
    name: 'Gold Luxe',
    badge: 'Default',
    description: 'Hangat, elegan & berwibawa khas identitas kebanggaan kelas.',
    colors: {
      bg: '#161512',
      card: '#1f1d19',
      accent: '#f2eb87',
      glow: 'rgba(242, 235, 135, 0.45)',
    },
  },
  {
    id: 'neon-black',
    name: 'Neon Black',
    badge: 'Cyber Tech',
    description: 'Hitam murni pekat tanpa coklat, dengan aksen neon cyber masa depan.',
    colors: {
      bg: '#040406',
      card: '#0d0e15',
      accent: '#00f0ff',
      glow: 'rgba(0, 240, 255, 0.45)',
    },
  },
  {
    id: 'elegant-green',
    name: 'Elegant Green',
    badge: 'Emerald',
    description: 'Nuansa hijau zamrud tenang, modern, segar dan profesional.',
    colors: {
      bg: '#04120b',
      card: '#0c2419',
      accent: '#10b981',
      glow: 'rgba(16, 185, 129, 0.45)',
    },
  },
];

interface ThemeContextType {
  theme: SiteTheme;
  themeOption: ThemeOption;
  themeOptions: ThemeOption[];
  setTheme: (theme: SiteTheme) => void;
  toggleTheme: () => void;
  mounted: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = 'tkj_site_theme';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<SiteTheme>('gold');
  const [mounted, setMounted] = useState(false);

  const applyThemeToDOM = useCallback((newTheme: SiteTheme) => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    root.classList.remove('theme-gold', 'theme-neon-black', 'theme-elegant-green', 'theme-neon', 'theme-green');
    root.classList.add(`theme-${newTheme}`);
    root.setAttribute('data-theme', newTheme);
    // Keep dark mode base active
    root.classList.add('dark');
  }, []);

  useEffect(() => {
    setMounted(true);
    let initial: SiteTheme = 'gold';
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'gold' || saved === 'neon-black' || saved === 'elegant-green') {
        initial = saved;
      }
    } catch {
      initial = 'gold';
    }
    setThemeState(initial);
    applyThemeToDOM(initial);
  }, [applyThemeToDOM]);

  const setTheme = useCallback(
    (newTheme: SiteTheme) => {
      setThemeState(newTheme);
      applyThemeToDOM(newTheme);
      try {
        localStorage.setItem(STORAGE_KEY, newTheme);
      } catch (e) {
        console.warn('Failed to save theme in localStorage:', e);
      }
    },
    [applyThemeToDOM]
  );

  const toggleTheme = useCallback(() => {
    setThemeState((current) => {
      let next: SiteTheme = 'gold';
      if (current === 'gold') next = 'neon-black';
      else if (current === 'neon-black') next = 'elegant-green';
      else next = 'gold';
      setTheme(next);
      return next;
    });
  }, [setTheme]);

  const currentOption = THEME_OPTIONS.find((t) => t.id === theme) || THEME_OPTIONS[0];

  return (
    <ThemeContext.Provider
      value={{
        theme,
        themeOption: currentOption,
        themeOptions: THEME_OPTIONS,
        setTheme,
        toggleTheme,
        mounted,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
