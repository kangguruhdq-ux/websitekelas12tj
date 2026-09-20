'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Award, GraduationCap } from 'lucide-react';
import { useClassData } from '@/context/ClassDataContext';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function MilestoneCountdown() {
  const { settings } = useClassData();

  // Dynamic targets from admin settings with fallback
  const ukkTargetString = settings.milestone_ukk_date || '2027-02-20T08:00:00Z';
  const gradTargetString = settings.milestone_wisuda_date || '2027-06-15T08:00:00Z';

  const ukkDate = new Date(ukkTargetString).getTime();
  const graduationDate = new Date(gradTargetString).getTime();

  const [timeLeftGrad, setTimeLeftGrad] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [timeLeftUkk, setTimeLeftUkk] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();

      const diffGrad = Math.max(0, graduationDate - now);
      setTimeLeftGrad({
        days: Math.floor(diffGrad / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diffGrad % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diffGrad % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diffGrad % (1000 * 60)) / 1000),
      });

      const diffUkk = Math.max(0, ukkDate - now);
      setTimeLeftUkk({
        days: Math.floor(diffUkk / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diffUkk % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diffUkk % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diffUkk % (1000 * 60)) / 1000),
      });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [graduationDate, ukkDate]);

  return (
    <motion.section
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* UKK Countdown Card */}
        <motion.div
          whileHover={{ y: -4 }}
          transition={{ duration: 0.2 }}
          className="p-6 sm:p-8 rounded-3xl bg-[#1f1d19] border border-[#f5f1ca]/15 shadow-xl relative overflow-hidden space-y-5 group hover:border-[#f2eb87]/50 transition-all"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-[#161512] border border-[#f2eb87]/30 text-[#f2eb87] flex items-center justify-center shadow-inner">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#f2eb87] block">
                  {settings.milestone_ukk_title || 'Uji Kompetensi Keahlian (UKK)'}
                </span>
                <h4 className="font-serif-title font-bold text-lg text-[#f5f1ca]">
                  {settings.milestone_ukk_subtitle || 'Sertifikasi Praktik TKJ 2027'}
                </h4>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-[#161512] text-[#f2eb87] border border-[#f2eb87]/30">
              {settings.milestone_ukk_badge || 'Februari 2027'}
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2.5 text-center">
            {[
              { label: 'Hari', val: timeLeftUkk.days },
              { label: 'Jam', val: timeLeftUkk.hours },
              { label: 'Menit', val: timeLeftUkk.minutes },
              { label: 'Detik', val: timeLeftUkk.seconds },
            ].map((item) => (
              <div key={item.label} className="p-3 rounded-2xl bg-[#161512] border border-[#f5f1ca]/10">
                <span className="font-serif-title font-bold text-2xl sm:text-3xl text-[#f2eb87] block">
                  {item.val}
                </span>
                <span className="text-[10px] text-[#9e9a8d] uppercase tracking-wider">{item.label}</span>
              </div>
            ))}
          </div>

          <p className="text-xs text-[#d8d6c6]/80 text-center font-normal">
            {settings.milestone_ukk_desc ||
              'Fokus menguasai routing BGP, MikroTik firewall, dan splicing fiber optic menuju kelulusan standar industri!'}
          </p>
        </motion.div>

        {/* Graduation Countdown Card */}
        <motion.div
          whileHover={{ y: -4 }}
          transition={{ duration: 0.2 }}
          className="p-6 sm:p-8 rounded-3xl bg-[#1f1d19] border border-[#f5f1ca]/15 shadow-xl relative overflow-hidden space-y-5 group hover:border-[#f2eb87]/50 transition-all"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-[#161512] border border-[#f2eb87]/30 text-[#f2eb87] flex items-center justify-center shadow-inner">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#f2eb87] block">
                  {settings.milestone_wisuda_title || 'Puncak Angkatan'}
                </span>
                <h4 className="font-serif-title font-bold text-lg text-[#f5f1ca]">
                  {settings.milestone_wisuda_subtitle || 'Wisuda & Pelepasan XII TKJ'}
                </h4>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-[#161512] text-[#f2eb87] border border-[#f2eb87]/30">
              {settings.milestone_wisuda_badge || 'Juni 2027'}
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2.5 text-center">
            {[
              { label: 'Hari', val: timeLeftGrad.days },
              { label: 'Jam', val: timeLeftGrad.hours },
              { label: 'Menit', val: timeLeftGrad.minutes },
              { label: 'Detik', val: timeLeftGrad.seconds },
            ].map((item) => (
              <div key={item.label} className="p-3 rounded-2xl bg-[#161512] border border-[#f5f1ca]/10">
                <span className="font-serif-title font-bold text-2xl sm:text-3xl text-[#f5f1ca] block">
                  {item.val}
                </span>
                <span className="text-[10px] text-[#9e9a8d] uppercase tracking-wider">{item.label}</span>
              </div>
            ))}
          </div>

          <p className="text-xs text-[#d8d6c6]/80 text-center font-normal">
            {settings.milestone_wisuda_desc ||
              'Menghitung setiap detik kebersamaan, tawa di lorong kelas, dan persaudaraan selamanya sebagai XII TKJ!'}
          </p>
        </motion.div>
      </div>
    </motion.section>
  );
}
