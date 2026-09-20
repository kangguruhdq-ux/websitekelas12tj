'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useClassData } from '@/context/ClassDataContext';
import { Student, LabSeatAssignment } from '@/types';
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
  CheckCircle2,
} from 'lucide-react';
import Link from 'next/link';

interface SelectedSeatDetail {
  name: string;
  photo_url?: string;
  gender: 'L' | 'P';
  elective_subject: string;
  nisn: string;
  ip_address: string;
  pc_name: string;
  deskNum: number;
  seatLabel: 'A' | 'B';
  vlan: number;
}

export default function SeatingPlanPage() {
  const { students, settings, seatingPlan, labSettings } = useClassData();
  const [selectedSeat, setSelectedSeat] = useState<SelectedSeatDetail | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Use seatingPlan from CMS if available, otherwise construct default 17 desks
  const activeDesks =
    seatingPlan && seatingPlan.length > 0
      ? seatingPlan
      : Array.from({ length: 17 }, (_, idx) => {
          const s1 = students[idx * 2];
          const s2 = students[idx * 2 + 1];
          const deskNum = idx + 1;
          return {
            id: `desk-${deskNum}`,
            deskNum,
            vlan: 10 + deskNum,
            seatA: {
              student_id: s1?.id || '',
              student_name: s1?.name || (s1 ? s1.name : 'Kursi Kosong'),
              ip_address: `192.168.27.${deskNum * 2}`,
              pc_name: `PC-TJ-${String(deskNum).padStart(2, '0')}A`,
              status: 'online' as const,
            },
            seatB: {
              student_id: s2?.id || '',
              student_name: s2?.name || (s2 ? s2.name : 'Kursi Kosong'),
              ip_address: `192.168.27.${deskNum * 2 + 1}`,
              pc_name: `PC-TJ-${String(deskNum).padStart(2, '0')}B`,
              status: 'online' as const,
            },
          };
        });

  const filteredDesks = activeDesks.filter((d) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const nameA = d.seatA?.student_name?.toLowerCase() || '';
    const nameB = d.seatB?.student_name?.toLowerCase() || '';
    const vlanStr = `vlan ${d.vlan}`;
    const deskStr = `meja ${d.deskNum}`;
    const ipA = d.seatA?.ip_address?.toLowerCase() || '';
    const ipB = d.seatB?.ip_address?.toLowerCase() || '';
    return (
      nameA.includes(q) ||
      nameB.includes(q) ||
      vlanStr.includes(q) ||
      deskStr.includes(q) ||
      ipA.includes(q) ||
      ipB.includes(q)
    );
  });

  const openStudentModal = (
    seat: LabSeatAssignment,
    seatLabel: 'A' | 'B',
    deskNum: number,
    vlan: number
  ) => {
    if (!seat.student_name || seat.student_name === 'Kursi Kosong') return;
    const match = students.find(
      (s) => s.id === seat.student_id || s.name.toLowerCase() === seat.student_name.toLowerCase()
    );
    setSelectedSeat({
      name: seat.student_name,
      photo_url: match?.photo_url || '',
      gender: match?.gender || 'L',
      elective_subject: match?.elective_subject || 'Routing & Switching',
      nisn: match?.nisn || '0071829000',
      ip_address: seat.ip_address,
      pc_name: seat.pc_name || `PC-TJ-${String(deskNum).padStart(2, '0')}${seatLabel}`,
      deskNum,
      seatLabel,
      vlan,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
      style={{
        backgroundColor: 'var(--bg-primary)',
        color: 'var(--text-body)',
      }}
    >
      {/* Background Ambience */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full blur-3xl pointer-events-none opacity-20"
        style={{ backgroundColor: 'var(--theme-glow)' }}
      />

      <div className="max-w-7xl mx-auto space-y-10 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold border shadow-sm"
            style={{
              backgroundColor: 'var(--color-theme-muted)',
              color: 'var(--color-theme)',
              borderColor: 'var(--border-theme)',
            }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="uppercase tracking-widest text-[10px]">TOPOLOGI FISIK & SEATING PLAN</span>
          </div>
          <h1
            className="text-3xl sm:text-5xl font-theme-heading font-black tracking-tight"
            style={{ color: 'var(--text-main)' }}
          >
            {labSettings?.page_title || 'Denah Meja Kelas & Lab XII TKJ'}
          </h1>
          <p
            className="text-xs sm:text-sm leading-relaxed"
            style={{ color: 'var(--text-muted)' }}
          >
            {labSettings?.page_subtitle ||
              `Visualisasi penataan tempat duduk praktikum dan workstation komputer jaringan 34 siswa keluarga besar ${
                settings.class_name || 'XII TKJ'
              }.`}
          </p>

          {/* Search Bar */}
          <div className="pt-2 max-w-md mx-auto">
            <div className="relative">
              <Search
                className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2"
                style={{ color: 'var(--text-muted)' }}
              />
              <input
                type="text"
                placeholder="Cari nama teman, nomor meja, atau VLAN..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl border text-xs focus:outline-none focus:border-current shadow-inner"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-main)',
                }}
              />
            </div>
          </div>
        </div>

        {/* Classroom / Lab Map Frame */}
        <div
          className="p-6 sm:p-10 rounded-3xl border shadow-2xl space-y-10"
          style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--border-color)',
          }}
        >
          {/* Front Stage: Teacher Podium, Screen, and Server Rack */}
          <div
            className="grid grid-cols-1 md:grid-cols-12 gap-4 pb-8 border-b items-center"
            style={{ borderColor: 'var(--border-color)' }}
          >
            {/* Server Rack Corner */}
            <div
              className="md:col-span-3 p-4 rounded-2xl border flex items-center gap-3 text-xs"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                borderColor: 'var(--border-theme)',
              }}
            >
              <div
                className="w-10 h-10 rounded-xl border flex items-center justify-center flex-shrink-0"
                style={{
                  backgroundColor: 'var(--bg-primary)',
                  borderColor: 'var(--border-theme)',
                  color: 'var(--color-theme)',
                }}
              >
                <Server className="w-5 h-5" />
              </div>
              <div className="overflow-hidden">
                <span
                  className="text-[10px] font-mono uppercase font-bold block truncate"
                  style={{ color: 'var(--color-theme)' }}
                >
                  {labSettings?.server_rack_name || 'Core Rack Server'}
                </span>
                <span className="text-[11px] truncate block" style={{ color: 'var(--text-muted)' }}>
                  {labSettings?.server_rack_desc || 'MikroTik CCR + 48P Switch'}
                </span>
              </div>
            </div>

            {/* Front Whiteboard / Projector Screen */}
            <div
              className="md:col-span-6 p-4 rounded-2xl border text-center space-y-1"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                borderColor: 'var(--border-color)',
              }}
            >
              <span
                className="text-[10px] uppercase tracking-widest font-bold block truncate"
                style={{ color: 'var(--color-theme)' }}
              >
                {labSettings?.board_title || 'PAPAN TULIS & LAYAR PROYEKTOR UTAMA'}
              </span>
              <p className="text-xs truncate" style={{ color: 'var(--text-body)' }}>
                {labSettings?.board_desc || 'Area Pengajaran & Presentasi Praktik Jaringan'}
              </p>
            </div>

            {/* Homeroom Teacher Podium */}
            <div
              className="md:col-span-3 p-4 rounded-2xl border flex items-center gap-3 text-xs"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                borderColor: 'var(--border-theme)',
              }}
            >
              <div
                className="w-10 h-10 rounded-xl border flex items-center justify-center flex-shrink-0"
                style={{
                  backgroundColor: 'var(--bg-primary)',
                  borderColor: 'var(--border-theme)',
                  color: 'var(--color-theme)',
                }}
              >
                <GraduationCap className="w-5 h-5" />
              </div>
              <div className="overflow-hidden">
                <span
                  className="text-[10px] font-mono uppercase font-bold block truncate"
                  style={{ color: 'var(--color-theme)' }}
                >
                  {labSettings?.podium_title || 'Podium Pembimbing'}
                </span>
                <span className="font-medium text-[11px] truncate block" style={{ color: 'var(--text-main)' }}>
                  {labSettings?.podium_teacher || settings.homeroom_teacher || 'Bu Febriyana, S.T.'}
                </span>
              </div>
            </div>
          </div>

          {/* Grid of Student Desks */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredDesks.map((d) => (
              <div
                key={d.deskNum}
                className="p-4 rounded-2xl border transition-all space-y-3 shadow-md hover:shadow-xl group"
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  borderColor: 'var(--border-color)',
                }}
              >
                {/* Desk Header */}
                <div
                  className="flex items-center justify-between pb-2 border-b"
                  style={{ borderColor: 'var(--border-color)' }}
                >
                  <div className="flex items-center gap-1.5">
                    <Monitor className="w-3.5 h-3.5" style={{ color: 'var(--color-theme)' }} />
                    <span className="font-theme-heading text-xs font-bold" style={{ color: 'var(--text-main)' }}>
                      Meja #{d.deskNum}
                    </span>
                  </div>
                  <span
                    className="text-[10px] font-mono px-2 py-0.5 rounded border"
                    style={{
                      backgroundColor: 'var(--bg-primary)',
                      color: 'var(--color-theme)',
                      borderColor: 'var(--border-color)',
                    }}
                  >
                    VLAN {d.vlan}
                  </span>
                </div>

                {/* Left Seat (Seat A) */}
                {d.seatA && d.seatA.student_name && d.seatA.student_name !== 'Kursi Kosong' ? (
                  <div
                    onClick={() => openStudentModal(d.seatA, 'A', d.deskNum, d.vlan)}
                    className="p-2.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between group/seat"
                    style={{
                      backgroundColor: 'var(--bg-card)',
                      borderColor: 'var(--border-color)',
                    }}
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      <div
                        className="w-7 h-7 rounded-lg border flex items-center justify-center flex-shrink-0 text-xs font-bold"
                        style={{
                          backgroundColor: 'var(--bg-primary)',
                          borderColor: 'var(--border-theme)',
                          color: 'var(--color-theme)',
                        }}
                      >
                        A
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-xs font-medium truncate" style={{ color: 'var(--text-main)' }}>
                          {d.seatA.student_name}
                        </p>
                        <p className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>
                          {d.seatA.ip_address}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                        d.seatA.status === 'offline'
                          ? 'bg-slate-500'
                          : d.seatA.status === 'maintenance'
                          ? 'bg-amber-400'
                          : 'bg-emerald-400'
                      }`}
                    />
                  </div>
                ) : (
                  <div
                    className="p-2.5 rounded-xl border border-dashed text-[11px] text-center"
                    style={{
                      backgroundColor: 'var(--bg-card)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-muted)',
                    }}
                  >
                    Kursi Kosong
                  </div>
                )}

                {/* Right Seat (Seat B) */}
                {d.seatB && d.seatB.student_name && d.seatB.student_name !== 'Kursi Kosong' ? (
                  <div
                    onClick={() => openStudentModal(d.seatB, 'B', d.deskNum, d.vlan)}
                    className="p-2.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between group/seat"
                    style={{
                      backgroundColor: 'var(--bg-card)',
                      borderColor: 'var(--border-color)',
                    }}
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      <div
                        className="w-7 h-7 rounded-lg border flex items-center justify-center flex-shrink-0 text-xs font-bold"
                        style={{
                          backgroundColor: 'var(--bg-primary)',
                          borderColor: 'var(--border-theme)',
                          color: 'var(--color-theme)',
                        }}
                      >
                        B
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-xs font-medium truncate" style={{ color: 'var(--text-main)' }}>
                          {d.seatB.student_name}
                        </p>
                        <p className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>
                          {d.seatB.ip_address}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                        d.seatB.status === 'offline'
                          ? 'bg-slate-500'
                          : d.seatB.status === 'maintenance'
                          ? 'bg-amber-400'
                          : 'bg-emerald-400'
                      }`}
                    />
                  </div>
                ) : (
                  <div
                    className="p-2.5 rounded-xl border border-dashed text-[11px] text-center"
                    style={{
                      backgroundColor: 'var(--bg-card)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-muted)',
                    }}
                  >
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
        {selectedSeat && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedSeat(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-md border rounded-3xl p-6 shadow-2xl z-10 space-y-5"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border-theme)',
                color: 'var(--text-body)',
              }}
            >
              <div className="flex items-start justify-between">
                <div
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border"
                  style={{
                    backgroundColor: 'var(--color-theme-muted)',
                    color: 'var(--color-theme)',
                    borderColor: 'var(--border-theme)',
                  }}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Workstation Profile</span>
                </div>
                <button
                  onClick={() => setSelectedSeat(null)}
                  className="p-1 rounded-full hover:opacity-70 transition-opacity"
                  style={{ color: 'var(--text-muted)' }}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center gap-4 pt-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={
                    selectedSeat.photo_url ||
                    getStudentAvatarUrl(selectedSeat.name, selectedSeat.gender)
                  }
                  alt={selectedSeat.name}
                  className="w-16 h-16 rounded-2xl object-cover border-2 shadow-inner"
                  style={{
                    backgroundColor: 'var(--bg-primary)',
                    borderColor: 'var(--border-theme)',
                  }}
                />
                <div className="overflow-hidden">
                  <h3
                    className="font-theme-heading font-bold text-lg leading-tight truncate"
                    style={{ color: 'var(--text-main)' }}
                  >
                    {selectedSeat.name}
                  </h3>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                    Meja #{selectedSeat.deskNum} (Kursi {selectedSeat.seatLabel}) • VLAN {selectedSeat.vlan}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div
                  className="p-3 rounded-xl border"
                  style={{
                    backgroundColor: 'var(--bg-secondary)',
                    borderColor: 'var(--border-color)',
                  }}
                >
                  <span className="block text-[10px] uppercase font-semibold" style={{ color: 'var(--text-muted)' }}>
                    IP Workstation
                  </span>
                  <span className="font-mono font-bold mt-0.5 block truncate" style={{ color: 'var(--color-theme)' }}>
                    {selectedSeat.ip_address}
                  </span>
                </div>

                <div
                  className="p-3 rounded-xl border"
                  style={{
                    backgroundColor: 'var(--bg-secondary)',
                    borderColor: 'var(--border-color)',
                  }}
                >
                  <span className="block text-[10px] uppercase font-semibold" style={{ color: 'var(--text-muted)' }}>
                    Hostname PC
                  </span>
                  <span className="font-mono font-bold mt-0.5 block truncate" style={{ color: 'var(--text-main)' }}>
                    {selectedSeat.pc_name}
                  </span>
                </div>

                <div
                  className="p-3 rounded-xl border"
                  style={{
                    backgroundColor: 'var(--bg-secondary)',
                    borderColor: 'var(--border-color)',
                  }}
                >
                  <span className="block text-[10px] uppercase font-semibold" style={{ color: 'var(--text-muted)' }}>
                    Peminatan Kejuruan
                  </span>
                  <span className="font-semibold line-clamp-1 mt-0.5" style={{ color: 'var(--text-main)' }}>
                    {selectedSeat.elective_subject}
                  </span>
                </div>

                <div
                  className="p-3 rounded-xl border"
                  style={{
                    backgroundColor: 'var(--bg-secondary)',
                    borderColor: 'var(--border-color)',
                  }}
                >
                  <span className="block text-[10px] uppercase font-semibold" style={{ color: 'var(--text-muted)' }}>
                    Status Praktikum
                  </span>
                  <span className="font-bold text-emerald-400 mt-0.5 block flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Terhubung Lab</span>
                  </span>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <Link
                  href="/siswa"
                  className="px-4 py-2 rounded-xl font-bold text-xs shadow-md transition-all hover:scale-105 active:scale-95"
                  style={{
                    backgroundColor: 'var(--color-theme)',
                    color: '#050505',
                  }}
                >
                  Lihat di Direktori Siswa →
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
