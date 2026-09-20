'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useClassData } from '@/context/ClassDataContext';
import { Student } from '@/types';
import { getStudentAvatarUrl } from '@/lib/seed-data';
import {
  Monitor,
  Server,
  User,
  GraduationCap,
  Sparkles,
  Search,
  Wifi,
  Cpu,
  X,
  ShieldCheck,
} from 'lucide-react';

export default function SeatingPlanPage() {
  const { students, settings } = useClassData();
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // 17 desks for 34 students (2 students per desk)
  // Divide into 4 rows in a lab layout
  const desks = Array.from({ length: 17 }, (_, idx) => {
    const s1 = students[idx * 2] || null;
    const s2 = students[idx * 2 + 1] || null;
    return {
      deskNum: idx + 1,
      student1: s1,
      student2: s2,
    };
  });

  const filteredDesks = desks.filter((d) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const name1 = d.student1?.name.toLowerCase() || '';
    const name2 = d.student2?.name.toLowerCase() || '';
    return name1.includes(q) || name2.includes(q) || `meja ${d.deskNum}`.includes(q);
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="min-h-screen bg-[#161512] text-[#d8d6c6] pt-28 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
    >
      {/* Background Ambience */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-[#f2eb87]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-10 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-[#1f1d19] text-[#f2eb87] border border-[#f2eb87]/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="uppercase tracking-widest text-[10px]">TOPOLOGI FISIK & SEATING PLAN</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif-title font-bold text-[#f5f1ca]">
            Denah Meja Kelas & Lab XII TKJ
          </h1>
          <p className="text-xs sm:text-sm text-[#9e9a8d] leading-relaxed">
            Visualisasi penataan tempat duduk praktikum dan workstation komputer jaringan 34 siswa keluarga besar {settings.class_name || 'XII TKJ'}.
          </p>

          {/* Search Bar */}
          <div className="pt-2 max-w-md mx-auto">
            <div className="relative">
              <Search className="w-4 h-4 text-[#9e9a8d] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari nama teman atau nomor meja..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#1f1d19] border border-[#f5f1ca]/15 text-[#f5f1ca] text-xs focus:outline-none focus:border-[#f2eb87]"
              />
            </div>
          </div>
        </div>

        {/* Classroom / Lab Map Frame */}
        <div className="p-6 sm:p-10 rounded-3xl bg-[#1f1d19] border border-[#f5f1ca]/15 shadow-2xl space-y-10">
          {/* Front Stage: Teacher Podium, Screen, and Server Rack */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pb-8 border-b border-[#f5f1ca]/10 items-center">
            {/* Server Rack Corner */}
            <div className="md:col-span-3 p-4 rounded-2xl bg-[#161512] border border-[#f2eb87]/30 flex items-center gap-3 text-xs">
              <div className="w-10 h-10 rounded-xl bg-[#1f1d19] border border-[#f2eb87]/40 text-[#f2eb87] flex items-center justify-center flex-shrink-0">
                <Server className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-[#f2eb87] uppercase font-bold block">
                  Core Rack Server
                </span>
                <span className="text-[#9e9a8d] text-[11px]">MikroTik CCR + 48P Switch</span>
              </div>
            </div>

            {/* Front Whiteboard / Projector Screen */}
            <div className="md:col-span-6 p-4 rounded-2xl bg-[#161512] border border-[#f5f1ca]/10 text-center space-y-1">
              <span className="text-[10px] uppercase tracking-widest text-[#f2eb87] font-bold">
                PAPAN TULIS & LAYAR PROYEKTOR UTAMA
              </span>
              <p className="text-xs text-[#d8d6c6]">Area Pengajaran & Presentasi Praktik Jaringan</p>
            </div>

            {/* Homeroom Teacher Podium */}
            <div className="md:col-span-3 p-4 rounded-2xl bg-[#161512] border border-[#f2eb87]/30 flex items-center gap-3 text-xs">
              <div className="w-10 h-10 rounded-xl bg-[#1f1d19] border border-[#f2eb87]/40 text-[#f2eb87] flex items-center justify-center flex-shrink-0">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-[#f2eb87] uppercase font-bold block">
                  Podium Pembimbing
                </span>
                <span className="text-[#f5f1ca] font-medium text-[11px] truncate block">
                  {settings.homeroom_teacher || 'Bu Febriyana, S.T.'}
                </span>
              </div>
            </div>
          </div>

          {/* Grid of Student Desks */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredDesks.map((d) => (
              <div
                key={d.deskNum}
                className="p-4 rounded-2xl bg-[#161512] border border-[#f5f1ca]/12 hover:border-[#f2eb87]/50 transition-all space-y-3 shadow-md group"
              >
                {/* Desk Header */}
                <div className="flex items-center justify-between pb-2 border-b border-[#f5f1ca]/10">
                  <div className="flex items-center gap-1.5">
                    <Monitor className="w-3.5 h-3.5 text-[#f2eb87]" />
                    <span className="font-mono text-xs font-bold text-[#f5f1ca]">
                      Meja #{d.deskNum}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-[#9e9a8d] px-2 py-0.5 rounded bg-[#1f1d19]">
                    VLAN {10 + d.deskNum}
                  </span>
                </div>

                {/* Left Seat (Student 1) */}
                {d.student1 ? (
                  <div
                    onClick={() => setSelectedStudent(d.student1)}
                    className="p-2.5 rounded-xl bg-[#1f1d19] hover:bg-[#282621] border border-[#f5f1ca]/5 hover:border-[#f2eb87]/40 cursor-pointer transition-all flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      <div className="w-7 h-7 rounded-lg bg-[#161512] border border-[#f2eb87]/30 flex items-center justify-center text-[#f2eb87] flex-shrink-0 text-xs font-bold">
                        A
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-xs font-medium text-[#f5f1ca] truncate">
                          {d.student1.name}
                        </p>
                        <p className="text-[10px] text-[#9e9a8d] font-mono">
                          192.168.27.{d.deskNum * 2}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-2.5 rounded-xl bg-[#1f1d19]/40 border border-dashed border-[#f5f1ca]/10 text-[11px] text-[#9e9a8d] text-center">
                    Kursi Kosong
                  </div>
                )}

                {/* Right Seat (Student 2) */}
                {d.student2 ? (
                  <div
                    onClick={() => setSelectedStudent(d.student2)}
                    className="p-2.5 rounded-xl bg-[#1f1d19] hover:bg-[#282621] border border-[#f5f1ca]/5 hover:border-[#f2eb87]/40 cursor-pointer transition-all flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      <div className="w-7 h-7 rounded-lg bg-[#161512] border border-[#f2eb87]/30 flex items-center justify-center text-[#f2eb87] flex-shrink-0 text-xs font-bold">
                        B
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-xs font-medium text-[#f5f1ca] truncate">
                          {d.student2.name}
                        </p>
                        <p className="text-[10px] text-[#9e9a8d] font-mono">
                          192.168.27.{d.deskNum * 2 + 1}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-2.5 rounded-xl bg-[#1f1d19]/40 border border-dashed border-[#f5f1ca]/10 text-[11px] text-[#9e9a8d] text-center">
                    Kursi Kosong
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Student Detail Modal */}
      <AnimatePresence>
        {selectedStudent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedStudent(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-md bg-[#1f1d19] border border-[#f5f1ca]/20 rounded-3xl p-6 shadow-2xl z-10 space-y-5 text-[#d8d6c6]"
            >
              <div className="flex items-start justify-between">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#161512] text-[#f2eb87] border border-[#f2eb87]/30">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Workstation Profile</span>
                </div>
                <button
                  onClick={() => setSelectedStudent(null)}
                  className="p-1 rounded-full text-[#9e9a8d] hover:text-[#f5f1ca]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center gap-4 pt-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selectedStudent.photo_url || getStudentAvatarUrl(selectedStudent.name, selectedStudent.gender)}
                  alt={selectedStudent.name}
                  className="w-16 h-16 rounded-2xl object-cover bg-[#161512] border-2 border-[#f2eb87]/40 shadow-inner"
                />
                <div>
                  <h3 className="font-serif-title font-bold text-lg text-[#f5f1ca] leading-tight">
                    {selectedStudent.name}
                  </h3>
                  <p className="text-xs text-[#9e9a8d] mt-0.5">
                    Anggota Resmi {settings.class_name || 'XII TKJ'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-[#161512] border border-[#f5f1ca]/10">
                  <span className="text-[#9e9a8d] block text-[10px] uppercase">Peminatan Kejuruan</span>
                  <span className="font-semibold text-[#f5f1ca] line-clamp-1 mt-0.5">
                    {selectedStudent.elective_subject || 'Routing & Switching'}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-[#161512] border border-[#f5f1ca]/10">
                  <span className="text-[#9e9a8d] block text-[10px] uppercase">Status Kehadiran</span>
                  <span className="font-bold text-emerald-400 mt-0.5 block">100% Terdaftar</span>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <a
                  href="/siswa"
                  className="px-4 py-2 rounded-xl bg-[#f2eb87] text-[#111111] font-bold text-xs hover:bg-[#eae26e] transition-all shadow-md shadow-[#f2eb87]/20"
                >
                  Lihat di Direktori Siswa →
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
