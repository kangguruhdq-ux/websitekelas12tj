'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Student } from '@/types';
import { getStudentAvatarUrl } from '@/lib/seed-data';
import { formatDate } from '@/lib/utils';
import {
  X,
  User,
  ShieldCheck,
  BookOpen,
  Calendar,
  MapPin,
  HeartHandshake,
  Hash,
  Cpu,
  GraduationCap,
  Sparkles,
} from 'lucide-react';

interface StudentModalProps {
  student: Student | null;
  onClose: () => void;
}

export default function StudentModal({ student, onClose }: StudentModalProps) {
  if (!student) return null;

  const photo = student.photo_url || getStudentAvatarUrl(student.name, student.gender);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-lg bg-[#1a1915] border border-[#f5f1ca]/20 rounded-3xl shadow-2xl shadow-black overflow-hidden z-10 max-h-[90vh] flex flex-col text-[#d8d6c6]"
        >
          {/* Header Banner */}
          <div className="relative h-28 bg-gradient-to-r from-[#2a261f] via-[#1f1d19] to-[#161512] p-4 flex justify-between items-start border-b border-[#f5f1ca]/10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#161512]/80 backdrop-blur-md text-[#f2eb87] border border-[#f2eb87]/30">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Profil Anggota XII TKJ</span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-[#161512]/60 hover:bg-[#161512] text-[#f5f1ca] hover:text-[#f2eb87] transition-colors"
              aria-label="Tutup Detail"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Profile Header */}
          <div className="px-6 -mt-12 flex items-end gap-4">
            <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-4 border-[#1a1915] shadow-xl bg-[#161512] flex-shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo}
                alt={student.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="mb-1 flex-1 min-w-0">
              <h3 className="font-serif-title text-xl font-bold text-[#f5f1ca] truncate">
                {student.name}
              </h3>
              <p className="text-xs text-[#9e9a8d] truncate">
                {student.major}
              </p>
            </div>
          </div>

          {/* Body Content */}
          <div className="p-6 overflow-y-auto space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-[#161512] border border-[#f5f1ca]/10">
                <span className="text-[#9e9a8d] block mb-1">
                  Jenis Kelamin
                </span>
                <span className="font-bold text-[#f5f1ca]">
                  {student.gender === 'L' ? 'Laki-laki' : 'Perempuan'}
                </span>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#161512] border border-[#f5f1ca]/10">
                <span className="text-[#9e9a8d] block mb-1">
                  Status Siswa
                </span>
                <span className="inline-flex items-center gap-1.5 font-bold text-[#f2eb87]">
                  <span className="w-2 h-2 rounded-full bg-[#f2eb87] animate-pulse" />
                  Siswa Aktif
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#161512] border border-[#f5f1ca]/10 space-y-3">
              <div className="flex items-center justify-between py-1 border-b border-[#f5f1ca]/5">
                <span className="text-[#9e9a8d] flex items-center gap-2">
                  <GraduationCap className="w-3.5 h-3.5 text-[#f2eb87]" />
                  <span>Tingkat & Jurusan</span>
                </span>
                <span className="font-semibold text-[#f5f1ca]">
                  XII - {student.major || 'Teknik Komputer dan Jaringan'}
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-[#f5f1ca]/5">
                <span className="text-[#9e9a8d] flex items-center gap-2">
                  <Cpu className="w-3.5 h-3.5 text-[#f2eb87]" />
                  <span>Konsentrasi Keahlian</span>
                </span>
                <span className="font-semibold text-[#f2eb87] text-right max-w-[220px] truncate">
                  {student.elective_subject || 'Teknik Komputer dan Jaringan'}
                </span>
              </div>

              <div className="flex items-center justify-between py-1">
                <span className="text-[#9e9a8d] flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#f2eb87]" />
                  <span>Tahun Angkatan</span>
                </span>
                <span className="text-[#f5f1ca] font-medium">
                  Class of 2026/2027
                </span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 bg-[#161512] border-t border-[#f5f1ca]/10 flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-[#f2eb87] text-[#111111] font-bold text-xs hover:bg-[#e6df73] transition-colors"
            >
              Tutup
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
