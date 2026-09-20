'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useClassData } from '@/context/ClassDataContext';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ExternalLink,
  Download,
  FolderGit2,
  Users,
  Calendar,
  Layers,
  Sparkles,
  CheckCircle2,
  Clock,
  Wrench,
  Archive,
  Terminal,
  ShieldCheck,
  Check,
} from 'lucide-react';

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { projects } = useClassData();

  const id = params?.id as string;
  const project = (projects || []).find((p) => p.id === id || p.slug === id);

  if (!project) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-4 flex flex-col items-center justify-center text-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <FolderGit2 className="w-16 h-16 mb-4 opacity-40" style={{ color: 'var(--color-theme)' }} />
        <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-main)' }}>
          Project Tidak Ditemukan
        </h1>
        <p className="text-xs sm:text-sm mb-6 max-w-md" style={{ color: 'var(--text-muted)' }}>
          Project yang Anda cari mungkin telah diarsipkan, diubah, atau link tidak valid.
        </p>
        <Link
          href="/projects"
          className="px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border"
          style={{
            backgroundColor: 'var(--color-theme)',
            color: '#050505',
            borderColor: 'var(--color-theme)',
          }}
        >
          Kembali ke Daftar Project
        </Link>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Completed':
        return { icon: CheckCircle2, text: 'Completed', className: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' };
      case 'In Development':
        return { icon: Clock, text: 'In Development', className: 'bg-amber-500/15 text-amber-300 border-amber-500/30' };
      case 'Maintenance':
        return { icon: Wrench, text: 'Maintenance', className: 'bg-blue-500/15 text-blue-300 border-blue-500/30' };
      default:
        return { icon: Archive, text: status, className: 'bg-slate-500/15 text-slate-300 border-slate-500/30' };
    }
  };

  const statusMeta = getStatusBadge(project.status);
  const StatusIcon = statusMeta.icon;

  return (
    <div className="min-h-screen pt-24 sm:pt-28 pb-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden" style={{ backgroundColor: 'var(--bg-primary)' }}>
      {/* Dynamic Background Glow */}
      <div
        className="absolute top-10 left-1/2 -translate-x-1/2 w-96 sm:w-[700px] h-96 rounded-full blur-[160px] pointer-events-none -z-10"
        style={{ backgroundColor: 'var(--theme-glow)' }}
      />

      <div className="max-w-5xl mx-auto">
        {/* Back Navigation */}
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6 sm:mb-8"
        >
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs font-semibold tracking-wider transition-all hover:scale-105"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-main)',
            }}
          >
            <ArrowLeft className="w-3.5 h-3.5" style={{ color: 'var(--color-theme)' }} />
            <span>Semua Project TKJ</span>
          </Link>
        </motion.div>

        {/* Hero Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="rounded-3xl border overflow-hidden shadow-2xl mb-10"
          style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--border-theme)',
          }}
        >
          {/* Cover Image */}
          <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full overflow-hidden bg-black/60">
            {project.cover_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={project.cover_url}
                alt={project.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <FolderGit2 className="w-16 h-16 opacity-30" style={{ color: 'var(--color-theme)' }} />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

            {/* Badges on Cover Overlay */}
            <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md border bg-black/60 border-white/10" style={{ color: 'var(--color-theme)' }}>
                {project.category}
              </span>
              {project.is_featured && (
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1 backdrop-blur-md border border-amber-400/50 bg-amber-500/30 text-amber-200">
                  <Sparkles className="w-3 h-3 text-amber-300" />
                  Featured Project
                </span>
              )}
            </div>

            <div className="absolute top-4 right-4">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 border backdrop-blur-md ${statusMeta.className}`}>
                <StatusIcon className="w-3.5 h-3.5" />
                <span>{statusMeta.text}</span>
              </span>
            </div>
          </div>

          {/* Header Info Details */}
          <div className="p-6 sm:p-8 lg:p-10 border-t border-white/5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/10">
              <div>
                <h1 className="text-2xl sm:text-4xl font-theme-heading font-black tracking-tight mb-2" style={{ color: 'var(--text-main)' }}>
                  {project.name}
                </h1>
                <p className="text-sm sm:text-base leading-relaxed" style={{ color: 'var(--text-body)' }}>
                  {project.short_description}
                </p>
              </div>

              {/* Action Buttons (Demo, GitHub, APK) */}
              <div className="flex flex-wrap items-center gap-2.5 flex-shrink-0">
                {project.demo_url && (
                  <a
                    href={project.demo_url}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 border shadow-sm hover:scale-105"
                    style={{
                      backgroundColor: 'var(--color-theme)',
                      color: '#050505',
                      borderColor: 'var(--color-theme)',
                      boxShadow: '0 4px 14px -2px var(--theme-glow)',
                    }}
                  >
                    <span>View Demo</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}

                {project.github_url && (
                  <a
                    href={project.github_url}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 border hover:scale-105"
                    style={{
                      backgroundColor: 'var(--bg-primary)',
                      borderColor: 'var(--border-theme)',
                      color: 'var(--text-main)',
                    }}
                  >
                    <GithubIcon className="w-3.5 h-3.5" />
                    <span>GitHub</span>
                  </a>
                )}

                {project.apk_url && (
                  <a
                    href={project.apk_url}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 border hover:scale-105 bg-emerald-500/15 border-emerald-500/30 text-emerald-300"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download APK</span>
                  </a>
                )}
              </div>
            </div>

            {/* Metadata Grid (Creator, Team, Year, Tech) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 py-6 border-b border-white/10">
              {/* Creator */}
              <div className="p-3.5 rounded-2xl border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)' }}>
                <span className="text-[10px] uppercase font-bold tracking-wider block mb-1" style={{ color: 'var(--text-muted)' }}>
                  Inisiator / Creator
                </span>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" style={{ color: 'var(--color-theme)' }} />
                  <span className="text-xs sm:text-sm font-bold" style={{ color: 'var(--text-main)' }}>
                    {project.student_creator}
                  </span>
                </div>
              </div>

              {/* Year */}
              <div className="p-3.5 rounded-2xl border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)' }}>
                <span className="text-[10px] uppercase font-bold tracking-wider block mb-1" style={{ color: 'var(--text-muted)' }}>
                  Tahun Angkatan
                </span>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" style={{ color: 'var(--color-theme)' }} />
                  <span className="text-xs sm:text-sm font-bold font-mono" style={{ color: 'var(--text-main)' }}>
                    {project.year || '2026'} (Angkatan 27)
                  </span>
                </div>
              </div>

              {/* Team Members */}
              <div className="p-3.5 rounded-2xl border sm:col-span-2" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)' }}>
                <span className="text-[10px] uppercase font-bold tracking-wider block mb-1" style={{ color: 'var(--text-muted)' }}>
                  Anggota Tim Kolaborator
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {(project.team_members && project.team_members.length > 0
                    ? project.team_members
                    : [project.student_creator]
                  ).map((m, i) => (
                    <span
                      key={i}
                      className="text-[11px] font-medium px-2 py-0.5 rounded-lg border"
                      style={{
                        backgroundColor: 'var(--bg-card)',
                        borderColor: 'var(--border-color)',
                        color: 'var(--text-main)',
                      }}
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Tech Stack */}
            <div className="py-6 border-b border-white/10">
              <span className="text-xs uppercase font-bold tracking-wider block mb-3" style={{ color: 'var(--text-muted)' }}>
                Teknologi & Tools yang Digunakan
              </span>
              <div className="flex flex-wrap gap-2">
                {(project.tech_stack || []).map((tech, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-xl text-xs font-mono font-semibold border flex items-center gap-1.5"
                    style={{
                      backgroundColor: 'var(--color-theme-muted)',
                      borderColor: 'var(--border-theme)',
                      color: 'var(--color-theme)',
                    }}
                  >
                    <Terminal className="w-3 h-3" />
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Full Description & Key Features */}
            <div className="pt-6 space-y-8">
              {/* Full Description */}
              <div>
                <h3 className="text-lg font-theme-heading font-bold mb-3" style={{ color: 'var(--text-main)' }}>
                  Tentang Project
                </h3>
                <div className="text-xs sm:text-sm leading-relaxed whitespace-pre-line space-y-4" style={{ color: 'var(--text-body)' }}>
                  {project.full_description || project.short_description}
                </div>
              </div>

              {/* Key Features */}
              {project.key_features && project.key_features.length > 0 && (
                <div>
                  <h3 className="text-lg font-theme-heading font-bold mb-3 flex items-center gap-2" style={{ color: 'var(--text-main)' }}>
                    <ShieldCheck className="w-5 h-5" style={{ color: 'var(--color-theme)' }} />
                    Fitur Unggulan
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {project.key_features.map((feature, i) => (
                      <div
                        key={i}
                        className="p-3.5 rounded-xl border flex items-start gap-3"
                        style={{
                          backgroundColor: 'var(--bg-primary)',
                          borderColor: 'var(--border-color)',
                        }}
                      >
                        <div
                          className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                          style={{ backgroundColor: 'var(--color-theme)', color: '#050505' }}
                        >
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                        <span className="text-xs sm:text-[13px] font-medium leading-tight" style={{ color: 'var(--text-main)' }}>
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Screenshots Gallery */}
              {project.screenshots && project.screenshots.length > 0 && (
                <div>
                  <h3 className="text-lg font-theme-heading font-bold mb-4" style={{ color: 'var(--text-main)' }}>
                    Galeri Tangkapan Layar
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {project.screenshots.map((shot, idx) => (
                      <div
                        key={idx}
                        className="rounded-2xl border overflow-hidden group/shot bg-black/40"
                        style={{ borderColor: 'var(--border-color)' }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={shot}
                          alt={`${project.name} preview ${idx + 1}`}
                          className="w-full h-auto object-cover transition-transform duration-300 group-hover/shot:scale-105"
                          loading="lazy"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
