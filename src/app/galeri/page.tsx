'use client';

import React, { useState, useMemo } from 'react';
import { useClassData } from '@/context/ClassDataContext';
import { GalleryItem } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Image as ImageIcon,
  Sparkles,
  X,
  ChevronLeft,
  ChevronRight,
  Calendar,
  MapPin,
  FileText,
} from 'lucide-react';

const CATEGORIES = [
  'Semua',
  'Kegiatan Kelas',
  'Praktik TKJ',
  'Sekolah',
  'Event',
  'Kebersamaan',
  'Lainnya',
];

export default function GaleriPage() {
  const { gallery } = useClassData();
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filteredItems = useMemo(() => {
    if (selectedCategory === 'Semua') return gallery;
    return gallery.filter((item) => item.category === selectedCategory);
  }, [gallery, selectedCategory]);

  const activePhoto = lightboxIndex !== null ? filteredItems[lightboxIndex] : null;

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((prev) => (prev! > 0 ? prev! - 1 : filteredItems.length - 1));
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((prev) => (prev! < filteredItems.length - 1 ? prev! + 1 : 0));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="min-h-screen py-12 sm:py-20 bem-grid bg-[#161512] text-[#d8d6c6]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="text-center sm:text-left space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#1f1d19] text-[#f2eb87] border border-[#f2eb87]/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="uppercase tracking-widest text-[10px]">VISUAL DOCUMENTATION</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif-title font-bold tracking-tight text-[#f5f1ca]">
            Galeri & Dokumentasi Kegiatan
          </h1>
          <p className="text-xs sm:text-base text-[#9e9a8d] max-w-2xl leading-relaxed">
            Arsip visual kebersamaan, praktikum laboratorium jaringan, konfigurasi server, serta perjalanan angkatan kelas XII TKJ.
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 hide-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-[#f2eb87] text-[#111111] font-bold shadow-md'
                  : 'bg-[#1f1d19] text-[#d8d6c6] border border-[#f5f1ca]/12 hover:border-[#f2eb87]/40'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        {filteredItems.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-[#1f1d19] border border-[#f5f1ca]/15 text-[#9e9a8d] space-y-2">
            <ImageIcon className="w-8 h-8 mx-auto text-[#f2eb87] mb-2" />
            <p className="font-serif-title text-base font-bold text-[#f5f1ca]">
              Belum ada dokumentasi pada kategori ini
            </p>
            <p className="text-xs text-[#9e9a8d]">
              Dokumentasi foto dapat ditambahkan melalui panel admin.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                whileHover={{ y: -4 }}
                onClick={() => setLightboxIndex(idx)}
                className="group relative aspect-[4/3] rounded-3xl overflow-hidden bg-[#1f1d19] border border-[#f5f1ca]/15 hover:border-[#f2eb87] shadow-lg cursor-pointer transition-all"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent opacity-80 group-hover:opacity-100 transition-opacity p-5 flex flex-col justify-end">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded bg-[#f2eb87] text-[#111111] self-start mb-2">
                    {item.category}
                  </span>
                  <h3 className="font-serif-title font-bold text-base text-[#f5f1ca] line-clamp-1">
                    {item.title}
                  </h3>
                  {(item.description || item.caption) && (
                    <p className="text-xs text-[#d8d6c6]/80 line-clamp-2 mt-1 leading-relaxed">
                      {item.description || item.caption}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Lightbox Modal */}
        <AnimatePresence>
          {lightboxIndex !== null && activePhoto && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setLightboxIndex(null)}
                className="fixed inset-0 bg-black/90 backdrop-blur-md"
              />

              {/* Close Button */}
              <button
                onClick={() => setLightboxIndex(null)}
                className="absolute top-4 right-4 z-50 p-2.5 rounded-full bg-[#161512] text-[#f5f1ca] hover:text-[#f2eb87] transition-colors"
                aria-label="Tutup"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Prev Button */}
              <button
                onClick={handlePrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-[#161512] border border-[#f5f1ca]/20 text-[#f5f1ca] hover:text-[#f2eb87] hover:border-[#f2eb87] transition-all active:scale-95"
                aria-label="Foto Sebelumnya"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              {/* Next Button */}
              <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-[#161512] border border-[#f5f1ca]/20 text-[#f5f1ca] hover:text-[#f2eb87] hover:border-[#f2eb87] transition-all active:scale-95"
                aria-label="Foto Selanjutnya"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Image Container */}
              <motion.div
                key={activePhoto.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative z-10 max-w-4xl max-h-[85vh] flex flex-col rounded-3xl overflow-hidden bg-[#1f1d19] border border-[#f5f1ca]/20 shadow-2xl"
              >
                <div className="relative overflow-hidden flex items-center justify-center bg-black/70 max-h-[60vh]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={activePhoto.image_url}
                    alt={activePhoto.title}
                    className="max-h-[60vh] w-auto max-w-full object-contain"
                  />
                </div>

                {/* Lightbox Caption & Details Bar */}
                <div className="p-5 sm:p-6 bg-[#1f1d19] text-[#d8d6c6] space-y-2 border-t border-[#f5f1ca]/10">
                  <div className="flex items-center justify-between text-xs">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#161512] text-[#f2eb87] border border-[#f2eb87]/30 font-bold uppercase text-[10px]">
                      {activePhoto.category}
                    </span>
                    <span className="text-[#9e9a8d]">
                      {lightboxIndex! + 1} dari {filteredItems.length} foto
                    </span>
                  </div>

                  <h3 className="font-serif-title text-xl font-bold text-[#f5f1ca]">
                    {activePhoto.title}
                  </h3>

                  {(activePhoto.description || activePhoto.caption) && (
                    <p className="text-xs sm:text-sm text-[#d8d6c6]/80 leading-relaxed">
                      {activePhoto.description || activePhoto.caption}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center gap-4 text-[11px] text-[#9e9a8d] pt-2 border-t border-[#f5f1ca]/10">
                    {activePhoto.date && (
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#f2eb87]" />
                        <span>{activePhoto.date}</span>
                      </div>
                    )}
                    {activePhoto.location && (
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#f2eb87]" />
                        <span>{activePhoto.location}</span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
