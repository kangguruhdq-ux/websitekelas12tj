'use client';

import React from 'react';
import Image from 'next/image';
import { Student } from '@/types';
import { getStudentAvatarUrl } from '@/lib/seed-data';
import { motion } from 'framer-motion';
import { ChevronRight, Cpu } from 'lucide-react';

interface StudentCardProps {
  student: Student;
  onClick: () => void;
}

export default function StudentCard({ student, onClick }: StudentCardProps) {
  const photo = student.photo_url || getStudentAvatarUrl(student.name, student.gender);
  const isMale = student.gender === 'L';

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.01 }}
      transition={{ type: 'spring', damping: 22, stiffness: 350 }}
      onClick={onClick}
      className="group relative cursor-pointer bg-[#1f1d19] rounded-2xl border border-[#f5f1ca]/12 p-5 hover:border-[#f2eb87]/50 hover:shadow-xl hover:shadow-black/60 transition-all duration-300 flex flex-col justify-between overflow-hidden"
    >
      {/* Subtle top indicator bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#f2eb87]/40 via-[#f5f1ca]/40 to-transparent group-hover:from-[#f2eb87] group-hover:to-[#f5f1ca] transition-all" />

      <div>
        {/* Avatar & Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-[#161512] border border-[#f5f1ca]/20 shadow-inner flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
            <Image
              src={photo}
              alt={student.name}
              width={64}
              height={64}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>

          <span className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#161512] text-[#f2eb87] border border-[#f2eb87]/30">
            {isMale ? 'Laki-laki' : 'Perempuan'}
          </span>
        </div>

        {/* Student Name */}
        <h3 className="font-serif-title font-bold text-base text-[#f5f1ca] group-hover:text-[#f2eb87] transition-colors line-clamp-1 mb-1">
          {student.name}
        </h3>

        {/* Major */}
        <p className="text-xs text-[#9e9a8d] mb-3 line-clamp-1">
          {student.major}
        </p>

        {/* Elective Subject Badge */}
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#161512] border border-[#f5f1ca]/10 text-[11px] text-[#d8d6c6] w-full mb-2">
          <Cpu className="w-3 h-3 text-[#f2eb87] flex-shrink-0" />
          <span className="truncate">{student.elective_subject || 'Teknik Jaringan'}</span>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="pt-3 border-t border-[#f5f1ca]/10 flex items-center justify-between text-xs text-[#9e9a8d] group-hover:text-[#f2eb87] transition-colors">
        <span>Profil Lengkap</span>
        <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
      </div>
    </motion.div>
  );
}
