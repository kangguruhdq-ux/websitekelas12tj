'use client';

import React, { useState } from 'react';
import { useClassData } from '@/context/ClassDataContext';
import { EventItem, EventCategory, EventStatus } from '@/types';
import { formatDate } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Calendar,
  Clock,
  MapPin,
  Edit2,
  Trash2,
  X,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export default function AdminAgendaPage() {
  const { events, upsertEvent, deleteEvent } = useClassData();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<EventItem | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<EventItem>>({
    title: '',
    description: '',
    event_date: '',
    event_time: '08:00 - 10:00 WIB',
    location: 'Laboratorium Jaringan',
    category: 'kegiatan',
    person_in_charge: 'Ketua Kelas',
    status: 'upcoming',
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleOpenCreate = () => {
    setEditingItem(null);
    setFormData({
      id: `ev-${Date.now()}`,
      title: '',
      description: '',
      event_date: new Date().toISOString().split('T')[0],
      event_time: '08:00 - 10:00 WIB',
      location: 'Laboratorium Jaringan',
      category: 'kegiatan',
      person_in_charge: 'Ketua Kelas',
      status: 'upcoming',
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (item: EventItem) => {
    setEditingItem(item);
    setFormData({ ...item });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title?.trim() || !formData.event_date) {
      alert('Judul agenda dan tanggal wajib diisi.');
      return;
    }

    const eventToSave: EventItem = {
      id: formData.id || `ev-${Date.now()}`,
      title: formData.title.trim(),
      description: formData.description?.trim() || '',
      event_date: formData.event_date,
      event_time: formData.event_time || '08:00 - 10:00 WIB',
      location: formData.location || 'Ruang Kelas XII TKJ',
      category: (formData.category as EventCategory) || 'kegiatan',
      person_in_charge: formData.person_in_charge || 'Pengurus Kelas',
      status: (formData.status as EventStatus) || 'upcoming',
      created_at: editingItem?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const success = await upsertEvent(eventToSave);
    if (success) {
      setModalOpen(false);
      showToast(editingItem ? 'Agenda berhasil diperbarui.' : 'Agenda baru berhasil dijadwalkan.');
    } else {
      alert('Gagal menyimpan agenda.');
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    const success = await deleteEvent(deleteId);
    if (success) {
      setDeleteId(null);
      showToast('Agenda berhasil dihapus.');
    } else {
      alert('Gagal menghapus agenda.');
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-[#1f1d19] border border-[#f2eb87]/50 text-[#f5f1ca] shadow-2xl flex items-center gap-3 text-xs font-semibold">
          <CheckCircle2 className="w-5 h-5 text-[#f2eb87]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#1f1d19] text-[#f2eb87] border border-[#f2eb87]/30 mb-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="uppercase tracking-widest text-[10px]">PROGRAM KERJA</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif-title font-bold text-[#f5f1ca]">
            Kelola Agenda & Jadwal Kelas
          </h1>
          <p className="text-xs sm:text-sm text-[#9e9a8d]">
            Jadwalkan kegiatan kelas, simulasi sertifikasi keahlian, ujian sekolah, dan piket lab.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#f2eb87] hover:bg-[#e6df73] text-[#161512] text-xs font-bold shadow-md shadow-[#f2eb87]/20 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Agenda Baru</span>
        </button>
      </div>

      {/* Table Card */}
      <div className="rounded-2xl bg-[#1f1d19] border border-[#f5f1ca]/12 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#161512] border-b border-[#f5f1ca]/10 text-[#9e9a8d] uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3.5 px-4">Tanggal</th>
                <th className="py-3.5 px-4">Nama Agenda</th>
                <th className="py-3.5 px-4">Waktu & Tempat</th>
                <th className="py-3.5 px-4">Kategori</th>
                <th className="py-3.5 px-4">PIC</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f5f1ca]/5">
              {events.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-[#9e9a8d]">
                    Belum ada agenda kegiatan.
                  </td>
                </tr>
              ) : (
                events.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-[#161512]/60 transition-colors"
                  >
                    <td className="py-3 px-4 font-mono font-medium text-[#f2eb87] whitespace-nowrap">
                      {formatDate(item.event_date)}
                    </td>
                    <td className="py-3 px-4 font-bold text-[#f5f1ca] max-w-xs truncate">
                      {item.title}
                    </td>
                    <td className="py-3 px-4 text-[#d8d6c6]">
                      <div>{item.event_time}</div>
                      <div className="text-[10px] text-[#9e9a8d]">{item.location}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#161512] border border-[#f5f1ca]/15 text-[#f5f1ca] capitalize">
                        {item.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[#9e9a8d]">
                      {item.person_in_charge}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          item.status === 'upcoming'
                            ? 'bg-[#f2eb87]/15 text-[#f2eb87] border border-[#f2eb87]/30'
                            : item.status === 'ongoing'
                            ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                            : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                        }`}
                      >
                        {item.status === 'upcoming'
                          ? 'Mendatang'
                          : item.status === 'ongoing'
                          ? 'Berlangsung'
                          : 'Selesai'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(item)}
                          className="p-2 rounded-xl text-[#9e9a8d] hover:text-[#f2eb87] hover:bg-[#161512] transition-colors"
                          title="Edit Agenda"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteId(item.id)}
                          className="p-2 rounded-xl text-[#9e9a8d] hover:text-red-400 hover:bg-red-500/10 transition-colors"
                          title="Hapus Agenda"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE / EDIT MODAL */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModalOpen(false)}
              className="fixed inset-0 bg-black/75 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg bg-[#1f1d19] border border-[#f5f1ca]/15 rounded-3xl p-6 shadow-2xl z-10 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-[#f5f1ca]/10 pb-3">
                <h3 className="font-serif-title font-bold text-lg text-[#f5f1ca]">
                  {editingItem ? 'Edit Agenda' : 'Jadwalkan Agenda Baru'}
                </h3>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-1 text-[#9e9a8d] hover:text-[#f5f1ca]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-xs font-semibold text-[#f5f1ca] mb-1">
                    Judul Kegiatan / Agenda *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Uji Sertifikasi MikroTik MTCNA"
                    value={formData.title || ''}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#161512] border border-[#f5f1ca]/15 text-[#f5f1ca] focus:outline-none focus:border-[#f2eb87] transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#f5f1ca] mb-1">
                      Tanggal Pelaksanaan *
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.event_date || ''}
                      onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#161512] border border-[#f5f1ca]/15 text-[#f5f1ca] focus:outline-none focus:border-[#f2eb87] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#f5f1ca] mb-1">
                      Waktu / Jam
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: 08:00 - 12:00 WIB"
                      value={formData.event_time || ''}
                      onChange={(e) => setFormData({ ...formData, event_time: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#161512] border border-[#f5f1ca]/15 text-[#f5f1ca] focus:outline-none focus:border-[#f2eb87] transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#f5f1ca] mb-1">
                      Lokasi
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: Lab Jaringan 2"
                      value={formData.location || ''}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#161512] border border-[#f5f1ca]/15 text-[#f5f1ca] focus:outline-none focus:border-[#f2eb87] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#f5f1ca] mb-1">
                      Penanggung Jawab (PIC)
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: Bu Febriyana / Ketua"
                      value={formData.person_in_charge || ''}
                      onChange={(e) => setFormData({ ...formData, person_in_charge: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#161512] border border-[#f5f1ca]/15 text-[#f5f1ca] focus:outline-none focus:border-[#f2eb87] transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#f5f1ca] mb-1">
                      Kategori
                    </label>
                    <select
                      value={formData.category || 'kegiatan'}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value as EventCategory })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#161512] border border-[#f5f1ca]/15 text-[#f5f1ca] focus:outline-none focus:border-[#f2eb87] transition-all"
                    >
                      <option value="ujian">Ujian / Sertifikasi</option>
                      <option value="kegiatan">Kegiatan Kelas</option>
                      <option value="rapat">Rapat Koordinasi</option>
                      <option value="piket">Piket / Perawatan Lab</option>
                      <option value="sekolah">Acara Sekolah</option>
                      <option value="lainnya">Lainnya</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#f5f1ca] mb-1">
                      Status Agenda
                    </label>
                    <select
                      value={formData.status || 'upcoming'}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as EventStatus })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#161512] border border-[#f5f1ca]/15 text-[#f5f1ca] focus:outline-none focus:border-[#f2eb87] transition-all"
                    >
                      <option value="upcoming">Mendatang</option>
                      <option value="ongoing">Sedang Berlangsung</option>
                      <option value="completed">Selesai</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#f5f1ca] mb-1">
                    Deskripsi Singkat Agenda
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Jelaskan detail kegiatan..."
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#161512] border border-[#f5f1ca]/15 text-[#f5f1ca] focus:outline-none focus:border-[#f2eb87] transition-all"
                  />
                </div>

                <div className="pt-3 border-t border-[#f5f1ca]/10 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-[#9e9a8d] hover:text-[#f5f1ca]"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#f2eb87] hover:bg-[#e6df73] text-[#161512] text-xs font-bold shadow-md shadow-[#f2eb87]/20 transition-all"
                  >
                    Simpan Agenda
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DELETE DIALOG */}
      <AnimatePresence>
        {deleteId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteId(null)}
              className="fixed inset-0 bg-black/75 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-sm bg-[#1f1d19] border border-red-500/30 rounded-3xl p-6 text-center space-y-4 z-10 shadow-2xl"
            >
              <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-red-400 flex items-center justify-center mx-auto border border-red-500/20">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-serif-title font-bold text-lg text-[#f5f1ca]">
                  Hapus Agenda?
                </h4>
                <p className="text-xs text-[#9e9a8d] mt-1 leading-relaxed">
                  Jadwal agenda ini akan dihapus dari kalender publik kelas.
                </p>
              </div>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => setDeleteId(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#9e9a8d] hover:text-[#f5f1ca]"
                >
                  Batal
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="px-5 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white text-xs font-bold shadow-md shadow-red-500/20"
                >
                  Ya, Hapus
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
