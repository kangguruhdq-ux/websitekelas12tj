'use client';

import React from 'react';
import HeroSection from '@/components/HeroSection';
import TentangKelas from '@/components/TentangKelas';
import FloatingStudentCarousel from '@/components/FloatingStudentCarousel';
import HomeHighlights from '@/components/HomeHighlights';
import TodayRadar from '@/components/TodayRadar';
import MilestoneCountdown from '@/components/MilestoneCountdown';
import HomeProjects from '@/components/HomeProjects';
import { useClassData } from '@/context/ClassDataContext';
import { motion } from 'framer-motion';

export default function HomePage() {
  const { students } = useClassData();

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col min-h-screen transition-colors duration-300"
      style={{
        backgroundColor: 'var(--bg-primary)',
        color: 'var(--text-body)',
      }}
    >
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Milestone Countdown (UKK & Wisuda) */}
      <MilestoneCountdown />

      {/* 3. Radar Harian (Jadwal Mapel & Piket Otomatis) */}
      <TodayRadar />

      {/* 4. Tentang Kelas & Core Values & Dynamic Live Statistics */}
      <TentangKelas />

      {/* 5. Floating Student Cards Carousel Section */}
      <section
        id="anggota"
        className="py-16 sm:py-24 relative overflow-hidden border-t"
        style={{
          backgroundColor: 'var(--bg-primary)',
          borderColor: 'var(--border-color)',
        }}
      >
        {/* Subtle glow backdrop */}
        <div
          className="absolute top-1/2 right-0 w-96 h-96 rounded-full blur-3xl pointer-events-none -translate-y-1/2"
          style={{ backgroundColor: 'var(--theme-glow)' }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <FloatingStudentCarousel students={students} />
          </motion.div>
        </div>
      </section>

      {/* 6. Featured Student Projects Showcase */}
      <HomeProjects />

      {/* 7. Announcements, Agenda, and Gallery Showcase Previews */}
      <HomeHighlights />
    </motion.div>
  );
}
