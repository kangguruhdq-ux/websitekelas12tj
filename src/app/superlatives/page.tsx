'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useClassData } from '@/context/ClassDataContext';
import {
  Trophy,
  Zap,
  Wifi,
  Mic,
  Cpu,
  Shield,
  Sparkles,
  Heart,
  Award,
  ThumbsUp,
} from 'lucide-react';

const ICON_MAP: Record<string, any> = {
  Zap,
  Wifi,
  Mic,
  Cpu,
  Shield,
  Sparkles,
};

export default function SuperlativesPage() {
  const { superlatives, voteSuperlative, settings } = useClassData();

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="min-h-screen bg-[#161512] text-[#d8d6c6] pt-28 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
    >
      {/* Background Ambience */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-[#f2eb87]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-[#1f1d19] text-[#f2eb87] border border-[#f2eb87]/30">
            <Trophy className="w-3.5 h-3.5" />
            <span className="uppercase tracking-widest text-[10px]">HALL OF FAME & SUPERLATIVES</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif-title font-bold text-[#f5f1ca]">
            Gelar Kehormatan & &ldquo;Si Paling&rdquo; XII TKJ
          </h1>
          <p className="text-xs sm:text-sm text-[#9e9a8d] leading-relaxed">
            Apresiasi seru dan penghargaan predikat terunik untuk rekan-rekan seperjuangan di laboratorium dan kelas. Berikan apresiasi suaramu!
          </p>
        </div>

        {/* Superlatives Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {superlatives.map((item, idx) => {
            const IconComponent = ICON_MAP[item.badge_icon] || Award;
            return (
              <motion.div
                key={item.id}
                whileHover={{ y: -5 }}
                className="p-6 sm:p-8 rounded-3xl bg-[#1f1d19] border border-[#f5f1ca]/12 hover:border-[#f2eb87]/60 transition-all shadow-xl space-y-5 flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  {/* Top Badge */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#161512] text-[#f2eb87] border border-[#f2eb87]/30">
                      {item.category}
                    </span>
                    <span className="text-xs font-serif-title font-bold text-[#9e9a8d]">
                      #0{idx + 1}
                    </span>
                  </div>

                  {/* Icon & Title */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#161512] border border-[#f2eb87]/40 text-[#f2eb87] flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:border-[#f2eb87] transition-all shadow-inner">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-serif-title font-bold text-lg text-[#f5f1ca] group-hover:text-[#f2eb87] transition-colors leading-snug">
                        {item.title}
                      </h3>
                      <p className="text-xs font-semibold text-[#f2eb87] mt-0.5">
                        Pemenang: {item.student_name}
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-[#d8d6c6]/80 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Vote Action */}
                <div className="pt-4 border-t border-[#f5f1ca]/10 flex items-center justify-between">
                  <span className="text-xs text-[#9e9a8d] font-mono">
                    <strong className="text-[#f5f1ca] font-bold">{item.votes}</strong> Apresiasi
                  </span>

                  <button
                    onClick={() => voteSuperlative(item.id)}
                    className="px-4 py-2 rounded-xl bg-[#161512] border border-[#f5f1ca]/15 text-[#f5f1ca] hover:border-[#f2eb87] hover:text-[#f2eb87] text-xs font-semibold transition-all flex items-center gap-1.5 active:scale-95"
                  >
                    <ThumbsUp className="w-3.5 h-3.5 text-[#f2eb87]" />
                    <span>Dukung</span>
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
