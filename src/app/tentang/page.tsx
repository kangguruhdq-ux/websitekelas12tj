'use client';

import React from 'react';
import { useClassData } from '@/context/ClassDataContext';
import { motion } from 'framer-motion';
import {
  Sparkles,
  HeartHandshake,
  TrendingUp,
  ShieldCheck,
  Award,
  GraduationCap,
  Cpu,
  Server,
  Network,
  Users,
  ArrowRight,
  CheckCircle2,
  BookOpen,
  Camera,
  Image as ImageIcon,
  MapPin,
  Calendar,
} from 'lucide-react';
import { INITIAL_CLASS_MEMORIES } from '@/lib/seed-data';

const CORE_VALUES = [
  {
    title: 'Togetherness',
    subtitle: 'Kebersamaan & Solidaritas',
    description:
      'Fondasi utama yang mempererat seluruh 34 anggota kelas XII TKJ. Menjadikan perbedaan latar belakang sebagai jembatan sinergi dan saling menopang dalam setiap praktikum dan rintangan akademik.',
    icon: HeartHandshake,
  },
  {
    title: 'Progressive',
    subtitle: 'Kemajuan & Inovasi',
    description:
      'Selalu terdepan dalam menguasai teknologi jaringan mutakhir, komputasi awan, dan otomasi infrastruktur dengan pola pikir kritis, adaptif, dan berorientasi masa depan.',
    icon: TrendingUp,
  },
  {
    title: 'Integrity',
    subtitle: 'Kejujuran & Disiplin',
    description:
      'Menjunjung tinggi etika profesional, kejujuran dalam setiap pengerjaan tugas dan praktikum laboratorium, serta integritas moral yang teguh dalam berorganisasi.',
    icon: ShieldCheck,
  },
  {
    title: 'Excellence',
    subtitle: 'Kualitas & Prestasi',
    description:
      'Berdedikasi untuk mencapai standar keahlian tertinggi dalam sertifikasi kejuruan industri (MikroTik MTCNA, Cisco CCNA, Linux SysAdmin) serta membawa nama baik almamater.',
    icon: Award,
  },
];

const SPECIALIZATIONS = [
  {
    title: 'Enterprise Routing & Switching',
    desc: 'Konfigurasi router MikroTik, Cisco Catalyst, VLAN, OSPF, BGP, serta optimasi routing protokol skala enterprise.',
    icon: Network,
  },
  {
    title: 'Cloud Computing & Server Virtualization',
    desc: 'Implementasi virtualization Proxmox VE, Docker containerization, manajemen Linux Server Ubuntu/Debian, dan cloud deployment.',
    icon: Server,
  },
  {
    title: 'Cyber Security & Network Defense',
    desc: 'Penerapan firewall security, intrusion detection, hardening konfigurasi server, dan audit keamanan sistem komunikasi data.',
    icon: ShieldCheck,
  },
  {
    title: 'Infrastruktur Fiber Optic & Wireless',
    desc: 'Teknik penyambungan serat optik (splicing), OTDR measurement, instalasi jaringan nirkabel point-to-point & point-to-multipoint.',
    icon: Cpu,
  },
];

