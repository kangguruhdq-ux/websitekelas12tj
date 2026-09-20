'use client';

import React, { useState, useEffect } from 'react';
import { useClassData } from '@/context/ClassDataContext';
import { DeskItem, LabSettings, LabSeatAssignment } from '@/types';
import { INITIAL_SEATING_PLAN, INITIAL_LAB_SETTINGS } from '@/lib/seed-data';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Monitor,
  Server,
  GraduationCap,
  Sparkles,
  Search,
  Save,
  RotateCcw,
  CheckCircle2,
  Edit2,
  ArrowRightLeft,
  Settings2,
  X,
  Plus,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Cpu,
  User,
  Wifi,
  Shuffle,
} from 'lucide-react';

export default function AdminDenahPage() {
  const { seatingPlan, labSettings, updateSeatingPlan, updateLabSettings, students, isSyncing } = useClassData();

  // Local state for 17 desks
  const [desks, setDesks] = useState<DeskItem[]>(() => {
    return seatingPlan && seatingPlan.length > 0 ? seatingPlan : INITIAL_SEATING_PLAN;
  });

  // Local state for lab info
  const [labInfo, setLabInfo] = useState<LabSettings>(() => {
    return labSettings && labSettings.page_title ? labSettings : INITIAL_LAB_SETTINGS;
  });

  // Sync state if context changes externally
  useEffect(() => {
    if (seatingPlan && seatingPlan.length > 0) {
      setDesks(seatingPlan);
    }
  }, [seatingPlan]);

  useEffect(() => {
    if (labSettings && labSettings.page_title) {
      setLabInfo(labSettings);
    }
  }, [labSettings]);

  const [searchQuery, setSearchQuery] = useState('');
  const [showLabSettingsAccordion, setShowLabSettingsAccordion] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Edit Single Desk Modal
  const [editingDesk, setEditingDesk] = useState<DeskItem | null>(null);

  // Swap Seats Modal
  const [swapModalOpen, setSwapModalOpen] = useState(false);
  const [swapSource, setSwapSource] = useState<{ deskNum: number; seat: 'A' | 'B' }>({ deskNum: 1, seat: 'A' });
  const [swapTarget, setSwapTarget] = useState<{ deskNum: number; seat: 'A' | 'B' }>({ deskNum: 2, seat: 'A' });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Save changes to CMS
  const handleSaveAll = async () => {
    setSaving(true);
    try {
      const p1 = updateSeatingPlan(desks);
      const p2 = updateLabSettings(labInfo);
      const [res1, res2] = await Promise.all([p1, p2]);
      if (res1 && res2) {
        showToast('Denah meja praktikum & konfigurasi lab berhasil disimpan ke database!');
      } else {
        alert('Gagal menyimpan denah ke server.');
      }
    } catch (e: any) {
      alert('Error saat menyimpan: ' + (e.message || 'Unknown error'));
    } finally {
      setSaving(false);
    }
  };

  // Reset to default seed
  const handleResetDefault = () => {
    if (confirm('Kembalikan denah tempat duduk ke susunan standar 17 meja & 34 siswa?')) {
      setDesks(INITIAL_SEATING_PLAN);
      setLabInfo(INITIAL_LAB_SETTINGS);
      showToast('Denah meja dan topologi di-reset ke konfigurasi default.');
    }
  };

  // Auto assign from current students list
  const handleAutoAssignAlphabetical = () => {
    if (confirm('Susun ulang tempat duduk 34 siswa secara urut alfabetis ke Meja #1 s/d #17?')) {
      const sortedStudents = [...students].sort((a, b) => a.name.localeCompare(b.name));
      const newDesks = desks.map((d, idx) => {
        const s1 = sortedStudents[idx * 2];
        const s2 = sortedStudents[idx * 2 + 1];
        return {
          ...d,
          seatA: {
            ...d.seatA,
            student_id: s1?.id || '',
            student_name: s1?.name || 'Kursi Kosong',
            ip_address: `192.168.27.${(idx + 1) * 2}`,
            pc_name: `PC-TJ-${String(idx + 1).padStart(2, '0')}A`,
            status: 'online' as const,
          },
          seatB: {
            ...d.seatB,
            student_id: s2?.id || '',
            student_name: s2?.name || 'Kursi Kosong',
            ip_address: `192.168.27.${(idx + 1) * 2 + 1}`,
            pc_name: `PC-TJ-${String(idx + 1).padStart(2, '0')}B`,
            status: 'online' as const,
          },
        };
      });
      setDesks(newDesks);
      showToast('Siswa berhasil disusun urut alfabetis ke seluruh meja lab!');
    }
  };

  // Quick swap seat A and seat B on a specific desk
  const handleQuickSwapAB = (deskNum: number) => {
    setDesks((prev) =>
      prev.map((d) => {
        if (d.deskNum === deskNum) {
          return {
            ...d,
            seatA: {
              ...d.seatA,
              student_id: d.seatB.student_id,
              student_name: d.seatB.student_name,
            },
            seatB: {
              ...d.seatB,
              student_id: d.seatA.student_id,
              student_name: d.seatA.student_name,
            },
          };
        }
        return d;
      })
    );
    showToast(`Meja #${deskNum}: Kursi A dan B berhasil ditukar posisinya!`);
  };

  // Perform cross-desk swap
  const handleExecuteCrossSwap = () => {
    if (swapSource.deskNum === swapTarget.deskNum && swapSource.seat === swapTarget.seat) {
      alert('Pilih dua kursi yang berbeda untuk ditukar!');
      return;
    }

    setDesks((prev) => {
      const next = JSON.parse(JSON.stringify(prev)) as DeskItem[];
      const srcDesk = next.find((d) => d.deskNum === swapSource.deskNum);
      const tgtDesk = next.find((d) => d.deskNum === swapTarget.deskNum);

      if (!srcDesk || !tgtDesk) return prev;

      const srcSeatProp = swapSource.seat === 'A' ? 'seatA' : 'seatB';
      const tgtSeatProp = swapTarget.seat === 'A' ? 'seatA' : 'seatB';

      const tempId = srcDesk[srcSeatProp].student_id;
      const tempName = srcDesk[srcSeatProp].student_name;

      srcDesk[srcSeatProp].student_id = tgtDesk[tgtSeatProp].student_id;
      srcDesk[srcSeatProp].student_name = tgtDesk[tgtSeatProp].student_name;

      tgtDesk[tgtSeatProp].student_id = tempId;
      tgtDesk[tgtSeatProp].student_name = tempName;

      return next;
    });

    setSwapModalOpen(false);
    showToast(
      `Berhasil menukar posisi Meja #${swapSource.deskNum} (${swapSource.seat}) ⇄ Meja #${swapTarget.deskNum} (${swapTarget.seat})!`
    );
  };

  // Save single desk from modal
  const handleSaveDeskModal = (updated: DeskItem) => {
    setDesks((prev) => prev.map((d) => (d.deskNum === updated.deskNum ? updated : d)));
    setEditingDesk(null);
    showToast(`Perubahan Meja #${updated.deskNum} berhasil disimpan.`);
  };

  // Filter desks by search
  const filteredDesks = desks.filter((d) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const nameA = d.seatA.student_name.toLowerCase();
    const nameB = d.seatB.student_name.toLowerCase();
    const vlanStr = `vlan ${d.vlan}`;
    const deskStr = `meja ${d.deskNum}`;
    const ipA = d.seatA.ip_address.toLowerCase();
    const ipB = d.seatB.ip_address.toLowerCase();
    return (
      nameA.includes(q) ||
      nameB.includes(q) ||
      vlanStr.includes(q) ||
      deskStr.includes(q) ||
      ipA.includes(q) ||
      ipB.includes(q)
    );
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-emerald-500 text-slate-950 font-semibold text-xs shadow-2xl"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header & Title */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b" style={{ borderColor: 'var(--border-color)' }}>
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase border" style={{ backgroundColor: 'var(--color-theme-muted)', color: 'var(--color-theme)', borderColor: 'var(--border-theme)' }}>
            <Monitor className="w-3.5 h-3.5" />
            <span>TOPOLOGI FISIK & SEATING PLAN</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-theme-heading font-black tracking-tight" style={{ color: 'var(--text-main)' }}>
            Denah Meja Kelas & Lab XII TKJ
          </h1>
          <p className="text-xs text-muted-foreground" style={{ color: 'var(--text-muted)' }}>
            Kelola penataan 17 meja praktikum (34 siswa), segmentasi VLAN 11–27, alokasi IP workstation, dan topologi pengajaran.
          </p>
        </div>

        {/* Global Control Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setSwapModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all hover:scale-105"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-main)',
            }}
          >
            <ArrowRightLeft className="w-3.5 h-3.5" style={{ color: 'var(--color-theme)' }} />
            <span>Tukar Kursi Siswa</span>
          </button>

          <button
            onClick={handleAutoAssignAlphabetical}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all hover:scale-105"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-main)',
            }}
          >
            <Shuffle className="w-3.5 h-3.5" style={{ color: 'var(--color-theme)' }} />
            <span>Auto Urut Nama</span>
          </button>

          <button
            onClick={handleResetDefault}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all hover:opacity-80"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-muted)',
            }}
            title="Reset ke Default"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          <button
            onClick={handleSaveAll}
            disabled={saving || isSyncing}
            className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold transition-all hover:scale-105 shadow-md active:scale-95 disabled:opacity-50"
            style={{
              backgroundColor: 'var(--color-theme)',
              color: '#050505',
              boxShadow: '0 4px 14px -2px var(--theme-glow)',
            }}
          >
            <Save className={`w-4 h-4 ${saving ? 'animate-spin' : ''}`} />
            <span>{saving ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
          </button>
        </div>
      </div>

      {/* Lab Information & Stage Settings Accordion */}
      <div className="rounded-2xl border transition-all overflow-hidden" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
        <button
          onClick={() => setShowLabSettingsAccordion(!showLabSettingsAccordion)}
          className="w-full px-5 py-3.5 flex items-center justify-between text-left transition-colors"
          style={{ color: 'var(--text-main)' }}
        >
          <div className="flex items-center gap-2.5">
            <Settings2 className="w-4 h-4" style={{ color: 'var(--color-theme)' }} />
            <span className="text-xs font-bold uppercase tracking-wider">
              Pengaturan Label Lab, Rack Server, Layar & Podium
            </span>
          </div>
          {showLabSettingsAccordion ? (
            <ChevronUp className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          )}
        </button>

        {showLabSettingsAccordion && (
          <div className="px-5 pb-5 pt-2 border-t grid grid-cols-1 md:grid-cols-2 gap-4" style={{ borderColor: 'var(--border-color)' }}>
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-muted-foreground">Judul Halaman Publik</label>
              <input
                type="text"
                value={labInfo.page_title}
                onChange={(e) => setLabInfo({ ...labInfo, page_title: e.target.value })}
                className="w-full px-3 py-2 rounded-xl text-xs border bg-transparent focus:outline-none focus:border-current"
                style={{ borderColor: 'var(--border-color)', color: 'var(--text-main)' }}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-muted-foreground">Subjudul / Deskripsi Denah</label>
              <input
                type="text"
                value={labInfo.page_subtitle}
                onChange={(e) => setLabInfo({ ...labInfo, page_subtitle: e.target.value })}
                className="w-full px-3 py-2 rounded-xl text-xs border bg-transparent focus:outline-none focus:border-current"
                style={{ borderColor: 'var(--border-color)', color: 'var(--text-main)' }}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-muted-foreground">Core Rack Server (Nama Perangkat)</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Core Rack Server"
                  value={labInfo.server_rack_name}
                  onChange={(e) => setLabInfo({ ...labInfo, server_rack_name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl text-xs border bg-transparent focus:outline-none focus:border-current"
                  style={{ borderColor: 'var(--border-color)', color: 'var(--text-main)' }}
                />
                <input
                  type="text"
                  placeholder="MikroTik CCR + 48P Switch"
                  value={labInfo.server_rack_desc}
                  onChange={(e) => setLabInfo({ ...labInfo, server_rack_desc: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl text-xs border bg-transparent focus:outline-none focus:border-current"
                  style={{ borderColor: 'var(--border-color)', color: 'var(--text-main)' }}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-muted-foreground">Papan Tulis & Layar Proyektor</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="PAPAN TULIS & LAYAR PROYEKTOR"
                  value={labInfo.board_title}
                  onChange={(e) => setLabInfo({ ...labInfo, board_title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl text-xs border bg-transparent focus:outline-none focus:border-current"
                  style={{ borderColor: 'var(--border-color)', color: 'var(--text-main)' }}
                />
                <input
                  type="text"
                  placeholder="Area Pengajaran & Presentasi"
                  value={labInfo.board_desc}
                  onChange={(e) => setLabInfo({ ...labInfo, board_desc: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl text-xs border bg-transparent focus:outline-none focus:border-current"
                  style={{ borderColor: 'var(--border-color)', color: 'var(--text-main)' }}
                />
              </div>
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="text-[11px] font-semibold text-muted-foreground">Podium Pembimbing & Nama Guru</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Podium Pembimbing"
                  value={labInfo.podium_title}
                  onChange={(e) => setLabInfo({ ...labInfo, podium_title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl text-xs border bg-transparent focus:outline-none focus:border-current"
                  style={{ borderColor: 'var(--border-color)', color: 'var(--text-main)' }}
                />
                <input
                  type="text"
                  placeholder="Bu Febriyana, S.T."
                  value={labInfo.podium_teacher}
                  onChange={(e) => setLabInfo({ ...labInfo, podium_teacher: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl text-xs border bg-transparent focus:outline-none focus:border-current"
                  style={{ borderColor: 'var(--border-color)', color: 'var(--text-main)' }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Front Stage Visualization Banner */}
      <div className="p-4 rounded-2xl border grid grid-cols-1 md:grid-cols-12 gap-3 items-center" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
        <div className="md:col-span-3 p-3 rounded-xl border flex items-center gap-3 text-xs" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-theme)' }}>
          <div className="w-8 h-8 rounded-lg border flex items-center justify-center shrink-0" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-theme)', color: 'var(--color-theme)' }}>
            <Server className="w-4 h-4" />
          </div>
          <div className="overflow-hidden">
            <span className="text-[10px] font-mono uppercase font-bold block truncate" style={{ color: 'var(--color-theme)' }}>
              {labInfo.server_rack_name || 'Core Rack Server'}
            </span>
            <span className="text-[11px] truncate block" style={{ color: 'var(--text-muted)' }}>
              {labInfo.server_rack_desc || 'MikroTik CCR + 48P Switch'}
            </span>
          </div>
        </div>

        <div className="md:col-span-6 p-3 rounded-xl border text-center space-y-0.5" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
          <span className="text-[10px] uppercase tracking-widest font-bold block truncate" style={{ color: 'var(--color-theme)' }}>
            {labInfo.board_title || 'PAPAN TULIS & LAYAR PROYEKTOR UTAMA'}
          </span>
          <p className="text-[11px] truncate" style={{ color: 'var(--text-body)' }}>
            {labInfo.board_desc || 'Area Pengajaran & Presentasi Praktik Jaringan'}
          </p>
        </div>

        <div className="md:col-span-3 p-3 rounded-xl border flex items-center gap-3 text-xs" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-theme)' }}>
          <div className="w-8 h-8 rounded-lg border flex items-center justify-center shrink-0" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-theme)', color: 'var(--color-theme)' }}>
            <GraduationCap className="w-4 h-4" />
          </div>
          <div className="overflow-hidden">
            <span className="text-[10px] font-mono uppercase font-bold block truncate" style={{ color: 'var(--color-theme)' }}>
              {labInfo.podium_title || 'Podium Pembimbing'}
            </span>
            <span className="text-[11px] font-medium truncate block" style={{ color: 'var(--text-main)' }}>
              {labInfo.podium_teacher || 'Bu Febriyana, S.T.'}
            </span>
          </div>
        </div>
      </div>

      {/* Search & Quick Stats */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Cari nama siswa, nomor meja, atau VLAN..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl text-xs border bg-transparent focus:outline-none focus:border-current"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-main)',
            }}
          />
        </div>

        <div className="text-xs font-medium flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
          <span>Total Workstation:</span>
          <span className="px-2 py-0.5 rounded-full font-bold font-mono border" style={{ backgroundColor: 'var(--color-theme-muted)', color: 'var(--color-theme)', borderColor: 'var(--border-theme)' }}>
            17 Meja • 34 Kursi
          </span>
        </div>
      </div>

      {/* Desks Grid (17 Meja) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredDesks.map((d) => (
          <div
            key={d.deskNum}
            className="p-4 rounded-2xl border transition-all space-y-3 shadow-md hover:shadow-lg relative group"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-color)',
            }}
          >
            {/* Desk Card Header */}
            <div className="flex items-center justify-between pb-2.5 border-b" style={{ borderColor: 'var(--border-color)' }}>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg border flex items-center justify-center font-bold text-xs" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-theme)', color: 'var(--color-theme)' }}>
                  #{d.deskNum}
                </div>
                <div>
                  <span className="font-theme-heading font-bold text-xs block leading-tight" style={{ color: 'var(--text-main)' }}>
                    Meja #{d.deskNum}
                  </span>
                  <span className="text-[10px] font-mono block" style={{ color: 'var(--color-theme)' }}>
                    VLAN {d.vlan}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {/* Quick swap Seat A <-> B */}
                <button
                  onClick={() => handleQuickSwapAB(d.deskNum)}
                  title="Tukar Cepat Kursi A ⇄ B"
                  className="p-1.5 rounded-lg border transition-all hover:scale-110"
                  style={{
                    backgroundColor: 'var(--bg-primary)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--color-theme)',
                  }}
                >
                  <ArrowRightLeft className="w-3.5 h-3.5" />
                </button>

                {/* Edit Desk Modal Trigger */}
                <button
                  onClick={() => setEditingDesk(d)}
                  title="Edit Meja & Konfigurasi Workstation"
                  className="p-1.5 rounded-lg border transition-all hover:scale-110"
                  style={{
                    backgroundColor: 'var(--bg-primary)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-main)',
                  }}
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Seat A */}
            <div
              onClick={() => setEditingDesk(d)}
              className="p-2.5 rounded-xl border cursor-pointer transition-all hover:border-current flex items-center justify-between"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                borderColor: 'var(--border-color)',
              }}
            >
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="w-7 h-7 rounded-lg border flex items-center justify-center font-bold text-xs shrink-0" style={{ backgroundColor: 'var(--color-theme-muted)', borderColor: 'var(--border-theme)', color: 'var(--color-theme)' }}>
                  A
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs font-semibold truncate" style={{ color: 'var(--text-main)' }}>
                    {d.seatA.student_name || 'Kursi Kosong'}
                  </p>
                  <p className="text-[10px] font-mono truncate" style={{ color: 'var(--text-muted)' }}>
                    {d.seatA.ip_address}
                  </p>
                </div>
              </div>
              <span className={`w-2 h-2 rounded-full shrink-0 ${d.seatA.status === 'offline' ? 'bg-slate-500' : d.seatA.status === 'maintenance' ? 'bg-amber-400' : 'bg-emerald-400'}`} />
            </div>

            {/* Seat B */}
            <div
              onClick={() => setEditingDesk(d)}
              className="p-2.5 rounded-xl border cursor-pointer transition-all hover:border-current flex items-center justify-between"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                borderColor: 'var(--border-color)',
              }}
            >
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="w-7 h-7 rounded-lg border flex items-center justify-center font-bold text-xs shrink-0" style={{ backgroundColor: 'var(--color-theme-muted)', borderColor: 'var(--border-theme)', color: 'var(--color-theme)' }}>
                  B
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs font-semibold truncate" style={{ color: 'var(--text-main)' }}>
                    {d.seatB.student_name || 'Kursi Kosong'}
                  </p>
                  <p className="text-[10px] font-mono truncate" style={{ color: 'var(--text-muted)' }}>
                    {d.seatB.ip_address}
                  </p>
                </div>
              </div>
              <span className={`w-2 h-2 rounded-full shrink-0 ${d.seatB.status === 'offline' ? 'bg-slate-500' : d.seatB.status === 'maintenance' ? 'bg-amber-400' : 'bg-emerald-400'}`} />
            </div>

            {/* Desk Footer info */}
            <div className="pt-1 flex items-center justify-between text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>
              <span>{d.seatA.pc_name || `PC-TJ-${d.deskNum}A`}</span>
              <span>•</span>
              <span>{d.seatB.pc_name || `PC-TJ-${d.deskNum}B`}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Edit Meja */}
      <AnimatePresence>
        {editingDesk && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingDesk(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-xl border rounded-3xl p-6 shadow-2xl z-10 space-y-5 max-h-[90vh] overflow-y-auto"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border-theme)',
                color: 'var(--text-main)',
              }}
            >
              <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: 'var(--border-color)' }}>
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl border flex items-center justify-center font-bold text-xs" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-theme)', color: 'var(--color-theme)' }}>
                    #{editingDesk.deskNum}
                  </div>
                  <div>
                    <h3 className="font-theme-heading font-bold text-base" style={{ color: 'var(--text-main)' }}>
                      Edit Konfigurasi Meja #{editingDesk.deskNum}
                    </h3>
                    <p className="text-[11px] text-muted-foreground" style={{ color: 'var(--text-muted)' }}>
                      Atur penugasan siswa, alokasi IP, hostname, dan status workstation.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setEditingDesk(null)}
                  className="p-1.5 rounded-full hover:opacity-70"
                  style={{ color: 'var(--text-muted)' }}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                {/* VLAN Config */}
                <div className="p-3.5 rounded-xl border flex items-center justify-between" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
                  <div>
                    <label className="text-xs font-bold block" style={{ color: 'var(--text-main)' }}>Segmentasi VLAN</label>
                    <span className="text-[10px] text-muted-foreground" style={{ color: 'var(--text-muted)' }}>ID VLAN praktikum switch port meja ini</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold" style={{ color: 'var(--color-theme)' }}>VLAN</span>
                    <input
                      type="number"
                      value={editingDesk.vlan}
                      onChange={(e) => setEditingDesk({ ...editingDesk, vlan: parseInt(e.target.value) || 10 })}
                      className="w-20 px-3 py-1.5 rounded-lg border text-xs font-mono font-bold text-center bg-transparent focus:outline-none"
                      style={{ borderColor: 'var(--border-color)', color: 'var(--text-main)' }}
                    />
                  </div>
                </div>

                {/* Seat A Settings */}
                <div className="p-4 rounded-2xl border space-y-3" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-md border flex items-center justify-center text-xs font-bold" style={{ backgroundColor: 'var(--color-theme)', color: '#050505', borderColor: 'var(--border-theme)' }}>
                        A
                      </span>
                      <span className="text-xs font-bold" style={{ color: 'var(--text-main)' }}>Workstation Kursi A</span>
                    </div>

                    <select
                      value={editingDesk.seatA.status || 'online'}
                      onChange={(e) =>
                        setEditingDesk({
                          ...editingDesk,
                          seatA: { ...editingDesk.seatA, status: e.target.value as any },
                        })
                      }
                      className="text-[11px] px-2.5 py-1 rounded-lg border bg-transparent font-medium"
                      style={{ borderColor: 'var(--border-color)', color: 'var(--text-main)' }}
                    >
                      <option value="online">Status: Online</option>
                      <option value="offline">Status: Offline</option>
                      <option value="maintenance">Status: Maintenance</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-muted-foreground">Pilih Siswa yang Duduk</label>
                    <select
                      value={editingDesk.seatA.student_name}
                      onChange={(e) => {
                        const s = students.find((std) => std.name === e.target.value);
                        setEditingDesk({
                          ...editingDesk,
                          seatA: {
                            ...editingDesk.seatA,
                            student_id: s ? s.id : '',
                            student_name: e.target.value,
                          },
                        });
                      }}
                      className="w-full px-3 py-2 rounded-xl text-xs border font-medium bg-transparent"
                      style={{ borderColor: 'var(--border-color)', color: 'var(--text-main)' }}
                    >
                      <option value="Kursi Kosong">-- Kursi Kosong --</option>
                      {students.map((std) => (
                        <option key={std.id} value={std.name}>
                          {std.name} ({std.nisn || 'Siswa'})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-muted-foreground">IP Address</label>
                      <input
                        type="text"
                        value={editingDesk.seatA.ip_address}
                        onChange={(e) =>
                          setEditingDesk({
                            ...editingDesk,
                            seatA: { ...editingDesk.seatA, ip_address: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl text-xs font-mono border bg-transparent"
                        style={{ borderColor: 'var(--border-color)', color: 'var(--text-main)' }}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-muted-foreground">Hostname PC</label>
                      <input
                        type="text"
                        value={editingDesk.seatA.pc_name || ''}
                        onChange={(e) =>
                          setEditingDesk({
                            ...editingDesk,
                            seatA: { ...editingDesk.seatA, pc_name: e.target.value },
                          })
                        }
                        placeholder={`PC-TJ-${String(editingDesk.deskNum).padStart(2, '0')}A`}
                        className="w-full px-3 py-2 rounded-xl text-xs font-mono border bg-transparent"
                        style={{ borderColor: 'var(--border-color)', color: 'var(--text-main)' }}
                      />
                    </div>
                  </div>
                </div>

                {/* Seat B Settings */}
                <div className="p-4 rounded-2xl border space-y-3" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-md border flex items-center justify-center text-xs font-bold" style={{ backgroundColor: 'var(--color-theme)', color: '#050505', borderColor: 'var(--border-theme)' }}>
                        B
                      </span>
                      <span className="text-xs font-bold" style={{ color: 'var(--text-main)' }}>Workstation Kursi B</span>
                    </div>

                    <select
                      value={editingDesk.seatB.status || 'online'}
                      onChange={(e) =>
                        setEditingDesk({
                          ...editingDesk,
                          seatB: { ...editingDesk.seatB, status: e.target.value as any },
                        })
                      }
                      className="text-[11px] px-2.5 py-1 rounded-lg border bg-transparent font-medium"
                      style={{ borderColor: 'var(--border-color)', color: 'var(--text-main)' }}
                    >
                      <option value="online">Status: Online</option>
                      <option value="offline">Status: Offline</option>
                      <option value="maintenance">Status: Maintenance</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-muted-foreground">Pilih Siswa yang Duduk</label>
                    <select
                      value={editingDesk.seatB.student_name}
                      onChange={(e) => {
                        const s = students.find((std) => std.name === e.target.value);
                        setEditingDesk({
                          ...editingDesk,
                          seatB: {
                            ...editingDesk.seatB,
                            student_id: s ? s.id : '',
                            student_name: e.target.value,
                          },
                        });
                      }}
                      className="w-full px-3 py-2 rounded-xl text-xs border font-medium bg-transparent"
                      style={{ borderColor: 'var(--border-color)', color: 'var(--text-main)' }}
                    >
                      <option value="Kursi Kosong">-- Kursi Kosong --</option>
                      {students.map((std) => (
                        <option key={std.id} value={std.name}>
                          {std.name} ({std.nisn || 'Siswa'})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-muted-foreground">IP Address</label>
                      <input
                        type="text"
                        value={editingDesk.seatB.ip_address}
                        onChange={(e) =>
                          setEditingDesk({
                            ...editingDesk,
                            seatB: { ...editingDesk.seatB, ip_address: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl text-xs font-mono border bg-transparent"
                        style={{ borderColor: 'var(--border-color)', color: 'var(--text-main)' }}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-muted-foreground">Hostname PC</label>
                      <input
                        type="text"
                        value={editingDesk.seatB.pc_name || ''}
                        onChange={(e) =>
                          setEditingDesk({
                            ...editingDesk,
                            seatB: { ...editingDesk.seatB, pc_name: e.target.value },
                          })
                        }
                        placeholder={`PC-TJ-${String(editingDesk.deskNum).padStart(2, '0')}B`}
                        className="w-full px-3 py-2 rounded-xl text-xs font-mono border bg-transparent"
                        style={{ borderColor: 'var(--border-color)', color: 'var(--text-main)' }}
                      />
                    </div>
                  </div>
                </div>

                {/* Notes */}
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-muted-foreground">Catatan Khusus Meja</label>
                  <input
                    type="text"
                    value={editingDesk.notes || ''}
                    onChange={(e) => setEditingDesk({ ...editingDesk, notes: e.target.value })}
                    placeholder="Contoh: PC siap praktikum Mikrotik & Cisco"
                    className="w-full px-3 py-2 rounded-xl text-xs border bg-transparent"
                    style={{ borderColor: 'var(--border-color)', color: 'var(--text-main)' }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t" style={{ borderColor: 'var(--border-color)' }}>
                <button
                  onClick={() => setEditingDesk(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold border hover:opacity-80"
                  style={{ borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}
                >
                  Batal
                </button>
                <button
                  onClick={() => handleSaveDeskModal(editingDesk)}
                  className="px-5 py-2 rounded-xl text-xs font-bold shadow-md hover:scale-105 active:scale-95 transition-all"
                  style={{
                    backgroundColor: 'var(--color-theme)',
                    color: '#050505',
                  }}
                >
                  Terapkan Perubahan Meja
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal Tukar Siswa Antar Meja (Cross-Desk Swap) */}
      <AnimatePresence>
        {swapModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSwapModalOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-lg border rounded-3xl p-6 shadow-2xl z-10 space-y-5"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border-theme)',
                color: 'var(--text-main)',
              }}
            >
              <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: 'var(--border-color)' }}>
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl border flex items-center justify-center font-bold text-xs" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-theme)', color: 'var(--color-theme)' }}>
                    <ArrowRightLeft className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-theme-heading font-bold text-base" style={{ color: 'var(--text-main)' }}>
                      Tukar Tempat Duduk Siswa
                    </h3>
                    <p className="text-[11px] text-muted-foreground" style={{ color: 'var(--text-muted)' }}>
                      Pilih 2 kursi di lab untuk saling menukar posisi siswa secara instan.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSwapModalOpen(false)}
                  className="p-1.5 rounded-full hover:opacity-70"
                  style={{ color: 'var(--text-muted)' }}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                {/* Source */}
                <div className="p-3.5 rounded-2xl border space-y-2.5" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
                  <span className="text-[10px] uppercase font-bold tracking-wider" style={{ color: 'var(--color-theme)' }}>
                    Kursi Pertama
                  </span>
                  <div className="space-y-1">
                    <label className="text-[11px] text-muted-foreground">Pilih Meja</label>
                    <select
                      value={swapSource.deskNum}
                      onChange={(e) => setSwapSource({ ...swapSource, deskNum: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl text-xs border bg-transparent font-medium"
                      style={{ borderColor: 'var(--border-color)', color: 'var(--text-main)' }}
                    >
                      {desks.map((d) => (
                        <option key={d.deskNum} value={d.deskNum}>
                          Meja #{d.deskNum} (VLAN {d.vlan})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] text-muted-foreground">Pilih Kursi (A/B)</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setSwapSource({ ...swapSource, seat: 'A' })}
                        className={`py-1.5 rounded-lg text-xs font-bold border transition-all ${
                          swapSource.seat === 'A' ? 'border-current' : 'opacity-60'
                        }`}
                        style={{
                          backgroundColor: swapSource.seat === 'A' ? 'var(--color-theme-muted)' : 'transparent',
                          color: swapSource.seat === 'A' ? 'var(--color-theme)' : 'var(--text-muted)',
                          borderColor: swapSource.seat === 'A' ? 'var(--border-theme)' : 'var(--border-color)',
                        }}
                      >
                        Kursi A
                      </button>
                      <button
                        type="button"
                        onClick={() => setSwapSource({ ...swapSource, seat: 'B' })}
                        className={`py-1.5 rounded-lg text-xs font-bold border transition-all ${
                          swapSource.seat === 'B' ? 'border-current' : 'opacity-60'
                        }`}
                        style={{
                          backgroundColor: swapSource.seat === 'B' ? 'var(--color-theme-muted)' : 'transparent',
                          color: swapSource.seat === 'B' ? 'var(--color-theme)' : 'var(--text-muted)',
                          borderColor: swapSource.seat === 'B' ? 'var(--border-theme)' : 'var(--border-color)',
                        }}
                      >
                        Kursi B
                      </button>
                    </div>
                  </div>

                  {/* Student preview */}
                  <div className="p-2 rounded-lg border text-xs" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
                    <span className="text-[10px] text-muted-foreground block">Siswa Saat Ini:</span>
                    <span className="font-bold truncate block" style={{ color: 'var(--text-main)' }}>
                      {(() => {
                        const d = desks.find((item) => item.deskNum === swapSource.deskNum);
                        return (swapSource.seat === 'A' ? d?.seatA.student_name : d?.seatB.student_name) || 'Kosong';
                      })()}
                    </span>
                  </div>
                </div>

                {/* Target */}
                <div className="p-3.5 rounded-2xl border space-y-2.5" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
                  <span className="text-[10px] uppercase font-bold tracking-wider" style={{ color: 'var(--color-theme)' }}>
                    Kursi Kedua
                  </span>
                  <div className="space-y-1">
                    <label className="text-[11px] text-muted-foreground">Pilih Meja</label>
                    <select
                      value={swapTarget.deskNum}
                      onChange={(e) => setSwapTarget({ ...swapTarget, deskNum: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl text-xs border bg-transparent font-medium"
                      style={{ borderColor: 'var(--border-color)', color: 'var(--text-main)' }}
                    >
                      {desks.map((d) => (
                        <option key={d.deskNum} value={d.deskNum}>
                          Meja #{d.deskNum} (VLAN {d.vlan})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] text-muted-foreground">Pilih Kursi (A/B)</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setSwapTarget({ ...swapTarget, seat: 'A' })}
                        className={`py-1.5 rounded-lg text-xs font-bold border transition-all ${
                          swapTarget.seat === 'A' ? 'border-current' : 'opacity-60'
                        }`}
                        style={{
                          backgroundColor: swapTarget.seat === 'A' ? 'var(--color-theme-muted)' : 'transparent',
                          color: swapTarget.seat === 'A' ? 'var(--color-theme)' : 'var(--text-muted)',
                          borderColor: swapTarget.seat === 'A' ? 'var(--border-theme)' : 'var(--border-color)',
                        }}
                      >
                        Kursi A
                      </button>
                      <button
                        type="button"
                        onClick={() => setSwapTarget({ ...swapTarget, seat: 'B' })}
                        className={`py-1.5 rounded-lg text-xs font-bold border transition-all ${
                          swapTarget.seat === 'B' ? 'border-current' : 'opacity-60'
                        }`}
                        style={{
                          backgroundColor: swapTarget.seat === 'B' ? 'var(--color-theme-muted)' : 'transparent',
                          color: swapTarget.seat === 'B' ? 'var(--color-theme)' : 'var(--text-muted)',
                          borderColor: swapTarget.seat === 'B' ? 'var(--border-theme)' : 'var(--border-color)',
                        }}
                      >
                        Kursi B
                      </button>
                    </div>
                  </div>

                  {/* Student preview */}
                  <div className="p-2 rounded-lg border text-xs" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
                    <span className="text-[10px] text-muted-foreground block">Siswa Saat Ini:</span>
                    <span className="font-bold truncate block" style={{ color: 'var(--text-main)' }}>
                      {(() => {
                        const d = desks.find((item) => item.deskNum === swapTarget.deskNum);
                        return (swapTarget.seat === 'A' ? d?.seatA.student_name : d?.seatB.student_name) || 'Kosong';
                      })()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t" style={{ borderColor: 'var(--border-color)' }}>
                <button
                  onClick={() => setSwapModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold border hover:opacity-80"
                  style={{ borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}
                >
                  Batal
                </button>
                <button
                  onClick={handleExecuteCrossSwap}
                  className="px-5 py-2 rounded-xl text-xs font-bold shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                  style={{
                    backgroundColor: 'var(--color-theme)',
                    color: '#050505',
                  }}
                >
                  <ArrowRightLeft className="w-3.5 h-3.5" />
                  <span>Tukar Sekarang</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
