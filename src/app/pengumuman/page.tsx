'use client';

import React, { useState, useMemo } from 'react';
import { useClassData } from '@/context/ClassDataContext';
import { formatDate } from '@/lib/utils';
import { Announcement } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  Search,
  Calendar,
  User,
  Sparkles,
  ArrowRight,
  X,
} from 'lucide-react';

export default function PengumumanPage() {
  const { announcements } = useClassData();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<Announcement | null>(null);

  const published = useMemo(() => {
    return announcements
      .filter((a) => a.is_published)
      .filter(
        (a) =>
          a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => new Date(b.published_at || b.created_at).getTime() - new Date(a.published_at || a.created_at).getTime());
  }, [announcements, searchQuery]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="min-h-screen py-12 sm:py-20 bem-grid bg-[#161512] text-[#d8d6c6]"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="text-center sm:text-left space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#1f1d19] text-[#f2eb87] border border-[#f2eb87]/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="uppercase tracking-widest text-[10px]">ARTICLES & STUDENT INFO</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif-title font-bold tracking-tight text-[#f5f1ca]">
            Warta & Pengumuman Resmi
          </h1>
          <p className="text-xs sm:text-base text-[#9e9a8d] max-w-2xl leading-relaxed">
            Edaran resmi wali kelas, kebijakan administrasi kas, informasi ujian kompetensi keahlian, dan warta kegiatan kelas XII TKJ.
          </p>
        </div>

        {/* Search */}
        <div className="p-4 sm:p-5 rounded-3xl bg-[#1f1d19] border border-[#f5f1ca]/15 shadow-xl max-w-md">
          <div className="relative">
            <Search className="w-4 h-4 text-[#9e9a8d] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari pengumuman..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl text-xs bg-[#161512] border border-[#f5f1ca]/15 text-[#f5f1ca] placeholder-[#9e9a8d]/60 focus:outline-none focus:border-[#f2eb87] transition-all"
            />
          </div>
        </div>

        {/* Announcements List */}
        {published.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-[#1f1d19] border border-[#f5f1ca]/15 text-[#9e9a8d] space-y-2">
            <Bell className="w-8 h-8 mx-auto text-[#f2eb87] mb-2" />
            <p className="font-serif-title text-base font-bold text-[#f5f1ca]">
              Tidak ada pengumuman ditemukan
            </p>
            <p className="text-xs text-[#9e9a8d]">
              Pengumuman baru akan segera dipublikasikan melalui Portal Admin.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {published.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                onClick={() => setSelectedItem(item)}
                className="group p-6 rounded-3xl bg-[#1f1d19] border border-[#f5f1ca]/12 hover:border-[#f2eb87]/50 shadow-sm transition-all cursor-pointer flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="px-2.5 py-0.5 rounded-full font-semibold uppercase text-[10px] bg-[#161512] text-[#f2eb87] border border-[#f2eb87]/30">
                      {item.category || 'Warta Kelas'}
                    </span>
                    <span className="text-[#9e9a8d] font-mono text-[11px]">
                      {formatDate(item.published_at || item.created_at)}
                    </span>
                  </div>

                  <h3 className="font-serif-title text-xl font-bold text-[#f5f1ca] group-hover:text-[#f2eb87] transition-colors line-clamp-2 leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-xs text-[#d8d6c6]/80 line-clamp-3 leading-relaxed">
                    {item.content}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#f5f1ca]/10 flex items-center justify-between text-xs text-[#9e9a8d]">
                  <span>Oleh: <strong className="text-[#d8d6c6]">{item.author}</strong></span>
                  <span className="text-[#f2eb87] group-hover:underline flex items-center gap-1 font-semibold">
                    <span>Baca Lengkap</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Detail Pengumuman */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedItem(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-2xl bg-[#1f1d19] border border-[#f5f1ca]/20 rounded-3xl shadow-2xl p-6 sm:p-8 z-10 max-h-[90vh] flex flex-col space-y-5"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#f5f1ca]/10">
                <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#161512] text-[#f2eb87] border border-[#f2eb87]/30">
                  {selectedItem.category || 'Warta Kelas'}
                </span>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="p-1.5 rounded-full bg-[#161512] text-[#f5f1ca] hover:text-[#f2eb87] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-2">
                <h2 className="font-serif-title text-2xl sm:text-3xl font-bold text-[#f5f1ca] leading-snug">
                  {selectedItem.title}
                </h2>
                <div className="flex items-center gap-4 text-xs text-[#9e9a8d] pt-1">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#f2eb87]" />
                    <span>{formatDate(selectedItem.published_at || selectedItem.created_at)}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#f2eb87]" />
                    <span>Penulis: {selectedItem.author}</span>
                  </div>
                </div>
              </div>

              <div className="overflow-y-auto pr-2 text-sm text-[#d8d6c6] leading-relaxed whitespace-pre-line border-t border-[#f5f1ca]/10 pt-4 max-h-[55vh]">
                {selectedItem.content}
              </div>

              <div className="pt-4 border-t border-[#f5f1ca]/10 flex justify-end">
                <button
                  onClick={() => setSelectedItem(null)}
                  className="px-5 py-2 rounded-xl bg-[#f2eb87] text-[#111111] font-bold text-xs hover:bg-[#e6df73] transition-colors"
                >
                  Tutup
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
