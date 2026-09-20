'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useClassData } from '@/context/ClassDataContext';
import { MemoryNote } from '@/types';
import {
  Heart,
  Plus,
  Send,
  MessageSquare,
  Sparkles,
  User,
  X,
  Smile,
  Quote,
} from 'lucide-react';

export default function MemoryWallPage() {
  const { memoryNotes, addMemoryNote, likeMemoryNote, settings } = useClassData();
  const [modalOpen, setModalOpen] = useState(false);
  const [senderName, setSenderName] = useState('');
  const [roleOrRelation, setRoleOrRelation] = useState('Siswa XII TKJ');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderName.trim() || !message.trim()) {
      alert('Nama dan pesan wajib diisi.');
      return;
    }

    setSubmitting(true);
    const newNote: MemoryNote = {
      id: `mem-${Date.now()}`,
      sender_name: senderName.trim(),
      role_or_relation: roleOrRelation,
      message: message.trim(),
      color: '#f2eb87',
      likes: 1,
      created_at: new Date().toISOString(),
    };

    const success = await addMemoryNote(newNote);
    if (success) {
      setModalOpen(false);
      setSenderName('');
      setMessage('');
      alert('Pesan kenangan berhasil disematkan di dinding kelas!');
    } else {
      alert('Gagal menyematkan pesan.');
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
            <Quote className="w-3.5 h-3.5" />
            <span className="uppercase tracking-widest text-[10px]">DIGITAL MEMORY WALL & GUESTBOOK</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif-title font-bold text-[#f5f1ca]">
            Dinding Kenangan & Buku Tamu
          </h1>
          <p className="text-xs sm:text-sm text-[#9e9a8d] leading-relaxed">
            Untaian doa, ucapan terima kasih kepada guru dan sahabat, serta cerita tak terlupakan dari perjalanan tiga tahun di {settings.class_name || 'XII TKJ'}.
          </p>

          <div className="pt-2">
            <button
              onClick={() => setModalOpen(true)}
              className="px-6 py-3 rounded-2xl bg-[#f2eb87] hover:bg-[#eae26e] text-[#111111] font-bold text-xs shadow-lg shadow-[#f2eb87]/20 transition-all flex items-center gap-2 mx-auto active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Tulis Pesan Kenangan</span>
            </button>
          </div>
        </div>

        {/* Notes Wall Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {memoryNotes.map((note) => (
            <motion.div
              key={note.id}
              whileHover={{ y: -4 }}
              className="p-6 rounded-3xl bg-[#1f1d19] border border-[#f5f1ca]/12 hover:border-[#f2eb87]/50 transition-all shadow-xl space-y-4 flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#161512] text-[#f2eb87] border border-[#f2eb87]/30">
                    {note.role_or_relation}
                  </span>
                  <span className="text-[10px] text-[#9e9a8d] font-mono">
                    {new Date(note.created_at).toLocaleDateString('id-ID')}
                  </span>
                </div>

                <p className="text-xs text-[#f5f1ca] leading-relaxed font-normal whitespace-pre-line italic">
                  &ldquo;{note.message}&rdquo;
                </p>
              </div>

              <div className="pt-3 border-t border-[#f5f1ca]/10 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#161512] border border-[#f2eb87]/30 text-[#f2eb87] text-[10px] font-bold flex items-center justify-center">
                    {note.sender_name.charAt(0)}
                  </div>
                  <span className="font-semibold text-[#f5f1ca] truncate max-w-[120px]">
                    {note.sender_name}
                  </span>
                </div>

                <button
                  onClick={() => likeMemoryNote(note.id)}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#161512] border border-[#f5f1ca]/10 text-[#9e9a8d] hover:text-[#f2eb87] hover:border-[#f2eb87]/30 transition-all text-[11px]"
                >
                  <Heart className="w-3.5 h-3.5 text-[#f2eb87] fill-[#f2eb87]/20" />
                  <span>{note.likes || 0}</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modal Tulis Pesan */}
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
                    Tulis Pesan Kenangan Kelas
                  </h3>
                  <p className="text-xs text-[#9e9a8d]">
                    Pesanmu akan abadi ditampilkan di buku tamu digital kelas XII TKJ.
                  </p>
                </div>
                <button onClick={() => setModalOpen(false)} className="p-1 text-[#9e9a8d] hover:text-[#f5f1ca]">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-[#f5f1ca] mb-1">
                    Nama Kamu
                  </label>
                  <input
                    type="text"
                    placeholder="Nama lengkap atau panggilan"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#161512] border border-[#f5f1ca]/15 text-[#f5f1ca] focus:outline-none focus:border-[#f2eb87]"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#f5f1ca] mb-1">
                    Hubungan / Peran
                  </label>
                  <select
                    value={roleOrRelation}
                    onChange={(e) => setRoleOrRelation(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#161512] border border-[#f5f1ca]/15 text-[#f5f1ca] focus:outline-none focus:border-[#f2eb87]"
                  >
                    <option value="Siswa XII TKJ">Siswa XII TKJ</option>
                    <option value="Guru / Wali Kelas">Guru / Wali Kelas</option>
                    <option value="Alumni Sekolah">Alumni Sekolah</option>
                    <option value="Teman / Pengunjung">Teman / Pengunjung</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#f5f1ca] mb-1">
                    Isi Pesan / Kesan & Doa
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Tuliskan ucapan terima kasih, kesan selama belajar bersama, atau doa terbaik untuk masa depan..."
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
                    <Send className="w-3.5 h-3.5" />
                    <span>{submitting ? 'Mengirim...' : 'Sematkan Pesan'}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
