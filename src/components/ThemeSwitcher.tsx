'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useTheme, SiteTheme, THEME_OPTIONS } from '@/context/ThemeContext';
import { Palette, Check, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ThemeSwitcher() {
  const { theme, setTheme, mounted } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!mounted) {
    return (
      <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 animate-pulse" />
    );
  }

  const activeOption = THEME_OPTIONS.find((t) => t.id === theme) || THEME_OPTIONS[0];

  return (
    <div className="relative" ref={containerRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold uppercase tracking-wider transition-all duration-300"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: isOpen ? 'var(--color-theme)' : 'var(--border-theme)',
          color: 'var(--text-main)',
          boxShadow: isOpen ? '0 0 15px -3px var(--theme-glow)' : 'none',
        }}
        title="Ganti Tema Warna Tampilan"
        aria-label="Theme Selector"
      >
        <div className="flex items-center gap-1.5">
          <span
            className="w-2.5 h-2.5 rounded-full transition-transform duration-300 ring-2 ring-white/10"
            style={{
              backgroundColor: activeOption.colors.accent,
              boxShadow: `0 0 8px ${activeOption.colors.accent}`,
            }}
          />
          <span className="hidden sm:inline font-medium text-[11px]">Tema</span>
        </div>
        <Palette className="w-3.5 h-3.5 transition-transform duration-200" style={{ color: 'var(--color-theme)' }} />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.96 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="absolute right-0 mt-2 w-64 sm:w-72 rounded-2xl p-2.5 shadow-2xl border backdrop-blur-xl z-50 overflow-hidden"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-theme)',
              boxShadow: '0 20px 40px -15px rgba(0,0,0,0.8), 0 0 25px -5px var(--theme-glow)',
            }}
          >
            {/* Header */}
            <div className="px-2.5 py-1.5 mb-1.5 flex items-center justify-between border-b border-white/5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5" style={{ color: 'var(--text-muted)' }}>
                <Sparkles className="w-3 h-3" style={{ color: 'var(--color-theme)' }} />
                Pilih Tema Global
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/5" style={{ color: 'var(--color-theme)' }}>
                3 Styles
              </span>
            </div>

            {/* Theme Options */}
            <div className="space-y-1.5">
              {THEME_OPTIONS.map((item) => {
                const isSelected = item.id === theme;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setTheme(item.id);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left p-2.5 rounded-xl transition-all duration-200 flex items-center justify-between group relative overflow-hidden ${
                      isSelected
                        ? 'ring-1 shadow-sm'
                        : 'hover:bg-white/5'
                    }`}
                    style={{
                      backgroundColor: isSelected ? 'var(--color-theme-muted)' : 'transparent',
                      borderColor: isSelected ? 'var(--color-theme)' : 'transparent',
                    }}
                  >
                    <div className="flex items-center gap-3">
                      {/* Color Preview Swatch */}
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center border shadow-inner transition-transform group-hover:scale-105"
                        style={{
                          backgroundColor: item.colors.bg,
                          borderColor: item.colors.accent,
                        }}
                      >
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{
                            backgroundColor: item.colors.accent,
                            boxShadow: `0 0 8px ${item.colors.accent}`,
                          }}
                        />
                      </div>

                      {/* Labels */}
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1.5">
                          <span
                            className="text-xs font-bold tracking-tight transition-colors"
                            style={{
                              color: isSelected ? 'var(--color-theme)' : 'var(--text-main)',
                            }}
                          >
                            {item.name}
                          </span>
                          <span
                            className="text-[9px] px-1.5 py-0.2 rounded font-mono font-semibold"
                            style={{
                              backgroundColor: `${item.colors.accent}18`,
                              color: item.colors.accent,
                            }}
                          >
                            {item.badge}
                          </span>
                        </div>
                        <span className="text-[10px] line-clamp-1" style={{ color: 'var(--text-muted)' }}>
                          {item.description}
                        </span>
                      </div>
                    </div>

                    {/* Active Checkmark */}
                    {isSelected && (
                      <motion.div
                        layoutId="active-theme-check"
                        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                        className="w-5 h-5 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: 'var(--color-theme)' }}
                      >
                        <Check className="w-3 h-3 text-black font-bold stroke-[3]" />
                      </motion.div>
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
