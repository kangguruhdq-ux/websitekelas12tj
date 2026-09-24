'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useClassData } from '@/context/ClassDataContext';
import { motion } from 'framer-motion';
import { FolderGit2, ArrowRight, Sparkles, ExternalLink, Users } from 'lucide-react';

export default function HomeProjects() {
  const { projects } = useClassData();

  // Pick published featured projects or newest
  const displayProjects = React.useMemo(() => {
    const published = (projects || []).filter((p) => p.is_published !== false);
    const featured = published.filter((p) => p.is_featured);
    const pool = featured.length > 0 ? featured : published;
    return pool.slice(0, 3);
  }, [projects]);

  if (displayProjects.length === 0) {
    return null;
  }

  return (
    <section className="py-20 sm:py-28 relative overflow-hidden border-t" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)' }}>
      {/* Background glow orb */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 sm:w-[600px] h-96 rounded-full blur-[140px] pointer-events-none -z-10"
        style={{ backgroundColor: 'var(--theme-glow)' }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border mb-3 text-xs font-bold uppercase tracking-wider" style={{ backgroundColor: 'var(--color-theme-muted)', borderColor: 'var(--border-theme)', color: 'var(--color-theme)' }}>
              <Sparkles className="w-3.5 h-3.5" />
              <span>Karya Digital Siswa</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-theme-heading font-black tracking-tight" style={{ color: 'var(--text-main)' }}>
              Project Terbaru
            </h2>
            <p className="text-xs sm:text-sm mt-2 max-w-xl" style={{ color: 'var(--text-muted)' }}>
              Eksplorasi karya teknologi dan inovasi digital unggulan hasil karya siswa Angkatan 27 — XII TJ.
            </p>
          </div>

          <Link
            href="/projects"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all hover:scale-105 self-start md:self-auto"
            style={{
              backgroundColor: 'var(--color-theme)',
              color: '#050505',
              borderColor: 'var(--color-theme)',
              boxShadow: '0 4px 14px -2px var(--theme-glow)',
            }}
          >
            <span>Lihat Semua Project</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 3-Col Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {displayProjects.map((project, idx) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: idx * 0.1 }}
              className="rounded-2xl border overflow-hidden flex flex-col group transition-all duration-300 hover:shadow-2xl"
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
              {/* Cover Preview */}
              <div className="relative aspect-video w-full overflow-hidden bg-black/40">
                {project.cover_url ? (
                  <Image
                    src={project.cover_url}
                    alt={project.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 380px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FolderGit2 className="w-10 h-10 opacity-30" style={{ color: 'var(--color-theme)' }} />
                  </div>
                )}
                <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider backdrop-blur-md border bg-black/60 border-white/10" style={{ color: 'var(--color-theme)' }}>
                  {project.category}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-grow flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-theme-heading font-bold mb-2 group-hover:underline" style={{ color: 'var(--text-main)' }}>
                    {project.name}
                  </h3>
                  <p className="text-xs sm:text-[13px] leading-relaxed line-clamp-2 mb-3" style={{ color: 'var(--text-body)' }}>
                    {project.short_description}
                  </p>

                  <div className="flex items-center gap-1.5 text-xs mb-4" style={{ color: 'var(--text-muted)' }}>
                    <Users className="w-3.5 h-3.5" style={{ color: 'var(--color-theme)' }} />
                    <span className="font-medium line-clamp-1">{project.student_creator}</span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {(project.tech_stack || []).slice(0, 3).map((tech, i) => (
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
                  </div>
                </div>

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
          ))}
        </div>
      </div>
    </section>
  );
}
