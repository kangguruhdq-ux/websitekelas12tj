'use client';

import React, { useState, useMemo } from 'react';
import { useClassData } from '@/context/ClassDataContext';
import { formatDate } from '@/lib/utils';
import { motion } from 'framer-motion';
import {
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  Hourglass,
  CheckCircle2,
} from 'lucide-react';

export default function AgendaPage() {
  const { events } = useClassData();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { label: 'Semua Agenda', value: 'all' },
    { label: 'Ujian & Sertifikasi', value: 'ujian' },
    { label: 'Kegiatan Kelas', value: 'kegiatan' },
    { label: 'Rapat Koordinasi', value: 'rapat' },
    { label: 'Piket & Kebersihan', value: 'piket' },
    { label: 'Sekolah & Eksternal', value: 'sekolah' },
  ];

  const filteredEvents = useMemo(() => {
    return events.filter((ev) => {
      if (selectedCategory === 'all') return true;
      return ev.category === selectedCategory;
    });
  }, [events, selectedCategory]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'upcoming':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-[#161512] text-[#f2eb87] border border-[#f2eb87]/30">
            <Hourglass className="w-3 h-3" />
            <span>Mendatang</span>
          </span>
        );
      case 'ongoing':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-[#161512] text-amber-400 border border-amber-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span>Berlangsung</span>
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-[#161512] text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-3 h-3" />
            <span>Selesai</span>
          </span>
        );
      default:
        return null;
    }
  };

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
            <span className="uppercase tracking-widest text-[10px]">PROGRAMS & CALENDAR</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif-title font-bold tracking-tight text-[#f5f1ca]">
            Program Kerja & Agenda Kegiatan
          </h1>
          <p className="text-xs sm:text-base text-[#9e9a8d] max-w-2xl leading-relaxed">
            Kalender program kerja, jadwal sertifikasi internasional (MikroTik/Cisco), agenda ujian kompetensi, serta kegiatan kelas XII TKJ.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 hide-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.value
                  ? 'bg-[#f2eb87] text-[#111111] font-bold shadow-md'
                  : 'bg-[#1f1d19] text-[#d8d6c6] border border-[#f5f1ca]/12 hover:border-[#f2eb87]/40'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Agenda Events Timeline List */}
        {filteredEvents.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-[#1f1d19] border border-[#f5f1ca]/15 text-[#9e9a8d] space-y-3">
            <Calendar className="w-8 h-8 mx-auto text-[#f2eb87]" />
            <p className="text-sm">Tidak ada agenda pada kategori ini.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredEvents.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="p-6 rounded-3xl bg-[#1f1d19] border border-[#f5f1ca]/12 hover:border-[#f2eb87]/50 transition-all flex flex-col md:flex-row md:items-center justify-between gap-5 group"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#161512] text-[#f2eb87] border border-[#f2eb87]/30">
                      {item.category}
                    </span>
                    {getStatusBadge(item.status)}
                  </div>

                  <h3 className="font-serif-title font-bold text-xl text-[#f5f1ca] group-hover:text-[#f2eb87] transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-xs text-[#d8d6c6]/80 leading-relaxed max-w-2xl">
                    {item.description}
                  </p>
                </div>

                {/* Right: Date, Time & Location Pill */}
                <div className="flex md:flex-col items-start md:items-end justify-between gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-[#f5f1ca]/10 text-xs">
                  <div className="flex items-center gap-1.5 text-[#f2eb87] font-semibold">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{formatDate(item.event_date)}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[#9e9a8d]">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{item.event_time}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[#9e9a8d]">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{item.location}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
