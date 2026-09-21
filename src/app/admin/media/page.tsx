'use client';

import React, { useState, useMemo, useRef } from 'react';
import { useClassData } from '@/context/ClassDataContext';
import { motion, AnimatePresence } from 'framer-motion';
import { optimizeImageForUpload } from '@/lib/image-optimizer';
import {
  FolderOpen,
  Upload,
  Search,
  Copy,
  Check,
  ExternalLink,
  Eye,
  CheckCircle2,
  X,
  Sparkles,
} from 'lucide-react';

interface MediaFile {
  id: string;
  url: string;
  name: string;
  source: 'Siswa' | 'Galeri' | 'Pengumuman' | 'Brand (Logo/Hero)' | 'Upload';
  date?: string;
}

export default function AdminMediaPage() {
  const { students, gallery, announcements, settings } = useClassData();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [previewMedia, setPreviewMedia] = useState<MediaFile | null>(null);
  const [uploading, setUploading] = useState(false);
  const [customUploads, setCustomUploads] = useState<MediaFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Aggregate all media assets currently active in the app
  const allMedia = useMemo(() => {
    const list: MediaFile[] = [];

    // 1. Brand assets
    if (settings.logo_url) {
      list.push({
        id: 'brand-logo',
        url: settings.logo_url,
        name: 'Logo Kelas XII TKJ',
        source: 'Brand (Logo/Hero)',
      });
    }
    if (settings.hero_image_url) {
      list.push({
        id: 'brand-hero',
        url: settings.hero_image_url,
        name: 'Hero Banner Kelas',
        source: 'Brand (Logo/Hero)',
      });
    }

    // 2. Student photos
    (students || []).forEach((s) => {
      if (s.photo_url) {
        list.push({
          id: `std-photo-${s.id}`,
          url: s.photo_url,
          name: `Foto Siswa - ${s.name}`,
          source: 'Siswa',
        });
      }
    });

    // 3. Gallery photos
    (gallery || []).forEach((g) => {
      if (g.image_url) {
        list.push({
          id: `gal-photo-${g.id}`,
          url: g.image_url,
          name: g.title,
          source: 'Galeri',
          date: g.created_at,
        });
      }
    });

    // 4. Announcement covers
    (announcements || []).forEach((a) => {
      if (a.cover_url) {
        list.push({
          id: `ann-photo-${a.id}`,
          url: a.cover_url,
          name: `Cover - ${a.title}`,
          source: 'Pengumuman',
        });
      }
    });

    // 5. Custom uploaded items in this session
    (customUploads || []).forEach((c) => list.unshift(c));

    return list;
  }, [students, gallery, announcements, settings, customUploads]);

  const filteredMedia = useMemo(() => {
    return allMedia.filter((item) => {
      const matchQuery = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchFilter = selectedFilter === 'all' || item.source === selectedFilter;
      return matchQuery && matchFilter;
    });
  }, [allMedia, searchQuery, selectedFilter]);

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2500);
  };

  const handleDirectUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawFile = e.target.files?.[0];
    if (!rawFile) return;

    setUploading(true);
    try {
      const file = await optimizeImageForUpload(rawFile, 1400, 0.82);
      const body = new FormData();
      body.append('file', file);
      body.append('category', 'media-center');

      const res = await fetch('/api/upload', { method: 'POST', body });
      const json = await res.json();
      if (json.success && json.url) {
        const newItem: MediaFile = {
          id: `custom-${Date.now()}`,
          url: json.url,
          name: rawFile.name,
          source: 'Upload',
          date: new Date().toISOString(),
        };
        setCustomUploads((prev) => [newItem, ...prev]);
        setCopiedUrl(json.url);
        setTimeout(() => setCopiedUrl(null), 3000);
      } else {
        alert(json.error || 'Gagal mengupload media.');
      }
    } catch (err: any) {
      alert('Error saat mengunggah: ' + err.message);
    } finally {
      setUploading(false);
      if (e.target) e.target.value = '';
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full min-w-0">
      {/* Header & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#1f1d19] text-[#f2eb87] border border-[#f2eb87]/30 mb-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="uppercase tracking-widest text-[10px]">PENYIMPANAN MEDIA</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif-title font-bold text-[#f5f1ca]">
            Media Manager (Aset Visual)
          </h1>
          <p className="text-xs sm:text-sm text-[#9e9a8d]">
            Pusat manajemen seluruh aset gambar: foto siswa, hero banner, logo, dan dokumentasi kegiatan.
          </p>
        </div>

        <div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleDirectUpload}
            accept="image/*"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#f2eb87] hover:bg-[#e6df73] text-[#161512] text-xs font-bold shadow-md shadow-[#f2eb87]/20 transition-all active:scale-95"
          >
            <Upload className="w-4 h-4" />
            <span>{uploading ? 'Mengunggah...' : 'Upload Media Baru'}</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#1f1d19] border border-[#f5f1ca]/12 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#9e9a8d] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari nama aset media..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl text-xs bg-[#161512] border border-[#f5f1ca]/15 text-[#f5f1ca] placeholder-[#9e9a8d]/60 focus:outline-none focus:border-[#f2eb87] transition-all"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 w-full md:w-auto hide-scrollbar">
          {['all', 'Siswa', 'Galeri', 'Brand (Logo/Hero)', 'Pengumuman', 'Upload'].map((f) => (
            <button
              key={f}
              onClick={() => setSelectedFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedFilter === f
                  ? 'bg-[#f2eb87] text-[#161512] font-bold shadow-sm'
                  : 'bg-[#161512] text-[#9e9a8d] hover:text-[#f5f1ca]'
              }`}
            >
              {f === 'all' ? `Semua (${allMedia.length})` : f}
            </button>
          ))}
        </div>
      </div>

      {/* Media Grid */}
      {filteredMedia.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-[#1f1d19] border border-[#f5f1ca]/12 text-[#9e9a8d] space-y-2">
          <FolderOpen className="w-10 h-10 mx-auto text-[#f2eb87]/40 mb-2" />
          <p className="font-semibold text-[#f5f1ca]">
            Tidak ada aset media ditemukan
          </p>
          <p className="text-xs text-[#9e9a8d]">
            Foto siswa, galeri, dan logo yang diunggah akan otomatis muncul di sini.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredMedia.map((media) => (
            <div
              key={media.id}
              className="group relative rounded-2xl overflow-hidden bg-[#1f1d19] border border-[#f5f1ca]/12 hover:border-[#f2eb87]/50 shadow-sm transition-all flex flex-col justify-between"
            >
              <div className="aspect-square relative bg-[#161512] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={media.url}
                  alt={media.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-full text-[9px] font-bold bg-black/80 text-[#f2eb87] border border-[#f2eb87]/30">
                  {media.source}
                </span>

                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={() => setPreviewMedia(media)}
                    className="p-1.5 rounded-lg bg-black/60 text-white hover:bg-black"
                    title="Lihat Penuh"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleCopy(media.url)}
                    className="p-1.5 rounded-lg bg-black/60 text-white hover:bg-black"
                    title="Salin URL"
                  >
                    {copiedUrl === media.url ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="p-2.5 bg-[#161512] border-t border-[#f5f1ca]/10">
                <span className="text-[11px] font-bold text-[#f5f1ca] truncate block">
                  {media.name}
                </span>
                <span className="text-[9px] text-[#9e9a8d] block truncate">
                  {media.url.slice(-25)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Media Preview Modal */}
      <AnimatePresence>
        {previewMedia && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPreviewMedia(null)}
              className="fixed inset-0 bg-black/85 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative max-w-2xl w-full bg-[#1f1d19] border border-[#f5f1ca]/15 rounded-3xl p-5 z-10 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-serif-title font-bold text-base text-[#f5f1ca]">
                    {previewMedia.name}
                  </h4>
                  <span className="text-[11px] text-[#f2eb87]">{previewMedia.source}</span>
                </div>
                <button
                  onClick={() => setPreviewMedia(null)}
                  className="p-1 text-[#9e9a8d] hover:text-[#f5f1ca]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="max-h-[60vh] overflow-hidden rounded-2xl bg-[#161512] flex items-center justify-center border border-[#f5f1ca]/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewMedia.url}
                  alt={previewMedia.name}
                  className="max-h-[60vh] w-auto object-contain"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <input
                  type="text"
                  readOnly
                  value={previewMedia.url}
                  className="w-3/4 px-3 py-1.5 rounded-xl text-xs bg-[#161512] border border-[#f5f1ca]/15 text-[#f5f1ca]"
                />
                <button
                  onClick={() => handleCopy(previewMedia.url)}
                  className="px-3.5 py-1.5 rounded-xl bg-[#f2eb87] text-[#161512] font-bold text-xs hover:bg-[#e6df73] transition-colors"
                >
                  Salin URL
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
