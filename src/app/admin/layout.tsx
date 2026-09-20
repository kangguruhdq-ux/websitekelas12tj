'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useClassData } from '@/context/ClassDataContext';
import { useTheme } from '@/context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeSwitcher from '@/components/ThemeSwitcher';
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
  FolderGit2,
} from 'lucide-react';

const ADMIN_NAV = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Siswa', href: '/admin/siswa', icon: Users },
  { name: 'Struktur Kelas', href: '/admin/struktur', icon: Network },
  { name: 'Projects TKJ', href: '/admin/projects', icon: FolderGit2 },
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
  const { isSyncing, refreshData } = useClassData();

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

  // If on login route, render bare page without admin chrome
  if (isLoginPage) {
    return <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>{children}</div>;
  }

  // Loading barrier until session verification finishes
  if (checkingAuth && !isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="w-12 h-12 rounded-2xl border flex items-center justify-center shadow-lg animate-pulse" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-theme)' }}>
          <Cpu className="w-6 h-6" style={{ color: 'var(--color-theme)' }} />
        </div>
        <p className="mt-4 text-xs font-mono uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
          Memverifikasi Sesi Admin...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row transition-colors duration-300" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-body)' }}>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r flex-shrink-0 min-h-screen transition-colors" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
        {/* Brand */}
        <div className="h-20 px-6 border-b flex items-center gap-3" style={{ borderColor: 'var(--border-color)' }}>
          <div className="w-10 h-10 rounded-xl border flex items-center justify-center shadow-inner" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-theme)', color: 'var(--color-theme)' }}>
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-theme-heading font-bold text-base block leading-tight" style={{ color: 'var(--text-main)' }}>
                XII TJ Admin
              </span>
              <span className="text-[8px] font-bold px-1.5 py-0.2 rounded border" style={{ backgroundColor: 'var(--color-theme-muted)', color: 'var(--color-theme)', borderColor: 'var(--border-theme)' }}>
                A-27
              </span>
            </div>
            <span className="text-[10px] font-semibold tracking-widest uppercase" style={{ color: 'var(--color-theme)' }}>
              Portal Manajemen
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
                    ? 'font-bold shadow-md'
                    : 'hover:opacity-100'
                }`}
                style={{
                  backgroundColor: isActive ? 'var(--color-theme)' : 'transparent',
                  color: isActive ? '#050505' : 'var(--text-body)',
                  boxShadow: isActive ? '0 4px 14px -2px var(--theme-glow)' : 'none',
                }}
              >
                <Icon className="w-4 h-4 flex-shrink-0" style={{ color: isActive ? '#050505' : 'var(--color-theme)' }} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t space-y-2" style={{ borderColor: 'var(--border-color)' }}>
          <Link
            href="/"
            className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors hover:opacity-100"
            style={{ color: 'var(--text-muted)' }}
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5" style={{ color: 'var(--color-theme)' }} />
              <span>Lihat Website Publik</span>
            </span>
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar (Logout)</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-16 sm:h-20 px-4 sm:px-6 backdrop-blur-md border-b flex items-center justify-between sticky top-0 z-30 transition-colors" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)' }}>
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Mobile Navigation Drawer Trigger */}
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="md:hidden flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all active:scale-95 shadow-sm"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-main)',
              }}
              aria-label="Buka menu navigasi admin"
            >
              <Menu className="w-4 h-4" style={{ color: 'var(--color-theme)' }} />
              <span className="text-xs font-bold">Menu Admin</span>
            </button>

            <Link
              href="/admin"
              className="hidden xs:inline-block md:hidden text-xs font-mono font-bold"
              style={{ color: 'var(--text-muted)' }}
            >
              XII TJ
            </Link>

            {/* Sync Status Badge */}
            <div className="flex items-center gap-2 text-xs">
              <button
                onClick={() => refreshData(true)}
                disabled={isSyncing}
                title="Sinkronisasi Data"
                className="p-1.5 rounded-lg transition-colors hover:opacity-100"
                style={{ color: 'var(--text-muted)' }}
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} style={{ color: isSyncing ? 'var(--color-theme)' : undefined }} />
              </button>
              <div className="hidden sm:flex items-center gap-2 text-[11px] px-2.5 py-1 rounded-full border" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}>
                <span className={`w-2 h-2 rounded-full ${isSyncing ? 'animate-pulse' : 'bg-emerald-400'}`} style={{ backgroundColor: isSyncing ? 'var(--color-theme)' : undefined }} />
                <span>
                  {isSyncing ? 'Menyinkronkan...' : 'Database Sinkron'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Global Theme Switcher inside Admin */}
            <ThemeSwitcher />

            {/* Admin Profile Pill */}
            <div className="flex items-center gap-2.5 pl-3 border-l" style={{ borderColor: 'var(--border-color)' }}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shadow-sm" style={{ backgroundColor: 'var(--color-theme)', color: '#050505' }}>
                AD
              </div>
              <div className="hidden sm:block text-left text-xs">
                <span className="font-bold block leading-tight" style={{ color: 'var(--text-main)' }}>
                  Admin XII TJ
                </span>
                <span className="text-[10px] tracking-wider uppercase font-semibold" style={{ color: 'var(--color-theme)' }}>
                  ANGKATAN 27
                </span>
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
      <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden backdrop-blur-lg border-t px-3 py-2 flex items-center justify-around shadow-2xl transition-colors" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)' }}>
        <Link
          href="/admin"
          className={`flex flex-col items-center gap-1 py-1 px-2 rounded-xl transition-all ${
            pathname === '/admin' ? 'font-bold scale-105' : 'hover:opacity-100'
          }`}
          style={{ color: pathname === '/admin' ? 'var(--color-theme)' : 'var(--text-muted)' }}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span className="text-[10px] tracking-tight">Ringkasan</span>
        </Link>
        <Link
          href="/admin/siswa"
          className={`flex flex-col items-center gap-1 py-1 px-2 rounded-xl transition-all ${
            pathname === '/admin/siswa' ? 'font-bold scale-105' : 'hover:opacity-100'
          }`}
          style={{ color: pathname === '/admin/siswa' ? 'var(--color-theme)' : 'var(--text-muted)' }}
        >
          <Users className="w-4 h-4" />
          <span className="text-[10px] tracking-tight">Siswa</span>
        </Link>
        <Link
          href="/admin/projects"
          className={`flex flex-col items-center gap-1 py-1 px-2 rounded-xl transition-all ${
            pathname === '/admin/projects' ? 'font-bold scale-105' : 'hover:opacity-100'
          }`}
          style={{ color: pathname === '/admin/projects' ? 'var(--color-theme)' : 'var(--text-muted)' }}
        >
          <FolderGit2 className="w-4 h-4" />
          <span className="text-[10px] tracking-tight">Projects</span>
        </Link>
        <Link
          href="/admin/jadwal"
          className={`flex flex-col items-center gap-1 py-1 px-2 rounded-xl transition-all ${
            pathname === '/admin/jadwal' ? 'font-bold scale-105' : 'hover:opacity-100'
          }`}
          style={{ color: pathname === '/admin/jadwal' ? 'var(--color-theme)' : 'var(--text-muted)' }}
        >
          <Clock className="w-4 h-4" />
          <span className="text-[10px] tracking-tight">Jadwal</span>
        </Link>
        <button
          onClick={() => setMobileSidebarOpen(true)}
          className="flex flex-col items-center gap-1 py-1 px-2 rounded-xl transition-all"
          style={{ color: 'var(--text-muted)' }}
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
              className="relative w-64 max-w-[80vw] h-full z-10 flex flex-col border-r"
              style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
            >
              <div className="h-16 px-5 border-b flex items-center justify-between" style={{ borderColor: 'var(--border-color)' }}>
                <span className="font-theme-heading font-bold text-sm" style={{ color: 'var(--text-main)' }}>Menu Portal Admin</span>
                <button
                  onClick={() => setMobileSidebarOpen(false)}
                  className="p-1 rounded-lg"
                  style={{ color: 'var(--text-muted)' }}
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
                      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                        isActive
                          ? 'font-bold shadow-sm'
                          : 'hover:opacity-100'
                      }`}
                      style={{
                        backgroundColor: isActive ? 'var(--color-theme)' : 'transparent',
                        color: isActive ? '#050505' : 'var(--text-body)',
                      }}
                    >
                      <Icon className="w-4 h-4" style={{ color: isActive ? '#050505' : 'var(--color-theme)' }} />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>
              <div className="p-4 border-t space-y-2" style={{ borderColor: 'var(--border-color)' }}>
                <Link
                  href="/"
                  className="flex items-center gap-2 px-3 py-2 text-xs hover:opacity-100"
                  style={{ color: 'var(--text-muted)' }}
                >
                  <ExternalLink className="w-3.5 h-3.5" style={{ color: 'var(--color-theme)' }} />
                  <span>Lihat Website</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full px-3 py-2 text-xs font-semibold text-rose-400 hover:text-rose-300"
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
