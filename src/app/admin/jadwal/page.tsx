'use client';

import React, { useState } from 'react';
import { useClassData } from '@/context/ClassDataContext';
import { DayScheduleItem, DayLesson } from '@/types';
import { INITIAL_DAILY_SCHEDULES } from '@/lib/seed-data';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock,
  BookOpen,
  UserCheck,
  Plus,
  Trash2,
  Edit2,
  Save,
  RotateCcw,
  CheckCircle2,
  Sparkles,
  MapPin,
  User,
  X,
  Cpu,
  Layers,
} from 'lucide-react';

export default function AdminJadwalPiketPage() {
  const { dailySchedules, updateDailySchedules, students } = useClassData();

  // Working state initialized with existing schedules or default
  const [schedules, setSchedules] = useState<DayScheduleItem[]>(() => {
    return dailySchedules && dailySchedules.length > 0 ? dailySchedules : INITIAL_DAILY_SCHEDULES;
  });

  const [activeDayNumber, setActiveDayNumber] = useState<number>(1);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Lesson modal state (add or edit)
  const [lessonModalOpen, setLessonModalOpen] = useState(false);
  const [editingLessonId, setEditingLessonId] = useState<string | null>(null);
  const [lessonForm, setLessonForm] = useState<DayLesson>({
    id: '',
    time: '07:45 - 10:00',
    subject: '',
    teacher: 'Bu Febriyana, S.T.',
    room: 'Lab Jaringan 1',
    block: 'praktik',
  });

  // Selected student to add to picket
  const [selectedPicketStudent, setSelectedPicketStudent] = useState<string>('');

  const activeDay = schedules.find((s) => s.dayNumber === activeDayNumber) || schedules[0];

  const subjects = activeDay.subjects || [];
  const theorySubjects = subjects.filter((s) => (s.block || 'teori') === 'teori');
  const practiceSubjects = subjects.filter((s) => s.block === 'praktik');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Save all schedules to CMS
  const handleSaveAll = async () => {
    setSaving(true);
    const success = await updateDailySchedules(schedules);
    if (success) {
      showToast('Jadwal pelajaran (2 blok) & regu piket berhasil disimpan ke server!');
    } else {
      alert('Gagal menyimpan jadwal.');
    }
    setSaving(false);
  };

  // Reset to default official seed schedules
  const handleResetToDefault = () => {
    if (confirm('Kembalikan jadwal pelajaran dan regu piket ke jadwal resmi awal?')) {
      setSchedules(INITIAL_DAILY_SCHEDULES);
      showToast('Jadwal di-reset ke data default resmi (Senin - Jumat).');
    }
  };

  // Open modal to add lesson with preselected block
  const openAddLesson = (defaultBlock: 'teori' | 'praktik' = 'praktik') => {
    setEditingLessonId(null);
    setLessonForm({
      id: `lesson-${Date.now()}`,
      time: defaultBlock === 'praktik' ? '07:45 - 10:00' : '10:15 - 12:30',
      subject: '',
      teacher: defaultBlock === 'praktik' ? 'Bu Febriyana, S.T.' : 'Guru Pengampu',
      room: defaultBlock === 'praktik' ? 'Lab Jaringan 1' : 'Ruang XII TKJ',
      block: defaultBlock,
    });
    setLessonModalOpen(true);
  };

  // Open modal to edit lesson
  const openEditLesson = (lesson: DayLesson) => {
    setEditingLessonId(lesson.id);
    setLessonForm({
      ...lesson,
      block: lesson.block || (lesson.room?.toLowerCase().includes('lab') ? 'praktik' : 'teori'),
    });
    setLessonModalOpen(true);
  };

  // Save lesson in current day
  const handleSaveLesson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lessonForm.subject.trim() || !lessonForm.time.trim()) {
      alert('Waktu dan Nama Pelajaran wajib diisi.');
      return;
    }

    const updatedSchedules = schedules.map((d) => {
      if (d.dayNumber !== activeDayNumber) return d;
      let newSubjects: DayLesson[];
      if (editingLessonId) {
        newSubjects = d.subjects.map((s) => (s.id === editingLessonId ? lessonForm : s));
      } else {
        newSubjects = [...d.subjects, lessonForm];
      }
      return { ...d, subjects: newSubjects };
    });

    setSchedules(updatedSchedules);
    setLessonModalOpen(false);
    showToast(editingLessonId ? 'Mata pelajaran diperbarui!' : 'Mata pelajaran ditambahkan!');
  };

  // Delete lesson from current day
  const handleDeleteLesson = (lessonId: string) => {
    const updatedSchedules = schedules.map((d) => {
      if (d.dayNumber !== activeDayNumber) return d;
      return { ...d, subjects: d.subjects.filter((s) => s.id !== lessonId) };
    });
    setSchedules(updatedSchedules);
    showToast('Mata pelajaran dihapus.');
  };

  // Add picket member
  const handleAddPicketMember = () => {
    if (!selectedPicketStudent.trim()) return;
    if (activeDay.picketTeam.includes(selectedPicketStudent)) {
      alert('Siswa ini sudah ada dalam regu piket hari ini.');
      return;
    }

    const updatedSchedules = schedules.map((d) => {
      if (d.dayNumber !== activeDayNumber) return d;
      return { ...d, picketTeam: [...d.picketTeam, selectedPicketStudent] };
    });

    setSchedules(updatedSchedules);
    setSelectedPicketStudent('');
  };

  // Remove picket member
  const handleRemovePicketMember = (indexToRemove: number) => {
    const updatedSchedules = schedules.map((d) => {
      if (d.dayNumber !== activeDayNumber) return d;
      return { ...d, picketTeam: d.picketTeam.filter((_, idx) => idx !== indexToRemove) };
    });
    setSchedules(updatedSchedules);
  };

  // Update motto
  const handleMottoChange = (newMotto: string) => {
    const updatedSchedules = schedules.map((d) => {
      if (d.dayNumber !== activeDayNumber) return d;
      return { ...d, motto: newMotto };
    });
    setSchedules(updatedSchedules);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-[#1f1d19] border border-[#f2eb87]/50 text-[#f5f1ca] shadow-2xl flex items-center gap-3 text-xs font-semibold animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-[#f2eb87]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#1f1d19] text-[#f2eb87] border border-[#f2eb87]/30 mb-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span className="uppercase tracking-widest text-[10px]">PENGELOLAAN 2 BLOK RADAR HARIAN</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif-title font-bold text-[#f5f1ca]">
            Jadwal Pelajaran (Blok Teori & Praktik) & Regu Piket
          </h1>
          <p className="text-xs sm:text-sm text-[#9e9a8d]">
            Kelola rincian mata pelajaran harian yang terbagi 2 blok: Blok Teori & Blok Praktik Lab, serta petugas piket (Senin s/d Jumat).
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleResetToDefault}
            type="button"
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#1f1d19] border border-[#f5f1ca]/15 hover:border-[#f2eb87]/40 text-[#d8d6c6] hover:text-[#f2eb87] text-xs font-semibold transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Default</span>
          </button>

          <button
            onClick={handleSaveAll}
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#f2eb87] hover:bg-[#e6df73] text-[#161512] text-xs font-bold shadow-md shadow-[#f2eb87]/20 transition-all active:scale-95 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Menyimpan...' : 'Simpan Semua Jadwal'}</span>
          </button>
        </div>
      </div>

      {/* Day Selector Tabs with Animated Active Indicator */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[#141310] border border-[#f5f1ca]/15 overflow-x-auto">
        {schedules.map((day) => {
          const isAct = activeDayNumber === day.dayNumber;
          const tCount = day.subjects.filter((s) => (s.block || 'teori') === 'teori').length;
          const pCount = day.subjects.filter((s) => s.block === 'praktik').length;

          return (
            <button
              key={day.dayNumber}
              onClick={() => setActiveDayNumber(day.dayNumber)}
              className={`relative flex-1 min-w-[120px] py-3 px-4 rounded-xl text-xs font-bold transition-all text-center flex flex-col items-center gap-0.5 ${
                isAct ? 'text-[#161512]' : 'text-[#9e9a8d] hover:text-[#f5f1ca] hover:bg-[#1f1d19]'
              }`}
            >
              {isAct && (
                <motion.div
                  layoutId="adminActiveDayTab"
                  className="absolute inset-0 bg-[#f2eb87] rounded-xl z-0 shadow-md shadow-[#f2eb87]/20"
                  transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                />
              )}
              <span className="relative z-10 uppercase tracking-wider text-[11px] font-bold">
                {day.dayName}
              </span>
              <span className="relative z-10 text-[10px] font-normal opacity-90 flex items-center gap-1.5">
                <span>{pCount} Praktik</span> • <span>{tCount} Teori</span>
              </span>
            </button>
          );
        })}
      </div>

      {/* Animated Day Content with Framer Motion AnimatePresence */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeDayNumber}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.28, ease: 'easeOut' }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8"
        >
          {/* Left Column: 2 BLOK JADWAL (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Header & Quick Action */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-[#f5f1ca] flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#f2eb87]" />
                  <span>Jadwal Pelajaran 2 Blok — {activeDay.dayName}</span>
                </h2>
                <p className="text-[11px] text-[#9e9a8d]">
                  Terbagi menjadi Blok Teori ({theorySubjects.length}) dan Blok Praktik ({practiceSubjects.length})
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => openAddLesson('praktik')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#f2eb87] hover:bg-[#e6df73] text-[#161512] text-xs font-bold transition-all shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Mapel Praktik</span>
                </button>
                <button
                  onClick={() => openAddLesson('teori')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1f1d19] border border-[#f5f1ca]/20 hover:border-[#f5f1ca]/40 text-[#f5f1ca] text-xs font-semibold transition-all shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5 text-[#f2eb87]" />
                  <span>+ Mapel Teori</span>
                </button>
              </div>
            </div>

            {/* ========================================================= */}
            {/* BLOK 1: BLOK PRAKTIK & LABORATORIUM                       */}
            {/* ========================================================= */}
            <div className="p-5 rounded-3xl bg-[#1f1d19] border border-[#f2eb87]/30 shadow-lg space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#f2eb87]/20">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#161512] border border-[#f2eb87]/40 flex items-center justify-center text-[#f2eb87]">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-serif-title font-bold text-sm text-[#f5f1ca] flex items-center gap-2">
                      <span>Blok Praktik & Laboratorium</span>
                      <span className="text-[10px] px-2 py-0.2 rounded-full bg-[#f2eb87] text-[#161512] font-bold">
                        {practiceSubjects.length} Mapel
                      </span>
                    </h3>
                    <p className="text-[10px] text-[#9e9a8d]">
                      Praktikum jaringan, konfigurasi perangkat, dan hands-on laboratorium
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => openAddLesson('praktik')}
                  className="text-[11px] text-[#f2eb87] hover:underline font-semibold flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> Tambah
                </button>
              </div>

              <div className="space-y-2.5">
                {practiceSubjects.length > 0 ? (
                  practiceSubjects.map((lesson) => (
                    <div
                      key={lesson.id}
                      className="p-3.5 rounded-2xl bg-[#161512] border border-[#f2eb87]/25 hover:border-[#f2eb87] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-md bg-[#f2eb87] text-[#161512] font-mono text-xs font-bold">
                            {lesson.time}
                          </span>
                          <span className="text-[11px] text-[#f2eb87] flex items-center gap-1 font-medium">
                            <MapPin className="w-3 h-3 text-[#f2eb87]" />
                            <span>{lesson.room}</span>
                          </span>
                        </div>
                        <h4 className="font-serif-title font-bold text-sm text-[#f5f1ca] leading-snug">
                          {lesson.subject}
                        </h4>
                        <p className="text-xs text-[#9e9a8d] flex items-center gap-1">
                          <User className="w-3 h-3 text-[#f2eb87]" />
                          <span>{lesson.teacher}</span>
                        </p>
                      </div>

                      <div className="flex items-center gap-1 self-end sm:self-center">
                        <button
                          onClick={() => openEditLesson(lesson)}
                          title="Edit Mapel Praktik"
                          className="p-2 rounded-xl bg-[#1f1d19] text-[#9e9a8d] hover:text-[#f2eb87] border border-[#f5f1ca]/10 transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteLesson(lesson.id)}
                          title="Hapus Mapel"
                          className="p-2 rounded-xl bg-[#1f1d19] text-red-400 hover:text-red-300 border border-red-500/20 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center rounded-2xl bg-[#161512] border border-dashed border-[#f2eb87]/20 text-xs text-[#9e9a8d]">
                    Belum ada mapel di Blok Praktik hari {activeDay.dayName}.
                  </div>
                )}
              </div>
            </div>

            {/* ========================================================= */}
            {/* BLOK 2: BLOK TEORI & AKADEMIK UMUM                        */}
            {/* ========================================================= */}
            <div className="p-5 rounded-3xl bg-[#1f1d19] border border-[#f5f1ca]/12 shadow-lg space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#f5f1ca]/10">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#161512] border border-[#f5f1ca]/20 flex items-center justify-center text-[#f5f1ca]">
                    <BookOpen className="w-4 h-4 text-[#f2eb87]" />
                  </div>
                  <div>
                    <h3 className="font-serif-title font-bold text-sm text-[#f5f1ca] flex items-center gap-2">
                      <span>Blok Teori & Mata Pelajaran Umum</span>
                      <span className="text-[10px] px-2 py-0.2 rounded-full bg-[#161512] text-[#f5f1ca] border border-[#f5f1ca]/20 font-bold">
                        {theorySubjects.length} Mapel
                      </span>
                    </h3>
                    <p className="text-[10px] text-[#9e9a8d]">
                      Materi dasar teori kejuruan, normatif adaptif, dan pembentukan karakter
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => openAddLesson('teori')}
                  className="text-[11px] text-[#f5f1ca] hover:underline font-semibold flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> Tambah
                </button>
              </div>

              <div className="space-y-2.5">
                {theorySubjects.length > 0 ? (
                  theorySubjects.map((lesson) => (
                    <div
                      key={lesson.id}
                      className="p-3.5 rounded-2xl bg-[#161512] border border-[#f5f1ca]/10 hover:border-[#f5f1ca]/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-md bg-[#1f1d19] border border-[#f5f1ca]/20 text-[#f5f1ca] font-mono text-xs font-bold">
                            {lesson.time}
                          </span>
                          <span className="text-[11px] text-[#9e9a8d] flex items-center gap-1 font-medium">
                            <MapPin className="w-3 h-3 text-[#9e9a8d]" />
                            <span>{lesson.room}</span>
                          </span>
                        </div>
                        <h4 className="font-serif-title font-bold text-sm text-[#f5f1ca] leading-snug">
                          {lesson.subject}
                        </h4>
                        <p className="text-xs text-[#9e9a8d] flex items-center gap-1">
                          <User className="w-3 h-3 text-[#9e9a8d]" />
                          <span>{lesson.teacher}</span>
                        </p>
                      </div>

                      <div className="flex items-center gap-1 self-end sm:self-center">
                        <button
                          onClick={() => openEditLesson(lesson)}
                          title="Edit Mapel Teori"
                          className="p-2 rounded-xl bg-[#1f1d19] text-[#9e9a8d] hover:text-[#f2eb87] border border-[#f5f1ca]/10 transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteLesson(lesson.id)}
                          title="Hapus Mapel"
                          className="p-2 rounded-xl bg-[#1f1d19] text-red-400 hover:text-red-300 border border-red-500/20 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center rounded-2xl bg-[#161512] border border-dashed border-[#f5f1ca]/10 text-xs text-[#9e9a8d]">
                    Belum ada mapel di Blok Teori hari {activeDay.dayName}.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Picket Team Card (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-6 rounded-3xl bg-[#1f1d19] border border-[#f5f1ca]/12 shadow-sm space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-[#f5f1ca]/10">
                <h2 className="text-sm font-bold text-[#f5f1ca] flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-[#f2eb87]" />
                  <span>Petugas Regu Piket ({activeDay.dayName})</span>
                </h2>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#161512] text-[#f2eb87] border border-[#f2eb87]/30">
                  {activeDay.picketTeam.length} Siswa
                </span>
              </div>

              {/* Add Student Dropdown */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#d8d6c6]">
                  Tambah Siswa ke Regu Piket Hari Ini
                </label>
                <div className="flex items-center gap-2">
                  <select
                    value={selectedPicketStudent}
                    onChange={(e) => setSelectedPicketStudent(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl text-xs bg-[#161512] border border-[#f5f1ca]/20 text-[#f5f1ca] focus:outline-none focus:border-[#f2eb87]"
                  >
                    <option value="">-- Pilih Nama Siswa ({students.length} Siswa) --</option>
                    {students.map((s) => (
                      <option key={s.id} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={handleAddPicketMember}
                    className="px-4 py-2 rounded-xl bg-[#f2eb87] text-[#161512] text-xs font-bold hover:bg-[#e6df73] transition-all flex items-center gap-1 shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah</span>
                  </button>
                </div>
              </div>

              {/* Active Picket Members List */}
              <div className="space-y-2 pt-2">
                <label className="text-xs font-semibold text-[#9e9a8d] block">
                  Daftar Petugas Bertugas:
                </label>
                <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
                  {activeDay.picketTeam.map((name, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-[#161512] border border-[#f5f1ca]/10 text-xs text-[#d8d6c6]"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-[#1f1d19] border border-[#f2eb87]/30 text-[#f2eb87] text-[10px] font-bold flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <span className="font-medium text-[#f5f1ca]">{name}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemovePicketMember(idx)}
                        className="p-1 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                        title="Hapus siswa dari regu piket"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                  {activeDay.picketTeam.length === 0 && (
                    <p className="text-xs text-[#9e9a8d] italic p-3 text-center">
                      Belum ada siswa yang ditugaskan piket untuk hari ini.
                    </p>
                  )}
                </div>
              </div>

              {/* Motto / Quote Editor */}
              <div className="space-y-1.5 pt-3 border-t border-[#f5f1ca]/10">
                <label className="text-xs font-semibold text-[#d8d6c6] block">
                  Motto / Pesan Kebersihan Hari Ini
                </label>
                <textarea
                  rows={2}
                  value={activeDay.motto || ''}
                  onChange={(e) => handleMottoChange(e.target.value)}
                  placeholder="Pesan motivasi kebersihan laboratorium..."
                  className="w-full px-3 py-2 rounded-xl text-xs bg-[#161512] border border-[#f5f1ca]/20 text-[#f5f1ca] focus:outline-none focus:border-[#f2eb87] leading-relaxed"
                />
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Lesson Modal (Add/Edit) */}
      <AnimatePresence>
        {lessonModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-[#1f1d19] border border-[#f5f1ca]/20 rounded-3xl p-6 shadow-2xl space-y-5"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#f5f1ca]/10">
                <h3 className="font-serif-title font-bold text-base text-[#f5f1ca] flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#f2eb87]" />
                  <span>{editingLessonId ? 'Edit Mata Pelajaran' : 'Tambah Mata Pelajaran'}</span>
                </h3>
                <button
                  onClick={() => setLessonModalOpen(false)}
                  className="p-1.5 rounded-xl text-[#9e9a8d] hover:text-[#f5f1ca]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveLesson} className="space-y-4">
                {/* 2-Block Classifier Buttons */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#d8d6c6]">Klasifikasi Blok Pelajaran *</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setLessonForm({ ...lessonForm, block: 'praktik' })}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-2 ${
                        lessonForm.block === 'praktik'
                          ? 'bg-[#f2eb87] border-[#f2eb87] text-[#161512] shadow-md shadow-[#f2eb87]/20'
                          : 'bg-[#161512]/70 border-[#f5f1ca]/15 text-[#9e9a8d] hover:text-[#f2eb87]'
                      }`}
                    >
                      <Cpu className="w-3.5 h-3.5" />
                      <span>Blok Praktik (Lab)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setLessonForm({ ...lessonForm, block: 'teori' })}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-2 ${
                        lessonForm.block === 'teori'
                          ? 'bg-[#f5f1ca] border-[#f5f1ca] text-[#161512] shadow-md'
                          : 'bg-[#161512]/70 border-[#f5f1ca]/15 text-[#9e9a8d] hover:text-[#f5f1ca]'
                      }`}
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Blok Teori (Umum)</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#d8d6c6]">Jam Pelajaran *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: 07:45 - 10:00"
                    value={lessonForm.time}
                    onChange={(e) => setLessonForm({ ...lessonForm, time: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-[#161512] border border-[#f5f1ca]/20 text-[#f5f1ca] focus:outline-none focus:border-[#f2eb87]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#d8d6c6]">Nama Mata Pelajaran *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Administrasi Infrastruktur Jaringan (MikroTik)"
                    value={lessonForm.subject}
                    onChange={(e) => setLessonForm({ ...lessonForm, subject: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-[#161512] border border-[#f5f1ca]/20 text-[#f5f1ca] focus:outline-none focus:border-[#f2eb87]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#d8d6c6]">Guru Pengampu / Instruktur *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Bu Febriyana, S.T."
                    value={lessonForm.teacher}
                    onChange={(e) => setLessonForm({ ...lessonForm, teacher: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-[#161512] border border-[#f5f1ca]/20 text-[#f5f1ca] focus:outline-none focus:border-[#f2eb87]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#d8d6c6]">Ruangan / Laboratorium *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Lab Jaringan 1 atau Ruang XII TKJ"
                    value={lessonForm.room}
                    onChange={(e) => setLessonForm({ ...lessonForm, room: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-[#161512] border border-[#f5f1ca]/20 text-[#f5f1ca] focus:outline-none focus:border-[#f2eb87]"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#f5f1ca]/10">
                  <button
                    type="button"
                    onClick={() => setLessonModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-[#9e9a8d] hover:text-[#f5f1ca]"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#f2eb87] text-[#161512] text-xs font-bold hover:bg-[#e6df73]"
                  >
                    Simpan Mapel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
