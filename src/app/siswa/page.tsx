'use client';

import React, { useState, useMemo } from 'react';
import { useClassData } from '@/context/ClassDataContext';
import StudentCard from '@/components/StudentCard';
import StudentModal from '@/components/StudentModal';
import { Student, Gender } from '@/types';
import { motion } from 'framer-motion';
import { Search, Users, ArrowUpDown, Filter, Sparkles } from 'lucide-react';

export default function SiswaPage() {
  const { students } = useClassData();
  const [searchQuery, setSearchQuery] = useState('');
  const [genderFilter, setGenderFilter] = useState<'all' | Gender>('all');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  // Filter and sort students
  const filteredStudents = useMemo(() => {
    return students
      .filter((student) => {
        const matchesSearch =
          student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (student.elective_subject && student.elective_subject.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesGender = genderFilter === 'all' || student.gender === genderFilter;

        return matchesSearch && matchesGender;
      })
      .sort((a, b) => {
        if (sortOrder === 'asc') {
          return a.name.localeCompare(b.name);
        } else {
          return b.name.localeCompare(a.name);
        }
      });
  }, [students, searchQuery, genderFilter, sortOrder]);

  const totalMale = students.filter((s) => s.gender === 'L').length;
  const totalFemale = students.filter((s) => s.gender === 'P').length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="min-h-screen py-12 sm:py-20 bem-grid bg-[#161512] text-[#d8d6c6]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Page Header (BEM FEB UI Editorial Style) */}
        <div className="text-center sm:text-left space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#1f1d19] text-[#f2eb87] border border-[#f2eb87]/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="uppercase tracking-widest text-[10px]">DIREKTORI RESMI ANGGOTA</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif-title font-bold tracking-tight text-[#f5f1ca]">
            Data Anggota Kelas XII TKJ
          </h1>
          <p className="text-xs sm:text-base text-[#9e9a8d] max-w-2xl leading-relaxed">
            Daftar lengkap 34 siswa kelas XII Teknik Komputer dan Jaringan. Klik pada kartu untuk melihat profil terperinci dan mata pelajaran pilihan.
          </p>
        </div>

        {/* Search, Filters, and Sorting Controls */}
        <div className="p-4 sm:p-6 rounded-3xl bg-[#1f1d19] border border-[#f5f1ca]/15 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-[#9e9a8d] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari nama siswa atau peminatan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs bg-[#161512] border border-[#f5f1ca]/15 text-[#f5f1ca] placeholder-[#9e9a8d]/60 focus:outline-none focus:border-[#f2eb87] transition-all"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between w-full md:w-auto gap-3">
            {/* Gender Filter Tabs */}
            <div className="inline-flex p-1 rounded-xl bg-[#161512] border border-[#f5f1ca]/15 text-xs font-semibold">
              <button
                onClick={() => setGenderFilter('all')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  genderFilter === 'all'
                    ? 'bg-[#f2eb87] text-[#111111] font-bold shadow-sm'
                    : 'text-[#9e9a8d] hover:text-[#f5f1ca]'
                }`}
              >
                Semua ({students.length})
              </button>
              <button
                onClick={() => setGenderFilter('L')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  genderFilter === 'L'
                    ? 'bg-[#f2eb87] text-[#111111] font-bold shadow-sm'
                    : 'text-[#9e9a8d] hover:text-[#f5f1ca]'
                }`}
              >
                Laki-laki ({totalMale})
              </button>
              <button
                onClick={() => setGenderFilter('P')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  genderFilter === 'P'
                    ? 'bg-[#f2eb87] text-[#111111] font-bold shadow-sm'
                    : 'text-[#9e9a8d] hover:text-[#f5f1ca]'
                }`}
              >
                Perempuan ({totalFemale})
              </button>
            </div>

            {/* Sort Order Toggle */}
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-[#161512] border border-[#f5f1ca]/15 text-xs font-semibold text-[#f5f1ca] hover:border-[#f2eb87] transition-all"
            >
              <ArrowUpDown className="w-3.5 h-3.5 text-[#f2eb87]" />
              <span>Urutan: {sortOrder === 'asc' ? 'A-Z' : 'Z-A'}</span>
            </button>
          </div>
        </div>

        {/* Results Counter & Info */}
        <div className="flex items-center justify-between text-xs text-[#9e9a8d] px-1">
          <span>Menampilkan <strong>{filteredStudents.length}</strong> siswa</span>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-[#f2eb87] hover:underline"
            >
              Reset Pencarian
            </button>
          )}
        </div>

        {/* Students Grid */}
        {filteredStudents.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-[#1f1d19] border border-[#f5f1ca]/15 text-[#9e9a8d] space-y-3">
            <Users className="w-8 h-8 mx-auto text-[#f2eb87]" />
            <p className="text-sm">Tidak ada data siswa yang cocok dengan pencarian.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filteredStudents.map((student, idx) => (
              <motion.div
                key={student.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: Math.min(idx * 0.03, 0.4) }}
              >
                <StudentCard
                  student={student}
                  onClick={() => setSelectedStudent(student)}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Detail Siswa */}
      <StudentModal
        student={selectedStudent}
        onClose={() => setSelectedStudent(null)}
      />
    </motion.div>
  );
}
