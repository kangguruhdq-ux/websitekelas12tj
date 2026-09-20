'use client';

import React, { useState } from 'react';
import { Shield, Key, Lock, Sparkles, CheckCircle2, AlertCircle, Eye, EyeOff } from 'lucide-react';

export default function AdminUsersPage() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      setToast({ type: 'error', message: 'Masukkan password saat ini.' });
      return;
    }
    if (newPassword.length < 4) {
      setToast({ type: 'error', message: 'Password baru minimal harus 4 karakter.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setToast({ type: 'error', message: 'Konfirmasi password baru tidak cocok.' });
      return;
    }

    setLoading(true);
    setToast(null);

    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setToast({ type: 'success', message: 'Password admin berhasil diperbarui! Gunakan password baru saat login berikutnya.' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setToast({ type: 'error', message: data.error || 'Gagal mengubah password.' });
      }
    } catch {
      setToast({ type: 'error', message: 'Terjadi kesalahan jaringan.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#1f1d19] text-[#f2eb87] border border-[#f2eb87]/30 mb-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          <span className="uppercase tracking-widest text-[10px]">KEAMANAN AKSES</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif-title font-bold text-[#f5f1ca]">
          Manajemen Pengguna Admin
        </h1>
        <p className="text-xs sm:text-sm text-[#9e9a8d]">
          Kelola hak akses administrator dan perbarui kata sandi akun portal kelas XII TKJ.
        </p>
      </div>

      {/* Admin User Card */}
      <div className="p-6 rounded-3xl bg-[#1f1d19] border border-[#f5f1ca]/12 shadow-xl space-y-5">
        <div className="flex items-center justify-between pb-4 border-b border-[#f5f1ca]/10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#161512] border border-[#f2eb87]/30 text-[#f2eb87] flex items-center justify-center">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif-title font-bold text-lg text-[#f5f1ca]">
                Administrator Utama
              </h3>
              <p className="text-xs text-[#9e9a8d]">Peran: SUPER_ADMIN</p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#f2eb87]/15 text-[#f2eb87] border border-[#f2eb87]/30">
            Aktif
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-[#161512] border border-[#f5f1ca]/10">
            <span className="text-[#9e9a8d] block mb-1 text-[11px]">Username Akses</span>
            <span className="font-mono font-bold text-[#f5f1ca] text-sm">
              admin
            </span>
          </div>

          <div className="p-4 rounded-xl bg-[#161512] border border-[#f5f1ca]/10">
            <span className="text-[#9e9a8d] block mb-1 text-[11px]">Hak Akses Route</span>
            <span className="font-bold text-[#f2eb87] text-sm">
              Akses Penuh (/admin/*)
            </span>
          </div>
        </div>
      </div>

      {/* Form Ganti Password */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#1f1d19] border border-[#f5f1ca]/15 shadow-xl space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-[#f5f1ca]/10">
          <div className="w-10 h-10 rounded-xl bg-[#161512] border border-[#f2eb87]/30 text-[#f2eb87] flex items-center justify-center">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif-title font-bold text-lg text-[#f5f1ca]">
              Ganti Password Admin
            </h3>
            <p className="text-xs text-[#9e9a8d]">
              Perbarui kata sandi login admin langsung dari dashboard ini.
            </p>
          </div>
        </div>

        {toast && (
          <div
            className={`p-4 rounded-2xl text-xs flex items-center gap-3 border ${
              toast.type === 'success'
                ? 'bg-emerald-950/30 text-emerald-300 border-emerald-500/30'
                : 'bg-red-950/30 text-red-300 border-red-500/30'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
            )}
            <span>{toast.message}</span>
          </div>
        )}

        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#f5f1ca] mb-1.5">
              Password Saat Ini
            </label>
            <div className="relative">
              <input
                type={showCurrent ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Masukkan password admin lama"
                className="w-full px-4 py-2.5 rounded-xl bg-[#161512] border border-[#f5f1ca]/15 text-[#f5f1ca] text-xs focus:outline-none focus:border-[#f2eb87] pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9e9a8d] hover:text-[#f5f1ca]"
              >
                {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#f5f1ca] mb-1.5">
                Password Baru
              </label>
              <div className="relative">
                <input
                  type={showNew ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimal 4 karakter"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#161512] border border-[#f5f1ca]/15 text-[#f5f1ca] text-xs focus:outline-none focus:border-[#f2eb87] pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9e9a8d] hover:text-[#f5f1ca]"
                >
                  {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#f5f1ca] mb-1.5">
                Konfirmasi Password Baru
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Ketik ulang password baru"
                className="w-full px-4 py-2.5 rounded-xl bg-[#161512] border border-[#f5f1ca]/15 text-[#f5f1ca] text-xs focus:outline-none focus:border-[#f2eb87]"
                required
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl font-semibold text-xs bg-[#f2eb87] text-[#111111] hover:bg-[#eae26e] transition-all disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-[#f2eb87]/20"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{loading ? 'Menyimpan...' : 'Simpan Password Baru'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
