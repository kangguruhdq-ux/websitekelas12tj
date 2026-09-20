'use client';

import React from 'react';
import { useClassData } from '@/context/ClassDataContext';
import { formatDate } from '@/lib/utils';
import { motion } from 'framer-motion';
import {
  Bell,
  Calendar,
  Image as ImageIcon,
  ArrowRight,
  Clock,
  MapPin,
  Sparkles,
} from 'lucide-react';

export default function HomeHighlights() {
  const { announcements, events, gallery } = useClassData();

  const publishedAnnouncements = announcements.filter((a) => a.is_published).slice(0, 3);
  const upcomingEvents = events.slice(0, 3);
  const recentGallery = gallery.slice(0, 4);

  return (
    <div className="space-y-24 py-16 transition-colors duration-300" style={{ backgroundColor: 'var(--bg-primary)' }}>
      {/* 1. Announcements & Agenda Grid (BEM FEB UI Student Info & Programs Style) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Announcements Column */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 space-y-6"
          >
            <div className="flex items-center justify-between border-b border-[#f5f1ca]/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-[#1f1d19] text-[#f2eb87] border border-[#f2eb87]/30">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-serif-title font-bold text-[#f5f1ca]">
                    Warta & Pengumuman
                  </h3>
                  <p className="text-xs text-[#9e9a8d]">
                    Publikasi resmi dan informasi kelas terkini
                  </p>
                </div>
              </div>

              <a
                href="/pengumuman"
                className="text-xs font-semibold text-[#f2eb87] hover:underline flex items-center gap-1"
              >
                <span>Lihat Semua</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>

            {publishedAnnouncements.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-[#1f1d19] border border-[#f5f1ca]/10 text-[#9e9a8d] text-sm">
                Belum ada pengumuman terbaru.
              </div>
            ) : (
              <div className="space-y-3.5">
                {publishedAnnouncements.map((item) => (
                  <motion.div
                    key={item.id}
                    whileHover={{ y: -3 }}
                    transition={{ duration: 0.2 }}
                    className="p-5 rounded-2xl bg-[#1f1d19] border border-[#f5f1ca]/12 hover:border-[#f2eb87]/50 hover:shadow-[0_12px_30px_-10px_rgba(242,235,135,0.15)] transition-all space-y-2.5 group cursor-pointer"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="px-2.5 py-0.5 rounded-full font-semibold uppercase text-[10px] bg-[#161512] text-[#f2eb87] border border-[#f2eb87]/30">
                        {item.category || 'Warta Kelas'}
                      </span>
                      <span className="text-[#9e9a8d] font-mono text-[11px]">
                        {formatDate(item.published_at || item.created_at)}
                      </span>
                    </div>

                    <h4 className="font-serif-title font-bold text-lg text-[#f5f1ca] group-hover:text-[#f2eb87] transition-colors leading-snug">
                      {item.title}
                    </h4>

                    <p className="text-xs text-[#d8d6c6]/80 line-clamp-2 leading-relaxed">
                      {item.content}
                    </p>

                    <div className="pt-2 text-[11px] font-medium text-[#9e9a8d] flex items-center justify-between border-t border-[#f5f1ca]/5">
                      <span>Penulis: <strong className="text-[#d8d6c6]">{item.author}</strong></span>
                      <a
                        href="/pengumuman"
                        className="text-[#f2eb87] group-hover:underline flex items-center gap-1 font-semibold"
                      >
                        <span>Baca Selengkapnya</span>
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                      </a>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Agenda & Programs Column */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-6 space-y-6"
          >
            <div className="flex items-center justify-between border-b border-[#f5f1ca]/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-[#1f1d19] text-[#f5f1ca] border border-[#f5f1ca]/30">
                  <Calendar className="w-5 h-5 text-[#f2eb87]" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-serif-title font-bold text-[#f5f1ca]">
                    Program Kerja & Agenda
                  </h3>
                  <p className="text-xs text-[#9e9a8d]">
                    Jadwal praktikum, kegiatan organisasi, dan ujian
                  </p>
                </div>
              </div>

              <a
                href="/agenda"
                className="text-xs font-semibold text-[#f2eb87] hover:underline flex items-center gap-1"
              >
                <span>Lihat Semua</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>

            {upcomingEvents.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-[#1f1d19] border border-[#f5f1ca]/10 text-[#9e9a8d] text-sm">
                Belum ada agenda mendatang.
              </div>
            ) : (
              <div className="space-y-3.5">
                {upcomingEvents.map((item) => (
                  <motion.div
                    key={item.id}
                    whileHover={{ y: -3 }}
                    transition={{ duration: 0.2 }}
                    className="p-5 rounded-2xl bg-[#1f1d19] border border-[#f5f1ca]/12 hover:border-[#f2eb87]/50 hover:shadow-[0_12px_30px_-10px_rgba(242,235,135,0.15)] transition-all space-y-2.5 group cursor-pointer"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="px-2.5 py-0.5 rounded-full font-semibold uppercase text-[10px] bg-[#161512] text-[#f5f1ca] border border-[#f5f1ca]/20">
                        {item.category}
                      </span>
                      <span className="text-[#f2eb87] font-mono text-[11px] font-semibold">
                        {formatDate(item.event_date)}
                      </span>
                    </div>

                    <h4 className="font-serif-title font-bold text-lg text-[#f5f1ca] group-hover:text-[#f2eb87] transition-colors leading-snug">
                      {item.title}
                    </h4>

                    <p className="text-xs text-[#d8d6c6]/80 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>

                    <div className="pt-2 flex flex-wrap items-center gap-4 text-[11px] text-[#9e9a8d] border-t border-[#f5f1ca]/5">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#f2eb87]" />
                        <span>{item.event_time}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#f2eb87]" />
                        <span>{item.location}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* 2. Gallery Teaser Showcase (BEM FEB UI Visual Showcase) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#f5f1ca]/10 pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#1f1d19] text-[#f2eb87] border border-[#f2eb87]/30 mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span className="uppercase tracking-widest text-[10px]">Dokumentasi Momen</span>
              </div>
              <h3 className="text-2xl sm:text-4xl font-serif-title font-bold text-[#f5f1ca]">
                Galeri Kegiatan & Praktikum
              </h3>
              <p className="text-xs sm:text-sm text-[#9e9a8d]">
                Dokumentasi visual kebersamaan, sertifikasi jaringan, dan karya siswa XII TKJ.
              </p>
            </div>

            <a
              href="/galeri"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-[#1f1d19] border border-[#f5f1ca]/15 text-[#f5f1ca] hover:border-[#f2eb87] hover:text-[#f2eb87] transition-all self-start sm:self-auto"
            >
              <ImageIcon className="w-3.5 h-3.5 text-[#f2eb87]" />
              <span>Lihat Semua Foto ({gallery.length})</span>
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {recentGallery.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                whileHover={{ y: -5 }}
                className="group relative aspect-[4/3] rounded-2xl overflow-hidden bg-[#1f1d19] border border-[#f5f1ca]/15 shadow-md cursor-pointer"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-80 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#f2eb87] text-[#111111] self-start mb-1.5">
                    {item.category}
                  </span>
                  <h4 className="text-[#f5f1ca] font-serif-title text-sm font-bold line-clamp-1">
                    {item.title}
                  </h4>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>
    </div>
  );
}
