'use client';

import React from 'react';
import { useClassData } from '@/context/ClassDataContext';
import { motion } from 'framer-motion';
import {
  Users,
  GraduationCap,
  Sparkles,
  BookOpen,
  Calendar,
  Layers,
  HeartHandshake,
  TrendingUp,
  ShieldCheck,
  Award,
} from 'lucide-react';

const CORE_VALUES = [
  {
    title: 'Togetherness',
    subtitle: 'Kebersamaan & Solidaritas',
    description:
      'Fondasi utama yang mempererat seluruh anggota kelas XII TKJ. Menjadikan perbedaan sebagai jembatan sinergi dan saling menopang dalam setiap tantangan akademik.',
    icon: HeartHandshake,
    accent: '#f2eb87',
  },
  {
    title: 'Progressive',
    subtitle: 'Kemajuan & Inovasi',
    description:
      'Selalu terdepan dalam menguasai teknologi jaringan, komputasi awan, dan otomasi server dengan pola pikir kritis, adaptif, dan berkelanjutan.',
    icon: TrendingUp,
    accent: '#f5f1ca',
  },
  {
    title: 'Integrity',
    subtitle: 'Kejujuran & Disiplin',
    description:
      'Menjunjung tinggi etika profesional, tanggung jawab dalam pengerjaan praktikum dan kepengurusan kelas, serta komitmen moral yang teguh.',
    icon: ShieldCheck,
    accent: '#f2eb87',
  },
  {
    title: 'Excellence',
    subtitle: 'Kualitas & Prestasi',
    description:
      'Berdedikasi untuk mencapai standar keahlian tertinggi dalam sertifikasi kejuruan (MikroTik, Cisco, Linux) dan dedikasi penuh bagi almamater.',
    icon: Award,
    accent: '#f5f1ca',
  },
];

