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
      className="relative min-h-[85vh] sm:min-h-[90vh] flex items-center justify-center pt-8 pb-16 overflow-hidden bem-grid"
      style={{ backgroundColor: 'var(--bg-primary)' }}
    >
      {/* Animated Warm Ambient Glows */}
      <motion.div
        animate={{
          scale: [1, 1.18, 1],
          opacity: [0.08, 0.16, 0.08],
        }}
        transition={{
          repeat: Infinity,
          duration: 8,
          ease: 'easeInOut',
        }}
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] sm:w-[850px] h-[450px] rounded-full blur-3xl pointer-events-none"
        style={{ backgroundColor: 'var(--theme-glow)' }}
      />
      <motion.div
        animate={{
          scale: [1, 1.25, 1],
          opacity: [0.04, 0.1, 0.04],
        }}
        transition={{
          repeat: Infinity,
          duration: 10,
          delay: 1,
          ease: 'easeInOut',
        }}
        className="absolute bottom-10 right-10 w-96 h-96 rounded-full blur-3xl pointer-events-none"
        style={{ backgroundColor: 'var(--theme-glow)' }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          {/* Left Column: Text, Slogan & CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7 space-y-6 text-center lg:text-left"
          >
            {/* Angkatan 27 Official Identity Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15, duration: 0.5 }}
              className="inline-block"
            >
              <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold border shadow-lg cursor-default"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  borderColor: 'var(--border-theme)',
                  color: 'var(--color-theme)',
                }}
              >
                <Sparkles className="w-3.5 h-3.5" style={{ color: 'var(--color-theme)' }} />
                <span className="tracking-wide uppercase font-bold">
                  ANGKATAN 27
                </span>
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--color-theme)' }} />
                <span style={{ color: 'var(--text-body)' }}>XII TJ • Teknik Komputer dan Jaringan</span>
              </motion.div>
            </motion.div>

            {/* Slogan & Title */}
            <div className="space-y-3">
              <div className="flex items-center justify-center lg:justify-start gap-2">
                <motion.span
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.25, duration: 0.6 }}
                  className="w-8 h-[1px] origin-left"
                  style={{ backgroundColor: 'var(--color-theme)' }}
                />
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.25, duration: 0.5 }}
                  className="text-xs sm:text-sm uppercase tracking-[0.25em] font-semibold"
                  style={{ color: 'var(--color-theme)' }}
                >
                  BRIDGING EXCELLENCE &bull; ANGKATAN 27
                </motion.p>
                <motion.span
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.25, duration: 0.6 }}
                  className="w-8 h-[1px] origin-right"
                  style={{ backgroundColor: 'var(--color-theme)' }}
                />
              </div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="text-4xl sm:text-6xl xl:text-7xl font-theme-heading font-black tracking-tight leading-[1.1]"
                style={{ color: 'var(--text-main)' }}
              >
                WELCOME TO{' '}
                <span className="italic underline underline-offset-8" style={{ textDecorationColor: 'var(--color-theme)' }}>
                  {settings.class_name?.includes('TJ') ? settings.class_name : 'XII TJ'}
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-base sm:text-xl font-medium tracking-normal"
                style={{ color: 'var(--text-body)' }}
              >
                {settings.class_subtitle || 'Teknik Komputer dan Jaringan'} • Angkatan 27 ({settings.academic_year || '2026/2027'})
              </motion.p>
            </div>

            {/* Quote / Description */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-sm sm:text-base max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal"
              style={{ color: 'var(--text-muted)' }}
            >
              &ldquo;
              {settings.description ||
                'Tempat kami belajar, berkembang, berkarya, dan membangun cerita bersama. Melangkah dengan integritas, kebersamaan, dan keunggulan teknologi.'}
              &rdquo;
            </motion.p>

            {/* Action Buttons: Siswa, Struktur, & Project TKJ */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2"
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
              transition={{ delay: 0.7, duration: 0.6 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t text-left max-w-xl mx-auto lg:mx-0"
              style={{ borderColor: 'var(--border-color)' }}
            >
              {[
                { label: 'Siswa Angkatan 27', value: students.length || 34, color: 'var(--color-theme)' },
                { label: 'Fungsionaris', value: 18, color: 'var(--text-main)' },
                { label: 'Wali Kelas', value: 1, color: 'var(--color-theme)' },
                { label: 'Solidaritas', value: '100%', color: 'var(--text-main)' },
              ].map((stat) => (
                <motion.div
                  key={stat.label}
                  whileHover={{ y: -3 }}
                  transition={{ duration: 0.2 }}
                  className="p-3 rounded-xl border shadow-sm"
                  style={{
                    backgroundColor: 'var(--bg-card)',
                    borderColor: 'var(--border-color)',
                  }}
                >
                  <span className="block text-2xl font-theme-heading font-bold" style={{ color: stat.color }}>
                    {stat.value}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: 'var(--text-muted)' }}>
                    {stat.label}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Column: Hero Visual Frame */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 relative"
          >
            <div
              className="relative rounded-3xl p-3 border shadow-2xl group"
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
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex items-end p-5">
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
                  <Cpu className="w-16 h-16 mb-4 animate-pulse" style={{ color: 'var(--color-theme)' }} />
                  <span className="text-xs font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full mb-2" style={{ backgroundColor: 'var(--color-theme-muted)', color: 'var(--color-theme)' }}>
                    ANGKATAN 27
                  </span>
                  <h3 className="text-lg font-theme-heading font-bold" style={{ color: 'var(--text-main)' }}>
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
