'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useClassData } from '@/context/ClassDataContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  FolderGit2,
  ExternalLink,
  Filter,
  ArrowUpDown,
  Sparkles,
  Layers,
  Code2,
  Users,
  CheckCircle2,
  Clock,
  Wrench,
  Archive,
} from 'lucide-react';
import { ClassProject, ProjectCategory } from '@/types';

const CATEGORIES = [
  'Semua',
  'Web Development',
  'Mobile App',
  'Network',
  'Cyber Security',
  'IoT',
  'AI / Machine Learning',
  'Other',
];

type SortOption = 'newest' | 'oldest' | 'az';

export default function ProjectsPage() {
  const { projects } = useClassData();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [sortBy, setSortBy] = useState<SortOption>('newest');

  // Filter and sort projects (only show published for public)
  const filteredProjects = useMemo(() => {
    let list = (projects || []).filter((p) => p.is_published !== false);

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.short_description.toLowerCase().includes(q) ||
          p.student_creator.toLowerCase().includes(q) ||
          (p.tech_stack || []).some((tech) => tech.toLowerCase().includes(q))
      );
    }

    // Category filter
    if (selectedCategory !== 'Semua') {
      list = list.filter((p) => {
        if (selectedCategory === 'Other') {
          return !['Web Development', 'Mobile App', 'Network', 'Cyber Security', 'IoT', 'AI / Machine Learning'].includes(p.category);
        }
        return p.category.toLowerCase().includes(selectedCategory.toLowerCase());
      });
    }

    // Sorting
    list.sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
      }
      if (sortBy === 'oldest') {
        return new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime();
      }
      if (sortBy === 'az') {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });

    return list;
  }, [projects, searchQuery, selectedCategory, sortBy]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Completed':
        return {
          icon: CheckCircle2,
          text: 'Completed',
          className: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
        };
      case 'In Development':
        return {
          icon: Clock,
          text: 'In Development',
          className: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
        };
      case 'Maintenance':
        return {
          icon: Wrench,
          text: 'Maintenance',
          className: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
        };
      default:
        return {
          icon: Archive,
          text: status,
          className: 'bg-slate-500/15 text-slate-300 border-slate-500/30',
        };
    }
  };

  return (
    <div className="min-h-screen pt-24 sm:pt-28 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden" style={{ backgroundColor: 'var(--bg-primary)' }}>
      {/* Background glow orb */}
      <div
        className="absolute top-10 left-1/2 -translate-x-1/2 w-96 sm:w-[600px] h-96 rounded-full blur-[140px] pointer-events-none -z-10"
        style={{ backgroundColor: 'var(--theme-glow)' }}
      />

      <div className="max-w-7xl mx-auto">
        {/* Header Hero Section with Smooth Fade Reveal */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-3xl mx-auto mb-10 sm:mb-14"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border mb-4 shadow-sm" style={{ backgroundColor: 'var(--color-theme-muted)', borderColor: 'var(--border-theme)' }}>
            <Sparkles className="w-3.5 h-3.5" style={{ color: 'var(--color-theme)' }} />
            <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--color-theme)' }}>
              ANGKATAN 27 — XII TJ
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-5xl font-theme-heading font-black tracking-tight mb-4" style={{ color: 'var(--text-main)' }}>
            Project TKJ
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl font-medium mb-3" style={{ color: 'var(--color-theme)' }}>
            Karya dan project digital Angkatan 27 — XII TJ
          </p>

          {/* Description */}
          <p className="text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            Kumpulan project yang dibuat dan dikembangkan oleh siswa Teknik Komputer dan Jaringan. Mulai dari otomasi infrastruktur jaringan, aplikasi mobile terintegrasi, AI prediktif, hingga solusi IoT cerdas.
          </p>
        </motion.div>

        {/* Search, Filter Category, & Sort Controls */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="space-y-4 mb-8 sm:mb-10"
        >
          {/* Search bar & Sorting */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-grow">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Cari project, teknologi, atau nama siswa..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border text-xs sm:text-sm transition-all focus:outline-none"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-main)',
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs hover:opacity-75"
                  style={{ color: 'var(--text-muted)' }}
                >
                  Clear
                </button>
              )}
            </div>

            {/* Sort Selector */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-xs font-medium flex items-center gap-1.5" style={{ color: 'var(--text-muted)' }}>
                <ArrowUpDown className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Urutan:</span>
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                aria-label="Urutan project"
                className="px-3 py-2.5 rounded-xl border text-xs font-semibold focus:outline-none transition-all cursor-pointer"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-main)',
                }}
              >
                <option value="newest">Terbaru</option>
                <option value="oldest">Terlama</option>
                <option value="az">A — Z (Nama)</option>
              </select>
            </div>
          </div>

          {/* Category Filter Pills (Horizontal scrollable on mobile) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 hide-scrollbar">
            <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 mr-1 flex-shrink-0" style={{ color: 'var(--text-muted)' }}>
              <Filter className="w-3.5 h-3.5" />
              Kategori:
            </span>
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap border flex-shrink-0 ${
                    isSelected
                      ? 'font-bold shadow-sm'
                      : 'hover:opacity-85'
                  }`}
                  style={{
                    backgroundColor: isSelected ? 'var(--color-theme)' : 'var(--bg-card)',
                    borderColor: isSelected ? 'var(--color-theme)' : 'var(--border-color)',
                    color: isSelected ? '#050505' : 'var(--text-body)',
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Project Grid: 3 cols Desktop, 2 cols Tablet, 1 col Mobile */}
        {filteredProjects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16 px-4 rounded-2xl border"
            style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
          >
            <FolderGit2 className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--color-theme)' }} />
            <h3 className="text-base sm:text-lg font-bold mb-1" style={{ color: 'var(--text-main)' }}>
              Tidak ada project ditemukan
            </h3>
            <p className="text-xs sm:text-sm" style={{ color: 'var(--text-muted)' }}>
              Coba sesuaikan kata kunci pencarian atau ganti filter kategori.
            </p>
          </motion.div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7"
          >
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project, idx) => {
                const statusMeta = getStatusBadge(project.status);
                const StatusIcon = statusMeta.icon;

                return (
                  <motion.div
                    key={project.id}
                    layout
                    initial={{ opacity: 0, y: 24, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{
                      duration: 0.35,
                      delay: Math.min(idx * 0.06, 0.35),
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="group rounded-2xl border overflow-hidden flex flex-col transition-all duration-300 hover:shadow-2xl"
                    style={{
                      backgroundColor: 'var(--bg-card)',
                      borderColor: 'var(--border-color)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'var(--border-theme)';
                      e.currentTarget.style.boxShadow = '0 16px 36px -10px rgba(0,0,0,0.8), 0 0 20px -3px var(--theme-glow)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--border-color)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    {/* Cover Image Container */}
                    <div className="relative aspect-video w-full overflow-hidden bg-black/40">
                      {project.cover_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={project.cover_url}
                          alt={project.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-black/30">
                          <FolderGit2 className="w-10 h-10 opacity-30" style={{ color: 'var(--color-theme)' }} />
                        </div>
                      )}

                      {/* Featured Badge */}
                      {project.is_featured && (
                        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-lg backdrop-blur-md border border-amber-400/40 bg-amber-500/25 text-amber-200">
                          <Sparkles className="w-3 h-3 text-amber-300" />
                          Featured
                        </div>
                      )}

                      {/* Status Badge */}
                      <div className={`absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-[10px] font-semibold flex items-center gap-1 border backdrop-blur-md ${statusMeta.className}`}>
                        <StatusIcon className="w-3 h-3" />
                        <span>{statusMeta.text}</span>
                      </div>

                      {/* Category tag on image corner */}
                      <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider backdrop-blur-md border bg-black/60 border-white/10" style={{ color: 'var(--color-theme)' }}>
                        {project.category}
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-5 flex-grow flex flex-col justify-between">
                      <div>
                        {/* Title & Year */}
                        <div className="flex items-baseline justify-between gap-2 mb-2">
                          <h3 className="text-lg font-theme-heading font-bold tracking-tight line-clamp-1 group-hover:underline" style={{ color: 'var(--text-main)' }}>
                            {project.name}
                          </h3>
                          <span className="text-[11px] font-mono font-medium flex-shrink-0" style={{ color: 'var(--text-muted)' }}>
                            {project.year || '2026'}
                          </span>
                        </div>

                        {/* Short Description */}
                        <p className="text-xs sm:text-[13px] leading-relaxed line-clamp-2 mb-3.5" style={{ color: 'var(--text-body)' }}>
                          {project.short_description}
                        </p>

                        {/* Student / Team */}
                        <div className="flex items-center gap-1.5 text-xs mb-3.5" style={{ color: 'var(--text-muted)' }}>
                          <Users className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'var(--color-theme)' }} />
                          <span className="font-medium line-clamp-1">
                            {project.student_creator}
                            {project.team_members && project.team_members.length > 1 && (
                              <span className="opacity-75"> ({project.team_members.length} Anggota)</span>
                            )}
                          </span>
                        </div>

                        {/* Tech Stack Pills */}
                        <div className="flex flex-wrap gap-1.5 mb-5">
                          {(project.tech_stack || []).slice(0, 4).map((tech, i) => (
                            <span
                              key={i}
                              className="text-[10px] font-mono px-2 py-0.5 rounded-md border"
                              style={{
                                backgroundColor: 'var(--bg-primary)',
                                borderColor: 'var(--border-color)',
                                color: 'var(--text-main)',
                              }}
                            >
                              {tech}
                            </span>
                          ))}
                          {(project.tech_stack || []).length > 4 && (
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded" style={{ color: 'var(--text-muted)' }}>
                              +{project.tech_stack.length - 4}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Card Action Button */}
                      <Link
                        href={`/projects/${project.id}`}
                        aria-label={`Lihat detail project ${project.name}`}
                        className="w-full py-2.5 rounded-xl text-center text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 border group-hover:scale-[1.01]"
                        style={{
                          backgroundColor: 'var(--color-theme)',
                          color: '#050505',
                          borderColor: 'var(--color-theme)',
                          boxShadow: '0 4px 14px -2px var(--theme-glow)',
                        }}
                      >
                        <span>Lihat Project</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}
