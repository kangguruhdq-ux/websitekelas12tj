'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useClassData } from '@/context/ClassDataContext';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeSwitcher from '@/components/ThemeSwitcher';
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
  FolderGit2,
  ArrowRight,
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
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMouseEnter = (groupName: string) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setActiveDropdown(groupName);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
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
          ? 'backdrop-blur-md shadow-2xl border-b py-3'
          : 'backdrop-blur-sm border-b py-4 sm:py-5'
      }`}
      style={{
        backgroundColor: isScrolled ? 'rgba(var(--color-theme-rgb), 0.03)' : 'transparent',
        borderColor: 'var(--border-color)',
        background: isScrolled ? 'var(--bg-primary)' : undefined,
      }}
    >
      <div className="w-full max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
        <div className="flex items-center justify-between gap-4">
          {/* Brand Logo & Editorial Title: XII TJ — ANGKATAN 27 */}
          <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
            <div
              className="relative flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl border transition-all overflow-hidden shadow-inner group-hover:scale-105"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border-theme)',
              }}
            >
              {settings.logo_url && !logoFailed ? (
                <Image
                  src={settings.logo_url}
                  alt={settings.class_name || 'XII TJ'}
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                  onError={() => setLogoFailed(true)}
                />
              ) : (
                <span className="font-theme-heading font-black text-sm sm:text-base" style={{ color: 'var(--color-theme)' }}>
                  TJ
                </span>
              )}
            </div>
            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-base sm:text-lg font-theme-heading font-black tracking-tight leading-none" style={{ color: 'var(--text-main)' }}>
                  {settings.class_name?.includes('TJ') ? settings.class_name : 'XII TJ'}
                </span>
                <span
                  className="text-[9px] sm:text-[10px] font-sans font-bold px-2 py-0.5 rounded-full border shadow-sm tracking-wider uppercase leading-tight"
                  style={{
                    backgroundColor: 'var(--color-theme-muted)',
                    color: 'var(--color-theme)',
                    borderColor: 'var(--border-theme)',
                  }}
                >
                  ANGKATAN 27
                </span>
              </div>
              <span className="text-[10px] tracking-wider uppercase font-medium hidden 2xl:inline-block leading-tight mt-1" style={{ color: 'var(--text-muted)' }}>
                {settings.class_subtitle || 'Teknik Komputer dan Jaringan'}
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5 flex-shrink-0">
            {/* 1. Home */}
            <Link
              href="/"
              className={`px-2.5 xl:px-3 py-1.5 rounded-xl text-[11px] xl:text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
                pathname === '/'
                  ? 'font-bold border'
                  : 'hover:opacity-100'
              }`}
              style={{
                color: pathname === '/' ? 'var(--color-theme)' : 'var(--text-body)',
                backgroundColor: pathname === '/' ? 'var(--color-theme-muted)' : 'transparent',
                borderColor: pathname === '/' ? 'var(--border-theme)' : 'transparent',
              }}
            >
              Home
            </Link>

            {/* 2. Tentang */}
            <Link
              href="/tentang"
              className={`px-2.5 xl:px-3 py-1.5 rounded-xl text-[11px] xl:text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
                pathname === '/tentang'
                  ? 'font-bold border'
                  : 'hover:opacity-100'
              }`}
              style={{
                color: pathname === '/tentang' ? 'var(--color-theme)' : 'var(--text-body)',
                backgroundColor: pathname === '/tentang' ? 'var(--color-theme-muted)' : 'transparent',
                borderColor: pathname === '/tentang' ? 'var(--border-theme)' : 'transparent',
              }}
            >
              Tentang
            </Link>

            {/* 3. NEW: Project TKJ */}
            <Link
              href="/projects"
              className={`px-2.5 xl:px-3 py-1.5 rounded-xl text-[11px] xl:text-xs font-semibold uppercase tracking-wider transition-all duration-200 flex items-center gap-1.5 ${
                pathname.startsWith('/projects')
                  ? 'font-bold border shadow-sm'
                  : 'hover:opacity-100'
              }`}
              style={{
                color: pathname.startsWith('/projects') ? 'var(--color-theme)' : 'var(--text-body)',
                backgroundColor: pathname.startsWith('/projects') ? 'var(--color-theme-muted)' : 'transparent',
                borderColor: pathname.startsWith('/projects') ? 'var(--border-theme)' : 'transparent',
              }}
            >
              <FolderGit2 className="w-3.5 h-3.5" style={{ color: 'var(--color-theme)' }} />
              <span>Project TKJ</span>
            </Link>

            {/* 4. Group Dropdowns */}
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
                    className={`px-2.5 xl:px-3 py-1.5 rounded-xl text-[11px] xl:text-xs font-semibold uppercase tracking-wider transition-all duration-200 flex items-center gap-1.5 ${
                      isGroupActive || isMenuOpen
                        ? 'font-bold border'
                        : 'hover:opacity-100'
                    }`}
                    style={{
                      color: isGroupActive || isMenuOpen ? 'var(--color-theme)' : 'var(--text-body)',
                      backgroundColor: isGroupActive || isMenuOpen ? 'var(--color-theme-muted)' : 'transparent',
                      borderColor: isGroupActive || isMenuOpen ? 'var(--border-theme)' : 'transparent',
                    }}
                  >
                    <span>{group.name}</span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${
                        isMenuOpen ? 'rotate-180' : ''
                      }`}
                      style={{ color: isMenuOpen ? 'var(--color-theme)' : 'var(--text-muted)' }}
                    />
                  </button>

                  <AnimatePresence>
                    {isMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        transition={{ duration: 0.18, ease: 'easeOut' }}
                        className="absolute top-full left-0 mt-2 w-64 p-2 rounded-2xl backdrop-blur-xl border shadow-2xl z-50 space-y-1"
                        style={{
                          backgroundColor: 'var(--bg-card)',
                          borderColor: 'var(--border-theme)',
                          boxShadow: '0 20px 40px -15px rgba(0,0,0,0.8), 0 0 20px -5px var(--theme-glow)',
                        }}
                      >
                        {group.items.map((item) => {
                          const IconComp = item.icon;
                          const isSubActive = pathname === item.href;
                          return (
                            <Link
                              key={item.href}
                              href={item.href}
                              onClick={() => setActiveDropdown(null)}
                              className="flex items-start gap-3 p-2.5 rounded-xl transition-all group/item"
                              style={{
                                backgroundColor: isSubActive ? 'var(--color-theme-muted)' : 'transparent',
                                borderColor: isSubActive ? 'var(--border-theme)' : 'transparent',
                                color: isSubActive ? 'var(--color-theme)' : 'var(--text-body)',
                              }}
                            >
                              <div
                                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all border"
                                style={{
                                  backgroundColor: isSubActive ? 'var(--color-theme)' : 'var(--bg-primary)',
                                  borderColor: isSubActive ? 'var(--color-theme)' : 'var(--border-color)',
                                  color: isSubActive ? '#050505' : 'var(--color-theme)',
                                }}
                              >
                                <IconComp className="w-4 h-4" />
                              </div>
                              <div className="overflow-hidden">
                                <span className="font-theme-heading font-bold text-xs block transition-colors leading-tight" style={{ color: 'var(--text-main)' }}>
                                  {item.name}
                                </span>
                                <span className="text-[10px] line-clamp-1 mt-0.5" style={{ color: 'var(--text-muted)' }}>
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

          {/* Right Actions: Theme Switcher & Social Links */}
          <div className="hidden lg:flex items-center gap-1.5 xl:gap-2 flex-shrink-0">
            {/* Global Theme Switcher */}
            <ThemeSwitcher />

            {/* Instagram Link */}
            <a
              href={instagramLink}
              target="_blank"
              rel="noreferrer"
              title="Instagram @networkengineering27"
              className="flex items-center gap-1.5 p-2 xl:px-2.5 xl:py-1.5 rounded-xl border text-xs transition-all group hover:scale-105"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-body)',
              }}
            >
              <InstagramIcon className="w-4 h-4 text-pink-400 group-hover:scale-110 transition-transform" />
              <span className="text-[11px] font-medium tracking-wide hidden 2xl:inline">Instagram</span>
            </a>

            {/* TikTok Link */}
            <a
              href={tiktokLink}
              target="_blank"
              rel="noreferrer"
              title="TikTok @networkcomp.27"
              className="flex items-center gap-1.5 p-2 xl:px-2.5 xl:py-1.5 rounded-xl border text-xs transition-all group hover:scale-105"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-body)',
              }}
            >
              <TikTokIcon className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
              <span className="text-[11px] font-medium tracking-wide hidden 2xl:inline">TikTok</span>
            </a>
          </div>

          {/* Mobile Right Bar: Theme Switcher & Hamburger */}
          <div className="flex lg:hidden items-center gap-2">
            <ThemeSwitcher />

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl border transition-colors"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-main)',
              }}
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
            className="lg:hidden border-b overflow-hidden backdrop-blur-xl"
            style={{
              backgroundColor: 'var(--bg-primary)',
              borderColor: 'var(--border-color)',
            }}
          >
            <div className="max-w-lg mx-auto px-4 py-5 space-y-5 max-h-[85vh] overflow-y-auto">
              {/* 1. Quick Navigation: Home & Tentang */}
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-3 rounded-2xl text-center text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 border shadow-sm"
                  style={{
                    backgroundColor: pathname === '/' ? 'var(--color-theme)' : 'var(--bg-card)',
                    borderColor: pathname === '/' ? 'var(--color-theme)' : 'var(--border-color)',
                    color: pathname === '/' ? '#020617' : 'var(--text-main)',
                  }}
                >
                  <Home className="w-4 h-4" />
                  <span>Beranda</span>
                </Link>

                <Link
                  href="/tentang"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-3 rounded-2xl text-center text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 border shadow-sm"
                  style={{
                    backgroundColor: pathname === '/tentang' ? 'var(--color-theme)' : 'var(--bg-card)',
                    borderColor: pathname === '/tentang' ? 'var(--color-theme)' : 'var(--border-color)',
                    color: pathname === '/tentang' ? '#020617' : 'var(--text-main)',
                  }}
                >
                  <Info className="w-4 h-4" />
                  <span>Tentang</span>
                </Link>
              </div>

              {/* 2. PROMINENT FEATURED: Project TKJ Showcase */}
              <Link
                href="/projects"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-3.5 rounded-2xl border shadow-lg transition-all active:scale-[0.98]"
                style={{
                  backgroundColor: pathname.startsWith('/projects') ? 'var(--color-theme)' : 'var(--bg-card)',
                  borderColor: 'var(--border-theme)',
                  color: pathname.startsWith('/projects') ? '#020617' : 'var(--text-main)',
                  boxShadow: '0 8px 24px -4px var(--theme-glow)',
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border shadow-inner"
                    style={{
                      backgroundColor: pathname.startsWith('/projects') ? '#020617' : 'var(--color-theme-muted)',
                      borderColor: 'var(--border-theme)',
                      color: pathname.startsWith('/projects') ? '#ffffff' : 'var(--color-theme)',
                    }}
                  >
                    <FolderGit2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm leading-tight">Project TKJ</span>
                      <span
                        className="text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border"
                        style={{
                          backgroundColor: pathname.startsWith('/projects') ? 'rgba(0,0,0,0.25)' : 'var(--color-theme-muted)',
                          borderColor: 'var(--border-theme)',
                          color: pathname.startsWith('/projects') ? '#020617' : 'var(--color-theme)',
                        }}
                      >
                        Karya Siswa
                      </span>
                    </div>
                    <p className="text-[11px] opacity-80 mt-0.5 leading-tight">
                      Katalog portofolio karya, sistem jaringan, APK & IoT
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 opacity-70 shrink-0" />
              </Link>

              {/* 3. Navigation Groups (All Website Pages) */}
              {NAV_GROUPS.map((group) => (
                <div key={group.name} className="space-y-1.5">
                  <span className="text-[10px] uppercase font-bold tracking-widest px-2 block" style={{ color: 'var(--color-theme)' }}>
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
                          className="flex items-center gap-3 p-2.5 rounded-xl text-xs font-medium transition-all border"
                          style={{
                            backgroundColor: isActive ? 'var(--color-theme-muted)' : 'transparent',
                            borderColor: isActive ? 'var(--border-theme)' : 'transparent',
                            color: isActive ? 'var(--color-theme)' : 'var(--text-body)',
                            fontWeight: isActive ? 700 : 500,
                          }}
                        >
                          <div
                            className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border"
                            style={{
                              backgroundColor: isActive ? 'var(--color-theme)' : 'var(--bg-card)',
                              borderColor: 'var(--border-color)',
                              color: isActive ? '#020617' : 'var(--color-theme)',
                            }}
                          >
                            <IconComp className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <span className="block leading-tight font-semibold text-xs" style={{ color: 'var(--text-main)' }}>
                              {item.name}
                            </span>
                            <span className="block text-[10px] line-clamp-1 mt-0.5" style={{ color: 'var(--text-muted)' }}>
                              {item.desc}
                            </span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}

              {/* 4. Social Links & Portal Admin */}
              <div className="pt-3 border-t space-y-3" style={{ borderColor: 'var(--border-color)' }}>
                {/* Social media links in mobile */}
                <div className="grid grid-cols-2 gap-2">
                  <a
                    href={instagramLink}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-medium transition-all"
                    style={{
                      backgroundColor: 'var(--bg-card)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-main)',
                    }}
                  >
                    <InstagramIcon className="w-4 h-4 text-pink-400" />
                    <span>Instagram</span>
                  </a>

                  <a
                    href={tiktokLink}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-medium transition-all"
                    style={{
                      backgroundColor: 'var(--bg-card)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-main)',
                    }}
                  >
                    <TikTokIcon className="w-4 h-4 text-cyan-400" />
                    <span>TikTok</span>
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
