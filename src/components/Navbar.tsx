'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useClassData } from '@/context/ClassDataContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  ChevronDown,
  Home,
  Info,
  Users,
  Network,
  Calendar,
  Bell,
  Image as ImageIcon,
  Monitor,
  BookOpen,
  Heart,
  Lock,
  Trophy,
  Sparkles,
  Terminal,
} from 'lucide-react';

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 3 15.68 6.34 6.34 0 0 0 9.33 22a6.33 6.33 0 0 0 6.34-6.32V8.75a8.18 8.18 0 0 0 4.79 1.54V6.85a4.8 4.8 0 0 1-.87-.16z" />
    </svg>
  );
}

interface NavDropdownItem {
  name: string;
  href: string;
  desc: string;
  icon: any;
}

interface NavGroup {
  name: string;
  items: NavDropdownItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    name: 'Kelas & Siswa',
    items: [
      { name: 'Direktori Siswa', href: '/siswa', desc: 'Profil 34 anggota aktif kelas', icon: Users },
      { name: 'Denah Meja & Lab', href: '/denah', desc: 'Topologi workstation praktikum', icon: Monitor },
      { name: 'Struktur Organisasi', href: '/struktur', desc: 'Bagan kepengurusan kelas', icon: Network },
    ],
  },
  {
    name: 'Akademik & Warta',
    items: [
      { name: 'Modul & Panduan TKJ', href: '/modul', desc: 'Cheat sheet subnetting & MikroTik', icon: BookOpen },
      { name: 'Agenda & Program', href: '/agenda', desc: 'Jadwal kegiatan & persiapan UKK', icon: Calendar },
      { name: 'Warta Pengumuman', href: '/pengumuman', desc: 'Pengumuman resmi angkatan', icon: Bell },
      { name: 'Galeri Dokumentasi', href: '/galeri', desc: 'Foto momen praktikum & acara', icon: ImageIcon },
    ],
  },
  {
    name: 'Kenangan',
    items: [
      { name: 'Kapsul Waktu 2030', href: '/kapsul-waktu', desc: 'Surat rahasia terkunci s/d reuni', icon: Lock },
      { name: 'Dinding Kenangan', href: '/kenangan', desc: 'Buku tamu & catatan persaudaraan', icon: Heart },
      { name: 'Hall of Fame "Si Paling"', href: '/superlatives', desc: 'Gelar kehormatan unik siswa', icon: Trophy },
    ],
  },
];

