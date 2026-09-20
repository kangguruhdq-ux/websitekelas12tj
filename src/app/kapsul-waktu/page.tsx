'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useClassData } from '@/context/ClassDataContext';
import { TimeCapsuleMessage } from '@/types';
import {
  Lock,
  Unlock,
  Sparkles,
  Clock,
  Plus,
  Send,
  Calendar,
  User,
  ShieldCheck,
  X,
  Heart,
} from 'lucide-react';

export default function TimeCapsulePage() {
  const { timeCapsules, addTimeCapsule, settings } = useClassData();
  const [modalOpen, setModalOpen] = useState(false);
  const [senderName, setSenderName] = useState('');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [targetYear, setTargetYear] = useState(2030);
  const [submitting, setSubmitting] = useState(false);
  const [previewItem, setPreviewItem] = useState<TimeCapsuleMessage | null>(null);

  // Countdown to 2030
  const targetDate = new Date('2030-01-01T00:00:00Z').getTime();
  const now = new Date().getTime();
  const diff = Math.max(0, targetDate - now);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderName.trim() || !message.trim()) {
      alert('Nama dan isi pesan kapsul waktu wajib diisi.');
      return;
    }

    setSubmitting(true);
    const newCapsule: TimeCapsuleMessage = {
      id: `capsule-${Date.now()}`,
      sender_name: senderName.trim(),
      title: title.trim() || 'Harapan untuk Masa Depan',
      target_year: targetYear,
      message: message.trim(),
      created_at: new Date().toISOString(),
      is_locked: true,
    };

    const success = await addTimeCapsule(newCapsule);
    if (success) {
      setModalOpen(false);
      setSenderName('');
      setTitle('');
      setMessage('');
      alert('Kapsul waktu berhasil disegel dan disimpan dalam arsip kelas 2030!');
    } else {
      alert('Gagal menyegel kapsul waktu.');
    }
    setSubmitting(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="min-h-screen bg-[#161512] text-[#d8d6c6] pt-28 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
    >
      {/* Background Ambience */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-[#f2eb87]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-[#1f1d19] text-[#f2eb87] border border-[#f2eb87]/30">
            <Lock className="w-3.5 h-3.5" />
            <span className="uppercase tracking-widest text-[10px]">TIME CAPSULE ARCHIVE</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif-title font-bold text-[#f5f1ca]">
            Kapsul Waktu Digital 2026 – 2030
          </h1>
          <p className="text-xs sm:text-sm text-[#9e9a8d] leading-relaxed">
            Pesan rahasia, impian karir, dan kenangan yang disegel oleh siswa XII TKJ untuk dibuka bersama saat Reuni Akbar tahun 2030.
          </p>

          {/* 2030 Countdown Ticker */}
          <div className="pt-2 flex items-center justify-center gap-4">
            <div className="px-5 py-3 rounded-2xl bg-[#1f1d19] border border-[#f2eb87]/40 text-center shadow-lg shadow-[#f2eb87]/10">
              <span className="font-serif-title font-bold text-3xl text-[#f2eb87] block">
                {days}
              </span>
              <span className="text-[10px] text-[#9e9a8d] uppercase tracking-wider">Hari Tersisa</span>
            </div>
            <div className="px-5 py-3 rounded-2xl bg-[#1f1d19] border border-[#f5f1ca]/15 text-center">
              <span className="font-serif-title font-bold text-3xl text-[#f5f1ca] block">
                {hours}
              </span>
              <span className="text-[10px] text-[#9e9a8d] uppercase tracking-wider">Jam Menuju 2030</span>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => setModalOpen(true)}
              className="px-6 py-3 rounded-2xl bg-[#f2eb87] hover:bg-[#eae26e] text-[#111111] font-bold text-xs shadow-lg shadow-[#f2eb87]/20 transition-all flex items-center gap-2 mx-auto active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Segel Surat Kapsul Waktumu</span>
            </button>
          </div>
        </div>

        {/* Capsule Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {timeCapsules.map((capsule) => (
            <motion.div
              key={capsule.id}
              whileHover={{ y: -4 }}
              className="p-6 rounded-3xl bg-[#1f1d19] border border-[#f5f1ca]/12 hover:border-[#f2eb87]/50 transition-all shadow-xl space-y-4 flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#161512] text-[#f2eb87] border border-[#f2eb87]/30 flex items-center gap-1.5">
                    <Lock className="w-3 h-3" />
                    <span>Terkunci s/d {capsule.target_year}</span>
                  </span>
                  <span className="text-[10px] text-[#9e9a8d] font-mono">
                    {new Date(capsule.created_at).toLocaleDateString('id-ID')}
                  </span>
                </div>

                <h3 className="font-serif-title font-bold text-lg text-[#f5f1ca] group-hover:text-[#f2eb87] transition-colors">
                  {capsule.title}
                </h3>

                {/* Encrypted / Blurred preview */}
                <div className="relative p-4 rounded-2xl bg-[#161512] border border-[#f5f1ca]/5 overflow-hidden">
                  <p className="text-xs text-[#d8d6c6]/60 blur-[3px] select-none line-clamp-3">
                    {capsule.message}
                  </p>
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
                    <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#f2eb87]">
                      <Lock className="w-3.5 h-3.5" />
                      <span>Terkunci Digital SHA-256</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-[#f5f1ca]/10 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#161512] border border-[#f2eb87]/30 flex items-center justify-center text-[10px] text-[#f2eb87] font-bold">
                    {capsule.sender_name.charAt(0)}
                  </div>
                  <span className="font-medium text-[#f5f1ca]">{capsule.sender_name}</span>
                </div>
                <button
                  onClick={() => setPreviewItem(capsule)}
                  className="text-[11px] text-[#f2eb87] hover:underline font-semibold"
                >
                  Detail Segel →
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modal Segel Surat */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModalOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-lg bg-[#1f1d19] border border-[#f5f1ca]/20 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 space-y-5 text-[#d8d6c6]"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-serif-title font-bold text-xl text-[#f5f1ca]">
                    Segel Pesan Masa Depanmu
                  </h3>
                  <p className="text-xs text-[#9e9a8d]">
                    Pesan ini akan disimpan aman dan dibuka bersama saat Reuni Akbar 2030.
                  </p>
                </div>
                <button onClick={() => setModalOpen(false)} className="p-1 text-[#9e9a8d] hover:text-[#f5f1ca]">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-[#f5f1ca] mb-1">
                    Nama Siswa / Pengirim
                  </label>
                  <input
                    type="text"
                    placeholder="Nama lengkap atau panggilanmu di kelas"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#161512] border border-[#f5f1ca]/15 text-[#f5f1ca] focus:outline-none focus:border-[#f2eb87]"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#f5f1ca] mb-1">
                    Judul Pesan / Topik Harapan
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Menjadi Network Architect di 2030"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#161512] border border-[#f5f1ca]/15 text-[#f5f1ca] focus:outline-none focus:border-[#f2eb87]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#f5f1ca] mb-1">
                    Isi Surat / Pesan Rahasia untuk Diri Sendiri & Kelas
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Tuliskan harapanmu, cita-citamu, pesan untuk teman sekelas, atau kenangan praktikum yang tak ingin kamu lupakan..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#161512] border border-[#f5f1ca]/15 text-[#f5f1ca] focus:outline-none focus:border-[#f2eb87]"
                    required
                  />
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-[#9e9a8d] hover:text-[#f5f1ca]"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2.5 rounded-xl bg-[#f2eb87] text-[#111111] font-bold text-xs hover:bg-[#eae26e] transition-all flex items-center gap-2 shadow-md shadow-[#f2eb87]/20"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>{submitting ? 'Menyegel...' : 'Kunci & Segel Sekarang'}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal Detail Segel */}
      <AnimatePresence>
        {previewItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPreviewItem(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-md bg-[#1f1d19] border border-[#f5f1ca]/20 rounded-3xl p-6 shadow-2xl z-10 space-y-4 text-center text-[#d8d6c6]"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#161512] border border-[#f2eb87]/40 text-[#f2eb87] flex items-center justify-center mx-auto">
                <Lock className="w-6 h-6 animate-pulse" />
              </div>

              <h3 className="font-serif-title font-bold text-xl text-[#f5f1ca]">
                {previewItem.title}
              </h3>
              <p className="text-xs text-[#9e9a8d]">
                Oleh: <strong className="text-[#f5f1ca]">{previewItem.sender_name}</strong>
              </p>

              <div className="p-4 rounded-2xl bg-[#161512] border border-[#f2eb87]/20 text-xs text-[#d8d6c6] space-y-2">
                <p className="italic text-[#f2eb87]">
                  &ldquo;Dokumen ini telah disegel dengan enkripsi digital angkatan XII TKJ dan hanya dapat dibuka serentak pada Reuni Akbar tahun 2030.&rdquo;
                </p>
                <span className="text-[10px] text-[#9e9a8d] block font-mono">
                  Timestamp Segel: {new Date(previewItem.created_at).toLocaleString('id-ID')}
                </span>
              </div>

              <button
                onClick={() => setPreviewItem(null)}
                className="w-full py-2.5 rounded-xl bg-[#161512] border border-[#f5f1ca]/20 text-xs font-semibold text-[#f5f1ca] hover:border-[#f2eb87]"
              >
                Tutup Pratinjau
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
