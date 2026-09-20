'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useClassData } from '@/context/ClassDataContext';
import { useTheme } from '@/context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  Network,
  Bell,
  Calendar,
  Image as ImageIcon,
  FolderOpen,
  Settings,
  ShieldAlert,
  LogOut,
  Menu,
  X,
  ExternalLink,
  RefreshCw,
  Cpu,
  Sparkles,
  Clock,
} from 'lucide-react';

const ADMIN_NAV = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Siswa', href: '/admin/siswa', icon: Users },
  { name: 'Struktur Kelas', href: '/admin/struktur', icon: Network },
  { name: 'Jadwal & Piket', href: '/admin/jadwal', icon: Clock },
  { name: 'Pengumuman', href: '/admin/pengumuman', icon: Bell },
  { name: 'Agenda', href: '/admin/agenda', icon: Calendar },
  { name: 'Galeri', href: '/admin/galeri', icon: ImageIcon },
  { name: 'Media Manager', href: '/admin/media', icon: FolderOpen },
  { name: 'Interaksi & Kenangan', href: '/admin/interaktif', icon: Sparkles },
  { name: 'Pengaturan Web', href: '/admin/settings', icon: Settings },
  { name: 'Admin Users', href: '/admin/users', icon: ShieldAlert },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isSyncing, lastSynced, refreshData } = useClassData();
  const { theme, toggleTheme } = useTheme();

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // If we are on /admin/login, bypass the admin shell
  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (isLoginPage) {
      setCheckingAuth(false);
      return;
    }

    if (isAuthenticated) {
      return;
    }

    const checkSession = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          router.push('/admin/login');
        }
      } catch {
        setIsAuthenticated(false);
        router.push('/admin/login');
      } finally {
        setCheckingAuth(false);
      }
    };

    checkSession();
  }, [isLoginPage, isAuthenticated, router]);

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {
      console.error(e);
    } finally {
      router.push('/admin/login');
    }
  };

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#161512] text-[#f2eb87]">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="w-8 h-8 animate-spin text-[#f2eb87]" />
          <p className="text-xs font-mono tracking-widest text-[#d8d6c6]">MEMVERIFIKASI AKSES PORTAL ADMIN...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#161512] text-[#d8d6c6] flex flex-col md:flex-row">
      {/* Desktop Sidebar (BEM FEB UI Obsidian Style) */}
      <aside className="hidden md:flex flex-col w-64 bg-[#141310] border-r border-[#f5f1ca]/10 flex-shrink-0 min-h-screen">
        {/* Brand */}
        <div className="h-20 px-6 border-b border-[#f5f1ca]/10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#1f1d19] border border-[#f2eb87]/30 text-[#f2eb87] flex items-center justify-center shadow-inner">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <span className="font-serif-title font-bold text-base text-[#f5f1ca] block leading-tight">
              XII TKJ Admin
            </span>
            <span className="text-[10px] text-[#f2eb87] font-semibold tracking-widest uppercase">
              Management Portal
            </span>
          </div>
        </div>

        {/* Nav Links */}
        <div className="flex-1 py-5 px-3 space-y-1.5 overflow-y-auto">
          {ADMIN_NAV.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-[#f2eb87] text-[#161512] font-bold shadow-md shadow-[#f2eb87]/20'
                    : 'text-[#d8d6c6]/80 hover:text-[#f2eb87] hover:bg-[#f5f1ca]/5'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#161512]' : 'text-[#f5f1ca]/60 group-hover:text-[#f2eb87]'}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-[#f5f1ca]/10 space-y-2">
          <Link
            href="/"
            className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-[#d8d6c6]/80 hover:text-[#f2eb87] hover:bg-[#f5f1ca]/5 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Lihat Website Publik</span>
            </span>
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-xs font-semibold text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar (Logout)</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-16 sm:h-20 px-4 sm:px-6 bg-[#161512]/90 backdrop-blur-md border-b border-[#f5f1ca]/10 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Mobile Navigation Drawer Trigger */}
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="md:hidden flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#1f1d19] border border-[#f5f1ca]/15 text-[#f5f1ca] hover:text-[#f2eb87] hover:border-[#f2eb87]/40 transition-all active:scale-95 shadow-sm"
              aria-label="Buka menu navigasi admin"
            >
              <Menu className="w-4 h-4 text-[#f2eb87]" />
              <span className="text-xs font-serif-title font-bold">Menu Admin</span>
            </button>

            <Link
              href="/admin"
              className="hidden xs:inline-block md:hidden text-xs font-mono font-bold text-[#9e9a8d] hover:text-[#f2eb87] transition-colors"
            >
              XII TKJ
            </Link>

            {/* Sync Status Badge */}
            <div className="flex items-center gap-2 text-xs">
              <button
                onClick={() => refreshData(true)}
                disabled={isSyncing}
                title="Sinkronisasi Data"
                className="p-1.5 rounded-lg text-[#9e9a8d] hover:text-[#f2eb87] hover:bg-[#f5f1ca]/10 transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-[#f2eb87]' : ''}`} />
              </button>
              <div className="hidden sm:flex items-center gap-2 text-[#9e9a8d] text-[11px] px-2.5 py-1 rounded-full bg-[#1f1d19] border border-[#f5f1ca]/10">
                <span className={`w-2 h-2 rounded-full ${isSyncing ? 'bg-[#f2eb87] animate-pulse' : 'bg-emerald-400'}`} />
                <span>
                  {isSyncing ? 'Menyinkronkan...' : 'Database Sinkron'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Admin Profile Pill */}
            <div className="flex items-center gap-2.5 pl-3 border-l border-[#f5f1ca]/10">
              <div className="w-8 h-8 rounded-full bg-[#f2eb87] text-[#161512] flex items-center justify-center text-xs font-bold shadow-sm">
                AD
              </div>
              <div className="hidden sm:block text-left text-xs">
                <span className="font-serif-title font-bold block text-[#f5f1ca] leading-tight">
                  Admin TKJ
                </span>
                <span className="text-[10px] text-[#f2eb87] tracking-wider uppercase font-semibold">Superuser</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8 flex-1 min-h-[calc(100vh-5rem)] pb-24 md:pb-8 w-full min-w-0">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar (Exclusive for Admin Portal) */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-[#161512]/95 backdrop-blur-lg border-t border-[#f5f1ca]/15 px-3 py-2 flex items-center justify-around shadow-2xl">
        <Link
          href="/admin"
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all ${
            pathname === '/admin' ? 'text-[#f2eb87] font-bold scale-105' : 'text-[#9e9a8d] hover:text-[#f5f1ca]'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span className="text-[10px] tracking-tight">Ringkasan</span>
        </Link>
        <Link
          href="/admin/siswa"
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all ${
            pathname === '/admin/siswa' ? 'text-[#f2eb87] font-bold scale-105' : 'text-[#9e9a8d] hover:text-[#f5f1ca]'
          }`}
        >
          <Users className="w-4 h-4" />
          <span className="text-[10px] tracking-tight">Siswa</span>
        </Link>
        <Link
          href="/admin/jadwal"
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all ${
            pathname === '/admin/jadwal' ? 'text-[#f2eb87] font-bold scale-105' : 'text-[#9e9a8d] hover:text-[#f5f1ca]'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span className="text-[10px] tracking-tight">Jadwal</span>
        </Link>
        <Link
          href="/admin/interaktif"
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all ${
            pathname === '/admin/interaktif' ? 'text-[#f2eb87] font-bold scale-105' : 'text-[#9e9a8d] hover:text-[#f5f1ca]'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span className="text-[10px] tracking-tight">Interaksi</span>
        </Link>
        <button
          onClick={() => setMobileSidebarOpen(true)}
          className="flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl text-[#9e9a8d] hover:text-[#f2eb87] transition-all"
        >
          <Menu className="w-4 h-4" />
          <span className="text-[10px] tracking-tight">Semua</span>
        </button>
      </nav>

      {/* Mobile Sidebar Drawer */}
      <AnimatePresence>
      {mobileSidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-50 md:hidden flex"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileSidebarOpen(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-64 max-w-[80vw] bg-[#141310] h-full z-10 flex flex-col border-r border-[#f5f1ca]/10"
          >
            <div className="h-16 px-5 border-b border-[#f5f1ca]/10 flex items-center justify-between">
              <span className="font-serif-title font-bold text-sm text-[#f5f1ca]">Menu Portal Admin</span>
              <button
                onClick={() => setMobileSidebarOpen(false)}
                className="p-1 rounded-lg text-[#9e9a8d] hover:text-[#f2eb87]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
              {ADMIN_NAV.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold ${
                      isActive
                        ? 'bg-[#f2eb87] text-[#161512] font-bold'
                        : 'text-[#d8d6c6]/80 hover:bg-[#f5f1ca]/10 hover:text-[#f2eb87]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
            <div className="p-4 border-t border-[#f5f1ca]/10 space-y-2">
              <Link
                href="/"
                className="flex items-center gap-2 px-3 py-2 text-xs text-[#d8d6c6]/80 hover:text-[#f2eb87]"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Lihat Website</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full px-3 py-2 text-xs font-semibold text-red-400 hover:text-red-300"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>
    </div>
  );
}
