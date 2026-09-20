'use client';

import React, { useState, useRef } from 'react';
import { useClassData } from '@/context/ClassDataContext';
import { SiteSettings, GalleryItem, GalleryCategory, ClassMemoryPhoto } from '@/types';
import { motion } from 'framer-motion';
import {
  Settings,
  Upload,
  Save,
  RotateCcw,
  CheckCircle2,
  Cpu,
  Image as ImageIcon,
  Mail,
  X,
  AlertTriangle,
  Plus,
  Trash2,
  Calendar,
  MapPin,
  FileText,
  Bot,
  Sparkles,
  Key,
  Clock,
  Award,
  GraduationCap,
  ExternalLink,
} from 'lucide-react';

const GALLERY_CATEGORIES: GalleryCategory[] = [
  'Kegiatan Kelas',
  'Praktik TKJ',
  'Sekolah',
  'Event',
  'Kebersamaan',
  'Lainnya',
];

export default function AdminSettingsPage() {
  const {
    settings,
    updateSettings,
    resetSeedData,
    gallery,
    upsertGallery,
    deleteGallery,
  } = useClassData();

  const [formData, setFormData] = useState<SiteSettings>({ ...settings });
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingHero, setUploadingHero] = useState(false);
  const [logoPreviewError, setLogoPreviewError] = useState(false);
  const [heroPreviewError, setHeroPreviewError] = useState(false);
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);

  // Quick Gallery upload state in settings
  const [galleryFormData, setGalleryFormData] = useState<Partial<GalleryItem>>({
    title: '',
    image_url: '',
    category: 'Praktik TKJ',
    description: '',
    caption: '',
    date: new Date().toISOString().split('T')[0],
    location: 'Laboratorium TKJ',
    uploaded_by: 'Admin',
  });
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [galleryDeleteId, setGalleryDeleteId] = useState<string | null>(null);

  const [testingAi, setTestingAi] = useState(false);
  const [aiTestResult, setAiTestResult] = useState<string | null>(null);

  const handleTestAi = async () => {
    setTestingAi(true);
    setAiTestResult(null);
    try {
      // First persist current unsaved settings to ensure active key is tested
      await updateSettings(formData);
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userMessage: 'Halo Ping-Ping! Tes koneksi gateway TKJ.' }),
      });
      const data = await res.json();
      if (data.success) {
        setAiTestResult(`[Status: Berhasil (${data.provider})]\n${data.reply}`);
      } else {
        setAiTestResult(`[Gagal]: ${data.error || 'Tidak ada respon'}`);
      }
    } catch (err: any) {
      setAiTestResult(`[Error]: ${err.message}`);
    } finally {
      setTestingAi(false);
    }
  };

  const logoInputRef = useRef<HTMLInputElement>(null);
  const heroInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const classPhotoInputRef = useRef<HTMLInputElement>(null);
  const memoryPhotoInputRef = useRef<HTMLInputElement>(null);

  const [uploadingClassPhoto, setUploadingClassPhoto] = useState(false);
  const [uploadingMemoryPhoto, setUploadingMemoryPhoto] = useState(false);

  const [newMemory, setNewMemory] = useState<Partial<ClassMemoryPhoto>>({
    title: '',
    caption: '',
    image_url: '',
    location: 'Lab Komputer TKJ',
    date: new Date().toISOString().split('T')[0],
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingLogo(true);
    try {
      const body = new FormData();
      body.append('file', file);
      body.append('category', 'brand');

      const res = await fetch('/api/upload', { method: 'POST', body });
      const json = await res.json();
      if (json.success && json.url) {
        setFormData((prev) => ({ ...prev, logo_url: json.url }));
        showToast('Logo kelas berhasil diunggah!');
      } else {
        alert(json.error || 'Gagal mengunggah logo');
      }
    } catch (err: any) {
      alert('Error mengunggah logo: ' + err.message);
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleHeroUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingHero(true);
    try {
      const body = new FormData();
      body.append('file', file);
      body.append('category', 'hero');

      const res = await fetch('/api/upload', { method: 'POST', body });
      const json = await res.json();
      if (json.success && json.url) {
        setFormData((prev) => ({ ...prev, hero_image_url: json.url }));
        showToast('Foto Hero kelas berhasil diunggah!');
      } else {
        alert(json.error || 'Gagal mengunggah foto hero');
      }
    } catch (err: any) {
      alert('Error mengunggah foto hero: ' + err.message);
    } finally {
      setUploadingHero(false);
    }
  };

  // Gallery direct upload handler in settings
  const handleGalleryPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingGallery(true);
    try {
      const body = new FormData();
      body.append('file', file);
      body.append('category', 'gallery');

      const res = await fetch('/api/upload', { method: 'POST', body });
      const json = await res.json();
      if (json.success && json.url) {
        setGalleryFormData((prev) => ({
          ...prev,
          image_url: json.url,
          title: prev.title || file.name.replace(/\.[^/.]+$/, ''),
        }));
        showToast('Foto galeri berhasil diunggah!');
      } else {
        alert(json.error || 'Gagal mengunggah foto');
      }
    } catch (err: any) {
      alert('Error mengunggah: ' + err.message);
    } finally {
      setUploadingGallery(false);
    }
  };

  const handleClassPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingClassPhoto(true);
    try {
      const body = new FormData();
      body.append('file', file);
      body.append('category', 'class_photo');

      const res = await fetch('/api/upload', { method: 'POST', body });
      const json = await res.json();
      if (json.success && json.url) {
        setFormData((prev) => ({ ...prev, class_photo_url: json.url }));
        showToast('Foto utama bersama kelas berhasil diunggah!');
      } else {
        alert(json.error || 'Gagal mengunggah foto');
      }
    } catch (err: any) {
      alert('Error mengunggah foto: ' + err.message);
    } finally {
      setUploadingClassPhoto(false);
    }
  };

  const handleMemoryPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingMemoryPhoto(true);
    try {
      const body = new FormData();
      body.append('file', file);
      body.append('category', 'memory_photo');

      const res = await fetch('/api/upload', { method: 'POST', body });
      const json = await res.json();
      if (json.success && json.url) {
        setNewMemory((prev) => ({
          ...prev,
          image_url: json.url,
          title: prev.title || file.name.replace(/\.[^/.]+$/, ''),
        }));
        showToast('Foto momen kenangan berhasil diunggah!');
      } else {
        alert(json.error || 'Gagal mengunggah foto');
      }
    } catch (err: any) {
      alert('Error: ' + err.message);
    } finally {
      setUploadingMemoryPhoto(false);
    }
  };

  const handleAddMemoryPhoto = () => {
    if (!newMemory.image_url?.trim() || !newMemory.title?.trim()) {
      alert('Gambar dan Judul Foto Kenangan wajib diisi.');
      return;
    }

    const item: ClassMemoryPhoto = {
      id: `mem-${Date.now()}`,
      title: newMemory.title.trim(),
      caption: newMemory.caption?.trim() || newMemory.title.trim(),
      image_url: newMemory.image_url.trim(),
      date: newMemory.date || new Date().toISOString().split('T')[0],
      location: newMemory.location || 'Laboratorium TKJ',
    };

    const currentMemories = formData.class_memories || [];
    setFormData({
      ...formData,
      class_memories: [...currentMemories, item],
    });

    setNewMemory({
      title: '',
      caption: '',
      image_url: '',
      location: 'Lab Komputer TKJ',
      date: new Date().toISOString().split('T')[0],
    });

    showToast('Foto kenangan ditambahkan!');
  };

  const handleDeleteMemoryPhoto = (id: string) => {
    const currentMemories = formData.class_memories || [];
    setFormData({
      ...formData,
      class_memories: currentMemories.filter((m) => m.id !== id),
    });
    showToast('Foto kenangan dihapus.');
  };

  const handleAddGalleryItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!galleryFormData.image_url || !galleryFormData.title) {
      alert('Foto dan judul dokumentasi wajib diisi!');
      return;
    }

    const desc = galleryFormData.description || galleryFormData.caption || '';
    const itemToSave: GalleryItem = {
      id: `gal-${Date.now()}`,
      title: galleryFormData.title,
      image_url: galleryFormData.image_url,
      category: (galleryFormData.category as GalleryCategory) || 'Praktik TKJ',
      caption: desc,
      description: desc,
      date: galleryFormData.date || new Date().toISOString().split('T')[0],
      location: galleryFormData.location || '',
      uploaded_by: 'Admin',
      created_at: new Date().toISOString(),
    };

    const success = await upsertGallery(itemToSave);
    if (success) {
      showToast('Foto dokumentasi baru berhasil ditambahkan ke Galeri!');
      setGalleryFormData({
        title: '',
        image_url: '',
        category: 'Praktik TKJ',
        description: '',
        caption: '',
        date: new Date().toISOString().split('T')[0],
        location: 'Laboratorium TKJ',
        uploaded_by: 'Admin',
      });
    } else {
      alert('Gagal menambahkan foto ke galeri.');
    }
  };

  const handleConfirmDeleteGallery = async () => {
    if (!galleryDeleteId) return;
    const success = await deleteGallery(galleryDeleteId);
    if (success) {
      setGalleryDeleteId(null);
      showToast('Foto berhasil dihapus dari galeri.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await updateSettings(formData);
    if (success) {
      showToast('Pengaturan website berhasil disimpan dan diperbarui!');
    } else {
      alert('Gagal menyimpan pengaturan.');
    }
  };

  const handleResetSeed = async () => {
    const success = await resetSeedData();
    if (success) {
      setResetConfirmOpen(false);
      showToast('Database berhasil di-reset ke data awal resmi (34 siswa).');
      setTimeout(() => window.location.reload(), 800);
    } else {
      alert('Gagal mereset database.');
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-[#1f1d19] border border-[#f2eb87]/50 text-[#f5f1ca] shadow-2xl flex items-center gap-3 text-xs font-semibold animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-[#f2eb87]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#1f1d19] text-[#f2eb87] border border-[#f2eb87]/30 mb-1.5">
            <Settings className="w-3.5 h-3.5" />
            <span className="uppercase tracking-widest text-[10px]">KONFIGURASI SISTEM</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif-title font-bold text-[#f5f1ca]">
            Pengaturan Tampilan & Identitas Website
          </h1>
          <p className="text-xs sm:text-sm text-[#9e9a8d]">
            Ubah logo, hero banner, identitas kelas, kanal sosial media, serta upload foto galeri lengkap dengan deskripsi.
          </p>
        </div>

        <button
          onClick={handleSubmit}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#f2eb87] hover:bg-[#e6df73] text-[#161512] text-xs font-bold shadow-md shadow-[#f2eb87]/20 transition-all active:scale-95"
        >
          <Save className="w-4 h-4" />
          <span>Simpan Seluruh Pengaturan</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Brand & Assets Card (Logo & Hero) */}
        <div className="p-6 rounded-3xl bg-[#1f1d19] border border-[#f5f1ca]/12 shadow-sm space-y-6">
          <h2 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-[#f2eb87]" />
            <span>Aset Visual Utama (Logo & Hero)</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Logo Upload */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-[#f5f1ca]/12 space-y-3">
              <div className="flex items-center justify-between">
                <label className="font-bold text-xs text-slate-800 dark:text-slate-200">
                  Logo Kelas (Navbar & Header)
                </label>
                {formData.logo_url && (
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, logo_url: '' })}
                    className="text-[11px] text-red-500 hover:underline"
                  >
                    Reset ke Default
                  </button>
                )}
              </div>

              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-sm">
                  {formData.logo_url && !logoPreviewError ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={formData.logo_url}
                      alt="Logo"
                      className="w-full h-full object-cover"
                      onError={() => setLogoPreviewError(true)}
                    />
                  ) : (
                    <Cpu className="w-8 h-8 text-[#f2eb87]" />
                  )}
                </div>

                <div className="space-y-1.5 flex-1">
                  <input
                    type="file"
                    ref={logoInputRef}
                    onChange={handleLogoUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => logoInputRef.current?.click()}
                    disabled={uploadingLogo}
                    className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-cyan-500/10 hover:text-[#f2eb87] text-xs font-semibold flex items-center gap-2 transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploadingLogo ? 'Mengunggah...' : 'Upload Logo Baru'}</span>
                  </button>
                  <p className="text-[10px] text-slate-400">Format PNG/SVG/JPG, maks 5MB.</p>
                </div>
              </div>

              <input
                type="text"
                placeholder="Atau masukkan URL gambar..."
                value={formData.logo_url || ''}
                onChange={(e) => {
                  setLogoPreviewError(false);
                  setFormData({ ...formData, logo_url: e.target.value });
                }}
                className="w-full px-3 py-1.5 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>

            {/* Hero Image Upload */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-[#f5f1ca]/12 space-y-3">
              <div className="flex items-center justify-between">
                <label className="font-bold text-xs text-slate-800 dark:text-slate-200">
                  Foto Hero (Foto Bersama Kelas)
                </label>
                {formData.hero_image_url && (
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, hero_image_url: '' })}
                    className="text-[11px] text-red-500 hover:underline"
                  >
                    Hapus / Gunakan Terminal
                  </button>
                )}
              </div>

              <div className="flex items-center gap-4">
                <div className="w-20 h-14 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-sm">
                  {formData.hero_image_url && !heroPreviewError ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={formData.hero_image_url}
                      alt="Hero Preview"
                      className="w-full h-full object-cover"
                      onError={() => setHeroPreviewError(true)}
                    />
                  ) : (
                    <span className="text-[10px] text-slate-400 text-center font-mono px-1">
                      Cyber Terminal
                    </span>
                  )}
                </div>

                <div className="space-y-1.5 flex-1">
                  <input
                    type="file"
                    ref={heroInputRef}
                    onChange={handleHeroUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => heroInputRef.current?.click()}
                    disabled={uploadingHero}
                    className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-cyan-500/10 hover:text-[#f2eb87] text-xs font-semibold flex items-center gap-2 transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploadingHero ? 'Mengunggah...' : 'Upload Foto Hero'}</span>
                  </button>
                  <p className="text-[10px] text-slate-400">Rasio 16:9 atau 4:3 direkomendasikan.</p>
                </div>
              </div>

              <input
                type="text"
                placeholder="Atau masukkan URL foto hero..."
                value={formData.hero_image_url || ''}
                onChange={(e) => setFormData({ ...formData, hero_image_url: e.target.value })}
                className="w-full px-3 py-1.5 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Quick Link Card: Jadwal Mapel & Regu Piket (Radar Harian) */}
        <div className="p-6 rounded-3xl bg-gradient-to-r from-[#1f1d19] via-[#24211a] to-[#1f1d19] border border-[#f2eb87]/30 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#161512] border border-[#f2eb87]/40 text-[#f2eb87] flex items-center justify-center flex-shrink-0 shadow-inner">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-[#f2eb87]/15 text-[#f2eb87] border border-[#f2eb87]/30">
                  Radar Harian Kelas
                </span>
              </div>
              <h3 className="font-serif-title font-bold text-base text-[#f5f1ca] mt-0.5">
                Pengelolaan Jadwal Mapel & Regu Piket (Senin - Jumat)
              </h3>
              <p className="text-xs text-[#9e9a8d]">
                Atur jam pelajaran kejuruan, ruangan lab, instruktur pengampu, dan daftar siswa bertugas piket harian.
              </p>
            </div>
          </div>

          <a
            href="/admin/jadwal"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#f2eb87] hover:bg-[#e6df73] text-[#161512] font-bold text-xs shadow-md shadow-[#f2eb87]/20 transition-all self-start sm:self-auto flex-shrink-0"
          >
            <Clock className="w-4 h-4" />
            <span>Buka Editor Jadwal & Piket</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* ============================================================================== */}
        {/* MILESTONE COUNTDOWN SECTION (UKK & WISUDA)                                     */}
        {/* ============================================================================== */}
        <div className="p-6 rounded-3xl bg-[#1f1d19] border border-[#f5f1ca]/12 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-2 border-b border-[#f5f1ca]/10">
            <div>
              <h2 className="font-bold text-base text-[#f5f1ca] flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#f2eb87]" />
                <span>Pengaturan Hitung Mundur (Milestone: UKK & Wisuda)</span>
              </h2>
              <p className="text-xs text-[#9e9a8d]">
                Sesuaikan target tanggal, judul, lencana bulan, dan teks motivasi yang tampil di beranda utama website.
              </p>
            </div>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-[#161512] text-[#f2eb87] border border-[#f2eb87]/30">
              Live Countdown
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card UKK */}
            <div className="p-5 rounded-2xl bg-[#161512] border border-[#f5f1ca]/12 space-y-4">
              <div className="flex items-center gap-2.5 pb-2 border-b border-[#f5f1ca]/10">
                <div className="w-8 h-8 rounded-lg bg-[#1f1d19] text-[#f2eb87] border border-[#f2eb87]/30 flex items-center justify-center">
                  <Award className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-[#f5f1ca]">Uji Kompetensi Keahlian (UKK)</h3>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-[#d8d6c6] mb-1">Judul Utama UKK</label>
                  <input
                    type="text"
                    value={formData.milestone_ukk_title || ''}
                    placeholder="Contoh: Uji Kompetensi Keahlian (UKK)"
                    onChange={(e) => setFormData({ ...formData, milestone_ukk_title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#1f1d19] border border-[#f5f1ca]/15 text-[#f5f1ca] focus:outline-none focus:border-[#f2eb87]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#d8d6c6] mb-1">Subjudul Sertifikasi</label>
                  <input
                    type="text"
                    value={formData.milestone_ukk_subtitle || ''}
                    placeholder="Contoh: Sertifikasi Praktik TKJ 2027"
                    onChange={(e) => setFormData({ ...formData, milestone_ukk_subtitle: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#1f1d19] border border-[#f5f1ca]/15 text-[#f5f1ca] focus:outline-none focus:border-[#f2eb87]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-semibold text-[#d8d6c6] mb-1">Target Waktu (ISO/UTC)</label>
                    <input
                      type="text"
                      value={formData.milestone_ukk_date || ''}
                      placeholder="2027-02-20T08:00:00Z"
                      onChange={(e) => setFormData({ ...formData, milestone_ukk_date: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-[#1f1d19] border border-[#f5f1ca]/15 text-[#f5f1ca] font-mono text-[11px] focus:outline-none focus:border-[#f2eb87]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#d8d6c6] mb-1">Badge Bulan</label>
                    <input
                      type="text"
                      value={formData.milestone_ukk_badge || ''}
                      placeholder="Contoh: Februari 2027"
                      onChange={(e) => setFormData({ ...formData, milestone_ukk_badge: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-[#1f1d19] border border-[#f5f1ca]/15 text-[#f5f1ca] focus:outline-none focus:border-[#f2eb87]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-[#d8d6c6] mb-1">Deskripsi Motivasi UKK</label>
                  <textarea
                    rows={2}
                    value={formData.milestone_ukk_desc || ''}
                    placeholder="Fokus menguasai routing BGP, MikroTik firewall..."
                    onChange={(e) => setFormData({ ...formData, milestone_ukk_desc: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#1f1d19] border border-[#f5f1ca]/15 text-[#f5f1ca] focus:outline-none focus:border-[#f2eb87]"
                  />
                </div>
              </div>
            </div>

            {/* Card Wisuda */}
            <div className="p-5 rounded-2xl bg-[#161512] border border-[#f5f1ca]/12 space-y-4">
              <div className="flex items-center gap-2.5 pb-2 border-b border-[#f5f1ca]/10">
                <div className="w-8 h-8 rounded-lg bg-[#1f1d19] text-[#f2eb87] border border-[#f2eb87]/30 flex items-center justify-center">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-[#f5f1ca]">Wisuda & Pelepasan Angkatan</h3>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-[#d8d6c6] mb-1">Judul Puncak</label>
                  <input
                    type="text"
                    value={formData.milestone_wisuda_title || ''}
                    placeholder="Contoh: Puncak Angkatan"
                    onChange={(e) => setFormData({ ...formData, milestone_wisuda_title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#1f1d19] border border-[#f5f1ca]/15 text-[#f5f1ca] focus:outline-none focus:border-[#f2eb87]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#d8d6c6] mb-1">Subjudul Wisuda</label>
                  <input
                    type="text"
                    value={formData.milestone_wisuda_subtitle || ''}
                    placeholder="Contoh: Wisuda & Pelepasan XII TKJ"
                    onChange={(e) => setFormData({ ...formData, milestone_wisuda_subtitle: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#1f1d19] border border-[#f5f1ca]/15 text-[#f5f1ca] focus:outline-none focus:border-[#f2eb87]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-semibold text-[#d8d6c6] mb-1">Target Waktu (ISO/UTC)</label>
                    <input
                      type="text"
                      value={formData.milestone_wisuda_date || ''}
                      placeholder="2027-06-15T08:00:00Z"
                      onChange={(e) => setFormData({ ...formData, milestone_wisuda_date: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-[#1f1d19] border border-[#f5f1ca]/15 text-[#f5f1ca] font-mono text-[11px] focus:outline-none focus:border-[#f2eb87]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#d8d6c6] mb-1">Badge Bulan</label>
                    <input
                      type="text"
                      value={formData.milestone_wisuda_badge || ''}
                      placeholder="Contoh: Juni 2027"
                      onChange={(e) => setFormData({ ...formData, milestone_wisuda_badge: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-[#1f1d19] border border-[#f5f1ca]/15 text-[#f5f1ca] focus:outline-none focus:border-[#f2eb87]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-[#d8d6c6] mb-1">Deskripsi Kenangan Wisuda</label>
                  <textarea
                    rows={2}
                    value={formData.milestone_wisuda_desc || ''}
                    placeholder="Menghitung setiap detik kebersamaan, tawa di lorong kelas..."
                    onChange={(e) => setFormData({ ...formData, milestone_wisuda_desc: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#1f1d19] border border-[#f5f1ca]/15 text-[#f5f1ca] focus:outline-none focus:border-[#f2eb87]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================================== */}
        {/* FOTO UTAMA BERSAMA KELAS & KENANGAN (HALAMAN TENTANG KAMI)                     */}
        {/* ============================================================================== */}
        <div className="p-6 rounded-3xl bg-[#1f1d19] border border-[#f5f1ca]/12 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-2 border-b border-[#f5f1ca]/10">
            <div>
              <h2 className="font-bold text-base text-[#f5f1ca] flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-[#f2eb87]" />
                <span>Foto Utama Bersama Kelas & Galeri Kenangan (Halaman Tentang)</span>
              </h2>
              <p className="text-xs text-[#9e9a8d]">
                Unggah foto angkatan lengkap dengan Wali Kelas dan momen berkesan untuk dipajang di halaman Tentang.
              </p>
            </div>
            <a
              href="/tentang"
              target="_blank"
              className="text-xs text-[#f2eb87] hover:underline flex items-center gap-1"
            >
              <span>Lihat Halaman Tentang</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Featured Class Photo Banner */}
          <div className="p-5 rounded-2xl bg-[#161512] border border-[#f5f1ca]/12 space-y-4">
            <h3 className="font-bold text-sm text-[#f5f1ca] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#f2eb87]" />
              <span>Foto Utama Angkatan (Featured Class Photo)</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-5">
                <div className="aspect-[16/9] w-full rounded-2xl overflow-hidden border border-[#f5f1ca]/15 bg-[#1f1d19] relative group">
                  {formData.class_photo_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={formData.class_photo_url}
                      alt="Foto Utama Kelas"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full p-4 text-center text-xs text-[#9e9a8d] space-y-2">
                      <ImageIcon className="w-8 h-8 opacity-40 text-[#f2eb87]" />
                      <span>Belum ada foto kelas diunggah</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="md:col-span-7 space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-[#d8d6c6] mb-1">Unggah File Foto Utama</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="file"
                      ref={classPhotoInputRef}
                      onChange={handleClassPhotoUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => classPhotoInputRef.current?.click()}
                      disabled={uploadingClassPhoto}
                      className="px-4 py-2 rounded-xl bg-[#1f1d19] border border-[#f2eb87]/40 text-[#f2eb87] font-semibold text-xs hover:bg-[#f2eb87] hover:text-[#111111] transition-colors flex items-center gap-2"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{uploadingClassPhoto ? 'Mengunggah...' : 'Pilih & Upload Foto'}</span>
                    </button>
                    <span className="text-[11px] text-[#9e9a8d]">Rekomendasi rasio 16:9 HD</span>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-[#d8d6c6] mb-1">Atau Masukkan URL Foto Langsung</label>
                  <input
                    type="text"
                    value={formData.class_photo_url || ''}
                    placeholder="https://..."
                    onChange={(e) => setFormData({ ...formData, class_photo_url: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#1f1d19] border border-[#f5f1ca]/15 text-[#f5f1ca] focus:outline-none focus:border-[#f2eb87]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#d8d6c6] mb-1">Judul Foto Kelas</label>
                  <input
                    type="text"
                    value={formData.class_photo_title || ''}
                    placeholder="Contoh: Foto Bersama Keluarga Besar XII TKJ"
                    onChange={(e) => setFormData({ ...formData, class_photo_title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#1f1d19] border border-[#f5f1ca]/15 text-[#f5f1ca] focus:outline-none focus:border-[#f2eb87]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#d8d6c6] mb-1">Keterangan / Deskripsi Foto</label>
                  <textarea
                    rows={2}
                    value={formData.class_photo_description || ''}
                    placeholder="Potret kebersamaan 34 siswa bersama Wali Kelas..."
                    onChange={(e) => setFormData({ ...formData, class_photo_description: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#1f1d19] border border-[#f5f1ca]/15 text-[#f5f1ca] focus:outline-none focus:border-[#f2eb87]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sub-Manager: Momen Foto Kenangan Angkatan */}
          <div className="p-5 rounded-2xl bg-[#161512] border border-[#f5f1ca]/12 space-y-4">
            <h3 className="font-bold text-sm text-[#f5f1ca] flex items-center gap-2">
              <Plus className="w-4 h-4 text-[#f2eb87]" />
              <span>Tambah Momen Foto Kenangan Tambahan</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div className="sm:col-span-2">
                <label className="block font-semibold text-[#d8d6c6] mb-1">Judul Momen *</label>
                <input
                  type="text"
                  value={newMemory.title || ''}
                  placeholder="Contoh: Praktikum Splicing Fiber Optic"
                  onChange={(e) => setNewMemory({ ...newMemory, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#1f1d19] border border-[#f5f1ca]/15 text-[#f5f1ca] focus:outline-none focus:border-[#f2eb87]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#d8d6c6] mb-1">Lokasi</label>
                <input
                  type="text"
                  value={newMemory.location || ''}
                  placeholder="Contoh: Lab Jaringan 1"
                  onChange={(e) => setNewMemory({ ...newMemory, location: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#1f1d19] border border-[#f5f1ca]/15 text-[#f5f1ca] focus:outline-none focus:border-[#f2eb87]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#d8d6c6] mb-1">Tanggal</label>
                <input
                  type="date"
                  value={newMemory.date || ''}
                  onChange={(e) => setNewMemory({ ...newMemory, date: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#1f1d19] border border-[#f5f1ca]/15 text-[#f5f1ca] focus:outline-none focus:border-[#f2eb87]"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block font-semibold text-[#d8d6c6] mb-1">Foto (Pilih File atau Isi URL) *</label>
                <div className="flex gap-2">
                  <input
                    type="file"
                    ref={memoryPhotoInputRef}
                    onChange={handleMemoryPhotoUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => memoryPhotoInputRef.current?.click()}
                    disabled={uploadingMemoryPhoto}
                    className="px-3 py-2 rounded-xl bg-[#1f1d19] border border-[#f5f1ca]/20 text-[#f2eb87] font-semibold flex items-center gap-1.5"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploadingMemoryPhoto ? 'Upload...' : 'Pilih File'}</span>
                  </button>
                  <input
                    type="text"
                    value={newMemory.image_url || ''}
                    placeholder="Atau URL foto: https://..."
                    onChange={(e) => setNewMemory({ ...newMemory, image_url: e.target.value })}
                    className="flex-1 px-3 py-2 rounded-xl bg-[#1f1d19] border border-[#f5f1ca]/15 text-[#f5f1ca] focus:outline-none focus:border-[#f2eb87]"
                  />
                </div>
              </div>

              <div className="flex items-end">
                <button
                  type="button"
                  onClick={handleAddMemoryPhoto}
                  className="w-full py-2.5 rounded-xl bg-[#f2eb87] text-[#161512] font-bold text-xs hover:bg-[#e6df73] transition-all flex items-center justify-center gap-1.5 shadow-md shadow-[#f2eb87]/20"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Momen</span>
                </button>
              </div>
            </div>

            {/* List of Active Memory Photos */}
            {formData.class_memories && formData.class_memories.length > 0 && (
              <div className="pt-3 border-t border-[#f5f1ca]/10 space-y-2">
                <span className="text-[11px] uppercase font-bold text-[#9e9a8d]">
                  Momen Terpasang ({formData.class_memories.length} Foto)
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {formData.class_memories.map((mem) => (
                    <div
                      key={mem.id}
                      className="group relative rounded-xl overflow-hidden border border-[#f5f1ca]/15 bg-[#1f1d19] flex flex-col"
                    >
                      <div className="aspect-[4/3] w-full overflow-hidden relative">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={mem.image_url}
                          alt={mem.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <button
                          type="button"
                          onClick={() => handleDeleteMemoryPhoto(mem.id)}
                          className="absolute top-1.5 right-1.5 p-1 rounded-lg bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Hapus foto kenangan ini"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="p-2 text-[11px]">
                        <span className="font-bold text-[#f5f1ca] block truncate">{mem.title}</span>
                        <span className="text-[10px] text-[#9e9a8d] block truncate">{mem.location || mem.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ============================================================================== */}
        {/* QUICK GALLERY UPLOAD & MANAGEMENT SECTION IN SETTINGS                          */}
        {/* ============================================================================== */}
        <div className="p-6 rounded-3xl bg-[#1f1d19] border border-[#f5f1ca]/12 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
            <h2 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-[#f2eb87]" />
              <span>Upload & Pengaturan Galeri Kegiatan</span>
            </h2>
            <span className="text-xs text-slate-500">
              Total {gallery.length} foto aktif di galeri publik
            </span>
          </div>

          {/* Upload New Gallery Photo Sub-form */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-[#f5f1ca]/12 space-y-4">
            <h3 className="font-bold text-xs uppercase tracking-wider text-cyan-600 dark:text-cyan-400 flex items-center gap-1.5">
              <Plus className="w-4 h-4" />
              <span>Unggah Foto Baru Beserta Rincian Deskripsi</span>
            </h3>

            {/* File Picker & URL */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Pilih File Foto *
              </label>
              <div className="flex flex-wrap items-center gap-3">
                <input
                  type="file"
                  ref={galleryInputRef}
                  onChange={handleGalleryPhotoUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => galleryInputRef.current?.click()}
                  disabled={uploadingGallery}
                  className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs flex items-center gap-2 shadow-sm transition-all"
                >
                  <Upload className="w-4 h-4" />
                  <span>{uploadingGallery ? 'Mengunggah...' : 'Pilih Foto dari Komputer'}</span>
                </button>
                <span className="text-[11px] text-slate-400">atau tempel link gambar di bawah</span>
              </div>

              <input
                type="text"
                placeholder="https://images.unsplash.com/... atau URL gambar lainnya"
                value={galleryFormData.image_url || ''}
                onChange={(e) =>
                  setGalleryFormData((prev) => ({ ...prev, image_url: e.target.value }))
                }
                className="w-full px-3 py-2 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />

              {galleryFormData.image_url && (
                <div className="relative aspect-[16/9] max-h-48 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-900 mt-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={galleryFormData.image_url}
                    alt="Preview Galeri"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>

            {/* Metadata Fields (Title & Category) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Judul Foto *
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Praktik Fusion Splicer Fiber Optic"
                  value={galleryFormData.title || ''}
                  onChange={(e) =>
                    setGalleryFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Kategori Dokumentasi
                </label>
                <select
                  value={galleryFormData.category || 'Praktik TKJ'}
                  onChange={(e) =>
                    setGalleryFormData((prev) => ({
                      ...prev,
                      category: e.target.value as GalleryCategory,
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                >
                  {GALLERY_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#f2eb87]" />
                  <span>Tanggal Kegiatan</span>
                </label>
                <input
                  type="date"
                  value={galleryFormData.date || ''}
                  onChange={(e) =>
                    setGalleryFormData((prev) => ({ ...prev, date: e.target.value }))
                  }
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#f2eb87]" />
                  <span>Lokasi Kegiatan</span>
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Server Room TKJ / Aula Sekolah"
                  value={galleryFormData.location || ''}
                  onChange={(e) =>
                    setGalleryFormData((prev) => ({ ...prev, location: e.target.value }))
                  }
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-[#f2eb87]" />
                  <span>Deskripsi Lengkap / Keterangan Momen</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="Ceritakan penjelasan momen, siapa saja yang terlibat, kegiatan praktikum apa yang dilakukan, dll..."
                  value={galleryFormData.description || galleryFormData.caption || ''}
                  onChange={(e) =>
                    setGalleryFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                      caption: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={handleAddGalleryItem}
                className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>Tambahkan Foto ke Galeri</span>
              </button>
            </div>
          </div>

          {/* Quick List of Active Gallery Items */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500">
              Daftar Foto Galeri Saat Ini ({gallery.length})
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {gallery.map((item) => (
                <div
                  key={item.id}
                  className="group relative rounded-xl overflow-hidden border border-[#f5f1ca]/12 bg-slate-900 flex flex-col justify-between"
                >
                  <div className="aspect-[4/3] w-full overflow-hidden relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <button
                      type="button"
                      onClick={() => setGalleryDeleteId(item.id)}
                      className="absolute top-1.5 right-1.5 p-1 rounded-lg bg-red-600/90 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Hapus foto ini"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="p-2 bg-[#1f1d19] text-[11px]">
                    <span className="font-bold text-slate-900 dark:text-white block truncate">
                      {item.title}
                    </span>
                    <span className="text-[10px] text-slate-400 block truncate">
                      {item.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* General Class Information */}
        <div className="p-6 rounded-3xl bg-[#1f1d19] border border-[#f5f1ca]/12 shadow-sm space-y-4">
          <h2 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-[#f2eb87]" />
            <span>Informasi Identitas Kelas</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Nama Kelas
              </label>
              <input
                type="text"
                value={formData.class_name}
                onChange={(e) => setFormData({ ...formData, class_name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Subjudul Program Keahlian
              </label>
              <input
                type="text"
                value={formData.class_subtitle}
                onChange={(e) => setFormData({ ...formData, class_subtitle: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Tahun Ajaran
              </label>
              <input
                type="text"
                value={formData.academic_year}
                onChange={(e) => setFormData({ ...formData, academic_year: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Wali Kelas
              </label>
              <input
                type="text"
                value={formData.homeroom_teacher}
                onChange={(e) => setFormData({ ...formData, homeroom_teacher: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Tagline Angkatan
              </label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Deskripsi / Slogan Kelas (Hero Quote)
              </label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Social Links & Contact */}
        <div className="p-6 rounded-3xl bg-[#1f1d19] border border-[#f5f1ca]/12 shadow-sm space-y-4">
          <h2 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <Mail className="w-5 h-5 text-[#f2eb87]" />
            <span>Kontak & Media Sosial</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Email Kelas
              </label>
              <input
                type="email"
                value={formData.contact_email || ''}
                onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Link Instagram
              </label>
              <input
                type="text"
                placeholder="https://instagram.com/..."
                value={formData.instagram_url || ''}
                onChange={(e) => setFormData({ ...formData, instagram_url: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Link TikTok
              </label>
              <input
                type="text"
                placeholder="https://www.tiktok.com/@..."
                value={formData.tiktok_url || ''}
                onChange={(e) => setFormData({ ...formData, tiktok_url: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Link GitHub
              </label>
              <input
                type="text"
                placeholder="https://github.com/..."
                value={formData.github_url || ''}
                onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Link YouTube
              </label>
              <input
                type="text"
                placeholder="https://youtube.com/..."
                value={formData.youtube_url || ''}
                onChange={(e) => setFormData({ ...formData, youtube_url: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* AI Chatbot & API Keys Configuration */}
        <div className="p-6 rounded-3xl bg-[#1f1d19] border border-[#f5f1ca]/15 shadow-xl space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#f5f1ca]/10">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-[#161512] border border-[#f2eb87]/30 text-[#f2eb87] flex items-center justify-center">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h2 className="font-serif-title font-bold text-lg text-[#f5f1ca] flex items-center gap-2">
                  <span>Konfigurasi AI Chatbot (Gemini, Groq, OpenRouter)</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-[#f2eb87]/15 text-[#f2eb87] border border-[#f2eb87]/30">
                    Active
                  </span>
                </h2>
                <p className="text-xs text-[#9e9a8d]">
                  Atur model bahasa dan API Key untuk maskot kucing router interaktif di sudut website.
                </p>
              </div>
            </div>

            <button
              type="button"
              disabled={testingAi}
              onClick={handleTestAi}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#161512] border border-[#f2eb87]/40 text-[#f2eb87] hover:bg-[#f2eb87] hover:text-[#111111] transition-all flex items-center gap-2 self-start sm:self-auto disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{testingAi ? 'Menguji Gateway...' : 'Uji Koneksi AI'}</span>
            </button>
          </div>

          {aiTestResult && (
            <div className="p-4 rounded-2xl bg-[#161512] border border-[#f2eb87]/30 text-xs text-[#d8d6c6] font-mono whitespace-pre-line space-y-1">
              <span className="text-[#f2eb87] font-bold block text-[11px] uppercase tracking-wider">Hasil Pengujian Gateway:</span>
              <span>{aiTestResult}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-[#f5f1ca] mb-1.5">
                Penyedia AI Aktif (Active Provider)
              </label>
              <select
                value={formData.active_ai_provider || 'mock'}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    active_ai_provider: e.target.value as any,
                  })
                }
                className="w-full px-3 py-2.5 rounded-xl bg-[#161512] border border-[#f5f1ca]/15 text-[#f5f1ca] focus:outline-none focus:border-[#f2eb87]"
              >
                <option value="mock">Offline Smart Knowledge Base (Bawaan Tanpa API Key)</option>
                <option value="gemini">Google Gemini AI (Studio / 1.5 Flash)</option>
                <option value="groq">Groq Fast Cloud (Llama 3.3 70B)</option>
                <option value="openrouter">OpenRouter Multi-Model (Llama 3.1 8B)</option>
              </select>
              <p className="text-[11px] text-[#9e9a8d] mt-1">
                Pilih provider yang akan merespons pertanyaan pengunjung.
              </p>
            </div>

            <div>
              <label className="block font-semibold text-[#f5f1ca] mb-1.5">
                Nama Maskot Bot
              </label>
              <input
                type="text"
                placeholder="Contoh: Ping-Ping si Kucing Router"
                value={formData.ai_bot_name || ''}
                onChange={(e) => setFormData({ ...formData, ai_bot_name: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-[#161512] border border-[#f5f1ca]/15 text-[#f5f1ca] focus:outline-none focus:border-[#f2eb87]"
              />
              <p className="text-[11px] text-[#9e9a8d] mt-1">
                Nama identitas maskot kucing saat menyapa pengunjung.
              </p>
            </div>

            <div className="sm:col-span-2 pt-2 border-t border-[#f5f1ca]/10 space-y-4">
              <div>
                <label className="block font-semibold text-[#f5f1ca] mb-1 flex items-center gap-2">
                  <Key className="w-3.5 h-3.5 text-[#f2eb87]" />
                  <span>Google Gemini API Key</span>
                  <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] text-[#f2eb87] underline hover:text-white"
                  >
                    (Dapatkan API Key Gratis di Google AI Studio)
                  </a>
                </label>
                <input
                  type="password"
                  placeholder="AIzaSy..."
                  value={formData.gemini_api_key || ''}
                  onChange={(e) => setFormData({ ...formData, gemini_api_key: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#161512] border border-[#f5f1ca]/15 text-[#f5f1ca] font-mono focus:outline-none focus:border-[#f2eb87]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#f5f1ca] mb-1 flex items-center gap-2">
                  <Key className="w-3.5 h-3.5 text-[#f2eb87]" />
                  <span>Groq Cloud API Key</span>
                  <a
                    href="https://console.groq.com/keys"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] text-[#f2eb87] underline hover:text-white"
                  >
                    (Dapatkan API Key Gratis di Groq Console)
                  </a>
                </label>
                <input
                  type="password"
                  placeholder="gsk_..."
                  value={formData.groq_api_key || ''}
                  onChange={(e) => setFormData({ ...formData, groq_api_key: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#161512] border border-[#f5f1ca]/15 text-[#f5f1ca] font-mono focus:outline-none focus:border-[#f2eb87]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#f5f1ca] mb-1 flex items-center gap-2">
                  <Key className="w-3.5 h-3.5 text-[#f2eb87]" />
                  <span>OpenRouter API Key</span>
                  <a
                    href="https://openrouter.ai/keys"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] text-[#f2eb87] underline hover:text-white"
                  >
                    (Dapatkan API Key di OpenRouter)
                  </a>
                </label>
                <input
                  type="password"
                  placeholder="sk-or-v1-..."
                  value={formData.openrouter_api_key || ''}
                  onChange={(e) => setFormData({ ...formData, openrouter_api_key: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#161512] border border-[#f5f1ca]/15 text-[#f5f1ca] font-mono focus:outline-none focus:border-[#f2eb87]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-between pt-4">
          <button
            type="button"
            onClick={() => setResetConfirmOpen(true)}
            className="px-4 py-2.5 rounded-xl border border-red-500/30 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 text-xs font-semibold flex items-center gap-2 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset ke Seed Database Awal (34 Siswa)</span>
          </button>

          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-[#f2eb87] hover:bg-[#e6df73] text-[#161512] font-bold text-xs shadow-md shadow-[#f2eb87]/20 flex items-center gap-2 transition-all active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Seluruh Pengaturan</span>
          </button>
        </div>
      </form>

      {/* GALLERY DELETE CONFIRMATION */}
      {galleryDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setGalleryDeleteId(null)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />
          <div className="relative w-full max-w-sm bg-[#1f1d19] border border-[#f5f1ca]/12 rounded-3xl p-6 shadow-2xl z-10 space-y-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-red-500 border border-red-500/20 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Hapus Foto Galeri?
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Foto dokumentasi ini akan dihapus dari galeri publik kelas.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setGalleryDeleteId(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteGallery}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-red-600 hover:bg-red-500 text-white shadow-md shadow-red-600/20"
              >
                Hapus Foto
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RESET SEED CONFIRMATION DIALOG */}
      {resetConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setResetConfirmOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />
          <div className="relative w-full max-w-sm bg-[#1f1d19] border border-[#f5f1ca]/12 rounded-3xl p-6 shadow-2xl z-10 space-y-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-red-500 border border-red-500/20 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Konfirmasi Reset Database
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Tindakan ini akan mengembalikan seluruh data (siswa, struktur, pengumuman, agenda, galeri) ke seed resmi awal. Lanjutkan?
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setResetConfirmOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleResetSeed}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-red-600 hover:bg-red-500 text-white shadow-md shadow-red-600/20"
              >
                Ya, Reset Sekarang
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