export default function TentangPage() {
  const { settings, students } = useClassData();

  const totalStudents = students.length || 34;
  const totalMale = students.filter((s) => s.gender === 'L').length || 22;
  const totalFemale = students.filter((s) => s.gender === 'P').length || 12;
  const memories = (settings.class_memories && settings.class_memories.length > 0) ? settings.class_memories : INITIAL_CLASS_MEMORIES;

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="min-h-screen py-12 sm:py-20 bem-grid bg-[#161512] text-[#d8d6c6]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20 sm:space-y-28">
        {/* 1. Hero Section (BEM FEB UI Editorial Style) */}
        <section className="text-center max-w-4xl mx-auto space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-2"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-[#1f1d19] text-[#f2eb87] border border-[#f2eb87]/30 shadow-lg">
              <Sparkles className="w-3.5 h-3.5" />
              <span className="uppercase tracking-widest text-[10px]">
                PROFIL RESMI KELAS & KABINET
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#f2eb87]" />
              <span className="text-[#d8d6c6]">{settings.academic_year || '2026/2027'}</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#f2eb87]/15 text-[#f2eb87] border border-[#f2eb87]/40 tracking-wider">
              ANGKATAN 27
            </div>
          </motion.div>

          <div className="space-y-3">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-xs sm:text-sm uppercase tracking-[0.25em] font-semibold text-[#f2eb87]"
            >
              — BRIDGING EXCELLENCE —
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="text-4xl sm:text-6xl font-serif-title font-bold tracking-tight text-[#f5f1ca] leading-tight"
            >
              Mengenal Keluarga Besar <br />
              <span className="italic underline decoration-[#f2eb87]/40 underline-offset-8 text-[#f2eb87]">
                XII TJ — Teknik Komputer dan Jaringan
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-sm sm:text-lg text-[#d8d6c6]/85 max-w-2xl mx-auto leading-relaxed"
            >
              {settings.description ||
                'Komunitas pembelajar teknologi informasi tingkat akhir yang berdedikasi membangun sinergi kebersamaan, integritas moral, dan penguasaan infrastruktur jaringan komputer mutakhir.'}
            </motion.p>
          </div>
        </section>

        {/* 2. Visi & Misi Kabinet Kelas */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Visi Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 p-8 rounded-3xl bg-[#1f1d19] border border-[#f5f1ca]/15 space-y-6 flex flex-col justify-between shadow-xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#f2eb87]/5 rounded-full blur-3xl pointer-events-none" />
            <div className="space-y-4 relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#161512] text-[#f2eb87] border border-[#f2eb87]/30">
                <Award className="w-3.5 h-3.5" />
                <span className="uppercase tracking-widest text-[10px]">VISI KELAS</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-serif-title font-bold text-[#f5f1ca]">
                Aspirasi Utama Kami
              </h3>
              <p className="text-sm sm:text-base text-[#d8d6c6]/90 leading-relaxed font-normal">
                &ldquo;Menjadi kesatuan kelas unggulan yang berdaya saing tinggi dalam kompetensi rekayasa jaringan dan komputasi awan, berlandaskan kekeluargaan erat, kedisiplinan moral, dan integritas profesional menuju jenjang karier industri.&rdquo;
              </p>
            </div>

            <div className="pt-6 border-t border-[#f5f1ca]/10 text-xs text-[#9e9a8d] flex items-center justify-between">
              <span>Fokus Angkatan:</span>
              <strong className="text-[#f2eb87]">Class of 2026/2027</strong>
            </div>
          </motion.div>

          {/* Misi Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7 p-8 rounded-3xl bg-[#1f1d19] border border-[#f5f1ca]/15 space-y-6 shadow-xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#161512] text-[#f5f1ca] border border-[#f5f1ca]/30">
              <BookOpen className="w-3.5 h-3.5 text-[#f2eb87]" />
              <span className="uppercase tracking-widest text-[10px]">MISI STRATEGIS</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-serif-title font-bold text-[#f5f1ca]">
              Empat Pilar Gerak Kelas
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  title: '1. Penguasaan Kompetensi',
                  desc: 'Memperdalam keahlian praktikum networking, server administration, dan teknologi komputasi cloud.',
                },
                {
                  title: '2. Solidaritas Kekeluargaan',
                  desc: 'Menciptakan ruang belajar kolaboratif, tutor sebaya, dan saling mendukung tanpa ada yang tertinggal.',
                },
                {
                  title: '3. Budaya Profesionalisme',
                  desc: 'Menerapkan standar kedisiplinan laboratorium, etika komunikasi, dan penyelesaian proyek tepat waktu.',
                },
                {
                  title: '4. Kontribusi Almamater',
                  desc: 'Menorehkan prestasi dalam lomba kompetensi siswa (LKS), sertifikasi kejuruan, dan kegiatan sekolah.',
                },
              ].map((misi) => (
                <div
                  key={misi.title}
                  className="p-4 rounded-2xl bg-[#161512] border border-[#f5f1ca]/10 space-y-1.5"
                >
                  <h4 className="font-serif-title font-bold text-sm text-[#f2eb87]">
                    {misi.title}
                  </h4>
                  <p className="text-xs text-[#d8d6c6]/80 leading-relaxed">
                    {misi.desc}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* 3. Our Core Values (BEM FEB UI Signature) */}
        <section className="space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#f2eb87]">
              — NILAI DASAR KABINET —
            </span>
            <h3 className="text-3xl sm:text-4xl font-serif-title font-bold text-[#f5f1ca]">
              Our Core Values
            </h3>
            <p className="text-xs sm:text-sm text-[#9e9a8d]">
              Prinsip luhur yang menuntun karakter, interaksi harian, dan dedikasi setiap fungsionaris serta anggota kelas XII TKJ.
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
        </section>

        {/* 4. Konsentrasi Keahlian & Spesialisasi TKJ */}
        <section className="space-y-8 pt-6 border-t border-[#f5f1ca]/10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#f2eb87]">
              — KOMPETENSI TEKNOLOGI —
            </span>
            <h3 className="text-3xl sm:text-4xl font-serif-title font-bold text-[#f5f1ca]">
              Konsentrasi Keahlian Kejuruan
            </h3>
            <p className="text-xs sm:text-sm text-[#9e9a8d]">
              Infrastruktur teknologi yang dipelajari dan dikembangkan oleh siswa kelas XII TKJ.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {SPECIALIZATIONS.map((spec, i) => {
              const Icon = spec.icon;
              return (
                <motion.div
                  key={spec.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  whileHover={{ y: -3 }}
                  className="p-6 rounded-2xl bg-[#1f1d19] border border-[#f5f1ca]/12 hover:border-[#f2eb87]/50 hover:shadow-[0_12px_24px_-8px_rgba(242,235,135,0.12)] flex items-start gap-4 transition-all"
                >
                  <div className="p-3 rounded-xl bg-[#161512] border border-[#f2eb87]/30 text-[#f2eb87] flex-shrink-0">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-base font-serif-title font-bold text-[#f5f1ca]">
                      {spec.title}
                    </h4>
                    <p className="text-xs text-[#d8d6c6]/80 leading-relaxed">
                      {spec.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* 5. Foto Bersama Kelas & Galeri Rekam Jejak Kenangan */}
        <motion.section
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-12 pt-6 border-t border-[#f5f1ca]/10"
        >
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#1f1d19] text-[#f2eb87] border border-[#f2eb87]/30">
              <Camera className="w-3.5 h-3.5" />
              <span className="uppercase tracking-widest text-[10px]">DOKUMENTASI ANGKATAN & KELAS</span>
            </div>
            <h3 className="text-3xl sm:text-4xl font-serif-title font-bold text-[#f5f1ca]">
              Foto Bersama & Rekam Jejak Kenangan
            </h3>
            <p className="text-xs sm:text-sm text-[#9e9a8d]">
              Potret kebersamaan 34 siswa, dedikasi praktikum berkesan, dan momen kebersamaan sepanjang perjalanan XII TKJ.
            </p>
          </div>

          {/* Master Featured Class Photo */}
          <div className="relative rounded-3xl overflow-hidden border border-[#f5f1ca]/20 bg-[#1f1d19] shadow-2xl group">
            <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full overflow-hidden bg-[#161512]">
              <img
                src={
                  settings.class_photo_url ||
                  'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1200&auto=format&fit=crop'
                }
                alt={settings.class_photo_title || 'Foto Bersama Kelas XII TKJ'}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#161512] via-[#161512]/40 to-transparent" />

              <div className="absolute top-4 left-4 sm:top-6 sm:left-6 flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#f2eb87] text-[#111111] shadow-md flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Official Class Portrait
                </span>
                <span className="px-3 py-1 rounded-full text-[11px] font-medium bg-[#161512]/85 backdrop-blur-md border border-[#f5f1ca]/20 text-[#f5f1ca]">
                  {settings.academic_year || '2026/2027'}
                </span>
              </div>

              <div className="absolute bottom-0 inset-x-0 p-6 sm:p-8 space-y-2">
                <h4 className="text-xl sm:text-3xl font-serif-title font-bold text-[#f5f1ca] drop-shadow-md">
                  {settings.class_photo_title || 'Foto Bersama Keluarga Besar XII Teknik Komputer dan Jaringan'}
                </h4>
                <p className="text-xs sm:text-sm text-[#d8d6c6]/90 max-w-3xl leading-relaxed drop-shadow">
                  {settings.class_photo_description ||
                    'Potret kebersamaan 34 siswa bersama Wali Kelas Bu Febriyana, S.T. di laboratorium komputer dan jaringan sekolah.'}
                </p>
              </div>
            </div>
          </div>

          {/* Grid of Class Memories */}
          {memories && memories.length > 0 && (
            <div className="space-y-6 pt-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h4 className="text-lg sm:text-xl font-serif-title font-bold text-[#f5f1ca] flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-[#f2eb87]" />
                    Momen Spesial & Arsip Praktikum
                  </h4>
                  <p className="text-xs text-[#9e9a8d]">
                    Kilasan aktivitas praktikum, kejuaraan, dan kebersamaan di luar jam pelajaran.
                  </p>
                </div>
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#1f1d19] border border-[#f5f1ca]/15 text-[#f2eb87]">
                  {memories.length} Momen
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {memories.map((mem, idx) => (
                  <motion.div
                    key={mem.id || idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.08, duration: 0.5 }}
                    whileHover={{ y: -5 }}
                    className="rounded-2xl bg-[#1f1d19] border border-[#f5f1ca]/12 hover:border-[#f2eb87]/50 hover:shadow-[0_16px_32px_-10px_rgba(242,235,135,0.15)] overflow-hidden flex flex-col group transition-all"
                  >
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#161512]">
                      <img
                        src={mem.image_url}
                        alt={mem.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#1f1d19] via-transparent to-transparent opacity-80" />
                      {mem.date && (
                        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-medium bg-[#161512]/85 backdrop-blur-sm border border-[#f5f1ca]/20 text-[#f2eb87] flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {mem.date}
                        </span>
                      )}
                    </div>
                    <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                      <div className="space-y-1">
                        {mem.location && (
                          <div className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-[#9e9a8d] font-semibold">
                            <MapPin className="w-3 h-3 text-[#f2eb87]" />
                            <span>{mem.location}</span>
                          </div>
                        )}
                        <h5 className="font-serif-title font-bold text-sm text-[#f5f1ca] group-hover:text-[#f2eb87] transition-colors line-clamp-2">
                          {mem.title}
                        </h5>
                        <p className="text-xs text-[#d8d6c6]/75 leading-relaxed line-clamp-3">
                          {mem.caption}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.section>

        {/* 6. Sambutan Wali Kelas & Profil Pembimbing */}
        <section className="p-8 sm:p-12 rounded-3xl bg-[#1f1d19] border border-[#f5f1ca]/15 shadow-2xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-4 text-center lg:text-left space-y-4">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-[#161512] border-2 border-[#f2eb87]/40 flex items-center justify-center text-[#f2eb87] mx-auto lg:mx-0 shadow-inner">
                <GraduationCap className="w-12 h-12" />
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider font-bold px-2.5 py-0.5 rounded-full bg-[#f2eb87] text-[#111111]">
                  Guru Pembimbing
                </span>
                <h4 className="text-xl sm:text-2xl font-serif-title font-bold text-[#f5f1ca] mt-2">
                  {settings.homeroom_teacher || 'Bu Febriyana, S.T.'}
                </h4>
                <p className="text-xs text-[#9e9a8d]">
                  Wali Kelas XII Teknik Komputer dan Jaringan
                </p>
              </div>
            </div>

            <div className="lg:col-span-8 space-y-4 border-t lg:border-t-0 lg:border-l border-[#f5f1ca]/10 pt-6 lg:pt-0 lg:pl-8">
              <span className="text-xs font-serif-title text-[#f2eb87] italic block text-lg">
                &ldquo;Pesan Pembimbing untuk Angkatan 2026/2027&rdquo;
              </span>
              <p className="text-xs sm:text-sm text-[#d8d6c6]/90 leading-relaxed font-normal">
                Perjalanan di tingkat akhir adalah fase penentuan di mana kematangan ilmu pengetahuan bertransformasi menjadi kesiapan nyata. Tetaplah rendah hati dalam belajar, jalin kekompakan antarteman, dan bangun reputasi yang membanggakan melalui dedikasi praktikum dan kejujuran berkarakter. Sukses selalu untuk XII TKJ!
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-[#9e9a8d]">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#f2eb87]" />
                  <span>Pendampingan Akademik</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#f2eb87]" />
                  <span>Sertifikasi Kompetensi</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#f2eb87]" />
                  <span>Pembentukan Karakter</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 7. Quick Action Links */}
        <section className="text-center space-y-6 pt-4">
          <h3 className="text-2xl font-serif-title font-bold text-[#f5f1ca]">
            Eksplorasi Portal Resmi XII TKJ
          </h3>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="/siswa"
              className="btn-bem-primary inline-flex items-center gap-2 text-xs hover:-translate-y-0.5 transition-transform"
            >
              <Users className="w-4 h-4" />
              <span>Lihat 34 Anggota Siswa</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <a
              href="/struktur"
              className="btn-bem-outline inline-flex items-center gap-2 text-xs hover:-translate-y-0.5 transition-transform"
            >
              <Network className="w-4 h-4 text-[#f2eb87]" />
              <span>Struktur Kepengurusan Kelas</span>
            </a>
          </div>
        </section>
      </div>
    </motion.div>
  );
}
