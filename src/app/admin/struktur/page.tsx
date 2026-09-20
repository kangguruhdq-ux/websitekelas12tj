'use client';

import React, { useState } from 'react';
import { useClassData } from '@/context/ClassDataContext';
import { ClassRole, RoleCategory } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Network,
  Edit2,
  Trash2,
  X,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export default function AdminStrukturPage() {
  const { roles, students, upsertRole, deleteRole } = useClassData();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<ClassRole | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<ClassRole>>({
    role_name: '',
    category: 'koordinator',
    person_name: '',
    student_id: '',
    position_order: roles.length + 1,
    badge: '',
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleOpenCreate = () => {
    setEditingRole(null);
    setFormData({
      id: `role-${Date.now()}`,
      role_name: '',
      category: 'koordinator',
      person_name: '',
      student_id: '',
      position_order: roles.length + 1,
      badge: '',
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (role: ClassRole) => {
    setEditingRole(role);
    setFormData({ ...role });
    setModalOpen(true);
  };

  const handleStudentSelect = (studentId: string) => {
    const student = students.find((s) => s.id === studentId);
    if (student) {
      setFormData((prev) => ({
        ...prev,
        student_id: student.id,
        person_name: student.name,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        student_id: '',
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.role_name?.trim() || !formData.person_name?.trim()) {
      alert('Nama jabatan dan nama pejabat wajib diisi.');
      return;
    }

    const roleToSave: ClassRole = {
      id: formData.id || `role-${Date.now()}`,
      role_name: formData.role_name.trim(),
      category: (formData.category as RoleCategory) || 'koordinator',
      person_name: formData.person_name.trim(),
      student_id: formData.student_id || undefined,
      position_order: Number(formData.position_order) || 1,
      badge: formData.badge?.trim() || undefined,
    };

    const success = await upsertRole(roleToSave);
    if (success) {
      setModalOpen(false);
      showToast(editingRole ? 'Jabatan berhasil diperbarui.' : 'Jabatan baru berhasil ditambahkan.');
    } else {
      alert('Gagal menyimpan data jabatan.');
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    const success = await deleteRole(deleteId);
    if (success) {
      setDeleteId(null);
      showToast('Jabatan berhasil dihapus.');
    } else {
      alert('Gagal menghapus jabatan.');
    }
  };

  // Sort roles by position_order
  const sortedRoles = [...roles].sort((a, b) => a.position_order - b.position_order);

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
            <span className="uppercase tracking-widest text-[10px]">FUNGSI KEPENGURUSAN</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif-title font-bold text-[#f5f1ca]">
            Kelola Struktur Organisasi Kelas
          </h1>
          <p className="text-xs sm:text-sm text-[#9e9a8d]">
            Atur hierarki pimpinan, administrasi, komando peleton, dan koordinator bidang kelas XII TKJ.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#f2eb87] hover:bg-[#e6df73] text-[#161512] text-xs font-bold shadow-md shadow-[#f2eb87]/20 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Posisi / Jabatan</span>
        </button>
      </div>

      {/* Table Card */}
      <div className="rounded-2xl bg-[#1f1d19] border border-[#f5f1ca]/12 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#161512] border-b border-[#f5f1ca]/10 text-[#9e9a8d] uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3.5 px-4 w-16">Urutan</th>
                <th className="py-3.5 px-4">Nama Jabatan</th>
                <th className="py-3.5 px-4">Kategori</th>
                <th className="py-3.5 px-4">Pejabat / Siswa</th>
                <th className="py-3.5 px-4">Badge / Keterangan</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f5f1ca]/5">
              {sortedRoles.map((role) => (
                <tr
                  key={role.id}
                  className="hover:bg-[#161512]/60 transition-colors"
                >
                  <td className="py-3 px-4 font-mono font-bold text-[#f2eb87]">
                    #{role.position_order}
                  </td>
                  <td className="py-3 px-4 font-bold text-[#f5f1ca]">
                    {role.role_name}
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#161512] border border-[#f5f1ca]/15 text-[#f5f1ca] capitalize">
                      {role.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-medium text-[#d8d6c6]">
                    {role.person_name}
                  </td>
                  <td className="py-3 px-4 text-[#9e9a8d] text-[11px]">
                    {role.badge || '-'}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(role)}
                        className="p-2 rounded-xl text-[#9e9a8d] hover:text-[#f2eb87] hover:bg-[#161512] transition-colors"
                        title="Edit Jabatan"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteId(role.id)}
                        className="p-2 rounded-xl text-[#9e9a8d] hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        title="Hapus Jabatan"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL EDIT / CREATE */}
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
              className="relative w-full max-w-md bg-[#1f1d19] border border-[#f5f1ca]/15 rounded-3xl p-6 shadow-2xl z-10 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-[#f5f1ca]/10 pb-3">
                <h3 className="font-serif-title font-bold text-lg text-[#f5f1ca]">
                  {editingRole ? 'Edit Posisi Struktur' : 'Tambah Posisi Baru'}
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
                    Nama Jabatan *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Ketua Kelas / Koordinator IT"
                    value={formData.role_name || ''}
                    onChange={(e) => setFormData({ ...formData, role_name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#161512] border border-[#f5f1ca]/15 text-[#f5f1ca] focus:outline-none focus:border-[#f2eb87] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#f5f1ca] mb-1">
                    Kategori Tingkat
                  </label>
                  <select
                    value={formData.category || 'koordinator'}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as RoleCategory })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#161512] border border-[#f5f1ca]/15 text-[#f5f1ca] focus:outline-none focus:border-[#f2eb87] transition-all"
                  >
                    <option value="wali">Wali Kelas / Pembimbing</option>
                    <option value="pimpinan">Pimpinan (Ketua & Wakil)</option>
                    <option value="administrasi">Administrasi (Sekretaris & Bendahara)</option>
                    <option value="komando">Komando Lapangan (Danton)</option>
                    <option value="koordinator">Koordinator Divisi</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#f5f1ca] mb-1">
                    Pilih Dari Daftar Siswa (Opsional)
                  </label>
                  <select
                    value={formData.student_id || ''}
                    onChange={(e) => handleStudentSelect(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#161512] border border-[#f5f1ca]/15 text-[#f5f1ca] focus:outline-none focus:border-[#f2eb87] transition-all"
                  >
                    <option value="">-- Ketik Nama Manual atau Pilih Siswa --</option>
                    {students.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.gender})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#f5f1ca] mb-1">
                    Nama Pejabat *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Nama pejabat"
                    value={formData.person_name || ''}
                    onChange={(e) => setFormData({ ...formData, person_name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#161512] border border-[#f5f1ca]/15 text-[#f5f1ca] focus:outline-none focus:border-[#f2eb87] transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#f5f1ca] mb-1">
                      Urutan Posisi
                    </label>
                    <input
                      type="number"
                      value={formData.position_order || 1}
                      onChange={(e) => setFormData({ ...formData, position_order: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#161512] border border-[#f5f1ca]/15 text-[#f5f1ca] focus:outline-none focus:border-[#f2eb87] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#f5f1ca] mb-1">
                      Badge / Tag
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: Pimpinan"
                      value={formData.badge || ''}
                      onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#161512] border border-[#f5f1ca]/15 text-[#f5f1ca] focus:outline-none focus:border-[#f2eb87] transition-all"
                    />
                  </div>
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
                    Simpan
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
                  Hapus Jabatan?
                </h4>
                <p className="text-xs text-[#9e9a8d] mt-1 leading-relaxed">
                  Data struktur ini akan dihapus dari bagan kelas.
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