export default function Navbar() {
  const { settings } = useClassData();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [logoFailed, setLogoFailed] = useState(false);

  useEffect(() => {
    setLogoFailed(false);
  }, [settings.logo_url]);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownTimeoutRef = useRef<any>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Hidden admin shortcut: Ctrl + Shift + A
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        window.location.href = '/admin';
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleMouseEnter = (name: string) => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setActiveDropdown(name);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 200);
  };

  const instagramLink =
    settings.instagram_url ||
    'https://www.instagram.com/networkengineering27?stkn=bnB4dnY1dHRjcDZ3';
  const tiktokLink =
    settings.tiktok_url ||
    'https://www.tiktok.com/@networkcomp.27?_r=1&_t=ZS-99sUSsU8y0t';

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#161512]/95 backdrop-blur-md shadow-2xl border-b border-[#f5f1ca]/12 py-3'
          : 'bg-[#161512]/80 backdrop-blur-sm border-b border-[#f5f1ca]/8 py-4 sm:py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo & Editorial Title */}
          <Link href="/" className="flex items-center gap-3.5 group flex-shrink-0">
            <div className="relative flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#1f1d19] border border-[#f2eb87]/30 group-hover:border-[#f2eb87] transition-all overflow-hidden shadow-inner">
              {settings.logo_url && !logoFailed ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={settings.logo_url}
                  alt={settings.class_name || 'XII TKJ'}
                  className="w-full h-full object-cover"
                  onError={() => setLogoFailed(true)}
                />
              ) : (
                <span className="font-serif-title text-[#f2eb87] font-bold text-lg">
                  TKJ
                </span>
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-base sm:text-lg font-serif-title font-bold tracking-tight text-[#f5f1ca] flex items-center gap-2">
                {settings.class_name || 'XII TKJ'}
                <span className="text-[10px] font-sans font-semibold px-2 py-0.5 rounded-full bg-[#f2eb87]/15 text-[#f2eb87] border border-[#f2eb87]/30">
                  {settings.academic_year || '2026/2027'}
                </span>
              </span>
              <span className="text-[11px] text-[#9e9a8d] tracking-wider uppercase font-medium hidden sm:inline-block">
                {settings.class_subtitle || 'Teknik Komputer dan Jaringan'}
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links (Clean BEM FEB UI Dropdowns) */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {/* 1. Home */}
            <Link
              href="/"
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
                pathname === '/'
                  ? 'text-[#f2eb87] bg-[#f2eb87]/15 font-bold border border-[#f2eb87]/30'
                  : 'text-[#d8d6c6]/85 hover:text-[#f2eb87] hover:bg-[#f5f1ca]/5'
              }`}
            >
              Home
            </Link>

            {/* 2. Tentang */}
            <Link
              href="/tentang"
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
                pathname === '/tentang'
                  ? 'text-[#f2eb87] bg-[#f2eb87]/15 font-bold border border-[#f2eb87]/30'
                  : 'text-[#d8d6c6]/85 hover:text-[#f2eb87] hover:bg-[#f5f1ca]/5'
              }`}
            >
              Tentang
            </Link>

            {/* 3. Group Dropdowns */}
            {NAV_GROUPS.map((group) => {
              const isGroupActive = group.items.some((it) => it.href === pathname);
              const isMenuOpen = activeDropdown === group.name;

              return (
                <div
                  key={group.name}
                  onMouseEnter={() => handleMouseEnter(group.name)}
                  onMouseLeave={handleMouseLeave}
                  className="relative"
                >
                  <button
                    onClick={() => setActiveDropdown(isMenuOpen ? null : group.name)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-200 flex items-center gap-1.5 ${
                      isGroupActive || isMenuOpen
                        ? 'text-[#f2eb87] bg-[#f2eb87]/10 font-bold border border-[#f2eb87]/30'
                        : 'text-[#d8d6c6]/85 hover:text-[#f2eb87] hover:bg-[#f5f1ca]/5'
                    }`}
                  >
                    <span>{group.name}</span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${
                        isMenuOpen ? 'rotate-180 text-[#f2eb87]' : 'text-[#9e9a8d]'
                      }`}
                    />
                  </button>

                  {/* Dropdown Floating Card */}
                  <AnimatePresence>
                    {isMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        transition={{ duration: 0.18, ease: 'easeOut' }}
                        className="absolute top-full left-0 mt-2 w-64 p-2 rounded-2xl bg-[#1a1915]/95 backdrop-blur-xl border border-[#f5f1ca]/15 shadow-2xl shadow-black z-50 space-y-1"
                      >
                        {group.items.map((item) => {
                          const IconComp = item.icon;
                          const isSubActive = pathname === item.href;
                          return (
                            <Link
                              key={item.href}
                              href={item.href}
                              onClick={() => setActiveDropdown(null)}
                              className={`flex items-start gap-3 p-2.5 rounded-xl transition-all group/item ${
                                isSubActive
                                  ? 'bg-[#f2eb87]/15 border border-[#f2eb87]/30 text-[#f2eb87]'
                                  : 'hover:bg-[#1f1d19] text-[#d8d6c6]'
                              }`}
                            >
                              <div
                                className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all ${
                                  isSubActive
                                    ? 'bg-[#f2eb87] text-[#111111]'
                                    : 'bg-[#161512] border border-[#f5f1ca]/10 text-[#f2eb87] group-hover/item:border-[#f2eb87]'
                                }`}
                              >
                                <IconComp className="w-4 h-4" />
                              </div>
                              <div className="overflow-hidden">
                                <span className="font-serif-title font-bold text-xs block text-[#f5f1ca] group-hover/item:text-[#f2eb87] transition-colors leading-tight">
                                  {item.name}
                                </span>
                                <span className="text-[10px] text-[#9e9a8d] line-clamp-1 mt-0.5">
                                  {item.desc}
                                </span>
                              </div>
                            </Link>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </nav>

          {/* Right Action Icons (Compact luxury pills) */}
          <div className="hidden lg:flex items-center gap-2">
            {/* Instagram Link */}
            <a
              href={instagramLink}
              target="_blank"
              rel="noreferrer"
              title="Instagram @networkengineering27"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1f1d19] border border-[#f5f1ca]/15 text-xs text-[#d8d6c6] hover:text-[#f2eb87] hover:border-[#f2eb87]/40 transition-all group"
            >
              <InstagramIcon className="w-4 h-4 text-pink-400 group-hover:scale-110 transition-transform" />
              <span className="text-[11px] font-medium tracking-wide">Instagram</span>
            </a>

            {/* TikTok Link */}
            <a
              href={tiktokLink}
              target="_blank"
              rel="noreferrer"
              title="TikTok @networkcomp.27"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1f1d19] border border-[#f5f1ca]/15 text-xs text-[#d8d6c6] hover:text-[#f2eb87] hover:border-[#f2eb87]/40 transition-all group"
            >
              <TikTokIcon className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
              <span className="text-[11px] font-medium tracking-wide">TikTok</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <a
              href={instagramLink}
              target="_blank"
              rel="noreferrer"
              className="p-2 text-[#d8d6c6] hover:text-[#f2eb87]"
            >
              <InstagramIcon className="w-4 h-4 text-pink-400" />
            </a>
            <a
              href={tiktokLink}
              target="_blank"
              rel="noreferrer"
              className="p-2 text-[#d8d6c6] hover:text-[#f2eb87]"
            >
              <TikTokIcon className="w-4 h-4 text-cyan-400" />
            </a>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-[#1f1d19] border border-[#f5f1ca]/15 text-[#f5f1ca] hover:text-[#f2eb87] transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer (Organized in Clean Accordions) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-[#161512] border-b border-[#f5f1ca]/15 overflow-hidden"
          >
            <div className="max-w-7xl mx-auto px-4 py-5 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-2 pb-3 border-b border-[#f5f1ca]/10">
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`p-3 rounded-xl text-center text-xs font-bold uppercase tracking-wider ${
                    pathname === '/' ? 'bg-[#f2eb87] text-[#111111]' : 'bg-[#1f1d19] text-[#f5f1ca]'
                  }`}
                >
                  Home
                </Link>
                <Link
                  href="/tentang"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`p-3 rounded-xl text-center text-xs font-bold uppercase tracking-wider ${
                    pathname === '/tentang' ? 'bg-[#f2eb87] text-[#111111]' : 'bg-[#1f1d19] text-[#f5f1ca]'
                  }`}
                >
                  Tentang
                </Link>
              </div>

              {NAV_GROUPS.map((group) => (
                <div key={group.name} className="space-y-1.5">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#f2eb87] px-2 block">
                    {group.name}
                  </span>
                  <div className="space-y-1">
                    {group.items.map((item) => {
                      const IconComp = item.icon;
                      const isActive = pathname === item.href;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`flex items-center gap-3 p-2.5 rounded-xl text-xs font-medium transition-all ${
                            isActive
                              ? 'bg-[#f2eb87]/15 text-[#f2eb87] border border-[#f2eb87]/30 font-bold'
                              : 'text-[#d8d6c6] hover:bg-[#1f1d19] hover:text-[#f2eb87]'
                          }`}
                        >
                          <IconComp className="w-4 h-4 text-[#f2eb87]" />
                          <span>{item.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}

              {/* Portal Admin Mobile Access */}
              <div className="pt-3 border-t border-[#f5f1ca]/10">
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between p-3 rounded-xl bg-[#1f1d19] border border-[#f2eb87]/30 text-[#f2eb87] font-semibold text-xs transition-all hover:bg-[#f2eb87]/15 active:scale-[0.99]"
                >
                  <div className="flex items-center gap-2.5">
                    <Lock className="w-4 h-4 text-[#f2eb87]" />
                    <span>Portal Admin Kelas</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#f2eb87]/20 text-[#f2eb87] font-mono uppercase tracking-wider">
                    Masuk
                  </span>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
