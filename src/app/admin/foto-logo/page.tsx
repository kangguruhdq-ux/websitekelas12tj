'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useClassData } from '@/context/ClassDataContext';
import { SiteSettings } from '@/types';
import { motion } from 'framer-motion';
import { optimizeImageForUpload } from '@/lib/image-optimizer';
import Image from 'next/image';
import Link from 'next/link';
import {
  Upload,
  Save,
  CheckCircle2,
  Cpu,
  Image as ImageIcon,
  Sparkles,
  RotateCcw,
  ExternalLink,
  Eye,
  Camera,
  Trash2,
  Layers,
  ArrowRight,
} from 'lucide-react';

export default function AdminFotoLogoPage() {
  const { settings, updateSettings, isSyncing } = useClassData();

  const [formData, setFormData] = useState<SiteSettings>({ ...settings });
  const isDirtyRef = useRef(false);

  // Auto-sync with settings from DB
  useEffect(() => {
    if (!isDirtyRef.current && settings && settings.class_name) {
      setFormData({ ...settings });
    }
  }, [settings]);

  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingHero, setUploadingHero] = useState(false);
  const [uploadingClassPhoto, setUploadingClassPhoto] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Upload Handlers (with automatic WebP compression and Neon DB persistence)
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawFile = e.target.files?.[0];
    if (!rawFile) return;

    setUploadingLogo(true);
    try {
      const file = await optimizeImageForUpload(rawFile, 600, 0.85);
      const body = new FormData();
      body.append('file', file);
      body.append('category', 'brand');

      const res = await fetch('/api/upload', { method: 'POST', body });
      const json = await res.json();
      if (json.success && json.url) {
        setFormData((prev) => ({ ...prev, logo_url: json.url }));
        isDirtyRef.current = true;
        showToast('Logo website berhasil diunggah & dikompresi ke WebP!');
      } else {
        alert(json.error || 'Gagal mengunggah logo');
      }
    } catch (err: any) {
      alert('Error mengunggah logo: ' + err.message);
    } finally {
      setUploadingLogo(false);
      if (e.target) e.target.value = '';
    }
  };

  const handleHeroUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawFile = e.target.files?.[0];
    if (!rawFile) return;

    setUploadingHero(true);
    try {
      const file = await optimizeImageForUpload(rawFile, 1200, 0.82);
      const body = new FormData();
      body.append('file', file);
      body.append('category', 'hero');

      const res = await fetch('/api/upload', { method: 'POST', body });
      const json = await res.json();
      if (json.success && json.url) {
        setFormData((prev) => ({ ...prev, hero_image_url: json.url }));
        isDirtyRef.current = true;
        showToast('Foto Banner Hero berhasil diunggah!');
      } else {
        alert(json.error || 'Gagal mengunggah foto hero');
      }
    } catch (err: any) {
      alert('Error mengunggah foto hero: ' + err.message);
    } finally {
      setUploadingHero(false);
      if (e.target) e.target.value = '';
    }
  };

  const handleClassPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawFile = e.target.files?.[0];
    if (!rawFile) return;

    setUploadingClassPhoto(true);
    try {
      const file = await optimizeImageForUpload(rawFile, 1200, 0.82);
      const body = new FormData();
      body.append('file', file);
      body.append('category', 'class_photo');

      const res = await fetch('/api/upload', { method: 'POST', body });
      const json = await res.json();
      if (json.success && json.url) {
        setFormData((prev) => ({ ...prev, class_photo_url: json.url }));
        isDirtyRef.current = true;
        showToast('Foto kebersamaan kelas berhasil diunggah!');
      } else {
        alert(json.error || 'Gagal mengunggah foto');
      }
    } catch (err: any) {
      alert('Error mengunggah foto: ' + err.message);
    } finally {
      setUploadingClassPhoto(false);
      if (e.target) e.target.value = '';
    }
  };

  const handleSaveAll = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await updateSettings(formData);
    if (success) {
      isDirtyRef.current = false;
      showToast('Perubahan Foto & Logo Website berhasil disimpan ke database!');
    } else {
      alert('Gagal menyimpan perubahan ke database.');
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12 w-full min-w-0">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-[#1f1d19] border border-[#f2eb87]/50 text-[#f5f1ca] shadow-2xl flex items-center gap-3 text-xs font-semibold animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-[#f2eb87]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#f5f1ca]/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#1f1d19] text-[#f2eb87] border border-[#f2eb87]/30 mb-2">
            <Camera className="w-3.5 h-3.5" />
            <span className="uppercase tracking-widest text-[10px]">BRANDING & VISUAL IDENTITY</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif-title font-bold text-[#f5f1ca]">
            Ganti Foto & Logo Website
          </h1>
          <p className="text-xs sm:text-sm text-[#9e9a8d] mt-1">
            Ubah Logo resmi, Foto Banner Hero Beranda, dan Foto Utama Kebersamaan Kelas XII TJ Angkatan 27.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            className="px-4 py-2.5 rounded-xl border border-[#f5f1ca]/15 text-[#f5f1ca] hover:border-[#f2eb87] text-xs font-semibold inline-flex items-center gap-2 transition-colors"
          >
            <Eye className="w-4 h-4 text-[#f2eb87]" />
            <span>Lihat Website</span>
          </Link>

          <button
            type="button"
            onClick={handleSaveAll}
            disabled={isSyncing}
            className="px-5 py-2.5 rounded-xl bg-[#f2eb87] text-[#161512] hover:bg-[#e0d970] font-bold text-xs shadow-lg shadow-[#f2eb87]/20 flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSyncing ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSaveAll} className="space-y-8">
        {/* ========================================================================= */}
        {/* SECTION 1: LOGO WEBSITE & KELAS */}
        {/* ========================================================================= */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#1f1d19] border border-[#f5f1ca]/12 shadow-xl space-y-6">
          <div className="flex items-start justify-between gap-4 border-b border-[#f5f1ca]/10 pb-4">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#161512] text-[#f2eb87] border border-[#f2eb87]/30 mb-1.5">
                Bagian 1
              </div>
              <h2 className="text-xl font-serif-title font-bold text-[#f5f1ca]">
                Logo Resmi Kelas & Website
              </h2>
              <p className="text-xs text-[#9e9a8d]">
                Tampil di Navbar utama (kiri atas), Favicon, dan Footer bawah seluruh halaman website.
              </p>
            </div>
            {formData.logo_url && (
              <button
                type="button"
                onClick={() => {
                  setFormData((prev) => ({ ...prev, logo_url: '' }));
                  isDirtyRef.current = true;
                }}
                className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1.5 p-1"
                title="Hapus logo dan gunakan monogram bawaan TJ"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Hapus Logo</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Live Preview Box */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 rounded-2xl bg-[#161512] border border-[#f5f1ca]/10 text-center space-y-3">
              <span className="text-[11px] font-semibold text-[#9e9a8d] uppercase tracking-wider">
                Pratinjau Logo di Navbar
              </span>
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#1f1d19] border border-[#f2eb87]/30 shadow-inner">
                <div className="w-12 h-12 rounded-xl bg-[#161512] border border-[#f5f1ca]/20 overflow-hidden flex items-center justify-center shadow-md">
                  {formData.logo_url ? (
                    <Image
                      src={formData.logo_url}
                      alt="Preview Logo"
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="font-theme-heading font-black text-lg text-[#f2eb87]">
                      TJ
                    </span>
                  )}
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-sm text-[#f5f1ca]">
                      {formData.class_name || 'XII TJ'}
                    </span>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#f2eb87]/20 text-[#f2eb87]">
                      ANGKATAN 27
                    </span>
                  </div>
                  <span className="text-[10px] text-[#9e9a8d]">
                    Teknik Komputer dan Jaringan
                  </span>
                </div>
              </div>
              <span className="text-[10px] text-[#9e9a8d]">
                Rekomendasi rasio: Persegi 1:1 (PNG transparan atau WebP, 400x400)
              </span>
            </div>

            {/* Inputs: URL & File Upload */}
            <div className="lg:col-span-7 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#f5f1ca] mb-1.5">
                  Tautan URL Logo (Bisa langsung tempel link gambar)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="url"
                    placeholder="https://... atau /uploads/..."
                    value={formData.logo_url || ''}
                    onChange={(e) => {
                      setFormData((prev) => ({ ...prev, logo_url: e.target.value }));
                      isDirtyRef.current = true;
                    }}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-[#161512] border border-[#f5f1ca]/15 text-[#f5f1ca] text-xs focus:outline-none focus:border-[#f2eb87] transition-all font-mono"
                  />
                  {formData.logo_url && (
                    <button
                      type="button"
                      onClick={() => {
                        setFormData((prev) => ({ ...prev, logo_url: '' }));
                        isDirtyRef.current = true;
                      }}
                      className="p-2.5 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                      title="Kosongkan"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#f5f1ca] mb-1.5">
                  Atau Unggah File Logo dari Perangkat (HP / Laptop)
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    disabled={uploadingLogo}
                    className="block w-full text-xs text-[#9e9a8d] file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#161512] file:text-[#f2eb87] file:border file:border-[#f2eb87]/30 hover:file:bg-[#25231e] cursor-pointer"
                  />
                  {uploadingLogo && (
                    <span className="text-[11px] text-[#f2eb87] font-semibold mt-1 block animate-pulse">
                      Mengompresi ke WebP dan menyimpan ke database...
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SECTION 2: FOTO BANNER HERO UTAMA */}
        {/* ========================================================================= */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#1f1d19] border border-[#f5f1ca]/12 shadow-xl space-y-6">
          <div className="flex items-start justify-between gap-4 border-b border-[#f5f1ca]/10 pb-4">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#161512] text-[#f2eb87] border border-[#f2eb87]/30 mb-1.5">
                Bagian 2
              </div>
              <h2 className="text-xl font-serif-title font-bold text-[#f5f1ca]">
                Foto Banner Hero Beranda Utama
              </h2>
              <p className="text-xs text-[#9e9a8d]">
                Foto besar yang tampil di bagian paling atas Beranda (Hero Section sebelah kanan).
              </p>
            </div>
            {formData.hero_image_url && (
              <button
                type="button"
                onClick={() => {
                  setFormData((prev) => ({ ...prev, hero_image_url: '' }));
                  isDirtyRef.current = true;
                }}
                className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1.5 p-1"
                title="Gunakan ilustrasi Cyber Chip default"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Gunakan Default Cyber Canvas</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Live Preview Hero Card */}
            <div className="lg:col-span-5">
              <span className="text-[11px] font-semibold text-[#9e9a8d] uppercase tracking-wider block mb-2 text-center">
                Pratinjau Hero Beranda
              </span>
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-[#f5f1ca]/20 bg-[#161512] shadow-inner group">
                {formData.hero_image_url ? (
                  <Image
                    src={formData.hero_image_url}
                    alt="Hero Banner Preview"
                    fill
                    sizes="(max-width: 768px) 100vw, 400px"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
                    <Cpu className="w-12 h-12 text-[#f2eb87] mb-2 animate-pulse" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#f2eb87]">
                      Cyber Canvas (Bawaan)
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex items-end p-4">
                  <div>
                    <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#f2eb87] text-[#161512]">
                      ANGKATAN 27
                    </span>
                    <p className="font-serif-title text-sm font-bold text-[#f5f1ca] mt-1">
                      Keluarga Besar {formData.class_name || 'XII TJ'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Inputs: URL & File Upload */}
            <div className="lg:col-span-7 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#f5f1ca] mb-1.5">
                  Tautan URL Foto Hero (Bisa tempel link gambar eksternal)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="url"
                    placeholder="https://... atau /uploads/..."
                    value={formData.hero_image_url || ''}
                    onChange={(e) => {
                      setFormData((prev) => ({ ...prev, hero_image_url: e.target.value }));
                      isDirtyRef.current = true;
                    }}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-[#161512] border border-[#f5f1ca]/15 text-[#f5f1ca] text-xs focus:outline-none focus:border-[#f2eb87] transition-all font-mono"
                  />
                  {formData.hero_image_url && (
                    <button
                      type="button"
                      onClick={() => {
                        setFormData((prev) => ({ ...prev, hero_image_url: '' }));
                        isDirtyRef.current = true;
                      }}
                      className="p-2.5 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                      title="Kosongkan"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#f5f1ca] mb-1.5">
                  Atau Unggah File Foto Banner dari Galeri HP / Komputer
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleHeroUpload}
                    disabled={uploadingHero}
                    className="block w-full text-xs text-[#9e9a8d] file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#161512] file:text-[#f2eb87] file:border file:border-[#f2eb87]/30 hover:file:bg-[#25231e] cursor-pointer"
                  />
                  {uploadingHero && (
                    <span className="text-[11px] text-[#f2eb87] font-semibold mt-1 block animate-pulse">
                      Mengompresi ke WebP resolusi web dan menyimpan ke database...
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-[#9e9a8d] mt-1.5">
                  Foto otomatis dikompresi ke format WebP agar loading website secepat kilat (skor performa 95-100).
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SECTION 3: FOTO UTAMA KEBERSAMAAN KELAS */}
        {/* ========================================================================= */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#1f1d19] border border-[#f5f1ca]/12 shadow-xl space-y-6">
          <div className="flex items-start justify-between gap-4 border-b border-[#f5f1ca]/10 pb-4">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#161512] text-[#f2eb87] border border-[#f2eb87]/30 mb-1.5">
                Bagian 3
              </div>
              <h2 className="text-xl font-serif-title font-bold text-[#f5f1ca]">
                Foto Utama Bersama Kelas (Tentang & Sejarah Kelas)
              </h2>
              <p className="text-xs text-[#9e9a8d]">
                Foto dokumentasi bersama 34 siswa yang tampil di bagian profil "Tentang Kelas".
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Live Preview Box */}
            <div className="lg:col-span-5">
              <span className="text-[11px] font-semibold text-[#9e9a8d] uppercase tracking-wider block mb-2 text-center">
                Pratinjau Foto Kebersamaan
              </span>
              <div className="relative aspect-video rounded-2xl overflow-hidden border border-[#f5f1ca]/20 bg-[#161512] shadow-inner group">
                {formData.class_photo_url ? (
                  <Image
                    src={formData.class_photo_url}
                    alt="Foto Kelas Preview"
                    fill
                    sizes="(max-width: 768px) 100vw, 400px"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
                    <ImageIcon className="w-12 h-12 text-[#9e9a8d] mb-2" />
                    <span className="text-[10px] text-[#9e9a8d]">Belum ada foto utama kelas</span>
                  </div>
                )}
              </div>
            </div>

            {/* Inputs: URL & File Upload */}
            <div className="lg:col-span-7 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#f5f1ca] mb-1.5">
                  Tautan URL Foto Bersama Kelas
                </label>
                <input
                  type="url"
                  placeholder="https://... atau /uploads/..."
                  value={formData.class_photo_url || ''}
                  onChange={(e) => {
                    setFormData((prev) => ({ ...prev, class_photo_url: e.target.value }));
                    isDirtyRef.current = true;
                  }}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#161512] border border-[#f5f1ca]/15 text-[#f5f1ca] text-xs focus:outline-none focus:border-[#f2eb87] transition-all font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#f5f1ca] mb-1.5">
                  Atau Unggah File Foto Bersama
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleClassPhotoUpload}
                  disabled={uploadingClassPhoto}
                  className="block w-full text-xs text-[#9e9a8d] file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#161512] file:text-[#f2eb87] file:border file:border-[#f2eb87]/30 hover:file:bg-[#25231e] cursor-pointer"
                />
                {uploadingClassPhoto && (
                  <span className="text-[11px] text-[#f2eb87] font-semibold mt-1 block animate-pulse">
                    Mengompresi ke WebP dan menyimpan ke database...
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#f5f1ca] mb-1">
                    Judul Foto Momen
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Formasi Lengkap 34 Siswa XII TJ"
                    value={formData.class_photo_title || ''}
                    onChange={(e) => {
                      setFormData((prev) => ({ ...prev, class_photo_title: e.target.value }));
                      isDirtyRef.current = true;
                    }}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#161512] border border-[#f5f1ca]/15 text-[#f5f1ca] text-xs focus:outline-none focus:border-[#f2eb87]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#f5f1ca] mb-1">
                    Keterangan Singkat
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Diambil saat praktikum jaringan"
                    value={formData.class_photo_description || ''}
                    onChange={(e) => {
                      setFormData((prev) => ({ ...prev, class_photo_description: e.target.value }));
                      isDirtyRef.current = true;
                    }}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#161512] border border-[#f5f1ca]/15 text-[#f5f1ca] text-xs focus:outline-none focus:border-[#f2eb87]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Save Action Bar */}
        <div className="flex items-center justify-between p-5 rounded-2xl bg-[#1f1d19] border border-[#f2eb87]/30 shadow-xl">
          <div className="flex items-center gap-2 text-xs text-[#9e9a8d]">
            <Sparkles className="w-4 h-4 text-[#f2eb87]" />
            <span>Data otomatis disinkronkan ke database Neon PostgreSQL & Supabase.</span>
          </div>

          <button
            type="submit"
            disabled={isSyncing}
            className="px-6 py-3 rounded-xl bg-[#f2eb87] text-[#161512] hover:bg-[#e0d970] font-bold text-xs shadow-lg shadow-[#f2eb87]/20 flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSyncing ? 'Menyimpan...' : 'Simpan Perubahan Visual'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
