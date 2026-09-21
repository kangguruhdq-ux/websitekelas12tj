'use client';

import React, { useState, useMemo, useRef } from 'react';
import { useClassData } from '@/context/ClassDataContext';
import { ClassProject, ProjectCategory, ProjectStatus } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { optimizeImageForUpload } from '@/lib/image-optimizer';
import {
  FolderGit2,
  Plus,
  Search,
  Edit2,
  Trash2,
  Upload,
  X,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  Globe,
  Smartphone,
  Eye,
  EyeOff,
  Star,
  Tag,
  Code2,
  Users,
  Calendar,
  Layers,
  ArrowUpRight,
  Filter,
} from 'lucide-react';

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

const CATEGORIES: ProjectCategory[] = [
  'Web Development',
  'Mobile App',
  'Network',
  'Cyber Security',
  'IoT',
  'AI / Machine Learning',
  'System Administration',
  'UI/UX',
  'Other',
];

const STATUSES: ProjectStatus[] = [
  'Completed',
  'In Development',
  'Maintenance',
  'Archived',
];

export default function AdminProjectsPage() {
  const {
    projects,
    upsertProject,
    deleteProject,
    toggleProjectPublish,
    toggleProjectFeature,
  } = useClassData();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [filterVisibility, setFilterVisibility] = useState<'all' | 'published' | 'draft' | 'featured'>('all');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ClassProject | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [uploadingCover, setUploadingCover] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form states
  const [formData, setFormData] = useState<Partial<ClassProject>>({
    name: '',
    short_description: '',
    full_description: '',
    category: 'Web Development',
    status: 'Completed',
    student_creator: '',
    team_members: [],
    tech_stack: [],
    year: '2024/2025',
    cover_url: '',
    github_url: '',
    demo_url: '',
    apk_url: '',
    key_features: [],
    is_published: true,
    is_featured: false,
    display_order: 1,
  });

  // String helpers for input fields
  const [teamMembersInput, setTeamMembersInput] = useState('');
  const [techStackInput, setTechStackInput] = useState('');
  const [featuresInput, setFeaturesInput] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const q = searchQuery.toLowerCase();
      const matchQuery =
        !searchQuery ||
        p.name.toLowerCase().includes(q) ||
        p.short_description.toLowerCase().includes(q) ||
        p.student_creator.toLowerCase().includes(q) ||
        (p.tech_stack && p.tech_stack.some((t) => t.toLowerCase().includes(q)));

      const matchCat = selectedCategory === 'all' || p.category === selectedCategory;
      const matchStatus = selectedStatus === 'all' || p.status === selectedStatus;

      let matchVis = true;
      if (filterVisibility === 'published') matchVis = p.is_published;
      if (filterVisibility === 'draft') matchVis = !p.is_published;
      if (filterVisibility === 'featured') matchVis = p.is_featured;

      return matchQuery && matchCat && matchStatus && matchVis;
    });
  }, [projects, searchQuery, selectedCategory, selectedStatus, filterVisibility]);

  // Quick stats
  const stats = useMemo(() => {
    const total = projects.length;
    const published = projects.filter((p) => p.is_published).length;
    const featured = projects.filter((p) => p.is_featured).length;
    const categoriesCount = new Set(projects.map((p) => p.category)).size;
    return { total, published, featured, categoriesCount };
  }, [projects]);

  const handleOpenCreate = () => {
    setEditingProject(null);
    setFormData({
      id: `proj-${Date.now()}`,
      name: '',
      short_description: '',
      full_description: '',
      category: 'Web Development',
      status: 'Completed',
      student_creator: '',
      team_members: [],
      tech_stack: ['Next.js', 'Tailwind CSS'],
      year: '2024/2025',
      cover_url: '',
      github_url: '',
      demo_url: '',
      apk_url: '',
      key_features: [],
      is_published: true,
      is_featured: false,
      display_order: (projects.length || 0) + 1,
    });
    setTeamMembersInput('');
    setTechStackInput('Next.js, Tailwind CSS');
    setFeaturesInput('');
    setModalOpen(true);
  };

  const handleOpenEdit = (project: ClassProject) => {
    setEditingProject(project);
    setFormData({ ...project });
    setTeamMembersInput(project.team_members ? project.team_members.join(', ') : '');
    setTechStackInput(project.tech_stack ? project.tech_stack.join(', ') : '');
    setFeaturesInput(project.key_features ? project.key_features.join('\n') : '');
    setModalOpen(true);
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawFile = e.target.files?.[0];
    if (!rawFile) return;

    setUploadingCover(true);
    try {
      const file = await optimizeImageForUpload(rawFile, 1200, 0.82);
      const body = new FormData();
      body.append('file', file);
      body.append('category', 'projects');

      const res = await fetch('/api/upload', {
        method: 'POST',
        body,
      });

      const data = await res.json();
      if (res.ok && data.url) {
        setFormData((prev) => ({ ...prev, cover_url: data.url }));
        showToast('Cover project berhasil diunggah.');
      } else {
        alert(data.error || 'Gagal mengunggah gambar cover.');
      }
    } catch {
      alert('Terjadi kesalahan saat mengunggah cover.');
    } finally {
      setUploadingCover(false);
      if (e.target) e.target.value = '';
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim()) {
      alert('Nama project wajib diisi.');
      return;
    }
    if (!formData.student_creator?.trim()) {
      alert('Nama pembuat / kreator project wajib diisi.');
      return;
    }
    if (!formData.short_description?.trim()) {
      alert('Deskripsi singkat wajib diisi.');
      return;
    }

    // Parse inputs
    const teamMembers = teamMembersInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const techStack = techStackInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const keyFeatures = featuresInput
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const projectToSave: ClassProject = {
      id: formData.id || `proj-${Date.now()}`,
      name: formData.name.trim(),
      slug: (formData.name || '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, ''),
      short_description: formData.short_description.trim(),
      full_description: formData.full_description?.trim() || formData.short_description.trim(),
      category: formData.category || 'Web Development',
      status: formData.status || 'Completed',
      student_creator: formData.student_creator.trim(),
      team_members: teamMembers,
      tech_stack: techStack.length > 0 ? techStack : ['TKJ'],
      year: formData.year?.trim() || '2024/2025',
      cover_url:
        formData.cover_url ||
        'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
      github_url: formData.github_url?.trim() || undefined,
      demo_url: formData.demo_url?.trim() || undefined,
      apk_url: formData.apk_url?.trim() || undefined,
      key_features: keyFeatures,
      is_published: formData.is_published ?? true,
      is_featured: formData.is_featured ?? false,
      display_order: Number(formData.display_order) || 1,
      created_at: editingProject?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const success = await upsertProject(projectToSave);
    if (success) {
      setModalOpen(false);
      showToast(editingProject ? 'Project berhasil diperbarui.' : 'Project baru berhasil ditambahkan.');
    } else {
      alert('Gagal menyimpan data project.');
    }
  };

  const handleTogglePublish = async (id: string, currentVal: boolean) => {
    const success = await toggleProjectPublish(id, !currentVal);
    if (success) {
      showToast(!currentVal ? 'Project telah dipublikasikan.' : 'Project dialihkan ke draft.');
    }
  };

  const handleToggleFeature = async (id: string, currentVal: boolean) => {
    const success = await toggleProjectFeature(id, !currentVal);
    if (success) {
      showToast(!currentVal ? 'Project disematkan sebagai Featured.' : 'Status Featured dilepas.');
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    const success = await deleteProject(deleteId);
    if (success) {
      setDeleteId(null);
      showToast('Project berhasil dihapus dari database.');
    } else {
      alert('Gagal menghapus project.');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-[#161512] border border-[#f2eb87]/50 text-[#f5f1ca] shadow-2xl flex items-center gap-3 text-xs font-semibold backdrop-blur-md">
          <CheckCircle2 className="w-5 h-5 text-[#f2eb87]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#1f1d19] text-[#f2eb87] border border-[#f2eb87]/30 mb-1.5">
            <FolderGit2 className="w-3.5 h-3.5" />
            <span className="uppercase tracking-widest text-[10px]">SHOWCASE & INOVASI TKJ</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif-title font-bold text-[#f5f1ca]">
            Kelola Project TKJ
          </h1>
          <p className="text-xs sm:text-sm text-[#9e9a8d]">
            Katalog karya, aplikasi, konfigurasi server, & portfolio siswa XII TJ Angkatan 27.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/projects"
            target="_blank"
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#1f1d19] hover:bg-[#282622] text-[#f5f1ca] text-xs font-semibold border border-[#f5f1ca]/15 transition-all"
          >
            <Globe className="w-4 h-4 text-[#f2eb87]" />
            <span className="hidden sm:inline">Lihat Web</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-60" />
          </Link>

          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#f2eb87] hover:bg-[#e6df73] text-[#161512] text-xs font-bold shadow-md shadow-[#f2eb87]/20 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Project</span>
          </button>
        </div>
      </div>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-[#1f1d19] border border-[#f5f1ca]/12 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#f2eb87]/10 border border-[#f2eb87]/30 flex items-center justify-center text-[#f2eb87] shrink-0">
            <FolderGit2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-lg sm:text-xl font-bold text-[#f5f1ca]">{stats.total}</div>
            <div className="text-[11px] text-[#9e9a8d]">Total Project</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#1f1d19] border border-[#f5f1ca]/12 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <Eye className="w-5 h-5" />
          </div>
          <div>
            <div className="text-lg sm:text-xl font-bold text-[#f5f1ca]">{stats.published}</div>
            <div className="text-[11px] text-[#9e9a8d]">Terpublikasi</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#1f1d19] border border-[#f5f1ca]/12 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <Star className="w-5 h-5 fill-amber-400" />
          </div>
          <div>
            <div className="text-lg sm:text-xl font-bold text-[#f5f1ca]">{stats.featured}</div>
            <div className="text-[11px] text-[#9e9a8d]">Featured Homepage</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#1f1d19] border border-[#f5f1ca]/12 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="text-lg sm:text-xl font-bold text-[#f5f1ca]">{stats.categoriesCount}</div>
            <div className="text-[11px] text-[#9e9a8d]">Kategori Aktif</div>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#1f1d19] border border-[#f5f1ca]/12 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          {/* Search */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-[#9e9a8d] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari project, kreator, tech stack..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs bg-[#161512] border border-[#f5f1ca]/15 text-[#f5f1ca] placeholder-[#9e9a8d]/60 focus:outline-none focus:border-[#f2eb87] transition-all"
            />
          </div>

          {/* Visibility Tabs */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-[#161512] border border-[#f5f1ca]/12 w-full md:w-auto overflow-x-auto text-xs">
            <button
              onClick={() => setFilterVisibility('all')}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                filterVisibility === 'all'
                  ? 'bg-[#f2eb87] text-[#161512] font-bold shadow-sm'
                  : 'text-[#9e9a8d] hover:text-[#f5f1ca]'
              }`}
            >
              Semua ({projects.length})
            </button>
            <button
              onClick={() => setFilterVisibility('published')}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                filterVisibility === 'published'
                  ? 'bg-[#f2eb87] text-[#161512] font-bold shadow-sm'
                  : 'text-[#9e9a8d] hover:text-[#f5f1ca]'
              }`}
            >
              Publish ({stats.published})
            </button>
            <button
              onClick={() => setFilterVisibility('draft')}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                filterVisibility === 'draft'
                  ? 'bg-[#f2eb87] text-[#161512] font-bold shadow-sm'
                  : 'text-[#9e9a8d] hover:text-[#f5f1ca]'
              }`}
            >
              Draft ({projects.length - stats.published})
            </button>
            <button
              onClick={() => setFilterVisibility('featured')}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                filterVisibility === 'featured'
                  ? 'bg-[#f2eb87] text-[#161512] font-bold shadow-sm'
                  : 'text-[#9e9a8d] hover:text-[#f5f1ca]'
              }`}
            >
              Featured ({stats.featured})
            </button>
          </div>
        </div>

        {/* Category & Status Selectors */}
        <div className="flex flex-wrap items-center gap-2.5 pt-2 border-t border-[#f5f1ca]/10 text-xs">
          <span className="text-[#9e9a8d] text-[11px] font-medium flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Filter:
          </span>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-[#161512] border border-[#f5f1ca]/15 text-[#f5f1ca] focus:outline-none focus:border-[#f2eb87]"
          >
            <option value="all">Semua Kategori</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-[#161512] border border-[#f5f1ca]/15 text-[#f5f1ca] focus:outline-none focus:border-[#f2eb87]"
          >
            <option value="all">Semua Status</option>
            {STATUSES.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>

          {(selectedCategory !== 'all' || selectedStatus !== 'all' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedStatus('all');
                setSearchQuery('');
              }}
              className="text-[#f2eb87] hover:underline text-[11px] ml-auto"
            >
              Reset Filter
            </button>
          )}
        </div>
      </div>

      {/* Projects Desktop Table & Mobile Cards */}
      <div className="rounded-2xl bg-[#1f1d19] border border-[#f5f1ca]/12 shadow-sm overflow-hidden">
        {filteredProjects.length === 0 ? (
          <div className="text-center py-16 px-4">
            <FolderGit2 className="w-12 h-12 text-[#9e9a8d]/40 mx-auto mb-3" />
            <h3 className="text-base font-bold text-[#f5f1ca] mb-1">Tidak ada project ditemukan</h3>
            <p className="text-xs text-[#9e9a8d] max-w-sm mx-auto mb-4">
              Coba sesuaikan kata kunci pencarian atau filter yang Anda terapkan.
            </p>
            <button
              onClick={handleOpenCreate}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#f2eb87] text-[#161512] text-xs font-bold"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Project Pertama</span>
            </button>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#f5f1ca]/10 bg-[#161512]/60 text-[#9e9a8d] uppercase tracking-wider font-semibold">
                    <th className="py-3.5 px-4 w-12 text-center">#</th>
                    <th className="py-3.5 px-4">Project</th>
                    <th className="py-3.5 px-4">Kategori & Status</th>
                    <th className="py-3.5 px-4">Kreator & Tim</th>
                    <th className="py-3.5 px-4">Tech Stack</th>
                    <th className="py-3.5 px-4 text-center">Status Web</th>
                    <th className="py-3.5 px-4 text-center">Featured</th>
                    <th className="py-3.5 px-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f5f1ca]/8">
                  {filteredProjects.map((p, index) => (
                    <tr
                      key={p.id}
                      className="hover:bg-[#161512]/40 transition-colors group"
                    >
                      <td className="py-3.5 px-4 text-center text-[#9e9a8d] font-mono text-[11px]">
                        {index + 1}
                      </td>

                      {/* Project Name & Cover */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-14 h-10 rounded-lg overflow-hidden bg-[#161512] border border-[#f5f1ca]/15 shrink-0 relative">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={p.cover_url}
                              alt={p.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                          </div>
                          <div className="min-w-0 max-w-xs">
                            <div className="font-bold text-[#f5f1ca] truncate flex items-center gap-1.5">
                              <span>{p.name}</span>
                              {p.year && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#161512] text-[#9e9a8d] border border-[#f5f1ca]/10">
                                  {p.year}
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-[#9e9a8d] truncate mt-0.5">
                              {p.short_description}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Category & Status */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-1">
                          <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-semibold bg-[#f2eb87]/15 text-[#f2eb87] border border-[#f2eb87]/30">
                            {p.category}
                          </span>
                          <div>
                            <span
                              className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-medium border ${
                                p.status === 'Completed'
                                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                                  : p.status === 'In Development'
                                  ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                                  : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                              }`}
                            >
                              {p.status}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Creator */}
                      <td className="py-3.5 px-4">
                        <div className="text-[#f5f1ca] font-medium">{p.student_creator}</div>
                        {p.team_members && p.team_members.length > 0 && (
                          <div className="text-[10px] text-[#9e9a8d] flex items-center gap-1 mt-0.5">
                            <Users className="w-3 h-3 text-[#f2eb87]" />
                            <span>+{p.team_members.length} anggota</span>
                          </div>
                        )}
                      </td>

                      {/* Tech Stack */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap gap-1 max-w-[180px]">
                          {p.tech_stack?.slice(0, 3).map((tech, idx) => (
                            <span
                              key={idx}
                              className="px-1.5 py-0.5 rounded text-[9px] bg-[#161512] text-[#f5f1ca]/80 border border-[#f5f1ca]/10 font-mono"
                            >
                              {tech}
                            </span>
                          ))}
                          {(p.tech_stack?.length || 0) > 3 && (
                            <span className="text-[9px] text-[#9e9a8d] self-center">
                              +{(p.tech_stack?.length || 0) - 3}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Publish Toggle */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => handleTogglePublish(p.id, p.is_published)}
                          title={p.is_published ? 'Klik untuk simpan sebagai draft' : 'Klik untuk publikasikan'}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold border transition-all ${
                            p.is_published
                              ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/25'
                              : 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:bg-zinc-700'
                          }`}
                        >
                          {p.is_published ? (
                            <>
                              <Eye className="w-3 h-3" />
                              <span>Live</span>
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3 h-3" />
                              <span>Draft</span>
                            </>
                          )}
                        </button>
                      </td>

                      {/* Featured Toggle */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => handleToggleFeature(p.id, p.is_featured)}
                          title={p.is_featured ? 'Hilangkan dari Featured' : 'Jadikan Featured di beranda'}
                          className={`p-1.5 rounded-lg border transition-all ${
                            p.is_featured
                              ? 'bg-amber-500/20 text-amber-400 border-amber-500/40 hover:bg-amber-500/30'
                              : 'bg-[#161512] text-[#9e9a8d] border-[#f5f1ca]/10 hover:text-amber-300'
                          }`}
                        >
                          <Star className={`w-4 h-4 ${p.is_featured ? 'fill-amber-400' : ''}`} />
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/projects/${p.id}`}
                            target="_blank"
                            title="Buka halaman publik"
                            className="p-1.5 rounded-lg bg-[#161512] hover:bg-[#282622] text-[#9e9a8d] hover:text-[#f2eb87] border border-[#f5f1ca]/10 transition-colors"
                          >
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </Link>
                          <button
                            onClick={() => handleOpenEdit(p)}
                            title="Edit Project"
                            className="p-1.5 rounded-lg bg-[#161512] hover:bg-[#282622] text-[#9e9a8d] hover:text-[#f2eb87] border border-[#f5f1ca]/10 transition-colors"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteId(p.id)}
                            title="Hapus Project"
                            className="p-1.5 rounded-lg bg-[#161512] hover:bg-red-500/20 text-[#9e9a8d] hover:text-red-400 border border-[#f5f1ca]/10 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden divide-y divide-[#f5f1ca]/8">
              {filteredProjects.map((p) => (
                <div key={p.id} className="p-4 space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-20 h-16 rounded-xl overflow-hidden bg-[#161512] border border-[#f5f1ca]/15 shrink-0 relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={p.cover_url}
                        alt={p.name}
                        className="w-full h-full object-cover"
                      />
                      {p.is_featured && (
                        <div className="absolute top-1 left-1 p-0.5 rounded bg-amber-500/90 text-[#161512]">
                          <Star className="w-2.5 h-2.5 fill-current" />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="font-bold text-[#f5f1ca] text-sm leading-tight">
                          {p.name}
                        </h4>
                        <span
                          className={`text-[9px] px-2 py-0.5 rounded-full font-semibold shrink-0 ${
                            p.is_published
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'bg-zinc-800 text-zinc-400'
                          }`}
                        >
                          {p.is_published ? 'Live' : 'Draft'}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#9e9a8d] line-clamp-2 mt-1">
                        {p.short_description}
                      </p>
                      <div className="flex items-center gap-2 mt-2 text-[10px] text-[#9e9a8d]">
                        <span className="text-[#f2eb87] font-semibold">{p.category}</span>
                        <span>•</span>
                        <span>{p.student_creator}</span>
                      </div>
                    </div>
                  </div>

                  {/* Mobile Quick Toggles & Actions */}
                  <div className="flex items-center justify-between pt-2 border-t border-[#f5f1ca]/8 text-xs">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleTogglePublish(p.id, p.is_published)}
                        className={`text-[10px] px-2 py-1 rounded-lg border font-medium ${
                          p.is_published
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                        }`}
                      >
                        {p.is_published ? 'Ubah ke Draft' : 'Publikasikan'}
                      </button>

                      <button
                        onClick={() => handleToggleFeature(p.id, p.is_featured)}
                        className={`p-1 rounded-lg border ${
                          p.is_featured
                            ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                            : 'bg-[#161512] text-[#9e9a8d] border-[#f5f1ca]/15'
                        }`}
                      >
                        <Star className={`w-3.5 h-3.5 ${p.is_featured ? 'fill-amber-400' : ''}`} />
                      </button>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Link
                        href={`/projects/${p.id}`}
                        target="_blank"
                        className="p-1.5 rounded-lg bg-[#161512] text-[#9e9a8d] hover:text-[#f2eb87] border border-[#f5f1ca]/10"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        onClick={() => handleOpenEdit(p)}
                        className="px-2.5 py-1 rounded-lg bg-[#161512] text-[#f2eb87] border border-[#f2eb87]/30 text-xs font-semibold flex items-center gap-1"
                      >
                        <Edit2 className="w-3 h-3" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => setDeleteId(p.id)}
                        className="p-1.5 rounded-lg bg-[#161512] text-red-400 hover:bg-red-500/20 border border-[#f5f1ca]/10"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* CREATE / EDIT MODAL */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-3xl my-8 rounded-3xl bg-[#1f1d19] border border-[#f2eb87]/30 shadow-2xl text-[#f5f1ca] overflow-hidden"
            >
              {/* Modal Header */}
              <div className="p-5 sm:p-6 border-b border-[#f5f1ca]/12 flex items-center justify-between bg-[#161512]/80">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#f2eb87]/15 border border-[#f2eb87]/30 flex items-center justify-center text-[#f2eb87]">
                    <FolderGit2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold font-serif-title text-[#f5f1ca]">
                      {editingProject ? 'Edit Project TKJ' : 'Tambah Project Baru'}
                    </h3>
                    <p className="text-xs text-[#9e9a8d]">
                      {editingProject ? editingProject.name : 'Masukkan detail karya siswa Angkatan 27.'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setModalOpen(false)}
                  className="p-2 rounded-xl bg-[#161512] text-[#9e9a8d] hover:text-[#f5f1ca] border border-[#f5f1ca]/10 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Form Content */}
              <form onSubmit={handleFormSubmit} className="p-5 sm:p-6 space-y-5 max-h-[75vh] overflow-y-auto">
                {/* 1. Basic Info */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#f2eb87] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Informasi Utama Project</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-[#f5f1ca] mb-1.5">
                        Nama Project / Inovasi <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: NetWatch Network Monitor"
                        value={formData.name || ''}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-[#161512] border border-[#f5f1ca]/15 text-[#f5f1ca] focus:outline-none focus:border-[#f2eb87]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#f5f1ca] mb-1.5">
                        Kategori Project
                      </label>
                      <select
                        value={formData.category || 'Web Development'}
                        onChange={(e) =>
                          setFormData({ ...formData, category: e.target.value as ProjectCategory })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-[#161512] border border-[#f5f1ca]/15 text-[#f5f1ca] focus:outline-none focus:border-[#f2eb87]"
                      >
                        {CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#f5f1ca] mb-1.5">
                        Status Pengerjaan
                      </label>
                      <select
                        value={formData.status || 'Completed'}
                        onChange={(e) =>
                          setFormData({ ...formData, status: e.target.value as ProjectStatus })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-[#161512] border border-[#f5f1ca]/15 text-[#f5f1ca] focus:outline-none focus:border-[#f2eb87]"
                      >
                        {STATUSES.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#f5f1ca] mb-1.5">
                        Kreator Utama / Lead Developer <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: Muhammad Farhan"
                        value={formData.student_creator || ''}
                        onChange={(e) => setFormData({ ...formData, student_creator: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-[#161512] border border-[#f5f1ca]/15 text-[#f5f1ca] focus:outline-none focus:border-[#f2eb87]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#f5f1ca] mb-1.5">
                        Tahun / Periode
                      </label>
                      <input
                        type="text"
                        placeholder="Contoh: 2024/2025"
                        value={formData.year || ''}
                        onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-[#161512] border border-[#f5f1ca]/15 text-[#f5f1ca] focus:outline-none focus:border-[#f2eb87]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#f5f1ca] mb-1.5">
                      Anggota Tim (Opsional, pisahkan dengan koma)
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: Bagas Pratama, Dwi Kurniawan, Citra Ayu"
                      value={teamMembersInput}
                      onChange={(e) => setTeamMembersInput(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-[#161512] border border-[#f5f1ca]/15 text-[#f5f1ca] focus:outline-none focus:border-[#f2eb87]"
                    />
                  </div>
                </div>

                {/* 2. Descriptions & Features */}
                <div className="space-y-4 pt-4 border-t border-[#f5f1ca]/10">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#f2eb87] flex items-center gap-1.5">
                    <Code2 className="w-3.5 h-3.5" />
                    <span>Deskripsi & Fitur</span>
                  </h4>

                  <div>
                    <label className="block text-xs font-semibold text-[#f5f1ca] mb-1.5">
                      Deskripsi Singkat (Ringkasan pada Kartu) <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ringkasan 1-2 kalimat untuk preview di katalog..."
                      value={formData.short_description || ''}
                      onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-[#161512] border border-[#f5f1ca]/15 text-[#f5f1ca] focus:outline-none focus:border-[#f2eb87]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#f5f1ca] mb-1.5">
                      Deskripsi Lengkap / Latar Belakang & Dokumentasi
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Tuliskan latar belakang pembuatan, masalah yang dipecahkan, arsitektur, dan cara kerja project..."
                      value={formData.full_description || ''}
                      onChange={(e) => setFormData({ ...formData, full_description: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-[#161512] border border-[#f5f1ca]/15 text-[#f5f1ca] focus:outline-none focus:border-[#f2eb87]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#f5f1ca] mb-1.5">
                      Fitur Utama (Satu baris per fitur)
                    </label>
                    <textarea
                      rows={3}
                      placeholder={"Contoh:\nReal-time SNMP bandwidth monitoring\nNotifikasi bot Telegram otomatis\nDashboard responsif desktop & mobile"}
                      value={featuresInput}
                      onChange={(e) => setFeaturesInput(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-[#161512] border border-[#f5f1ca]/15 text-[#f5f1ca] focus:outline-none focus:border-[#f2eb87] font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#f5f1ca] mb-1.5">
                      Tech Stack (Pisahkan dengan koma)
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: Next.js, TypeScript, Tailwind CSS, MikroTik API, Telegram Bot"
                      value={techStackInput}
                      onChange={(e) => setTechStackInput(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-[#161512] border border-[#f5f1ca]/15 text-[#f5f1ca] focus:outline-none focus:border-[#f2eb87]"
                    />
                  </div>
                </div>

                {/* 3. Cover Media & Links */}
                <div className="space-y-4 pt-4 border-t border-[#f5f1ca]/10">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#f2eb87] flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5" />
                    <span>Media & Tautan Publik</span>
                  </h4>

                  {/* Cover Upload */}
                  <div>
                    <label className="block text-xs font-semibold text-[#f5f1ca] mb-1.5">
                      Cover Banner Project
                    </label>
                    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                      {formData.cover_url && (
                        <div className="w-24 h-16 rounded-xl overflow-hidden bg-[#161512] border border-[#f5f1ca]/20 shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={formData.cover_url}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      <div className="flex-1 w-full space-y-2">
                        <input
                          type="text"
                          placeholder="URL Cover (https://...)"
                          value={formData.cover_url || ''}
                          onChange={(e) => setFormData({ ...formData, cover_url: e.target.value })}
                          className="w-full px-3.5 py-2 rounded-xl text-xs bg-[#161512] border border-[#f5f1ca]/15 text-[#f5f1ca] focus:outline-none focus:border-[#f2eb87]"
                        />

                        <div className="flex items-center gap-2">
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleCoverUpload}
                            className="hidden"
                          />
                          <button
                            type="button"
                            disabled={uploadingCover}
                            onClick={() => fileInputRef.current?.click()}
                            className="px-3 py-1.5 rounded-lg bg-[#161512] hover:bg-[#282622] text-[#f2eb87] border border-[#f2eb87]/30 text-xs font-semibold inline-flex items-center gap-1.5"
                          >
                            <Upload className="w-3.5 h-3.5" />
                            <span>{uploadingCover ? 'Mengunggah...' : 'Upload dari Perangkat'}</span>
                          </button>
                          <span className="text-[11px] text-[#9e9a8d]">PNG, JPG, WebP max 5MB</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* URLs */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#f5f1ca] mb-1.5 flex items-center gap-1">
                        <GithubIcon className="w-3.5 h-3.5 text-[#9e9a8d]" />
                        <span>Link GitHub</span>
                      </label>
                      <input
                        type="url"
                        placeholder="https://github.com/..."
                        value={formData.github_url || ''}
                        onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl text-xs bg-[#161512] border border-[#f5f1ca]/15 text-[#f5f1ca] focus:outline-none focus:border-[#f2eb87]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#f5f1ca] mb-1.5 flex items-center gap-1">
                        <Globe className="w-3.5 h-3.5 text-[#9e9a8d]" />
                        <span>Live Demo URL</span>
                      </label>
                      <input
                        type="url"
                        placeholder="https://demo.example.com"
                        value={formData.demo_url || ''}
                        onChange={(e) => setFormData({ ...formData, demo_url: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl text-xs bg-[#161512] border border-[#f5f1ca]/15 text-[#f5f1ca] focus:outline-none focus:border-[#f2eb87]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#f5f1ca] mb-1.5 flex items-center gap-1">
                        <Smartphone className="w-3.5 h-3.5 text-[#9e9a8d]" />
                        <span>Link APK / Download</span>
                      </label>
                      <input
                        type="url"
                        placeholder="https://.../app-release.apk"
                        value={formData.apk_url || ''}
                        onChange={(e) => setFormData({ ...formData, apk_url: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl text-xs bg-[#161512] border border-[#f5f1ca]/15 text-[#f5f1ca] focus:outline-none focus:border-[#f2eb87]"
                      />
                    </div>
                  </div>
                </div>

                {/* 4. Settings & Visibility */}
                <div className="space-y-4 pt-4 border-t border-[#f5f1ca]/10">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#f2eb87]">
                    Pengaturan Publikasi
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#f5f1ca] mb-1.5">
                        Urutan Tampilan
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={formData.display_order ?? 1}
                        onChange={(e) =>
                          setFormData({ ...formData, display_order: parseInt(e.target.value) || 1 })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-[#161512] border border-[#f5f1ca]/15 text-[#f5f1ca] focus:outline-none focus:border-[#f2eb87]"
                      />
                    </div>

                    <div className="flex items-center gap-3 pt-6">
                      <input
                        type="checkbox"
                        id="is_published"
                        checked={formData.is_published ?? true}
                        onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                        className="w-4 h-4 rounded text-[#f2eb87] focus:ring-0 bg-[#161512] border-[#f5f1ca]/20"
                      />
                      <label htmlFor="is_published" className="text-xs font-semibold text-[#f5f1ca] cursor-pointer">
                        Publikasikan di Web
                      </label>
                    </div>

                    <div className="flex items-center gap-3 pt-6">
                      <input
                        type="checkbox"
                        id="is_featured"
                        checked={formData.is_featured ?? false}
                        onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                        className="w-4 h-4 rounded text-[#f2eb87] focus:ring-0 bg-[#161512] border-[#f5f1ca]/20"
                      />
                      <label htmlFor="is_featured" className="text-xs font-semibold text-[#f5f1ca] cursor-pointer flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        <span>Featured di Beranda</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-6 border-t border-[#f5f1ca]/12 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-[#161512] hover:bg-[#282622] text-[#9e9a8d] text-xs font-bold border border-[#f5f1ca]/15 transition-all"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-[#f2eb87] hover:bg-[#e6df73] text-[#161512] text-xs font-bold shadow-md shadow-[#f2eb87]/20 transition-all active:scale-95"
                  >
                    {editingProject ? 'Simpan Perubahan' : 'Tambahkan ke Portfolio'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DELETE CONFIRMATION MODAL */}
      <AnimatePresence>
        {deleteId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md p-6 rounded-3xl bg-[#1f1d19] border border-red-500/30 text-center shadow-2xl"
            >
              <div className="w-12 h-12 rounded-2xl bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-400 mx-auto mb-4">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#f5f1ca] mb-2 font-serif-title">
                Hapus Project Ini?
              </h3>
              <p className="text-xs text-[#9e9a8d] mb-6 leading-relaxed">
                Tindakan ini tidak dapat dibatalkan. Project akan dihapus secara permanen dari basis data dan portal showcase.
              </p>

              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => setDeleteId(null)}
                  className="px-4 py-2 rounded-xl bg-[#161512] hover:bg-[#282622] text-[#9e9a8d] text-xs font-bold border border-[#f5f1ca]/15"
                >
                  Batal
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="px-5 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white text-xs font-bold shadow-lg shadow-red-500/20"
                >
                  Ya, Hapus Project
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
