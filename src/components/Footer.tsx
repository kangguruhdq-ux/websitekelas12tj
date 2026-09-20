'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useClassData } from '@/context/ClassDataContext';
import { Mail, Shield, Sparkles, MapPin, Phone } from 'lucide-react';

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 3 15.68 6.34 6.34 0 0 0 9.33 22a6.33 6.33 0 0 0 6.34-6.32V8.75a8.18 8.18 0 0 0 4.79 1.54V6.85a4.8 4.8 0 0 1-.87-.16z" />
    </svg>
  );
}

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
      <polygon points="10 15 15 12 10 9 10 15" />
    </svg>
  );
}

export default function Footer() {
  const { settings } = useClassData();
  const pathname = usePathname();

  const instagramLink =
    settings.instagram_url ||
    'https://www.instagram.com/networkengineering27?stkn=bnB4dnY1dHRjcDZ3';
  const tiktokLink =
    settings.tiktok_url ||
    'https://www.tiktok.com/@networkcomp.27?_r=1&_t=ZS-99sUSsU8y0t';

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="relative border-t overflow-hidden transition-colors" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-body)' }}>
      {/* Top subtle theme ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 max-w-4xl h-[1px]" style={{ background: 'linear-gradient(to right, transparent, var(--color-theme), transparent)' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-14">
          {/* Col 1: Identity & Description (Span 5) */}
          <div className="md:col-span-5 space-y-5">
            <div className="flex items-center gap-3">
              {settings.logo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={settings.logo_url}
                  alt={settings.class_name}
                  className="w-10 h-10 rounded-xl object-cover border"
                  style={{ borderColor: 'var(--border-color)' }}
                />
              ) : (
                <div className="flex items-center justify-center w-10 h-10 rounded-xl border font-theme-heading font-bold text-lg" style={{ backgroundColor: 'var(--color-theme-muted)', borderColor: 'var(--border-theme)', color: 'var(--color-theme)' }}>
                  TJ
                </div>
              )}
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-xl font-theme-heading font-bold tracking-tight" style={{ color: 'var(--text-main)' }}>
                    {settings.class_name?.includes('TJ') ? settings.class_name : 'XII TJ'}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border" style={{ backgroundColor: 'var(--color-theme-muted)', color: 'var(--color-theme)', borderColor: 'var(--border-theme)' }}>
                    ANGKATAN 27
                  </span>
                </div>
                <span className="text-xs tracking-wide uppercase font-medium" style={{ color: 'var(--text-muted)' }}>
                  {settings.class_subtitle || 'Teknik Komputer dan Jaringan'}
                </span>
              </div>
            </div>

            <p className="text-sm leading-relaxed font-normal" style={{ color: 'var(--text-body)' }}>
              {settings.description ||
                'Tempat kami belajar, berkembang, berkarya, dan membangun cerita bersama. Melangkah dengan integritas, kebersamaan, dan keunggulan teknologi.'}
            </p>

            {/* Homeroom & Academic Year Badge */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', color: 'var(--text-main)' }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--color-theme)' }} />
                <span>Wali Kelas: <strong className="font-semibold" style={{ color: 'var(--color-theme)' }}>{settings.homeroom_teacher || 'Bu Febriyana, S.T.'}</strong></span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}>
                <Sparkles className="w-3 h-3" style={{ color: 'var(--color-theme)' }} />
                <span>{settings.academic_year || '2026/2027'}</span>
              </div>
            </div>
          </div>

          {/* Col 2: Navigation (Span 3) */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest border-b pb-2" style={{ color: 'var(--text-main)', borderColor: 'var(--border-color)' }}>
              Navigasi Halaman
            </h4>
            <ul className="space-y-2.5 text-sm" style={{ color: 'var(--text-body)' }}>
              <li>
                <Link href="/" className="transition-colors hover:underline" style={{ color: 'var(--text-main)' }}>
                  <span>Beranda Utama</span>
                </Link>
              </li>
              <li>
                <Link href="/projects" className="font-semibold transition-colors flex items-center gap-1.5" style={{ color: 'var(--color-theme)' }}>
                  <span>★ Project TKJ (Showcase)</span>
                </Link>
              </li>
              <li>
                <Link href="/tentang" className="hover:opacity-80 transition-colors">
                  Tentang & Filosofi Kelas
                </Link>
              </li>
              <li>
                <Link href="/siswa" className="hover:opacity-80 transition-colors">
                  Direktori Siswa (34 Anggota)
                </Link>
              </li>
              <li>
                <Link href="/denah" className="hover:text-[#f2eb87] transition-colors">
                  Denah Meja & Lab Komputer
                </Link>
              </li>
              <li>
                <Link href="/struktur" className="hover:text-[#f2eb87] transition-colors">
                  Struktur Organisasi (BEM Profile)
                </Link>
              </li>
              <li>
                <Link href="/modul" className="hover:text-[#f2eb87] transition-colors">
                  Modul & Cheat Sheets TKJ
                </Link>
              </li>
              <li>
                <Link href="/kapsul-waktu" className="hover:text-[#f2eb87] transition-colors">
                  Kapsul Waktu Digital 2030
                </Link>
              </li>
              <li>
                <Link href="/superlatives" className="hover:text-[#f2eb87] transition-colors">
                  Hall of Fame & &ldquo;Si Paling&rdquo;
                </Link>
              </li>
              <li>
                <Link href="/kenangan" className="hover:text-[#f2eb87] transition-colors">
                  Dinding Kenangan & Buku Tamu
                </Link>
              </li>
              <li>
                <Link href="/agenda" className="hover:text-[#f2eb87] transition-colors">
                  Program Kerja & Agenda
                </Link>
              </li>
              <li>
                <Link href="/galeri" className="hover:text-[#f2eb87] transition-colors">
                  Galeri Dokumentasi Kegiatan
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Media Sosial & Saluran Komunikasi (Span 4) */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#f5f1ca] border-b border-[#f5f1ca]/10 pb-2">
              Kanal Resmi & Media Sosial
            </h4>
            <p className="text-xs text-[#9e9a8d] leading-relaxed">
              Ikuti dokumentasi momen, kabar terkini, serta kegiatan belajar praktikum kelas XII TKJ melalui saluran resmi kami:
            </p>

            <div className="flex flex-col gap-2.5">
              {/* Instagram */}
              <a
                href={instagramLink}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 p-2.5 rounded-xl bg-[#1f1d19] border border-[#f5f1ca]/15 hover:border-[#f2eb87]/50 text-xs text-[#f5f1ca] hover:text-[#f2eb87] transition-all group"
              >
                <div className="p-1.5 rounded-lg bg-pink-500/10 text-pink-400 group-hover:bg-pink-500/20 transition-colors">
                  <InstagramIcon className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold">Instagram Resmi</span>
                  <span className="text-[11px] text-[#9e9a8d] truncate max-w-[200px]">@networkengineering27</span>
                </div>
              </a>

              {/* TikTok */}
              <a
                href={tiktokLink}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 p-2.5 rounded-xl bg-[#1f1d19] border border-[#f5f1ca]/15 hover:border-[#f2eb87]/50 text-xs text-[#f5f1ca] hover:text-[#f2eb87] transition-all group"
              >
                <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-500/20 transition-colors">
                  <TikTokIcon className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold">TikTok Resmi</span>
                  <span className="text-[11px] text-[#9e9a8d] truncate max-w-[200px]">@networkcomp.27</span>
                </div>
              </a>

              {/* Additional Channels */}
              <div className="flex items-center gap-2 pt-1">
                {settings.youtube_url && (
                  <a
                    href={settings.youtube_url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="YouTube"
                    className="p-2.5 rounded-xl bg-[#1f1d19] border border-[#f5f1ca]/15 hover:border-[#f2eb87]/50 text-red-400 hover:text-red-300 transition-all"
                  >
                    <YoutubeIcon className="w-4 h-4" />
                  </a>
                )}
                {settings.github_url && (
                  <a
                    href={settings.github_url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="GitHub"
                    className="p-2.5 rounded-xl bg-[#1f1d19] border border-[#f5f1ca]/15 hover:border-[#f2eb87]/50 text-[#f5f1ca] hover:text-white transition-all"
                  >
                    <GithubIcon className="w-4 h-4" />
                  </a>
                )}
                {settings.contact_email && (
                  <a
                    href={`mailto:${settings.contact_email}`}
                    aria-label="Email"
                    className="p-2.5 rounded-xl bg-[#1f1d19] border border-[#f5f1ca]/15 hover:border-[#f2eb87]/50 text-[#f2eb87] transition-all"
                  >
                    <Mail className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-14 pt-6 border-t border-[#f5f1ca]/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#9e9a8d]">
          <p>
            <a
              href="/admin"
              className="hover:text-[#f2eb87] transition-colors select-none"
              title="Portal"
            >
              ©
            </a>{' '}
            {settings.academic_year || '2026/2027'} {settings.class_name || 'XII TKJ'}. Seluruh Hak Cipta Dilindungi.
          </p>
          <p className="flex items-center gap-1.5">
            <span>Official Portal • Terinspirasi dari Estetika BEM FEB UI</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
