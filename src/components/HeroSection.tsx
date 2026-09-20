'use client';

import React from 'react';
import { useClassData } from '@/context/ClassDataContext';
import { motion } from 'framer-motion';
import {
  Users,
  Network,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Cpu,
  GraduationCap,
  FolderGit2,
} from 'lucide-react';
import Link from 'next/link';

export default function HeroSection() {
  const { settings, students } = useClassData();

  return (
    <section
      className="relative min-h-[85vh] sm:min-h-[90vh] flex items-center justify-center pt-6 sm:pt-8 pb-14 sm:pb-16 overflow-hidden bem-grid"
      style={{ backgroundColor: 'var(--bg-primary)' }}
    >
      {/* Mobile Ultra-Lightweight Static Glow (Zero GPU overhead, buttery smooth entry) */}
      <div
        className="sm:hidden absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full pointer-events-none opacity-20"
        style={{
          background: 'radial-gradient(circle, var(--color-theme) 0%, transparent 70%)',
        }}
      />

      {/* Desktop Animated Ambient Glows (Hidden on small mobile screens to prevent GPU fill-rate throttling) */}
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.08, 0.15, 0.08],
        }}
        transition={{
          repeat: Infinity,
          duration: 8,
          ease: 'easeInOut',
        }}
        className="hidden sm:block absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] lg:w-[850px] h-[450px] rounded-full blur-3xl pointer-events-none transform-gpu"
        style={{ backgroundColor: 'var(--theme-glow)' }}
      />
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.04, 0.09, 0.04],
        }}
        transition={{
          repeat: Infinity,
          duration: 10,
          delay: 1,
          ease: 'easeInOut',
        }}
        className="hidden sm:block absolute bottom-10 right-10 w-80 h-80 rounded-full blur-3xl pointer-events-none transform-gpu"
        style={{ backgroundColor: 'var(--theme-glow)' }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-10 items-center">
          {/* Left Column: Text, Slogan & CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 space-y-5 sm:space-y-6 text-center lg:text-left transform-gpu"
          >
            {/* Angkatan 27 Official Identity Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.08, duration: 0.4, ease: 'easeOut' }}
              className="inline-block transform-gpu"
            >
              <div
                className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full text-xs font-semibold border shadow-md cursor-default"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  borderColor: 'var(--border-theme)',
                  color: 'var(--color-theme)',
                }}
              >
                <Sparkles className="w-3.5 h-3.5" style={{ color: 'var(--color-theme)' }} />
                <span className="tracking-wide uppercase font-bold text-[11px] sm:text-xs">
                  ANGKATAN 27
                </span>
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--color-theme)' }} />
                <span style={{ color: 'var(--text-body)' }} className="text-[11px] sm:text-xs">
                  XII TJ • Teknik Komputer dan Jaringan
                </span>
              </div>
            </motion.div>

            {/* Slogan & Title */}
            <div className="space-y-2.5 sm:space-y-3">
              <div className="flex items-center justify-center lg:justify-start gap-2">
                <span
                  className="w-6 sm:w-8 h-[1px]"
                  style={{ backgroundColor: 'var(--color-theme)' }}
                />
                <p
                  className="text-[11px] sm:text-sm uppercase tracking-[0.2em] sm:tracking-[0.25em] font-semibold"
                  style={{ color: 'var(--color-theme)' }}
                >
                  BRIDGING EXCELLENCE &bull; ANGKATAN 27
                </p>
                <span
                  className="w-6 sm:w-8 h-[1px]"
                  style={{ backgroundColor: 'var(--color-theme)' }}
                />
              </div>

              <motion.h1
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="text-3xl sm:text-6xl xl:text-7xl font-theme-heading font-black tracking-tight leading-[1.1] transform-gpu"
                style={{ color: 'var(--text-main)' }}
              >
                WELCOME TO{' '}
                <span className="italic underline underline-offset-8" style={{ textDecorationColor: 'var(--color-theme)' }}>
                  {settings.class_name?.includes('TJ') ? settings.class_name : 'XII TJ'}
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.18, duration: 0.45 }}
                className="text-sm sm:text-xl font-medium tracking-normal transform-gpu"
                style={{ color: 'var(--text-body)' }}
              >
                {settings.class_subtitle || 'Teknik Komputer dan Jaringan'} • Angkatan 27 ({settings.academic_year || '2026/2027'})
              </motion.p>
            </div>

            {/* Quote / Description */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.22, duration: 0.45 }}
              className="text-xs sm:text-base max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal transform-gpu"
              style={{ color: 'var(--text-muted)' }}
            >
              &ldquo;
              {settings.description ||
                'Tempat kami belajar, berkembang, berkarya, dan membangun cerita bersama. Melangkah dengan integritas, kebersamaan, dan keunggulan teknologi.'}
              &rdquo;
            </motion.p>

            {/* Action Buttons: Siswa, Struktur, & Project TKJ */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28, duration: 0.5 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-2.5 sm:gap-3 pt-2 transform-gpu"
            >
              <Link
                href="/projects"
                className="btn-bem-primary w-full sm:w-auto inline-flex items-center justify-center gap-2 text-xs hover:-translate-y-0.5 transition-transform"
              >
                <FolderGit2 className="w-4 h-4" />
                <span>Showcase Project TKJ</span>
                <ArrowRight className="w-4 h-4 ml-0.5" />
              </Link>

              <Link
                href="/siswa"
                className="btn-bem-outline w-full sm:w-auto inline-flex items-center justify-center gap-2 text-xs hover:-translate-y-0.5 transition-transform"
              >
                <Users className="w-4 h-4" />
                <span>Direktori Siswa</span>
              </Link>

              <Link
                href="/struktur"
                className="btn-bem-outline w-full sm:w-auto inline-flex items-center justify-center gap-2 text-xs hover:-translate-y-0.5 transition-transform"
              >
                <Network className="w-4 h-4" />
                <span>Struktur Kelas</span>
              </Link>
            </motion.div>

            {/* Quick Stat Counter Bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.32, duration: 0.5 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 pt-5 sm:pt-6 border-t text-left max-w-xl mx-auto lg:mx-0 transform-gpu"
              style={{ borderColor: 'var(--border-color)' }}
            >
              {[
                { label: 'Siswa Angkatan 27', value: students.length || 34, color: 'var(--color-theme)' },
                { label: 'Fungsionaris', value: 18, color: 'var(--text-main)' },
                { label: 'Wali Kelas', value: 1, color: 'var(--color-theme)' },
                { label: 'Solidaritas', value: '100%', color: 'var(--text-main)' },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="p-3 rounded-xl border shadow-sm transition-transform hover:-translate-y-0.5 transform-gpu"
                  style={{
                    backgroundColor: 'var(--bg-card)',
                    borderColor: 'var(--border-color)',
                  }}
                >
                  <span className="block text-xl sm:text-2xl font-theme-heading font-bold" style={{ color: stat.color }}>
                    {stat.value}
                  </span>
                  <span className="text-[9px] sm:text-[10px] uppercase tracking-wider font-semibold" style={{ color: 'var(--text-muted)' }}>
                    {stat.label}
                  </span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Column: Hero Visual Frame */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 relative transform-gpu"
          >
            <div
              className="relative rounded-3xl p-2.5 sm:p-3 border shadow-2xl group"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border-theme)',
              }}
            >
              {settings.hero_image_url ? (
                <div
                  className="relative aspect-[4/3] rounded-2xl overflow-hidden border shadow-inner"
                  style={{
                    backgroundColor: 'var(--bg-primary)',
                    borderColor: 'var(--border-color)',
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={settings.hero_image_url}
                    alt="Hero Dokumentasi Kelas"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex items-end p-4 sm:p-5">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full" style={{ backgroundColor: 'var(--color-theme)', color: '#050505' }}>
                        ANGKATAN 27
                      </span>
                      <p className="font-theme-heading text-base font-bold mt-1.5" style={{ color: 'var(--text-main)' }}>
                        Keluarga Besar {settings.class_name?.includes('TJ') ? settings.class_name : 'XII TJ'}
                      </p>
                      <p className="text-[11px]" style={{ color: 'var(--text-body)' }}>
                        SMK Negeri • Teknik Komputer dan Jaringan
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  className="relative aspect-[4/3] rounded-2xl overflow-hidden border flex flex-col items-center justify-center p-6 text-center"
                  style={{
                    backgroundColor: 'var(--bg-primary)',
                    borderColor: 'var(--border-color)',
                  }}
                >
                  <Cpu className="w-14 h-14 sm:w-16 sm:h-16 mb-3 sm:mb-4 text-theme-glow animate-pulse" style={{ color: 'var(--color-theme)' }} />
                  <span className="text-xs font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full mb-2" style={{ backgroundColor: 'var(--color-theme-muted)', color: 'var(--color-theme)' }}>
                    ANGKATAN 27
                  </span>
                  <h3 className="text-base sm:text-lg font-theme-heading font-bold" style={{ color: 'var(--text-main)' }}>
                    {settings.class_name || 'XII TJ'} — Official Portal
                  </h3>
                  <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                    Teknik Komputer dan Jaringan
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