export default function TentangKelas() {
  const { students, settings } = useClassData();

  const totalStudents = students.length;
  const totalMale = students.filter((s) => s.gender === 'L').length;
  const totalFemale = students.filter((s) => s.gender === 'P').length;

  return (
    <section id="tentang" className="py-20 sm:py-28 relative overflow-hidden bg-[#161512] border-t border-[#f5f1ca]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
        {/* Section 1: Overview & Philosophy */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Vision & Identity */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 space-y-5"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#1f1d19] text-[#f2eb87] border border-[#f2eb87]/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span className="tracking-widest uppercase">FILOSOFI & IDENTITAS</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-serif-title font-bold tracking-tight text-[#f5f1ca] leading-tight">
              Mengenal Keluarga Besar <br />
              <span className="italic text-[#f2eb87]">
                {settings.class_name || 'XII TKJ'}
              </span>
            </h2>

            <p className="text-sm sm:text-base text-[#d8d6c6]/85 leading-relaxed font-normal">
              Kami adalah entitas pembelajar teknologi informasi tingkat akhir yang berfokus pada rekayasa infrastruktur jaringan enterprise, komputasi awan (cloud), keamanan siber, dan sistem transmisi data modern.
            </p>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-4 rounded-2xl bg-[#1f1d19] border border-[#f5f1ca]/12">
                <span className="text-[11px] font-semibold text-[#9e9a8d] uppercase tracking-wider block mb-1">
                  Program Keahlian
                </span>
                <span className="font-bold text-sm text-[#f5f1ca]">
                  Teknik Komputer & Jaringan
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-[#1f1d19] border border-[#f5f1ca]/12">
                <span className="text-[11px] font-semibold text-[#9e9a8d] uppercase tracking-wider block mb-1">
                  Tahun Ajaran
                </span>
                <span className="font-bold text-sm text-[#f2eb87]">
                  {settings.academic_year || '2026/2027'}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-[#1f1d19] border border-[#f5f1ca]/12 col-span-2 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-semibold text-[#9e9a8d] uppercase tracking-wider block mb-0.5">
                    Wali Kelas Pembimbing
                  </span>
                  <span className="font-bold text-sm text-[#f5f1ca]">
                    {settings.homeroom_teacher || 'Bu Febriyana, S.T.'}
                  </span>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-[#f2eb87]/15 text-[#f2eb87] border border-[#f2eb87]/30 font-semibold">
                  Guru Pembimbing
                </span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Key Metrics in BEM FEB UI Style */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-6 grid grid-cols-2 gap-4"
          >
            <div className="p-6 rounded-2xl bg-[#1f1d19] border border-[#f5f1ca]/15 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider font-semibold text-[#9e9a8d]">
                  Total Anggota
                </span>
                <Users className="w-4 h-4 text-[#f2eb87]" />
              </div>
              <div className="text-4xl font-serif-title font-bold text-[#f5f1ca]">
                {totalStudents}
                <span className="text-sm font-sans font-normal text-[#9e9a8d] ml-1">Siswa</span>
              </div>
              <p className="text-[11px] text-[#9e9a8d]">100% Aktif Terdaftar</p>
            </div>

            <div className="p-6 rounded-2xl bg-[#1f1d19] border border-[#f5f1ca]/15 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider font-semibold text-[#9e9a8d]">
                  Laki-laki
                </span>
                <span className="text-xs font-bold text-[#f2eb87]">
                  {totalStudents ? Math.round((totalMale / totalStudents) * 100) : 0}%
                </span>
              </div>
              <div className="text-4xl font-serif-title font-bold text-[#f2eb87]">
                {totalMale}
                <span className="text-sm font-sans font-normal text-[#9e9a8d] ml-1">Siswa</span>
              </div>
              <p className="text-[11px] text-[#9e9a8d]">Komposisi Anggota</p>
            </div>

            <div className="p-6 rounded-2xl bg-[#1f1d19] border border-[#f5f1ca]/15 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider font-semibold text-[#9e9a8d]">
                  Perempuan
                </span>
                <span className="text-xs font-bold text-[#f5f1ca]">
                  {totalStudents ? Math.round((totalFemale / totalStudents) * 100) : 0}%
                </span>
              </div>
              <div className="text-4xl font-serif-title font-bold text-[#f5f1ca]">
                {totalFemale}
                <span className="text-sm font-sans font-normal text-[#9e9a8d] ml-1">Siswi</span>
              </div>
              <p className="text-[11px] text-[#9e9a8d]">Komposisi Anggota</p>
            </div>

            <div className="p-6 rounded-2xl bg-[#1f1d19] border border-[#f5f1ca]/15 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider font-semibold text-[#9e9a8d]">
                  Kelulusan
                </span>
                <GraduationCap className="w-4 h-4 text-[#f2eb87]" />
              </div>
              <div className="text-4xl font-serif-title font-bold text-[#f2eb87]">
                2027
              </div>
              <p className="text-[11px] text-[#9e9a8d]">Target Selesai Pendidikan</p>
            </div>
          </motion.div>
        </div>

        {/* Section 2: BEM FEB UI Signature "Our Core Values" */}
        <div className="space-y-8 pt-8 border-t border-[#f5f1ca]/10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#f2eb87]">
              — NILAI DASAR KABINET —
            </span>
            <h3 className="text-3xl sm:text-4xl font-serif-title font-bold text-[#f5f1ca]">
              Our Core Values
            </h3>
            <p className="text-xs sm:text-sm text-[#9e9a8d]">
              Prinsip dan nilai luhur yang menjadi pedoman fungsionaris dan seluruh anggota kelas XII TKJ dalam berkarya dan berprestasi.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {CORE_VALUES.map((val, idx) => {
              const Icon = val.icon;
              return (
                <motion.div
                  key={val.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ y: -6 }}
                  className="p-6 rounded-2xl bg-[#1f1d19] border border-[#f5f1ca]/12 hover:border-[#f2eb87]/60 hover:shadow-[0_16px_36px_-10px_rgba(242,235,135,0.18)] transition-all space-y-3 group cursor-default"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#161512] border border-[#f2eb87]/30 flex items-center justify-center text-[#f2eb87] group-hover:scale-110 group-hover:border-[#f2eb87] transition-all">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-lg font-serif-title font-bold text-[#f5f1ca] group-hover:text-[#f2eb87] transition-colors">
                      {val.title}
                    </h4>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[#f2eb87] block mt-0.5">
                      {val.subtitle}
                    </span>
                  </div>
                  <p className="text-xs text-[#d8d6c6]/80 leading-relaxed">
                    {val.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
