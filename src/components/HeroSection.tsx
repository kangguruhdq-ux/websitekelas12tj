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
} from 'lucide-react';

export default function HeroSection() {
  const { settings, students } = useClassData();

  return (
    <section className="relative min-h-[85vh] sm:min-h-[90vh] flex items-center justify-center pt-8 pb-16 overflow-hidden bem-grid bg-[#161512]">
      {/* Animated Warm Ambient Gold Glows (BEM FEB UI Signature) */}
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
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] sm:w-[850px] h-[450px] bg-gradient-to-tr from-[#f2eb87]/20 via-[#f5f1ca]/10 to-transparent rounded-full blur-3xl pointer-events-none"
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
        className="absolute bottom-10 right-10 w-96 h-96 bg-[#f2eb87]/15 rounded-full blur-3xl pointer-events-none"
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
            {/* Cabinet Identity Badge with Gentle Float */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15, duration: 0.5 }}
              className="inline-block"
            >
              <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-[#1f1d19] text-[#f2eb87] border border-[#f2eb87]/30 shadow-lg shadow-black/40 hover:border-[#f2eb87] transition-colors cursor-default"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#f2eb87]" />
                <span className="tracking-wide uppercase">
                  {settings.tagline || 'Class of 2026/2027'}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#f2eb87]" />
                <span className="text-[#d8d6c6]">Tingkat XII TKJ</span>
              </motion.div>
            </motion.div>

            {/* Slogan & Title (BEM FEB UI Editorial Serif Style) */}
            <div className="space-y-3">
              <div className="flex items-center justify-center lg:justify-start gap-2">
                <motion.span
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.25, duration: 0.6 }}
                  className="w-8 h-[1px] bg-[#f2eb87]/60 origin-left"
                />
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.25, duration: 0.5 }}
                  className="text-xs sm:text-sm uppercase tracking-[0.25em] font-semibold text-[#f2eb87]"
                >
                  BRIDGING EXCELLENCE
                </motion.p>
                <motion.span
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.25, duration: 0.6 }}
                  className="w-8 h-[1px] bg-[#f2eb87]/60 origin-right"
                />
              </div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="text-4xl sm:text-6xl xl:text-7xl font-serif-title font-bold tracking-tight text-[#f5f1ca] leading-[1.1]"
              >
                WELCOME TO{' '}
                <span className="italic underline decoration-[#f2eb87]/40 underline-offset-8">
                  {settings.class_name || 'XII TKJ'}
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-base sm:text-xl font-medium text-[#d8d6c6] tracking-normal"
              >
                {settings.class_subtitle || 'Teknik Komputer dan Jaringan'} • {settings.academic_year || '2026/2027'}
              </motion.p>
            </div>

            {/* Quote / Description */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-sm sm:text-base text-[#d8d6c6]/80 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal"
            >
              &ldquo;
              {settings.description ||
                'Tempat kami belajar, berkembang, berkarya, dan membangun cerita bersama. Melangkah dengan integritas, kebersamaan, dan keunggulan teknologi.'}
              &rdquo;
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2"
            >
              <a
                href="/siswa"
                className="btn-bem-primary w-full sm:w-auto inline-flex items-center justify-center gap-2 text-xs hover:-translate-y-0.5 transition-transform"
              >
                <Users className="w-4 h-4" />
                <span>Lihat Anggota Kelas</span>
                <ArrowRight className="w-4 h-4 ml-0.5" />
              </a>

              <a
                href="/struktur"
                className="btn-bem-outline w-full sm:w-auto inline-flex items-center justify-center gap-2 text-xs hover:-translate-y-0.5 transition-transform"
              >
                <Network className="w-4 h-4 text-[#f2eb87]" />
                <span>Struktur Kepengurusan</span>
              </a>
            </motion.div>

            {/* BEM FEB UI Quick Stat Counter Bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-[#f5f1ca]/15 text-left max-w-xl mx-auto lg:mx-0"
            >
              {[
                { label: 'Siswa Aktif', value: students.length || 34, color: 'text-[#f2eb87]' },
                { label: 'Fungsionaris', value: 18, color: 'text-[#f5f1ca]' },
                { label: 'Wali Kelas', value: 1, color: 'text-[#f2eb87]' },
                { label: 'Solid & Aktif', value: '100%', color: 'text-[#f5f1ca]' },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  whileHover={{ y: -3, borderColor: 'rgba(242, 235, 135, 0.4)' }}
                  transition={{ duration: 0.2 }}
                  className="p-3 rounded-xl bg-[#1f1d19] border border-[#f5f1ca]/10 shadow-sm"
                >
                  <span className={`block text-2xl font-serif-title font-bold ${stat.color}`}>
                    {stat.value}
                  </span>
                  <span className="text-[11px] text-[#9e9a8d] uppercase tracking-wider font-semibold">
                    {stat.label}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Column: Hero Visual Frame (BEM FEB UI Double Bezel Frame) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 relative"
          >
            {/* Outer Luxury Champagne Border Frame */}
            <div className="relative rounded-3xl p-3 bg-[#1f1d19] border border-[#f2eb87]/30 shadow-2xl shadow-black/80 group">
              {settings.hero_image_url ? (
                // Official Uploaded Class Hero Photo
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-[#161512] border border-[#f5f1ca]/20 shadow-inner">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={settings.hero_image_url}
                    alt="Hero Dokumentasi Kelas"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex items-end p-5">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#f2eb87] text-[#111111]">
                        Dokumentasi Resmi
                      </span>
                      <p className="text-[#f5f1ca] font-serif-title text-base font-bold mt-1.5">
                        Keluarga Besar {settings.class_name || 'XII TKJ'}
                      </p>
                      <p className="text-[11px] text-[#d8d6c6]">
                        Tahun Ajaran {settings.academic_year || '2026/2027'}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                // Institutional Placeholder Frame
                <div className="relative aspect-[4/3] rounded-2xl bg-[#161512] border border-[#f5f1ca]/15 p-6 flex flex-col justify-between text-left">
                  <div className="flex items-center justify-between border-b border-[#f5f1ca]/10 pb-4">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-5 h-5 text-[#f2eb87]" />
                      <span className="font-serif-title font-bold text-sm text-[#f5f1ca]">
                        Official Class Portal
                      </span>
                    </div>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#f2eb87]/15 text-[#f2eb87]">
                      XII TKJ
                    </span>
                  </div>

                  <div className="space-y-2 py-4">
                    <p className="font-serif-title text-xl font-bold text-[#f5f1ca]">
                      &ldquo;Bridging Excellence in Networking&rdquo;
                    </p>
                    <p className="text-xs text-[#9e9a8d] leading-relaxed">
                      Dokumentasi foto utama kelas dapat diunggah melalui menu Pengaturan di Portal Admin.
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-[#f5f1ca]/10 text-xs text-[#d8d6c6]">
                    <span>Wali Kelas: {settings.homeroom_teacher || 'Bu Febriyana, S.T.'}</span>
                    <span className="text-[#f2eb87] font-semibold">Aktif</span>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
