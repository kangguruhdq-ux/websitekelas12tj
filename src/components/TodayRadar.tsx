'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  Clock,
  Sparkles,
  CheckCircle2,
  UserCheck,
  BookOpen,
  Cpu,
  Layers,
  MapPin,
  User,
} from 'lucide-react';
import { useClassData } from '@/context/ClassDataContext';
import { DayScheduleItem, DayLesson } from '@/types';
import { INITIAL_DAILY_SCHEDULES } from '@/lib/seed-data';

export default function TodayRadar() {
  const { dailySchedules } = useClassData();
  const [currentDayNum, setCurrentDayNum] = useState<number>(1);
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [selectedBlockFilter, setSelectedBlockFilter] = useState<'all' | 'teori' | 'praktik'>('all');

  const schedulesToUse: DayScheduleItem[] =
    dailySchedules && dailySchedules.length > 0 ? dailySchedules : INITIAL_DAILY_SCHEDULES;

  useEffect(() => {
    const today = new Date().getDay();
    // Default to Monday (1) if weekend
    const effectiveDay = today >= 1 && today <= 5 ? today : 1;
    setCurrentDayNum(effectiveDay);
    setSelectedDay(effectiveDay);
  }, []);

  const activeSchedule =
    schedulesToUse.find((s) => s.dayNumber === selectedDay) ||
    schedulesToUse[0] ||
    INITIAL_DAILY_SCHEDULES[0];

  const subjects = activeSchedule.subjects || [];
  const theorySubjects = subjects.filter((s) => (s.block || 'teori') === 'teori');
  const practiceSubjects = subjects.filter((s) => s.block === 'praktik');

  const displayedSubjects =
    selectedBlockFilter === 'all'
      ? subjects
      : selectedBlockFilter === 'teori'
      ? theorySubjects
      : practiceSubjects;

  return (
    <motion.section
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10"
    >
      <div className="p-6 sm:p-10 rounded-3xl bg-[#1f1d19] border border-[#f5f1ca]/12 shadow-2xl relative overflow-hidden space-y-8">
        {/* Glow Accent */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#f2eb87]/5 rounded-full blur-3xl pointer-events-none" />

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#161512] text-[#f2eb87] border border-[#f2eb87]/30 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span className="uppercase tracking-widest text-[10px]">RADAR HARIAN XII TKJ</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-serif-title font-bold text-[#f5f1ca]">
              Jadwal Mapel & Regu Piket Kelas
            </h3>
            <p className="text-xs sm:text-sm text-[#9e9a8d]">
              Pantau jadwal pelajaran kejuruan (terbagi 2 blok: Teori & Praktik) serta petugas piket kebersihan harian.
            </p>
          </div>

          {/* Day Selector Buttons with animated indicator */}
          <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-[#161512] border border-[#f5f1ca]/10 overflow-x-auto">
            {schedulesToUse.map((d) => (
              <button
                key={d.dayNumber}
                onClick={() => setSelectedDay(d.dayNumber)}
                className={`relative px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                  selectedDay === d.dayNumber
                    ? 'text-[#161512] font-bold shadow-md shadow-[#f2eb87]/20'
                    : 'text-[#9e9a8d] hover:text-[#f5f1ca]'
                }`}
              >
                {selectedDay === d.dayNumber && (
                  <motion.div
                    layoutId="activeDayTab"
                    className="absolute inset-0 bg-[#f2eb87] rounded-xl z-0"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1">
                  {d.dayName}
                  {currentDayNum === d.dayNumber && (
                    <span className={`w-1.5 h-1.5 rounded-full ${selectedDay === d.dayNumber ? 'bg-emerald-900' : 'bg-emerald-400'}`} />
                  )}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* 2-Block Summary Counter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-[#161512] border border-[#f5f1ca]/10 relative z-10">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-[#9e9a8d] uppercase tracking-wider pl-1 hidden sm:inline">
              Filter Tampilan:
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setSelectedBlockFilter('all')}
                className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                  selectedBlockFilter === 'all'
                    ? 'bg-[#1f1d19] text-[#f5f1ca] border border-[#f5f1ca]/30'
                    : 'text-[#9e9a8d] hover:text-[#f5f1ca]'
                }`}
              >
                Semua ({subjects.length})
              </button>
              <button
                onClick={() => setSelectedBlockFilter('teori')}
                className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  selectedBlockFilter === 'teori'
                    ? 'bg-[#1f1d19] text-[#f5f1ca] border border-[#f5f1ca]/40'
                    : 'text-[#9e9a8d] hover:text-[#f5f1ca]'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5 text-[#f5f1ca]" />
                <span>Blok Teori</span>
                <span className="px-1.5 py-0.2 rounded-full bg-[#161512] text-[10px] font-mono">
                  {theorySubjects.length}
                </span>
              </button>
              <button
                onClick={() => setSelectedBlockFilter('praktik')}
                className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  selectedBlockFilter === 'praktik'
                    ? 'bg-[#f2eb87]/20 text-[#f2eb87] border border-[#f2eb87]/50'
                    : 'text-[#9e9a8d] hover:text-[#f2eb87]'
                }`}
              >
                <Cpu className="w-3.5 h-3.5 text-[#f2eb87]" />
                <span>Blok Praktik</span>
                <span className="px-1.5 py-0.2 rounded-full bg-[#161512] text-[#f2eb87] text-[10px] font-mono">
                  {practiceSubjects.length}
                </span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-[#9e9a8d] pr-2">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#f5f1ca]/60" />
              Teori: {theorySubjects.length} Mapel
            </span>
            <span className="flex items-center gap-1 text-[#f2eb87]">
              <span className="w-2 h-2 rounded-full bg-[#f2eb87]" />
              Praktik: {practiceSubjects.length} Mapel
            </span>
          </div>
        </div>

        {/* Animated Day Transition Container */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${selectedDay}-${selectedBlockFilter}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10"
          >
            {/* Left Column: Schedule Timeline (7 cols) */}
            <div className="lg:col-span-7 space-y-5">
              {/* If "all", show the 2 blocks divided clearly */}
              {selectedBlockFilter === 'all' ? (
                <div className="space-y-6">
                  {/* BLOK 1: PRAKTIK */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between pb-1 border-b border-[#f2eb87]/20">
                      <h4 className="text-xs uppercase font-bold tracking-wider text-[#f2eb87] flex items-center gap-2">
                        <Cpu className="w-4 h-4" />
                        <span>Blok Praktik & Laboratorium ({practiceSubjects.length})</span>
                      </h4>
                      <span className="text-[10px] uppercase tracking-wider font-semibold text-[#f2eb87] bg-[#f2eb87]/10 px-2 py-0.5 rounded-full border border-[#f2eb87]/20">
                        Hands-on Lab
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      {practiceSubjects.length > 0 ? (
                        practiceSubjects.map((s, idx) => (
                          <div
                            key={s.id || idx}
                            className="p-4 rounded-2xl bg-[#161512] border border-[#f2eb87]/30 hover:border-[#f2eb87] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group shadow-sm"
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-mono font-bold text-[#161512] bg-[#f2eb87] px-2 py-0.5 rounded-md shadow-sm">
                                  {s.time}
                                </span>
                                <span className="text-[11px] text-[#f2eb87] font-medium flex items-center gap-1">
                                  <MapPin className="w-3 h-3 text-[#f2eb87]" />
                                  {s.room}
                                </span>
                              </div>
                              <h5 className="font-serif-title font-bold text-sm text-[#f5f1ca] group-hover:text-[#f2eb87] transition-colors">
                                {s.subject}
                              </h5>
                            </div>
                            <div className="text-left sm:text-right text-[11px] text-[#9e9a8d] flex-shrink-0">
                              <span className="block text-[#d8d6c6] font-medium">{s.teacher}</span>
                              <span className="text-[#f2eb87]/80 text-[10px]">Instruktur Praktik</span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-4 text-center text-xs text-[#9e9a8d] rounded-2xl bg-[#161512] border border-dashed border-[#f5f1ca]/10">
                          Tidak ada jadwal blok praktik untuk hari ini.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* BLOK 2: TEORI */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between pb-1 border-b border-[#f5f1ca]/15">
                      <h4 className="text-xs uppercase font-bold tracking-wider text-[#f5f1ca] flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-[#f2eb87]" />
                        <span>Blok Teori & Akademik Umum ({theorySubjects.length})</span>
                      </h4>
                      <span className="text-[10px] uppercase tracking-wider font-semibold text-[#9e9a8d] bg-[#161512] px-2 py-0.5 rounded-full border border-[#f5f1ca]/15">
                        Kelas Teori
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      {theorySubjects.length > 0 ? (
                        theorySubjects.map((s, idx) => (
                          <div
                            key={s.id || idx}
                            className="p-4 rounded-2xl bg-[#161512] border border-[#f5f1ca]/10 hover:border-[#f5f1ca]/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-mono font-bold text-[#f5f1ca] px-2 py-0.5 rounded-md bg-[#1f1d19] border border-[#f5f1ca]/20">
                                  {s.time}
                                </span>
                                <span className="text-[11px] text-[#9e9a8d] flex items-center gap-1">
                                  <MapPin className="w-3 h-3 text-[#9e9a8d]" />
                                  {s.room}
                                </span>
                              </div>
                              <h5 className="font-serif-title font-bold text-sm text-[#f5f1ca] group-hover:text-[#f2eb87] transition-colors">
                                {s.subject}
                              </h5>
                            </div>
                            <div className="text-left sm:text-right text-[11px] text-[#9e9a8d] flex-shrink-0">
                              <span className="block text-[#d8d6c6] font-medium">{s.teacher}</span>
                              <span className="text-[10px]">Guru Pengampu</span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-4 text-center text-xs text-[#9e9a8d] rounded-2xl bg-[#161512] border border-dashed border-[#f5f1ca]/10">
                          Tidak ada jadwal blok teori untuk hari ini.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                /* Filtered list */
                <div className="space-y-3">
                  <h4 className="text-xs uppercase font-bold tracking-wider text-[#f2eb87] flex items-center gap-2">
                    {selectedBlockFilter === 'praktik' ? <Cpu className="w-4 h-4" /> : <BookOpen className="w-4 h-4" />}
                    <span>
                      Daftar Mata Pelajaran {selectedBlockFilter === 'praktik' ? 'Blok Praktik' : 'Blok Teori'} ({activeSchedule.dayName})
                    </span>
                  </h4>

                  <div className="space-y-2.5">
                    {displayedSubjects.length > 0 ? (
                      displayedSubjects.map((s, idx) => (
                        <div
                          key={s.id || idx}
                          className={`p-4 rounded-2xl bg-[#161512] border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group ${
                            s.block === 'praktik'
                              ? 'border-[#f2eb87]/30 hover:border-[#f2eb87]'
                              : 'border-[#f5f1ca]/10 hover:border-[#f5f1ca]/40'
                          }`}
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span
                                className={`text-xs font-mono font-bold px-2 py-0.5 rounded-md ${
                                  s.block === 'praktik'
                                    ? 'bg-[#f2eb87] text-[#161512]'
                                    : 'bg-[#1f1d19] text-[#f5f1ca] border border-[#f5f1ca]/20'
                                }`}
                              >
                                {s.time}
                              </span>
                              <span className="text-[11px] text-[#9e9a8d] flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-[#f2eb87]" />
                                {s.room}
                              </span>
                              <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-[#161512] text-[#f2eb87] border border-[#f2eb87]/30">
                                {s.block === 'praktik' ? 'Praktik' : 'Teori'}
                              </span>
                            </div>
                            <h5 className="font-serif-title font-bold text-sm text-[#f5f1ca] group-hover:text-[#f2eb87] transition-colors">
                              {s.subject}
                            </h5>
                          </div>
                          <div className="text-left sm:text-right text-[11px] text-[#9e9a8d] flex-shrink-0">
                            <span className="block text-[#d8d6c6] font-medium">{s.teacher}</span>
                            <span className="text-[10px]">{s.block === 'praktik' ? 'Instruktur Lab' : 'Pengampu Mapel'}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-6 text-center text-xs text-[#9e9a8d] rounded-2xl bg-[#161512] border border-[#f5f1ca]/10">
                        Tidak ada mata pelajaran di blok ini untuk hari {activeSchedule.dayName}.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Picket Team Card (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <h4 className="text-xs uppercase font-bold tracking-wider text-[#f2eb87] flex items-center gap-2">
                <UserCheck className="w-4 h-4" />
                <span>Petugas Piket Laboratorium & Kelas</span>
              </h4>

              <div className="p-6 rounded-2xl bg-[#161512] border border-[#f5f1ca]/10 space-y-4 shadow-xl">
                <div className="flex items-center justify-between pb-3 border-b border-[#f5f1ca]/10">
                  <span className="text-xs text-[#9e9a8d]">Regu Hari:</span>
                  <span className="text-xs font-bold text-[#f2eb87] uppercase">
                    {activeSchedule.dayName}
                  </span>
                </div>

                <div className="space-y-2.5">
                  {activeSchedule.picketTeam && activeSchedule.picketTeam.length > 0 ? (
                    activeSchedule.picketTeam.map((name, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-[#1f1d19] border border-[#f5f1ca]/5 text-xs text-[#d8d6c6]"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="w-5 h-5 rounded-full bg-[#161512] border border-[#f2eb87]/30 text-[#f2eb87] text-[10px] font-bold flex items-center justify-center">
                            {i + 1}
                          </span>
                          <span className="font-medium text-[#f5f1ca]">{name}</span>
                        </div>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-xs text-[#9e9a8d]">
                      Belum ada petugas piket yang ditentukan.
                    </div>
                  )}
                </div>

                <p className="text-[11px] text-[#9e9a8d] italic pt-2 text-center border-t border-[#f5f1ca]/5">
                  &ldquo;{activeSchedule.motto || 'Kebersihan dan kerapian laboratorium adalah cermin kedisiplinan seorang teknisi jaringan.'}&rdquo;
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.section>
  );
}
