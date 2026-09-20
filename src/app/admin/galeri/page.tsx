'use client';

import React, { useState, useRef } from 'react';
import { useClassData } from '@/context/ClassDataContext';
import { GalleryItem, GalleryCategory } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Image as ImageIcon,
  Trash2,
  Edit2,
  Upload,
  X,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  MapPin,
  FileText,
  Sparkles,
} from 'lucide-react';

const CATEGORIES: GalleryCategory[] = [
  'Kegiatan Kelas',
  'Praktik TKJ',
  'Sekolah',
  'Event',
  'Kebersamaan',
  'Lainnya',
];

export default function AdminGaleriPage() {
  const { gallery, upsertGallery, deleteGallery } = useClassData();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<Partial<GalleryItem>>({
    title: '',
    image_url: '',
    category: 'Praktik TKJ',
    caption: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    location: 'Laboratorium Komputer TKJ',
    uploaded_by: 'Admin',
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleOpenCreate = () => {
    setEditingItem(null);
    setFormData({
      id: `gal-${Date.now()}`,
      title: '',
      image_url: '',
      category: 'Praktik TKJ',
      caption: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      location: 'Laboratorium Komputer TKJ',
      uploaded_by: 'Admin',
      created_at: new Date().toISOString(),
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (item: GalleryItem) => {
    setEditingItem(item);
    setFormData({
      ...item,
      description: item.description || item.caption || '',
    });
    setModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const body = new FormData();
      body.append('file', file);
      body.append('category', 'gallery');

      const res = await fetch('/api/upload', {
        method: 'POST',
        body,
      });

      const data = await res.json();
      if (res.ok && data.url) {
        setFormData((prev) => ({ ...prev, image_url: data.url }));
        showToast('Foto dokumentasi berhasil diunggah.');
      } else {
        alert(data.error || 'Gagal mengunggah foto.');
      }
    } catch {
      alert('Terjadi kesalahan saat mengunggah foto.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title?.trim() || !formData.image_url) {
      alert('Judul kegiatan dan foto dokumentasi wajib diisi.');
      return;
    }

    const descriptionText = formData.description || formData.caption || '';

    const itemToSave: GalleryItem = {
      id: formData.id || `gal-${Date.now()}`,
      title: formData.title,
      image_url: formData.image_url,
      category: (formData.category as GalleryCategory) || 'Kegiatan Kelas',
      caption: descriptionText,
      description: descriptionText,
      date: formData.date || new Date().toISOString().split('T')[0],
      location: formData.location || '',
      uploaded_by: formData.uploaded_by || 'Admin',
      created_at: formData.created_at || new Date().toISOString(),
    };

    const success = await upsertGallery(itemToSave);
    if (success) {
      setModalOpen(false);
      showToast(editingItem ? 'Foto berhasil diperbarui.' : 'Foto baru berhasil ditambahkan ke galeri.');
    } else {
      alert('Gagal menyimpan foto.');
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    const success = await deleteGallery(deleteId);
    if (success) {
      setDeleteId(null);
      showToast('Foto berhasil dihapus dari galeri.');
    } else {
      alert('Gagal menghapus foto.');
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
            <span className="uppercase tracking-widest text-[10px]">ARSIP VISUAL</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif-title font-bold text-[#f5f1ca]">
            Kelola Galeri & Dokumentasi
          </h1>
          <p className="text-xs sm:text-sm text-[#9e9a8d]">
            Unggah dan lengkapi judul, kategori, tanggal kegiatan, lokasi, dan deskripsi detail dokumentasi kelas XII TKJ.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#f2eb87] hover:bg-[#e6df73] text-[#161512] text-xs font-bold shadow-md shadow-[#f2eb87]/20 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Foto Baru</span>
        </button>
      </div>

      {/* Gallery Cards Grid */}
      {gallery.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-[#1f1d19] border border-[#f5f1ca]/12 text-[#9e9a8d] space-y-2">
          <ImageIcon className="w-10 h-10 mx-auto text-[#f2eb87]/40 mb-2" />
          <p className="font-semibold text-[#f5f1ca]">
            Belum ada dokumentasi di galeri
          </p>
          <p className="text-xs text-[#9e9a8d]">Klik tombol di atas untuk mengunggah foto kegiatan.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {gallery.map((item) => (
            <div
              key={item.id}
              className="group rounded-2xl bg-[#1f1d19] border border-[#f5f1ca]/12 shadow-sm overflow-hidden flex flex-col justify-between hover:border-[#f2eb87]/50 transition-all"
            >
              {/* Photo View */}
              <div className="relative aspect-[4/3] bg-[#161512] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-black/80 backdrop-blur-md text-[#f2eb87] border border-[#f2eb87]/30">
                  {item.category}
                </span>
                {item.date && (
                  <span className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-black/80 backdrop-blur-md text-[#d8d6c6] border border-[#f5f1ca]/20">
                    {item.date}
                  </span>
                )}
              </div>

              {/* Info & Caption */}
              <div className="p-4 space-y-2 flex-1">
                <h4 className="font-serif-title font-bold text-base text-[#f5f1ca] group-hover:text-[#f2eb87] transition-colors line-clamp-1">
                  {item.title}
                </h4>

                {item.location && (
                  <div className="flex items-center gap-1.5 text-[11px] text-[#9e9a8d]">
                    <MapPin className="w-3 h-3 text-[#f2eb87]" />
                    <span className="truncate">{item.location}</span>
                  </div>
                )}

                {(item.description || item.caption) && (
                  <p className="text-xs text-[#d8d6c6]/80 line-clamp-2 leading-relaxed">
                    {item.description || item.caption}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="p-3 border-t border-[#f5f1ca]/10 flex items-center justify-between text-xs text-[#9e9a8d]">
                <span className="text-[10px]">Oleh {item.uploaded_by || 'Admin'}</span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEdit(item)}
                    className="p-1.5 rounded-lg hover:text-[#f2eb87] hover:bg-[#161512] transition-colors"
                    title="Edit Foto"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleteId(item.id)}
                    className="p-1.5 rounded-lg hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    title="Hapus Foto"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* UPLOAD / EDIT MODAL */}
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
                  {editingItem ? 'Edit Dokumentasi Galeri' : 'Upload Dokumentasi Baru'}
                </h3>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-1 text-[#9e9a8d] hover:text-[#f5f1ca]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 text-xs max-h-[80vh] overflow-y-auto pr-1">
                {/* Image Upload Zone */}
                <div>
                  <label className="block text-xs font-semibold text-[#f5f1ca] mb-1.5">
                    File Foto Dokumentasi *
                  </label>
                  {formData.image_url ? (
                    <div className="relative aspect-video rounded-2xl overflow-hidden bg-[#161512] border border-[#f5f1ca]/15 mb-2 group">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={formData.image_url}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="px-3 py-1.5 rounded-xl bg-[#f2eb87] text-[#161512] font-bold text-xs"
                        >
                          Ganti Foto
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, image_url: '' })}
                          className="px-3 py-1.5 rounded-xl bg-red-500 text-white font-bold text-xs"
                        >
                          Hapus
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-[#f5f1ca]/20 hover:border-[#f2eb87] bg-[#161512] rounded-2xl p-8 text-center cursor-pointer transition-all space-y-2"
                    >
                      <Upload className="w-8 h-8 text-[#f2eb87] mx-auto" />
                      <div className="font-semibold text-[#f5f1ca]">
                        {uploading ? 'Mengunggah file...' : 'Klik untuk memilih atau seret foto ke sini'}
                      </div>
                      <p className="text-[11px] text-[#9e9a8d]">PNG, JPG, atau WEBP hingga 10MB</p>
                    </div>
                  )}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/*"
                    className="hidden"
                  />
                </div>

                {/* Judul & Kategori */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#f5f1ca] mb-1">
                      Judul Kegiatan / Foto *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Praktikum Konfigurasi VLAN & Trunking"
                      value={formData.title || ''}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#161512] border border-[#f5f1ca]/15 text-[#f5f1ca] focus:outline-none focus:border-[#f2eb87] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#f5f1ca] mb-1">
                      Kategori Dokumentasi *
                    </label>
                    <select
                      value={formData.category || 'Praktik TKJ'}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value as GalleryCategory })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#161512] border border-[#f5f1ca]/15 text-[#f5f1ca] focus:outline-none focus:border-[#f2eb87] transition-all"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Tanggal & Lokasi */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#f5f1ca] mb-1">
                      Tanggal Pelaksanaan
                    </label>
                    <input
                      type="date"
                      value={formData.date || ''}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#161512] border border-[#f5f1ca]/15 text-[#f5f1ca] focus:outline-none focus:border-[#f2eb87] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#f5f1ca] mb-1">
                      Lokasi Kegiatan
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: Lab Komputer Jaringan 2"
                      value={formData.location || ''}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#161512] border border-[#f5f1ca]/15 text-[#f5f1ca] focus:outline-none focus:border-[#f2eb87] transition-all"
                    />
                  </div>
                </div>

                {/* Deskripsi Lengkap */}
                <div>
                  <label className="block text-xs font-semibold text-[#f5f1ca] mb-1">
                    Deskripsi Lengkap Kegiatan
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Ceritakan jalannya kegiatan, materi yang diuji, serta keseruan kelas..."
                    value={formData.description || formData.caption || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        description: e.target.value,
                        caption: e.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#161512] border border-[#f5f1ca]/15 text-[#f5f1ca] focus:outline-none focus:border-[#f2eb87] transition-all font-sans"
                  />
                </div>

                {/* Submit Buttons */}
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
                    Simpan Foto Galeri
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
                  Hapus Foto Galeri?
                </h4>
                <p className="text-xs text-[#9e9a8d] mt-1 leading-relaxed">
                  Foto ini akan dihapus dari album publik website kelas.
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
