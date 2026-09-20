'use client';

import React, { useState } from 'react';
import { useClassData } from '@/context/ClassDataContext';
import { getStudentAvatarUrl } from '@/lib/seed-data';
import { Student } from '@/types';
import StudentModal from '@/components/StudentModal';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Shield,
  Crown,
  Brush,
  Lock,
  Heart,
  Network,
  Layers,
  GraduationCap,
  Users,
  ChevronRight,
  Info,
} from 'lucide-react';

export default function StrukturPage() {
  const { roles, students } = useClassData();
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [viewMode, setViewMode] = useState<'tree' | 'grid'>('tree');

  // Helper to find photo if student exists in database
  const getPersonPhoto = (rolePersonName: string, studentId?: string | null) => {
    if (studentId) {
      const found = students.find((s) => s.id === studentId);
      if (found?.photo_url) return found.photo_url;
      if (found) return getStudentAvatarUrl(found.name, found.gender);
    }
    const foundByName = students.find(
      (s) => s.name.toLowerCase().trim() === rolePersonName.toLowerCase().trim()
    );
    if (foundByName?.photo_url) return foundByName.photo_url;
    if (foundByName) return getStudentAvatarUrl(foundByName.name, foundByName.gender);

    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      rolePersonName
    )}&background=22201b&color=f2eb87&size=200&bold=true`;
  };

  const handlePersonClick = (personName: string, studentId?: string | null) => {
    let found = studentId ? students.find((s) => s.id === studentId) : null;
    if (!found) {
      found = students.find(
        (s) => s.name.toLowerCase().trim() === personName.toLowerCase().trim()
      );
    }
    if (found) {
      setSelectedStudent(found);
    }
  };

  // Group roles
  const waliRole = roles.find((r) => r.category === 'wali' || r.role_name.toLowerCase().includes('wali'));
  const ketuaRole = roles.find((r) => r.role_name.toLowerCase().includes('ketua') && !r.role_name.toLowerCase().includes('wakil'));
  const wakilRole = roles.find((r) => r.role_name.toLowerCase().includes('wakil'));
  const sekretarisRoles = roles.filter((r) => r.role_name.toLowerCase().includes('sekretaris'));
  const bendaharaRoles = roles.filter((r) => r.role_name.toLowerCase().includes('bendahara'));
  const dantonRoles = roles.filter((r) => r.role_name.toLowerCase().includes('danton'));
  const kebersihanRoles = roles.filter((r) => r.role_name.toLowerCase().includes('kebersihan'));
  const keamananRoles = roles.filter((r) => r.role_name.toLowerCase().includes('keamanan'));
  const keagamaanRoles = roles.filter((r) => r.role_name.toLowerCase().includes('keagamaan'));

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="min-h-screen py-12 sm:py-20 bem-grid bg-[#161512] text-[#d8d6c6] relative overflow-hidden"
    >
      {/* Warm Ambient Gold Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-[#f2eb87]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-2/3 left-1/2 -translate-x-1/2 w-[800px] h-[700px] bg-[#f5f1ca]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        {/* Page Header (BEM FEB UI Profile Header Style) */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold bg-[#1f1d19] text-[#f2eb87] border border-[#f2eb87]/30 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="uppercase tracking-[0.2em] text-[10px]">ORGANIZATIONAL STRUCTURE</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif-title font-bold tracking-tight text-[#f5f1ca]">
            Struktur Kepengurusan Kelas XII TKJ
          </h1>

          <p className="text-xs sm:text-base text-[#9e9a8d] max-w-2xl mx-auto leading-relaxed">
            Hierarki kepemimpinan, biro administrasi, dan divisi operasional keluarga besar XII Teknik Komputer dan Jaringan Tahun Ajaran 2026/2027.
          </p>

          {/* View Mode Switcher */}
          <div className="inline-flex items-center p-1.5 rounded-2xl bg-[#1f1d19] border border-[#f5f1ca]/15 shadow-md">
            <button
              onClick={() => setViewMode('tree')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                viewMode === 'tree'
                  ? 'bg-[#f2eb87] text-[#111111] shadow-sm font-bold'
                  : 'text-[#d8d6c6] hover:text-[#f2eb87]'
              }`}
            >
              <Network className="w-3.5 h-3.5" />
              <span>Hierarki Pohon (Tree Circuit)</span>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                viewMode === 'grid'
                  ? 'bg-[#f2eb87] text-[#111111] shadow-sm font-bold'
                  : 'text-[#d8d6c6] hover:text-[#f2eb87]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Katalog Biro & Divisi</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* VIEW 1: CONTINUOUS 100% CONNECTED TREE CIRCUIT (DESKTOP & MOBILE RESPONSIVE) */}
        {/* ========================================================================= */}
        {viewMode === 'tree' && (
          <div className="relative max-w-5xl mx-auto flex flex-col items-center">
            
            {/* ------------------------------------------------------------------- */}
            {/* TIER 1: WALI KELAS (TOP ANCHOR)                                     */}
            {/* ------------------------------------------------------------------- */}
            {waliRole && (
              <div className="flex flex-col items-center relative z-20 w-full max-w-md">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="w-full p-6 rounded-3xl bg-[#1f1d19] border border-[#f2eb87]/40 text-center relative shadow-2xl shadow-black/80 hover:border-[#f2eb87] transition-all group"
                >
                  {/* Subtle top gold stripe */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#f2eb87] to-transparent" />

                  <div className="relative w-24 h-24 mx-auto rounded-2xl overflow-hidden bg-[#161512] border-2 border-[#f2eb87]/40 mb-3.5 shadow-inner">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={getPersonPhoto(waliRole.person_name, waliRole.student_id)}
                      alt={waliRole.person_name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>

                  <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-[#161512] text-[#f2eb87] border border-[#f2eb87]/30">
                    {waliRole.role_name}
                  </span>

                  <h3 className="text-xl font-serif-title font-bold text-[#f5f1ca] mt-2">
                    {waliRole.person_name}
                  </h3>
                  <p className="text-xs text-[#9e9a8d] mt-1 font-medium">
                    {waliRole.badge || 'Guru Pembimbing & Penasihat Kelas'}
                  </p>
                </motion.div>

                {/* Bottom Docking Port on Wali Kelas */}
                <div className="w-3 h-3 rounded-full border-2 border-[#f2eb87] bg-[#161512] shadow-[0_0_8px_rgba(242,235,135,0.8)] -mt-1.5 z-30" />

                {/* Vertical Stem down to Level 2 */}
                <div className="w-[2px] h-10 bg-gradient-to-b from-[#f2eb87] to-[#f5f1ca] shadow-[0_0_8px_rgba(242,235,135,0.4)]" />
              </div>
            )}

            {/* ------------------------------------------------------------------- */}
            {/* TIER 2: PRESIDIUM (KETUA & WAKIL KETUA)                             */}
            {/* ------------------------------------------------------------------- */}
            <div className="w-full max-w-3xl relative z-10 flex flex-col items-center">
              {/* Horizontal Circuit Bar connecting Ketua and Wakil */}
              <div className="w-[75%] h-6 border-t-2 border-x-2 border-[#f2eb87]/80 rounded-t-2xl relative flex justify-between">
                {/* Central T-junction meeting Wali Kelas stem */}
                <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#f2eb87] shadow-[0_0_10px_rgba(242,235,135,0.8)]" />
                {/* Left Drop Port to Ketua */}
                <div className="w-3 h-3 rounded-full border-2 border-[#f2eb87] bg-[#161512] -ml-1.5 mt-4 self-end shadow-[0_0_6px_rgba(242,235,135,0.6)]" />
                {/* Right Drop Port to Wakil */}
                <div className="w-3 h-3 rounded-full border-2 border-[#f2eb87] bg-[#161512] -mr-1.5 mt-4 self-end shadow-[0_0_6px_rgba(242,235,135,0.6)]" />
              </div>

              {/* Cards Grid: Ketua & Wakil */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
                {/* Ketua Card */}
                {ketuaRole && (
                  <motion.div
                    whileHover={{ y: -4 }}
                    onClick={() => handlePersonClick(ketuaRole.person_name, ketuaRole.student_id)}
                    className="cursor-pointer p-5 rounded-3xl bg-[#1f1d19] border border-[#f2eb87]/30 hover:border-[#f2eb87] transition-all text-center relative shadow-lg group"
                  >
                    <div className="absolute top-3 right-3 p-1.5 rounded-xl bg-[#161512] text-[#f2eb87] border border-[#f2eb87]/20">
                      <Crown className="w-4 h-4" />
                    </div>

                    <div className="relative w-16 h-16 mx-auto rounded-2xl overflow-hidden bg-[#161512] border border-[#f2eb87]/30 mb-3 shadow-inner">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={getPersonPhoto(ketuaRole.person_name, ketuaRole.student_id)}
                        alt={ketuaRole.person_name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>

                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#161512] text-[#f2eb87] border border-[#f2eb87]/30">
                      {ketuaRole.role_name}
                    </span>

                    <h4 className="text-lg font-serif-title font-bold text-[#f5f1ca] mt-2 group-hover:text-[#f2eb87] transition-colors">
                      {ketuaRole.person_name}
                    </h4>
                    <p className="text-xs text-[#9e9a8d] mt-0.5">Pimpinan Utama Kelas</p>
                  </motion.div>
                )}

                {/* Wakil Card */}
                {wakilRole && (
                  <motion.div
                    whileHover={{ y: -4 }}
                    onClick={() => handlePersonClick(wakilRole.person_name, wakilRole.student_id)}
                    className="cursor-pointer p-5 rounded-3xl bg-[#1f1d19] border border-[#f5f1ca]/20 hover:border-[#f2eb87] transition-all text-center relative shadow-lg group"
                  >
                    <div className="absolute top-3 right-3 p-1.5 rounded-xl bg-[#161512] text-[#f5f1ca] border border-[#f5f1ca]/20">
                      <Shield className="w-4 h-4" />
                    </div>

                    <div className="relative w-16 h-16 mx-auto rounded-2xl overflow-hidden bg-[#161512] border border-[#f5f1ca]/30 mb-3 shadow-inner">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={getPersonPhoto(wakilRole.person_name, wakilRole.student_id)}
                        alt={wakilRole.person_name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>

                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#161512] text-[#f5f1ca] border border-[#f5f1ca]/30">
                      {wakilRole.role_name}
                    </span>

                    <h4 className="text-lg font-serif-title font-bold text-[#f5f1ca] mt-2 group-hover:text-[#f2eb87] transition-colors">
                      {wakilRole.person_name}
                    </h4>
                    <p className="text-xs text-[#9e9a8d] mt-0.5">Wakil Pimpinan Kelas</p>
                  </motion.div>
                )}
              </div>

              {/* Lower Merge Bar converging Ketua & Wakil back to central spine */}
              <div className="w-[75%] h-6 border-b-2 border-x-2 border-[#f2eb87]/80 rounded-b-2xl relative flex justify-between">
                <div className="w-3 h-3 rounded-full border-2 border-[#f2eb87] bg-[#161512] -ml-1.5 -mt-1.5 shadow-[0_0_6px_rgba(242,235,135,0.6)]" />
                <div className="w-3 h-3 rounded-full border-2 border-[#f2eb87] bg-[#161512] -mr-1.5 -mt-1.5 shadow-[0_0_6px_rgba(242,235,135,0.6)]" />
                <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#f2eb87] shadow-[0_0_10px_rgba(242,235,135,0.8)]" />
              </div>

              {/* Central Spine connecting to Level 3 */}
              <div className="w-[2px] h-8 bg-gradient-to-b from-[#f2eb87] to-[#f5f1ca]" />
            </div>

            {/* ------------------------------------------------------------------- */}
            {/* TIER 3: BIRO ADMINISTRASI & KEUANGAN (SEKRETARIS & BENDAHARA)       */}
            {/* ------------------------------------------------------------------- */}
            <div className="w-full max-w-5xl relative z-10 flex flex-col items-center">
              {/* Integrated Circuit Badge Node */}
              <div className="relative z-10 flex items-center gap-2.5 px-5 py-2 rounded-full bg-[#161512] border border-[#f2eb87]/50 shadow-[0_0_20px_rgba(242,235,135,0.15)] text-[#f2eb87] text-xs font-bold uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-[#f2eb87] animate-ping" />
                <span>Biro Administrasi & Tata Kelola Kas</span>
              </div>

              {/* Stem down to 4-Way Spanning Bar */}
              <div className="w-[2px] h-6 bg-[#f2eb87]" />

              {/* 4-Way Spanning Bar */}
              <div className="w-[88%] h-6 border-t-2 border-[#f2eb87]/80 relative flex justify-between">
                <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-[#f2eb87]" />
                {/* 4 Docking points across the columns */}
                <div className="w-2.5 h-2.5 rounded-full border-2 border-[#f2eb87] bg-[#161512] -ml-1 mt-4 self-end" />
                <div className="w-2.5 h-2.5 rounded-full border-2 border-[#f2eb87] bg-[#161512] -ml-1 mt-4 self-end" />
                <div className="w-2.5 h-2.5 rounded-full border-2 border-[#f2eb87] bg-[#161512] -mr-1 mt-4 self-end" />
                <div className="w-2.5 h-2.5 rounded-full border-2 border-[#f2eb87] bg-[#161512] -mr-1 mt-4 self-end" />
              </div>

              {/* 4 Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
                {/* Sekretaris 1 & 2 */}
                {sekretarisRoles.map((item) => (
                  <motion.div
                    key={item.id}
                    whileHover={{ y: -3 }}
                    onClick={() => handlePersonClick(item.person_name, item.student_id)}
                    className="cursor-pointer p-4 rounded-2xl bg-[#1f1d19] border border-[#f5f1ca]/15 hover:border-[#f2eb87] transition-all text-center shadow-sm group"
                  >
                    <div className="relative w-14 h-14 mx-auto rounded-xl overflow-hidden bg-[#161512] border border-[#f5f1ca]/20 mb-2.5 shadow-inner">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={getPersonPhoto(item.person_name, item.student_id)}
                        alt={item.person_name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#161512] text-[#f2eb87] border border-[#f2eb87]/30">
                      {item.role_name}
                    </span>
                    <h5 className="font-serif-title font-bold text-base text-[#f5f1ca] mt-1.5 group-hover:text-[#f2eb87] transition-colors truncate">
                      {item.person_name}
                    </h5>
                    <p className="text-[11px] text-[#9e9a8d] mt-0.5">Notulensi & Arsip Kelas</p>
                  </motion.div>
                ))}

                {/* Bendahara 1 & 2 */}
                {bendaharaRoles.map((item) => (
                  <motion.div
                    key={item.id}
                    whileHover={{ y: -3 }}
                    onClick={() => handlePersonClick(item.person_name, item.student_id)}
                    className="cursor-pointer p-4 rounded-2xl bg-[#1f1d19] border border-[#f5f1ca]/15 hover:border-[#f2eb87] transition-all text-center shadow-sm group"
                  >
                    <div className="relative w-14 h-14 mx-auto rounded-xl overflow-hidden bg-[#161512] border border-[#f5f1ca]/20 mb-2.5 shadow-inner">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={getPersonPhoto(item.person_name, item.student_id)}
                        alt={item.person_name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#161512] text-[#f5f1ca] border border-[#f5f1ca]/30">
                      {item.role_name}
                    </span>
                    <h5 className="font-serif-title font-bold text-base text-[#f5f1ca] mt-1.5 group-hover:text-[#f2eb87] transition-colors truncate">
                      {item.person_name}
                    </h5>
                    <p className="text-[11px] text-[#9e9a8d] mt-0.5">Manajemen Kas & Keuangan</p>
                  </motion.div>
                ))}
              </div>

              {/* Lower Merge Bar converging back to central spine */}
              <div className="w-[88%] h-6 border-b-2 border-[#f2eb87]/80 relative flex justify-center">
                <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#f2eb87] shadow-[0_0_8px_rgba(242,235,135,0.7)]" />
              </div>

              {/* Central Spine connecting to Level 4 */}
              <div className="w-[2px] h-8 bg-[#f2eb87]" />
            </div>

            {/* ------------------------------------------------------------------- */}
            {/* TIER 4: KOMANDO PELETON (DANTON 1 & DANTON 2)                       */}
            {/* ------------------------------------------------------------------- */}
            <div className="w-full max-w-3xl relative z-10 flex flex-col items-center">
              {/* Integrated Circuit Badge Node */}
              <div className="relative z-10 flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#161512] border border-[#f2eb87]/40 text-[#f2eb87] text-xs font-bold uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-red-400" />
                <span>Komando Barisan & Peleton (Danton)</span>
              </div>

              <div className="w-[2px] h-5 bg-[#f2eb87]" />

              {/* Fork to 2 Dantons */}
              <div className="w-[70%] h-6 border-t-2 border-x-2 border-[#f2eb87]/80 rounded-t-2xl relative flex justify-between">
                <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-[#f2eb87]" />
                <div className="w-2.5 h-2.5 rounded-full border-2 border-[#f2eb87] bg-[#161512] -ml-1 mt-4 self-end" />
                <div className="w-2.5 h-2.5 rounded-full border-2 border-[#f2eb87] bg-[#161512] -mr-1 mt-4 self-end" />
              </div>

              {/* Danton Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                {dantonRoles.map((item) => (
                  <motion.div
                    key={item.id}
                    whileHover={{ y: -3 }}
                    onClick={() => handlePersonClick(item.person_name, item.student_id)}
                    className="cursor-pointer p-4 rounded-2xl bg-[#1f1d19] border border-[#f5f1ca]/15 hover:border-[#f2eb87] transition-all text-center shadow-sm group"
                  >
                    <div className="relative w-14 h-14 mx-auto rounded-xl overflow-hidden bg-[#161512] border border-[#f5f1ca]/20 mb-2.5 shadow-inner">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={getPersonPhoto(item.person_name, item.student_id)}
                        alt={item.person_name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#161512] text-[#f2eb87] border border-[#f2eb87]/30">
                      {item.role_name}
                    </span>
                    <h5 className="font-serif-title font-bold text-base text-[#f5f1ca] mt-1.5 group-hover:text-[#f2eb87] transition-colors truncate">
                      {item.person_name}
                    </h5>
                    <p className="text-[11px] text-[#9e9a8d] mt-0.5">Komando Baris & Disiplin</p>
                  </motion.div>
                ))}
              </div>

              {/* Lower Merge Bar converging Danton */}
              <div className="w-[70%] h-6 border-b-2 border-x-2 border-[#f2eb87]/80 rounded-b-2xl relative flex justify-center">
                <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#f2eb87] shadow-[0_0_8px_rgba(242,235,135,0.7)]" />
              </div>

              {/* Central Spine to Level 5 */}
              <div className="w-[2px] h-8 bg-[#f2eb87]" />
            </div>

            {/* ------------------------------------------------------------------- */}
            {/* TIER 5: DEPARTEMEN & KOORDINATOR DIVISI                             */}
            {/* ------------------------------------------------------------------- */}
            <div className="w-full max-w-6xl relative z-10 flex flex-col items-center">
              {/* Integrated Circuit Badge Node */}
              <div className="relative z-10 flex items-center gap-2 px-5 py-2 rounded-full bg-[#161512] border border-[#f2eb87]/50 shadow-[0_0_20px_rgba(242,235,135,0.15)] text-[#f2eb87] text-xs font-bold uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Koordinator Divisi & Departemen Operasional</span>
              </div>

              <div className="w-[2px] h-6 bg-[#f2eb87]" />

              {/* 3-Way Branch Bar */}
              <div className="w-[85%] h-6 border-t-2 border-[#f2eb87]/80 relative flex justify-between">
                <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#f2eb87]" />
                <div className="w-2.5 h-2.5 rounded-full border-2 border-[#f2eb87] bg-[#161512] -ml-1 mt-4 self-end" />
                <div className="w-2.5 h-2.5 rounded-full border-2 border-[#f2eb87] bg-[#161512] -mr-1 mt-4 self-end" />
              </div>

              {/* 3 Divisions Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                {/* Divisi Kebersihan */}
                <div className="p-6 rounded-3xl bg-[#1f1d19] border border-[#f5f1ca]/15 hover:border-[#f2eb87] transition-all space-y-4 shadow-sm">
                  <div className="flex items-center gap-2.5 pb-3 border-b border-[#f5f1ca]/10 text-[#f2eb87]">
                    <Brush className="w-4 h-4" />
                    <span className="font-serif-title font-bold text-base text-[#f5f1ca]">
                      Divisi Kebersihan
                    </span>
                  </div>
                  <div className="space-y-3">
                    {kebersihanRoles.map((item, i) => (
                      <div
                        key={item.id}
                        onClick={() => handlePersonClick(item.person_name, item.student_id)}
                        className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#161512] transition-colors cursor-pointer group"
                      >
                        <div className="w-10 h-10 rounded-xl overflow-hidden bg-[#161512] border border-[#f5f1ca]/15 flex-shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={getPersonPhoto(item.person_name, item.student_id)}
                            alt={item.person_name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <div className="text-xs min-w-0 flex-1">
                          <p className="font-bold text-[#f5f1ca] group-hover:text-[#f2eb87] transition-colors truncate">
                            {item.person_name}
                          </p>
                          <p className="text-[10px] text-[#9e9a8d]">Sanitasi & Kebersihan Lab</p>
                        </div>
                        <span className="text-[10px] font-mono font-bold text-[#9e9a8d]">
                          #{i + 1}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Divisi Keamanan */}
                <div className="p-6 rounded-3xl bg-[#1f1d19] border border-[#f5f1ca]/15 hover:border-[#f2eb87] transition-all space-y-4 shadow-sm">
                  <div className="flex items-center gap-2.5 pb-3 border-b border-[#f5f1ca]/10 text-[#f2eb87]">
                    <Lock className="w-4 h-4" />
                    <span className="font-serif-title font-bold text-base text-[#f5f1ca]">
                      Divisi Keamanan
                    </span>
                  </div>
                  <div className="space-y-3">
                    {keamananRoles.map((item, i) => (
                      <div
                        key={item.id}
                        onClick={() => handlePersonClick(item.person_name, item.student_id)}
                        className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#161512] transition-colors cursor-pointer group"
                      >
                        <div className="w-10 h-10 rounded-xl overflow-hidden bg-[#161512] border border-[#f5f1ca]/15 flex-shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={getPersonPhoto(item.person_name, item.student_id)}
                            alt={item.person_name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <div className="text-xs min-w-0 flex-1">
                          <p className="font-bold text-[#f5f1ca] group-hover:text-[#f2eb87] transition-colors truncate">
                            {item.person_name}
                          </p>
                          <p className="text-[10px] text-[#9e9a8d]">Ketertiban & Aset Ruangan</p>
                        </div>
                        <span className="text-[10px] font-mono font-bold text-[#9e9a8d]">
                          #{i + 1}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Divisi Keagamaan */}
                <div className="p-6 rounded-3xl bg-[#1f1d19] border border-[#f5f1ca]/15 hover:border-[#f2eb87] transition-all space-y-4 shadow-sm">
                  <div className="flex items-center gap-2.5 pb-3 border-b border-[#f5f1ca]/10 text-[#f2eb87]">
                    <Heart className="w-4 h-4" />
                    <span className="font-serif-title font-bold text-base text-[#f5f1ca]">
                      Divisi Keagamaan
                    </span>
                  </div>
                  <div className="space-y-3">
                    {keagamaanRoles.map((item, i) => (
                      <div
                        key={item.id}
                        onClick={() => handlePersonClick(item.person_name, item.student_id)}
                        className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#161512] transition-colors cursor-pointer group"
                      >
                        <div className="w-10 h-10 rounded-xl overflow-hidden bg-[#161512] border border-[#f5f1ca]/15 flex-shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={getPersonPhoto(item.person_name, item.student_id)}
                            alt={item.person_name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <div className="text-xs min-w-0 flex-1">
                          <p className="font-bold text-[#f5f1ca] group-hover:text-[#f2eb87] transition-colors truncate">
                            {item.person_name}
                          </p>
                          <p className="text-[10px] text-[#9e9a8d]">Rohani & Aktivitas Ibadah</p>
                        </div>
                        <span className="text-[10px] font-mono font-bold text-[#9e9a8d]">
                          #{i + 1}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 2: DEPARTMENT & BIRO CATALOG (BEM FEB UI DIRECTORY STYLE)            */}
        {/* ========================================================================= */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {roles.map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ y: -4 }}
                onClick={() => handlePersonClick(item.person_name, item.student_id)}
                className="cursor-pointer p-6 rounded-3xl bg-[#1f1d19] border border-[#f5f1ca]/15 hover:border-[#f2eb87] transition-all flex items-center gap-4 group"
              >
                <div className="w-16 h-16 rounded-2xl overflow-hidden bg-[#161512] border border-[#f5f1ca]/20 flex-shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={getPersonPhoto(item.person_name, item.student_id)}
                    alt={item.person_name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#161512] text-[#f2eb87] border border-[#f2eb87]/20">
                    {item.category}
                  </span>
                  <h4 className="font-serif-title font-bold text-lg text-[#f5f1ca] group-hover:text-[#f2eb87] transition-colors truncate mt-1">
                    {item.person_name}
                  </h4>
                  <p className="text-xs text-[#9e9a8d] truncate">{item.role_name}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-[#9e9a8d] group-hover:text-[#f2eb87] group-hover:translate-x-1 transition-all" />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Student Detail Modal */}
      <StudentModal student={selectedStudent} onClose={() => setSelectedStudent(null)} />
    </motion.div>
  );
}
