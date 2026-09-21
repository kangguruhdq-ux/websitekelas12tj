'use client';

import React, { useState } from 'react';
import { useClassData } from '@/context/ClassDataContext';
import { Announcement } from '@/types';
import { formatDate } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { optimizeImageForUpload } from '@/lib/image-optimizer';
import {
  Plus,
  Bell,
  Edit2,
  Trash2,
  X,
  AlertTriangle,
  CheckCircle2,
  Eye,
  EyeOff,
  Upload,
  Sparkles,
} from 'lucide-react';

export default function AdminPengumumanPage() {
  const { announcements, upsertAnnouncement, deleteAnnouncement } = useClassData();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Announcement | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [uploadingCover, setUploadingCover] = useState(false);

  const [formData, setFormData] = useState<Partial<Announcement>>({
    title: '',
    content: '',
    category: 'Akademik',
    author: 'Wali Kelas',
    cover_url: '',
    is_published: true,
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleOpenCreate = () => {
    setEditingItem(null);
    setFormData({
      id: `ann-${Date.now()}`,
      title: '',
      content: '',
      category: 'Akademik',
      author: 'Wali Kelas',
      cover_url: '',
      is_published: true,
      created_at: new Date().toISOString(),
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (item: Announcement) => {
    setEditingItem(item);
    setFormData({ ...item });
    setModalOpen(true);
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawFile = e.target.files?.[0];
    if (!rawFile) return;

    setUploadingCover(true);
    try {
      const file = await optimizeImageForUpload(rawFile, 1200, 0.82);
      const body = new FormData();
      body.append('file', file);
      body.append('category', 'announcements');

      const res = await fetch('/api/upload', {
        method: 'POST',
        body,
      });

      const data = await res.json();
      if (res.ok && data.url) {
        setFormData((prev) => ({ ...prev, cover_url: data.url }));
        showToast('Gambar sampul pengumuman berhasil diunggah.');
      } else {
        alert(data.error || 'Gagal mengunggah gambar.');
      }
    } catch {
      alert('Terjadi kesalahan saat mengunggah gambar.');
    } finally {
      setUploadingCover(false);
      if (e.target) e.target.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title?.trim() || !formData.content?.trim()) {
      alert('Judul dan isi pengumuman wajib diisi.');
      return;
    }

    const itemToSave: Announcement = {
      id: formData.id || `ann-${Date.now()}`,
      title: formData.title.trim(),
      content: formData.content.trim(),
      category: formData.category || 'Warta Kelas',
      author: formData.author || 'Pengurus Kelas',
      cover_url: formData.cover_url || '',
      is_published: formData.is_published ?? true,
      created_at: formData.created_at || new Date().toISOString(),
      published_at: formData.is_published ? (formData.published_at || new Date().toISOString()) : '',
      updated_at: new Date().toISOString(),
    };

    const success = await upsertAnnouncement(itemToSave);
    if (success) {
      setModalOpen(false);
      showToast(editingItem ? 'Pengumuman berhasil diperbarui.' : 'Pengumuman baru berhasil diterbitkan.');
    } else {
      alert('Gagal menyimpan pengumuman.');
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    const success = await deleteAnnouncement(deleteId);
    if (success) {
      setDeleteId(null);
      showToast('Pengumuman berhasil dihapus.');
    } else {
      alert('Gagal menghapus pengumuman.');
    }
  };

  const togglePublish = async (item: Announcement) => {
    const updated = { ...item, is_published: !item.is_published };
    await upsertAnnouncement(updated);
    showToast(updated.is_published ? 'Pengumuman dipublikasikan.' : 'Pengumuman disembunyikan (draft).');
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
            <span className="uppercase tracking-widest text-[10px]">WARTA PUBLIKASI</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif-title font-bold text-[#f5f1ca]">
            Kelola Warta & Pengumuman Kelas
          </h1>
          <p className="text-xs sm:text-sm text-[#9e9a8d]">
            Terbitkan surat edaran, pemberitahuan praktikum, atau pengumuman penting bagi publik.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#f2eb87] hover:bg-[#e6df73] text-[#161512] text-xs font-bold shadow-md shadow-[#f2eb87]/20 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Buat Pengumuman Baru</span>
        </button>
      </div>

      {/* Table Card */}
      <div className="rounded-2xl bg-[#1f1d19] border border-[#f5f1ca]/12 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#161512] border-b border-[#f5f1ca]/10 text-[#9e9a8d] uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3.5 px-4">Judul Pengumuman</th>
                <th className="py-3.5 px-4">Kategori</th>
                <th className="py-3.5 px-4">Penulis</th>
                <th className="py-3.5 px-4">Tanggal</th>
                <th className="py-3.5 px-4">Status Publikasi</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f5f1ca]/5">
              {announcements.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-[#9e9a8d]">
                    Belum ada pengumuman dibuat.
                  </td>
                </tr>
              ) : (
                announcements.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-[#161512]/60 transition-colors"
                  >
                    <td className="py-3 px-4 font-bold text-[#f5f1ca] max-w-xs truncate">
                      {item.title}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#161512] border border-[#f5f1ca]/15 text-[#f2eb87]">
                        {item.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[#d8d6c6]">
                      {item.author}
                    </td>
                    <td className="py-3 px-4 text-[#9e9a8d] font-mono text-[11px]">
                      {formatDate(item.published_at || item.created_at)}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => togglePublish(item)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-colors ${
                          item.is_published
                            ? 'bg-[#f2eb87]/15 text-[#f2eb87] border border-[#f2eb87]/30'
                            : 'bg-[#161512] text-[#9e9a8d] border border-[#f5f1ca]/10'
                        }`}
                      >
                        {item.is_published ? (
                          <>
                            <Eye className="w-3 h-3" />
                            <span>Publik</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3 h-3" />
                            <span>Draft</span>
                          </>
                        )}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(item)}
                          className="p-2 rounded-xl text-[#9e9a8d] hover:text-[#f2eb87] hover:bg-[#161512] transition-colors"
                          title="Edit Pengumuman"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteId(item.id)}
                          className="p-2 rounded-xl text-[#9e9a8d] hover:text-red-400 hover:bg-red-500/10 transition-colors"
                          title="Hapus Pengumuman"
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
              className="relative w-full max-w-xl bg-[#1f1d19] border border-[#f5f1ca]/15 rounded-3xl p-6 shadow-2xl z-10 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-[#f5f1ca]/10 pb-3">
                <h3 className="font-serif-title font-bold text-lg text-[#f5f1ca]">
                  {editingItem ? 'Edit Pengumuman' : 'Buat Pengumuman Baru'}
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
                    Judul Pengumuman *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Jadwal Simulasi Gladi Bersih UKK TKJ"
                    value={formData.title || ''}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#161512] border border-[#f5f1ca]/15 text-[#f5f1ca] focus:outline-none focus:border-[#f2eb87] transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#f5f1ca] mb-1">
                      Kategori
                    </label>
                    <select
                      value={formData.category || 'Akademik'}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#161512] border border-[#f5f1ca]/15 text-[#f5f1ca] focus:outline-none focus:border-[#f2eb87] transition-all"
                    >
                      <option value="Akademik">Akademik & Praktikum</option>
                      <option value="Organisasi">Organisasi & Kepengurusan</option>
                      <option value="Kas Kelas">Kas Kelas & Iuran</option>
                      <option value="Informasi Sekolah">Informasi Sekolah</option>
                      <option value="Lainnya">Lainnya</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#f5f1ca] mb-1">
                      Penulis / Penerbit
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: Wali Kelas / Sekretaris"
                      value={formData.author || ''}
                      onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#161512] border border-[#f5f1ca]/15 text-[#f5f1ca] focus:outline-none focus:border-[#f2eb87] transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#f5f1ca] mb-1">
                    Isi Pengumuman Lengkap *
                  </label>
                  <textarea
                    rows={6}
                    required
                    placeholder="Tuliskan isi pengumuman secara rinci..."
                    value={formData.content || ''}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#161512] border border-[#f5f1ca]/15 text-[#f5f1ca] focus:outline-none focus:border-[#f2eb87] transition-all font-sans"
                  />
                </div>

                {/* Cover Image Upload */}
                <div>
                  <label className="block text-xs font-semibold text-[#f5f1ca] mb-1">
                    Gambar Sampul / Lampiran (Opsional)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      onChange={handleCoverUpload}
                      accept="image/*"
                      className="text-xs text-[#9e9a8d] file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#161512] file:text-[#f2eb87] hover:file:bg-[#25231e]"
                    />
                    {uploadingCover && <span className="text-[11px] text-[#f2eb87]">Mengunggah...</span>}
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="is_published"
                    checked={formData.is_published ?? true}
                    onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                    className="rounded border-[#f5f1ca]/20 text-[#f2eb87] focus:ring-[#f2eb87] w-4 h-4 bg-[#161512]"
                  />
                  <label htmlFor="is_published" className="text-xs font-semibold text-[#d8d6c6]">
                    Langsung Publikasikan ke Halaman Publik
                  </label>
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
                    Simpan Pengumuman
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
                  Hapus Pengumuman?
                </h4>
                <p className="text-xs text-[#9e9a8d] mt-1 leading-relaxed">
                  Warta ini akan dihapus secara permanen dari portal kelas.
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
