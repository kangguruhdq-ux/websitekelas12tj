'use client';

import React, { useRef, useState } from 'react';
import { Student } from '@/types';
import StudentCard from './StudentCard';
import StudentModal from './StudentModal';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Sparkles, Users } from 'lucide-react';

interface FloatingStudentCarouselProps {
  students: Student[];
}

export default function FloatingStudentCarousel({ students }: FloatingStudentCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 340;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="relative w-full">
      {/* Header controls with Arrow Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#1f1d19] text-[#f2eb87] border border-[#f2eb87]/30 mb-2.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="uppercase tracking-widest text-[10px]">High Achievers & Anggota</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-serif-title font-bold tracking-tight text-[#f5f1ca]">
            Keluarga Besar XII TKJ
          </h2>
          <p className="text-xs sm:text-sm text-[#9e9a8d] mt-1">
            Jelajahi profil 34 rekan seperjuangan kelas XII Teknik Komputer dan Jaringan.
          </p>
        </div>

        {/* Carousel Navigation Arrow Controls */}
        <div className="flex items-center gap-2.5 self-end sm:self-auto">
          <a
            href="/siswa"
            className="text-xs font-semibold text-[#f2eb87] hover:underline mr-2 inline-flex items-center gap-1.5"
          >
            <Users className="w-3.5 h-3.5" />
            <span>Lihat Direktori Lengkap ({students.length})</span>
          </a>

          <button
            onClick={() => scroll('left')}
            aria-label="Geser ke Kiri"
            className="p-2.5 rounded-xl bg-[#1f1d19] border border-[#f5f1ca]/15 text-[#f5f1ca] hover:border-[#f2eb87] hover:text-[#f2eb87] shadow-sm transition-all active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <button
            onClick={() => scroll('right')}
            aria-label="Geser ke Kanan"
            className="p-2.5 rounded-xl bg-[#1f1d19] border border-[#f5f1ca]/15 text-[#f5f1ca] hover:border-[#f2eb87] hover:text-[#f2eb87] shadow-sm transition-all active:scale-95"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Floating Cards Horizontal Scroll Track */}
      <div
        ref={scrollContainerRef}
        className="flex gap-5 overflow-x-auto pb-6 pt-2 px-1 hide-scrollbar scroll-smooth snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {students.map((student, idx) => (
          <motion.div
            key={student.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: Math.min(idx * 0.05, 0.5) }}
            className="w-[280px] sm:w-[310px] flex-shrink-0 snap-start"
          >
            <StudentCard student={student} onClick={() => setSelectedStudent(student)} />
          </motion.div>
        ))}
      </div>

      {/* Detail Modal */}
      <StudentModal student={selectedStudent} onClose={() => setSelectedStudent(null)} />
    </div>
  );
}
