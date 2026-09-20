'use client';

import React, { useState, useMemo, useRef } from 'react';
import { useClassData } from '@/context/ClassDataContext';
import { Student, Gender } from '@/types';
import { getStudentAvatarUrl } from '@/lib/seed-data';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Upload,
  User,
  X,
  Check,
  AlertTriangle,
  Camera,
  CheckCircle2,
  Sparkles,
  Cpu,
} from 'lucide-react';

export default function AdminSiswaPage() {
  const { students, upsertStudent, deleteStudent } = useClassData();

  const [searchQuery, setSearchQuery] = useState('');
  const [genderFilter, setGenderFilter] = useState<'all' | Gender>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Form states (no sensitive data like NISN or Parent Name)
  const [formData, setFormData] = useState<Partial<Student>>({
    name: '',
    nisn: '',
    elective_subject: 'Cloud Computing & Cyber Security',
    major: 'Teknik Komputer dan Jaringan',
    gender: 'L',
    birth_place: '',
    birth_date: '',
    parent_name: '',
    photo_url: '',
    is_active: true,
  });

  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchQuery =
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s.elective_subject && s.elective_subject.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchGender = genderFilter === 'all' || s.gender === genderFilter;
      return matchQuery && matchGender;
    });
  }, [students, searchQuery, genderFilter]);

  const handleOpenCreate = () => {
    setEditingStudent(null);
    setFormData({
      id: `std-${Date.now()}`,
      name: '',
      nisn: '',
      elective_subject: 'Cloud Computing & Cyber Security',
      major: 'Teknik Komputer dan Jaringan',
      gender: 'L',
      birth_place: '',
      birth_date: '',
      parent_name: '',
      photo_url: '',
      is_active: true,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (student: Student) => {
    setEditingStudent(student);
    setFormData({ ...student });
    setModalOpen(true);
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPhoto(true);
    try {
      const body = new FormData();
      body.append('file', file);
      body.append('category', 'students');

      const res = await fetch('/api/upload', {
        method: 'POST',
        body,
      });

      const data = await res.json();
      if (res.ok && data.url) {
        setFormData((prev) => ({ ...prev, photo_url: data.url }));
        showToast('Foto siswa berhasil diunggah.');
      } else {
        alert(data.error || 'Gagal mengunggah foto.');
      }
    } catch {
      alert('Terjadi kesalahan saat mengunggah foto.');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim()) {
      alert('Nama siswa wajib diisi.');
      return;
    }

    const studentToSave: Student = {
      id: formData.id || `std-${Date.now()}`,
      name: formData.name.trim(),
      nisn: formData.nisn || '',
      elective_subject: formData.elective_subject || 'Teknik Komputer dan Jaringan',
      major: formData.major || 'Teknik Komputer dan Jaringan',
      gender: (formData.gender as Gender) || 'L',
      birth_place: formData.birth_place || '',
      birth_date: formData.birth_date || '',
      parent_name: '', // Kept empty for student privacy
      photo_url: formData.photo_url || '',
      is_active: formData.is_active ?? true,
      created_at: editingStudent?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const success = await upsertStudent(studentToSave);
    if (success) {
      setModalOpen(false);
      showToast(editingStudent ? 'Data siswa berhasil diperbarui.' : 'Siswa baru berhasil ditambahkan.');
    } else {
      alert('Gagal menyimpan data siswa.');
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    const success = await deleteStudent(deleteId);
    if (success) {
      setDeleteId(null);
      showToast('Data siswa berhasil dihapus.');
    } else {
      alert('Gagal menghapus siswa.');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-[#1f1d19] border border-[#f2eb87]/50 text-[#f5f1ca] shadow-2xl flex items-center gap-3 text-xs font-semibold">
          <CheckCircle2 className="w-5 h-5 text-[#f2eb87]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header & Actions (BEM FEB UI Style) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#1f1d19] text-[#f2eb87] border border-[#f2eb87]/30 mb-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="uppercase tracking-widest text-[10px]">DIREKTORI ANGGOTA</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif-title font-bold text-[#f5f1ca]">
            Kelola Data Siswa
          </h1>
          <p className="text-xs sm:text-sm text-[#9e9a8d]">
            Total {students.length} siswa terdaftar di database kelas XII TKJ (Informasi privasi terlindungi).
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#f2eb87] hover:bg-[#e6df73] text-[#161512] text-xs font-bold shadow-md shadow-[#f2eb87]/20 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Siswa Baru</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#1f1d19] border border-[#f5f1ca]/12 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#9e9a8d] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari nama atau konsentrasi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl text-xs bg-[#161512] border border-[#f5f1ca]/15 text-[#f5f1ca] placeholder-[#9e9a8d]/60 focus:outline-none focus:border-[#f2eb87] transition-all"
          />
        </div>

        {/* Gender Filter Tabs */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="inline-flex p-1 rounded-xl bg-[#161512] border border-[#f5f1ca]/12 text-xs font-semibold">
            <button
              onClick={() => setGenderFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                genderFilter === 'all'
                  ? 'bg-[#f2eb87] text-[#161512] font-bold shadow-sm'
                  : 'text-[#9e9a8d] hover:text-[#f5f1ca]'
              }`}
            >
              Semua ({students.length})
            </button>
            <button
              onClick={() => setGenderFilter('L')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                genderFilter === 'L'
                  ? 'bg-[#f2eb87] text-[#161512] font-bold shadow-sm'
                  : 'text-[#9e9a8d] hover:text-[#f5f1ca]'
              }`}
            >
              L ({students.filter((s) => s.gender === 'L').length})
            </button>
            <button
              onClick={() => setGenderFilter('P')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                genderFilter === 'P'
                  ? 'bg-[#f2eb87] text-[#161512] font-bold shadow-sm'
                  : 'text-[#9e9a8d] hover:text-[#f5f1ca]'
              }`}
            >
              P ({students.filter((s) => s.gender === 'P').length})
            </button>
          </div>
        </div>
      </div>

      {/* Table Card */}
      <div className="rounded-2xl bg-[#1f1d19] border border-[#f5f1ca]/12 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#161512] border-b border-[#f5f1ca]/10 text-[#9e9a8d] uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3.5 px-4">No.</th>
                <th className="py-3.5 px-4">Nama Siswa</th>
                <th className="py-3.5 px-4">Jenis Kelamin</th>
                <th className="py-3.5 px-4">Konsentrasi / Peminatan</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f5f1ca]/5">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-[#9e9a8d]">
                    Tidak ada siswa ditemukan.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student, index) => {
                  const avatar =
                    student.photo_url || getStudentAvatarUrl(student.name, student.gender);
                  return (
                    <tr
                      key={student.id}
                      className="hover:bg-[#161512]/60 transition-colors"
                    >
                      <td className="py-3.5 px-4 text-[#9e9a8d] font-mono">
                        {index + 1}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl overflow-hidden bg-[#161512] flex-shrink-0 border border-[#f5f1ca]/15">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={avatar}
                              alt={student.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <span className="font-bold text-[#f5f1ca] block">
                              {student.name}
                            </span>
                            <span className="text-[10px] text-[#9e9a8d]">
                              XII TKJ • Angkatan 2026/2027
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            student.gender === 'L'
                              ? 'bg-[#f2eb87]/15 text-[#f2eb87] border border-[#f2eb87]/30'
                              : 'bg-[#f5f1ca]/15 text-[#f5f1ca] border border-[#f5f1ca]/30'
                          }`}
                        >
                          {student.gender === 'L' ? 'Laki-laki' : 'Perempuan'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-[#d8d6c6] max-w-[220px] truncate">
                        <div className="flex items-center gap-1.5">
                          <Cpu className="w-3.5 h-3.5 text-[#f2eb87] flex-shrink-0" />
                          <span className="truncate">{student.elective_subject || 'Teknik Jaringan'}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1.5 text-[#f2eb87] font-semibold text-[11px]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#f2eb87]" />
                          <span>{student.is_active ? 'Aktif' : 'Non-aktif'}</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(student)}
                            className="p-2 rounded-xl text-[#9e9a8d] hover:text-[#f2eb87] hover:bg-[#161512] transition-colors"
                            title="Edit Data"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteId(student.id)}
                            className="p-2 rounded-xl text-[#9e9a8d] hover:text-red-400 hover:bg-red-500/10 transition-colors"
                            title="Hapus Data"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form Tambah / Edit Siswa */}
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
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-lg bg-[#1f1d19] rounded-3xl border border-[#f5f1ca]/15 shadow-2xl overflow-hidden z-10"
            >
              <div className="p-5 border-b border-[#f5f1ca]/10 flex items-center justify-between">
                <div>
                  <h3 className="font-serif-title font-bold text-lg text-[#f5f1ca]">
                    {editingStudent ? 'Edit Data Siswa' : 'Tambah Siswa Baru'}
                  </h3>
                  <p className="text-[11px] text-[#9e9a8d]">
                    Isi informasi profil siswa kelas XII TKJ.
                  </p>
                </div>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-1 rounded-lg text-[#9e9a8d] hover:text-[#f5f1ca]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleFormSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
                {/* Photo Upload Section */}
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#161512] border border-[#f5f1ca]/10">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden bg-[#1f1d19] border border-[#f5f1ca]/15 flex-shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={
                        formData.photo_url ||
                        getStudentAvatarUrl(
                          formData.name || 'Siswa',
                          (formData.gender as Gender) || 'L'
                        )
                      }
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <span className="font-serif-title font-bold text-sm text-[#f5f1ca] block">
                      Foto Profil Siswa
                    </span>
                    <p className="text-[11px] text-[#9e9a8d]">
                      Format JPG/PNG. Jika dikosongkan, avatar digital otomatis digunakan.
                    </p>
                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handlePhotoUpload}
                        accept="image/*"
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadingPhoto}
                        className="px-3 py-1.5 rounded-xl bg-[#f2eb87] text-[#161512] font-bold flex items-center gap-1.5 text-[11px] hover:bg-[#e6df73] transition-colors"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>{uploadingPhoto ? 'Mengunggah...' : 'Pilih Foto'}</span>
                      </button>
                      {formData.photo_url && (
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, photo_url: '' })}
                          className="px-2.5 py-1.5 rounded-xl text-red-400 hover:bg-red-500/10 text-[11px] transition-colors"
                        >
                          Hapus Foto
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Form Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-[#f5f1ca] mb-1.5">
                      Nama Lengkap Siswa *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Nama lengkap sesuai absensi"
                      value={formData.name || ''}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#161512] border border-[#f5f1ca]/15 text-[#f5f1ca] focus:outline-none focus:border-[#f2eb87] text-xs transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#f5f1ca] mb-1.5">
                      Jenis Kelamin *
                    </label>
                    <select
                      value={formData.gender || 'L'}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value as Gender })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#161512] border border-[#f5f1ca]/15 text-[#f5f1ca] focus:outline-none focus:border-[#f2eb87] text-xs transition-all"
                    >
                      <option value="L">Laki-laki (L)</option>
                      <option value="P">Perempuan (P)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#f5f1ca] mb-1.5">
                      Program Kejuruan
                    </label>
                    <input
                      type="text"
                      value={formData.major || 'Teknik Komputer dan Jaringan'}
                      onChange={(e) => setFormData({ ...formData, major: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#161512] border border-[#f5f1ca]/15 text-[#f5f1ca] focus:outline-none focus:border-[#f2eb87] text-xs transition-all"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-[#f5f1ca] mb-1.5">
                      Konsentrasi Keahlian / Peminatan
                    </label>
                    <input
                      type="text"
                      value={formData.elective_subject || ''}
                      onChange={(e) => setFormData({ ...formData, elective_subject: e.target.value })}
                      placeholder="Contoh: Cloud Computing & Cyber Security"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#161512] border border-[#f5f1ca]/15 text-[#f5f1ca] focus:outline-none focus:border-[#f2eb87] text-xs transition-all"
                    />
                  </div>

                  <div className="sm:col-span-2 flex items-center gap-2 pt-2">
                    <input
                      type="checkbox"
                      id="is_active"
                      checked={formData.is_active ?? true}
                      onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                      className="rounded border-[#f5f1ca]/20 text-[#f2eb87] focus:ring-[#f2eb87] w-4 h-4 bg-[#161512]"
                    />
                    <label htmlFor="is_active" className="text-xs font-semibold text-[#d8d6c6]">
                      Siswa Berstatus Aktif di Kelas XII TKJ
                    </label>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="pt-4 border-t border-[#f5f1ca]/10 flex items-center justify-end gap-2">
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
                    Simpan Data Siswa
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal Hapus Konfirmasi */}
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
              className="relative w-full max-w-sm bg-[#1f1d19] rounded-3xl border border-red-500/30 p-6 text-center space-y-4 z-10 shadow-2xl"
            >
              <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-red-400 flex items-center justify-center mx-auto border border-red-500/20">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-serif-title font-bold text-lg text-[#f5f1ca]">
                  Hapus Data Siswa?
                </h4>
                <p className="text-xs text-[#9e9a8d] mt-1 leading-relaxed">
                  Tindakan ini tidak dapat dibatalkan. Data siswa akan terhapus dari database kelas.
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
