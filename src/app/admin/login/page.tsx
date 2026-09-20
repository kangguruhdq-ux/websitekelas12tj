'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Shield, Lock, User, ArrowRight, AlertCircle, CheckCircle2, Sparkles } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/admin');
        }, 600);
      } else {
        setError(data.error || 'Username atau password tidak sesuai.');
      }
    } catch {
      setError('Terjadi kesalahan koneksi server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#161512] bem-grid relative overflow-hidden text-[#d8d6c6]">
      {/* Dynamic Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-[#f2eb87]/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md relative z-10"
      >
        <div className="p-8 rounded-3xl bg-[#1f1d19] border border-[#f5f1ca]/15 shadow-2xl">
          {/* Header */}
          <div className="text-center space-y-3 mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#161512] border border-[#f2eb87]/30 text-[#f2eb87] mb-1 shadow-inner">
              <Shield className="w-7 h-7" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif-title font-bold text-[#f5f1ca] tracking-tight">
              Portal Admin XII TKJ
            </h1>
            <p className="text-xs text-[#9e9a8d]">
              Masuk untuk mengelola data siswa, struktur, agenda, pengumuman, dan galeri kelas.
            </p>
          </div>

          {/* Feedback Alerts */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3.5 mb-5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2.5"
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3.5 mb-5 rounded-xl bg-[#f2eb87]/10 border border-[#f2eb87]/30 text-[#f2eb87] text-xs flex items-center gap-2.5"
            >
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>Verifikasi berhasil! Mengalihkan ke dashboard...</span>
            </motion.div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#f5f1ca] mb-1.5">
                Username Administrator
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#9e9a8d] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="Masukkan username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs bg-[#161512] border border-[#f5f1ca]/15 text-[#f5f1ca] placeholder-[#9e9a8d]/60 focus:outline-none focus:border-[#f2eb87] transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#f5f1ca] mb-1.5">
                Kata Sandi (Password)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#9e9a8d] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs bg-[#161512] border border-[#f5f1ca]/15 text-[#f5f1ca] placeholder-[#9e9a8d]/60 focus:outline-none focus:border-[#f2eb87] transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-3 py-3 px-4 rounded-xl font-bold text-xs text-[#161512] bg-[#f2eb87] hover:bg-[#e6df73] shadow-lg shadow-[#f2eb87]/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? (
                <span>Memverifikasi Akses...</span>
              ) : (
                <>
                  <span>Masuk Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

        </div>

        <div className="text-center mt-6">
          <a
            href="/"
            className="text-xs text-[#9e9a8d] hover:text-[#f2eb87] transition-colors inline-flex items-center gap-1"
          >
            <span>← Kembali ke Beranda Kelas</span>
          </a>
        </div>
      </motion.div>
    </div>
  );
}
