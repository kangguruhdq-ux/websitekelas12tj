'use client';

import React from 'react';
import { useClassData } from '@/context/ClassDataContext';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Users,
  Network,
  Bell,
  Calendar,
  Image as ImageIcon,
  Sparkles,
  ArrowRight,
  PlusCircle,
  FolderOpen,
  Settings,
  ShieldCheck,
  Cpu,
  FolderGit2,
  Camera,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { students, roles, announcements, events, gallery, settings, projects } = useClassData();

  const totalStudents = students.length;
  const totalMale = students.filter((s) => s.gender === 'L').length;
  const totalFemale = students.filter((s) => s.gender === 'P').length;
  const totalProjects = (projects || []).length;
  const publishedProjects = (projects || []).filter((p) => p.is_published).length;

  const kpis = [
    {
      title: 'Total Siswa',
      value: totalStudents,
      sub: `${totalMale} Laki-laki • ${totalFemale} Perempuan`,
      icon: Users,
      href: '/admin/siswa',
      accent: 'text-[#f2eb87]',
      bg: 'bg-[#f2eb87]/10',
      border: 'border-[#f2eb87]/20',
    },
    {
      title: 'Project TKJ',
      value: totalProjects,
      sub: `${publishedProjects} Live • ${(projects || []).filter((p) => p.is_featured).length} Featured`,
      icon: FolderGit2,
      href: '/admin/projects',
      accent: 'text-[#f2eb87]',
      bg: 'bg-[#f2eb87]/10',
      border: 'border-[#f2eb87]/20',
    },
    {
      title: 'Struktur Organisasi',
      value: roles.length,
      sub: 'Jabatan & Koordinator Terisi',
      icon: Network,
      href: '/admin/struktur',
      accent: 'text-[#f5f1ca]',
      bg: 'bg-[#f5f1ca]/10',
      border: 'border-[#f5f1ca]/20',
    },
    {
      title: 'Warta & Pengumuman',
      value: announcements.length,
      sub: `${announcements.filter((a) => a.is_published).length} Telah Dipublikasikan`,
      icon: Bell,
      href: '/admin/pengumuman',
      accent: 'text-[#f2eb87]',
      bg: 'bg-[#f2eb87]/10',
      border: 'border-[#f2eb87]/20',
    },
    {
      title: 'Agenda & Program Kerja',
      value: events.length,
      sub: `${events.filter((e) => e.status === 'upcoming').length} Agenda Mendatang`,
      icon: Calendar,
      href: '/admin/agenda',
      accent: 'text-[#f5f1ca]',
      bg: 'bg-[#f5f1ca]/10',
      border: 'border-[#f5f1ca]/20',
    },
    {
      title: 'Dokumentasi Galeri',
      value: gallery.length,
      sub: 'Foto Kegiatan Kelas Terkumpul',
      icon: ImageIcon,
      href: '/admin/galeri',
      accent: 'text-[#f2eb87]',
      bg: 'bg-[#f2eb87]/10',
      border: 'border-[#f2eb87]/20',
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Welcome Card (BEM FEB UI Prestige Style) */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="p-6 sm:p-8 rounded-3xl bg-[#1f1d19] border border-[#f5f1ca]/15 shadow-xl relative overflow-hidden group"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#f2eb87]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#161512] text-[#f2eb87] border border-[#f2eb87]/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="uppercase tracking-widest text-[10px]">PUSAT KENDALI KELAS</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#f2eb87]" />
            <span className="text-[#d8d6c6]">ANGKATAN 27 • XII TJ</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-serif-title font-bold text-[#f5f1ca] tracking-tight">
            Selamat Datang di Portal Manajemen Kelas
          </h1>

          <p className="text-xs sm:text-sm text-[#d8d6c6]/80 max-w-3xl leading-relaxed">
            Kelola seluruh data anggota siswa, katalog karya inovasi Project TKJ, struktur fungsionaris, warta pengumuman, agenda program kerja, dokumentasi galeri, serta pengaturan identitas visual website resmi XII TJ — Teknik Komputer dan Jaringan secara real-time.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link
              href="/admin/foto-logo"
              className="px-4 py-2 rounded-xl bg-[#f2eb87] text-[#161512] hover:bg-[#e0d970] text-xs font-bold inline-flex items-center gap-2 shadow-md shadow-[#f2eb87]/20 transition-all active:scale-95"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Ganti Foto & Logo Website</span>
            </Link>
            <Link
              href="/admin/siswa"
              className="px-4 py-2 rounded-xl bg-[#161512] border border-[#f5f1ca]/15 hover:border-[#f2eb87] text-[#f5f1ca] text-xs font-semibold inline-flex items-center gap-2 transition-colors"
            >
              <Users className="w-3.5 h-3.5 text-[#f2eb87]" />
              <span>Kelola Siswa</span>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {kpis.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <motion.a
              key={kpi.title}
              href={kpi.href}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{
                y: -4,
                borderColor: 'rgba(242, 235, 135, 0.5)',
                boxShadow: '0 12px 30px -10px rgba(242, 235, 135, 0.12)',
              }}
              className="p-6 rounded-2xl bg-[#1f1d19] border border-[#f5f1ca]/12 transition-all group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#9e9a8d]">
                  {kpi.title}
                </span>
                <div className={`p-2.5 rounded-xl ${kpi.bg} ${kpi.border} border text-[#f2eb87] group-hover:scale-110 transition-transform`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-3xl sm:text-4xl font-serif-title font-bold text-[#f5f1ca]">
                  {kpi.value}
                </div>
                <p className="text-xs text-[#9e9a8d]">{kpi.sub}</p>
              </div>

              <div className="mt-5 pt-3.5 border-t border-[#f5f1ca]/10 flex items-center justify-between text-xs text-[#9e9a8d] group-hover:text-[#f2eb87] transition-colors">
                <span>Kelola Modul</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.a>
          );
        })}
      </div>

      {/* VISITOR ANALYTICS CHART & WEB TRAFFIC (BEM FEB UI Prestige Style) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="p-6 sm:p-8 rounded-3xl bg-[#1f1d19] border border-[#f5f1ca]/15 space-y-6 shadow-xl"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#f5f1ca]/10 pb-5">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-semibold bg-[#161512] text-[#f2eb87] border border-[#f2eb87]/30 uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Real-Time Traffic Monitor</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-serif-title font-bold text-[#f5f1ca]">
              Statistik & Tren Kunjungan Website
            </h2>
            <p className="text-xs text-[#9e9a8d]">
              Monitoring aktivitas pengunjung portal publik kelas XII TKJ dalam 7 hari terakhir.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[10px] uppercase tracking-wider text-[#9e9a8d] block font-semibold">
                Total Minggu Ini
              </span>
              <span className="text-2xl font-serif-title font-bold text-[#f2eb87]">
                1,482 <span className="text-xs font-sans font-normal text-[#9e9a8d]">Hits</span>
              </span>
            </div>
          </div>
        </div>

        {/* Chart + Insights Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Main Visual Chart (SVG Golden Wave Curve) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="h-60 w-full relative pt-4">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 700 200" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-theme)" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="var(--color-theme)" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                
                {/* Horizontal Guide Lines */}
                <line x1="0" y1="40" x2="700" y2="40" stroke="var(--border-color)" strokeOpacity="0.5" strokeDasharray="4 4" />
                <line x1="0" y1="100" x2="700" y2="100" stroke="var(--border-color)" strokeOpacity="0.5" strokeDasharray="4 4" />
                <line x1="0" y1="160" x2="700" y2="160" stroke="var(--border-color)" strokeOpacity="0.5" strokeDasharray="4 4" />

                {/* Area Fill */}
                <polygon
                  points="0,170 100,120 200,140 300,80 400,95 500,45 600,60 700,25 700,200 0,200"
                  fill="url(#goldGradient)"
                />

                {/* Main Glowing Curve Line */}
                <polyline
                  points="0,170 100,120 200,140 300,80 400,95 500,45 600,60 700,25"
                  fill="none"
                  stroke="var(--color-theme)"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Interactive Points on Line */}
                {[
                  { x: 0, y: 170, label: 'Sen', val: '142' },
                  { x: 100, y: 120, label: 'Sel', val: '198' },
                  { x: 200, y: 140, label: 'Rab', val: '175' },
                  { x: 300, y: 80, label: 'Kam', val: '240' },
                  { x: 400, y: 95, label: 'Jum', val: '215' },
                  { x: 500, y: 45, label: 'Sab', val: '310' },
                  { x: 600, y: 60, label: 'Min', val: '280' },
                  { x: 700, y: 25, label: 'Hari Ini', val: '342' },
                ].map((pt, i) => (
                  <g key={i}>
                    <circle cx={pt.x} cy={pt.y} r="5" fill="var(--bg-card)" stroke="var(--color-theme)" strokeWidth="2.5" />
                    <circle cx={pt.x} cy={pt.y} r="2" fill="var(--color-theme)" />
                  </g>
                ))}
              </svg>

              {/* Day Labels Axis */}
              <div className="flex justify-between text-[11px] font-semibold text-[#9e9a8d] pt-3 border-t border-[#f5f1ca]/10">
                <span>Senin (142)</span>
                <span>Selasa (198)</span>
                <span>Rabu (175)</span>
                <span>Kamis (240)</span>
                <span>Jumat (215)</span>
                <span>Sabtu (310)</span>
                <span>Minggu (280)</span>
                <span className="text-[#f2eb87] font-bold">Hari Ini (342)</span>
              </div>
            </div>
          </div>

          {/* Quick Metrics & Device Distribution */}
          <div className="lg:col-span-4 space-y-4">
            <div className="p-4 rounded-2xl bg-[#161512] border border-[#f5f1ca]/10 space-y-3">
              <span className="text-xs font-semibold text-[#f5f1ca] block">
                Perangkat Pengunjung
              </span>
              
              <div className="space-y-2.5">
                <div>
                  <div className="flex justify-between text-[11px] font-medium mb-1">
                    <span className="text-[#d8d6c6]">Smartphone (Mobile)</span>
                    <span className="text-[#f2eb87] font-bold">72%</span>
                  </div>
                  <div className="h-2 w-full bg-[#1f1d19] rounded-full overflow-hidden">
                    <div className="h-full bg-[#f2eb87] rounded-full" style={{ width: '72%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] font-medium mb-1">
                    <span className="text-[#d8d6c6]">Desktop / Laptop</span>
                    <span className="text-[#f5f1ca] font-bold">24%</span>
                  </div>
                  <div className="h-2 w-full bg-[#1f1d19] rounded-full overflow-hidden">
                    <div className="h-full bg-[#f5f1ca] rounded-full" style={{ width: '24%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] font-medium mb-1">
                    <span className="text-[#d8d6c6]">Tablet & iPad</span>
                    <span className="text-[#9e9a8d] font-bold">4%</span>
                  </div>
                  <div className="h-2 w-full bg-[#1f1d19] rounded-full overflow-hidden">
                    <div className="h-full bg-[#9e9a8d] rounded-full" style={{ width: '4%' }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#161512] border border-[#f5f1ca]/10 space-y-2 text-xs">
              <span className="font-semibold text-[#f5f1ca] block">
                Halaman Paling Populer
              </span>
              <ul className="space-y-1.5 text-[11px] text-[#9e9a8d]">
                <li className="flex items-center justify-between">
                  <span>1. Direktori Siswa (/siswa)</span>
                  <strong className="text-[#f2eb87]">580 views</strong>
                </li>
                <li className="flex items-center justify-between">
                  <span>2. Beranda Utama (/)</span>
                  <strong className="text-[#f5f1ca]">420 views</strong>
                </li>
                <li className="flex items-center justify-between">
                  <span>3. Galeri Kegiatan (/galeri)</span>
                  <strong className="text-[#f2eb87]">310 views</strong>
                </li>
                <li className="flex items-center justify-between">
                  <span>4. Struktur Kelas (/struktur)</span>
                  <strong className="text-[#f5f1ca]">172 views</strong>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Gender Distribution Visual & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Gender Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="lg:col-span-6 p-6 sm:p-7 rounded-2xl bg-[#1f1d19] border border-[#f5f1ca]/15 space-y-5"
        >
          <div className="flex items-center justify-between border-b border-[#f5f1ca]/10 pb-3">
            <h3 className="font-serif-title font-bold text-lg text-[#f5f1ca]">
              Demografi Anggota Kelas
            </h3>
            <span className="text-xs text-[#f2eb87] font-semibold">
              Total {totalStudents} Siswa
            </span>
          </div>

          <div className="space-y-4">
            {/* Male bar */}
            <div>
              <div className="flex justify-between text-xs mb-1.5 font-semibold">
                <span className="text-[#f2eb87]">Laki-laki</span>
                <span className="text-[#d8d6c6]">
                  {totalMale} Siswa ({totalStudents ? Math.round((totalMale / totalStudents) * 100) : 0}%)
                </span>
              </div>
              <div className="h-3 w-full bg-[#161512] border border-[#f5f1ca]/10 rounded-full overflow-hidden p-0.5">
                <div
                  className="h-full bg-[#f2eb87] rounded-full transition-all duration-700"
                  style={{
                    width: `${totalStudents ? (totalMale / totalStudents) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>

            {/* Female bar */}
            <div>
              <div className="flex justify-between text-xs mb-1.5 font-semibold">
                <span className="text-[#f5f1ca]">Perempuan</span>
                <span className="text-[#d8d6c6]">
                  {totalFemale} Siswa ({totalStudents ? Math.round((totalFemale / totalStudents) * 100) : 0}%)
                </span>
              </div>
              <div className="h-3 w-full bg-[#161512] border border-[#f5f1ca]/10 rounded-full overflow-hidden p-0.5">
                <div
                  className="h-full bg-[#f5f1ca] rounded-full transition-all duration-700"
                  style={{
                    width: `${totalStudents ? (totalFemale / totalStudents) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#161512] border border-[#f5f1ca]/10 text-xs text-[#9e9a8d] flex items-center justify-between">
            <span>Status Keanggotaan:</span>
            <strong className="text-[#f2eb87]">100% Aktif Terdaftar di Buku Induk</strong>
          </div>
        </motion.div>

        {/* Quick Shortcuts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="lg:col-span-6 p-6 sm:p-7 rounded-2xl bg-[#1f1d19] border border-[#f5f1ca]/15 space-y-5"
        >
          <div className="flex items-center justify-between border-b border-[#f5f1ca]/10 pb-3">
            <h3 className="font-serif-title font-bold text-lg text-[#f5f1ca]">
              Aksi Cepat Manajemen
            </h3>
            <span className="text-[10px] uppercase tracking-wider font-semibold text-[#9e9a8d]">Pintasan</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
            <a
              href="/admin/projects"
              className="p-4 rounded-xl bg-[#161512] border border-[#f5f1ca]/10 hover:border-[#f2eb87]/50 text-xs font-semibold text-[#f5f1ca] hover:text-[#f2eb87] flex items-center gap-3 transition-all group"
            >
              <FolderGit2 className="w-4 h-4 text-[#f2eb87] group-hover:scale-110 transition-transform" />
              <span>Project TKJ</span>
            </a>

            <a
              href="/admin/siswa"
              className="p-4 rounded-xl bg-[#161512] border border-[#f5f1ca]/10 hover:border-[#f2eb87]/50 text-xs font-semibold text-[#f5f1ca] hover:text-[#f2eb87] flex items-center gap-3 transition-all group"
            >
              <PlusCircle className="w-4 h-4 text-[#f2eb87] group-hover:scale-110 transition-transform" />
              <span>Kelola Siswa</span>
            </a>

            <a
              href="/admin/pengumuman"
              className="p-4 rounded-xl bg-[#161512] border border-[#f5f1ca]/10 hover:border-[#f2eb87]/50 text-xs font-semibold text-[#f5f1ca] hover:text-[#f2eb87] flex items-center gap-3 transition-all group"
            >
              <Bell className="w-4 h-4 text-[#f2eb87] group-hover:scale-110 transition-transform" />
              <span>Buat Warta</span>
            </a>

            <a
              href="/admin/agenda"
              className="p-4 rounded-xl bg-[#161512] border border-[#f5f1ca]/10 hover:border-[#f2eb87]/50 text-xs font-semibold text-[#f5f1ca] hover:text-[#f2eb87] flex items-center gap-3 transition-all group"
            >
              <Calendar className="w-4 h-4 text-[#f2eb87] group-hover:scale-110 transition-transform" />
              <span>Tambah Agenda</span>
            </a>

            <a
              href="/admin/galeri"
              className="p-4 rounded-xl bg-[#161512] border border-[#f5f1ca]/10 hover:border-[#f2eb87]/50 text-xs font-semibold text-[#f5f1ca] hover:text-[#f2eb87] flex items-center gap-3 transition-all group"
            >
              <ImageIcon className="w-4 h-4 text-[#f2eb87] group-hover:scale-110 transition-transform" />
              <span>Upload Galeri</span>
            </a>

            <a
              href="/admin/settings"
              className="p-4 rounded-xl bg-[#161512] border border-[#f5f1ca]/10 hover:border-[#f2eb87]/50 text-xs font-semibold text-[#f5f1ca] hover:text-[#f2eb87] flex items-center gap-3 transition-all group"
            >
              <Settings className="w-4 h-4 text-[#f2eb87] group-hover:scale-110 transition-transform" />
              <span>Pengaturan Web</span>
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
