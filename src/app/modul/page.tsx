'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Cpu,
  Terminal,
  Server,
  Zap,
  Cable,
  CheckCircle2,
  Copy,
  Sparkles,
} from 'lucide-react';

export default function TKJKnowledgeBasePage() {
  const [activeTab, setActiveTab] = useState<'kabel' | 'subnetting' | 'mikrotik' | 'linux' | 'fo'>('kabel');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="min-h-screen bg-[#161512] text-[#d8d6c6] pt-28 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
    >
      {/* Background Ambience */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-[#f2eb87]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-10 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-[#1f1d19] text-[#f2eb87] border border-[#f2eb87]/30">
            <BookOpen className="w-3.5 h-3.5" />
            <span className="uppercase tracking-widest text-[10px]">TKJ CHEAT SHEETS & KNOWLEDGE BASE</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif-title font-bold text-[#f5f1ca]">
            Arsip Modul & Panduan Praktikum TKJ
          </h1>
          <p className="text-xs sm:text-sm text-[#9e9a8d] leading-relaxed">
            Rangkuman rumus subnetting, standar warna kabel UTP, perintah MikroTik RouterOS & Debian Server untuk persiapan ujian dan praktikum laboratorium.
          </p>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            {[
              { id: 'kabel', label: 'Standar Kabel UTP' },
              { id: 'subnetting', label: 'Tabel Subnetting IPv4' },
              { id: 'mikrotik', label: 'CLI MikroTik RouterOS' },
              { id: 'linux', label: 'Debian Linux Server' },
              { id: 'fo', label: 'Kode Warna Fiber Optic' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-2xl text-xs font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-[#f2eb87] text-[#111111] shadow-lg shadow-[#f2eb87]/20 font-bold'
                    : 'bg-[#1f1d19] border border-[#f5f1ca]/10 text-[#9e9a8d] hover:text-[#f5f1ca]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab 1: Kabel UTP Standar T568A & T568B */}
        {activeTab === 'kabel' && (
          <div className="p-6 sm:p-10 rounded-3xl bg-[#1f1d19] border border-[#f5f1ca]/15 shadow-2xl space-y-8">
            <div>
              <h2 className="text-xl sm:text-2xl font-serif-title font-bold text-[#f5f1ca]">
                Standar Urutan Warna Kabel UTP (EIA/TIA 568A & 568B)
              </h2>
              <p className="text-xs text-[#9e9a8d] mt-1">
                Gunakan standar T568B untuk kabel Straight-Through (koneksi beda perangkat seperti PC ke Switch).
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* T568B */}
              <div className="p-6 rounded-2xl bg-[#161512] border border-[#f2eb87]/30 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#f5f1ca]/10">
                  <span className="font-serif-title font-bold text-base text-[#f2eb87]">
                    Standar T568B (Paling Sering Digunakan)
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#f2eb87]/10 text-[#f2eb87]">
                    Standar B
                  </span>
                </div>

                <div className="space-y-2">
                  {[
                    { pin: 1, color: 'Putih - Orange', hex: '#fb923c', striped: true },
                    { pin: 2, color: 'Orange', hex: '#ea580c' },
                    { pin: 3, color: 'Putih - Hijau', hex: '#4ade80', striped: true },
                    { pin: 4, color: 'Biru', hex: '#3b82f6' },
                    { pin: 5, color: 'Putih - Biru', hex: '#60a5fa', striped: true },
                    { pin: 6, color: 'Hijau', hex: '#16a34a' },
                    { pin: 7, color: 'Putih - Cokelat', hex: '#a8a29e', striped: true },
                    { pin: 8, color: 'Cokelat', hex: '#78350f' },
                  ].map((p) => (
                    <div
                      key={p.pin}
                      className="flex items-center justify-between p-2 rounded-xl bg-[#1f1d19] text-xs font-mono"
                    >
                      <span className="text-[#9e9a8d]">Pin {p.pin}</span>
                      <div className="flex items-center gap-2">
                        <span
                          className="w-4 h-4 rounded-full border border-white/20 inline-block"
                          style={{ backgroundColor: p.hex }}
                        />
                        <span className="font-semibold text-[#f5f1ca]">{p.color}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* T568A */}
              <div className="p-6 rounded-2xl bg-[#161512] border border-[#f5f1ca]/10 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#f5f1ca]/10">
                  <span className="font-serif-title font-bold text-base text-[#f5f1ca]">
                    Standar T568A
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-[#9e9a8d]">
                    Standar A
                  </span>
                </div>

                <div className="space-y-2">
                  {[
                    { pin: 1, color: 'Putih - Hijau', hex: '#4ade80', striped: true },
                    { pin: 2, color: 'Hijau', hex: '#16a34a' },
                    { pin: 3, color: 'Putih - Orange', hex: '#fb923c', striped: true },
                    { pin: 4, color: 'Biru', hex: '#3b82f6' },
                    { pin: 5, color: 'Putih - Biru', hex: '#60a5fa', striped: true },
                    { pin: 6, color: 'Orange', hex: '#ea580c' },
                    { pin: 7, color: 'Putih - Cokelat', hex: '#a8a29e', striped: true },
                    { pin: 8, color: 'Cokelat', hex: '#78350f' },
                  ].map((p) => (
                    <div
                      key={p.pin}
                      className="flex items-center justify-between p-2 rounded-xl bg-[#1f1d19] text-xs font-mono"
                    >
                      <span className="text-[#9e9a8d]">Pin {p.pin}</span>
                      <div className="flex items-center gap-2">
                        <span
                          className="w-4 h-4 rounded-full border border-white/20 inline-block"
                          style={{ backgroundColor: p.hex }}
                        />
                        <span className="font-semibold text-[#d8d6c6]">{p.color}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Tabel Subnetting IPv4 */}
        {activeTab === 'subnetting' && (
          <div className="p-6 sm:p-10 rounded-3xl bg-[#1f1d19] border border-[#f5f1ca]/15 shadow-2xl space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-serif-title font-bold text-[#f5f1ca]">
                Tabel Cheat Sheet Subnetting IPv4 (/24 s/d /30)
              </h2>
              <p className="text-xs text-[#9e9a8d] mt-1">
                Rumus Host: 2^n - 2 (di mana n adalah jumlah bit host 0).
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#f5f1ca]/10 text-[#f2eb87] uppercase text-[10px] tracking-wider">
                    <th className="py-3 px-4">CIDR</th>
                    <th className="py-3 px-4">Subnet Mask</th>
                    <th className="py-3 px-4">Total IP</th>
                    <th className="py-3 px-4">Usable Host (Valid)</th>
                    <th className="py-3 px-4">Kebutuhan Umum</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f5f1ca]/5 font-mono">
                  {[
                    { cidr: '/24', mask: '255.255.255.0', total: 256, usable: 254, use: 'Laboratorium Utama / 1 Ruang Kelas' },
                    { cidr: '/25', mask: '255.255.255.128', total: 128, usable: 126, use: 'Setengah Lab / Departemen' },
                    { cidr: '/26', mask: '255.255.255.192', total: 64, usable: 62, use: '1 Baris Workstation PC Siswa' },
                    { cidr: '/27', mask: '255.255.255.224', total: 32, usable: 30, use: 'Ruang Ujian / Kelas Khusus' },
                    { cidr: '/28', mask: '255.255.255.240', total: 16, usable: 14, use: 'Server Farm / DMZ' },
                    { cidr: '/29', mask: '255.255.255.248', total: 8, usable: 6, use: 'Interkoneksi Multi-Router' },
                    { cidr: '/30', mask: '255.255.255.252', total: 4, usable: 2, use: 'Point-to-Point Link Antar Router' },
                  ].map((row) => (
                    <tr key={row.cidr} className="hover:bg-[#161512] transition-colors">
                      <td className="py-3 px-4 font-bold text-[#f2eb87]">{row.cidr}</td>
                      <td className="py-3 px-4 text-[#f5f1ca]">{row.mask}</td>
                      <td className="py-3 px-4 text-[#d8d6c6]">{row.total}</td>
                      <td className="py-3 px-4 text-emerald-400 font-bold">{row.usable}</td>
                      <td className="py-3 px-4 text-[#9e9a8d] font-sans">{row.use}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: CLI MikroTik */}
        {activeTab === 'mikrotik' && (
          <div className="p-6 sm:p-10 rounded-3xl bg-[#1f1d19] border border-[#f5f1ca]/15 shadow-2xl space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-serif-title font-bold text-[#f5f1ca]">
                Perintah Wajib MikroTik RouterOS (MTCNA / UKK TKJ)
              </h2>
              <p className="text-xs text-[#9e9a8d] mt-1">
                Kumpulan perintah terminal CLI cepat untuk konfigurasi gateway, NAT, dan DHCP server.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[
                {
                  title: '1. Pasang IP Address',
                  cmd: '/ip address add address=192.168.27.1/24 interface=ether2 comment="LAN-TKJ"',
                  desc: 'Menetapkan IP gateway pada interface lokal ether2.',
                },
                {
                  title: '2. Internet NAT Masquerade',
                  cmd: '/ip firewall nat add chain=srcnat out-interface=ether1 action=masquerade',
                  desc: 'Membagikan akses internet dari ether1 ke seluruh klien LAN.',
                },
                {
                  title: '3. Default Gateway Routing',
                  cmd: '/ip route add dst-address=0.0.0.0/0 gateway=192.168.1.1',
                  desc: 'Mengarahkan seluruh paket internet ke gateway ISP.',
                },
                {
                  title: '4. DNS Server & Allow Request',
                  cmd: '/ip dns set servers=8.8.8.8,1.1.1.1 allow-remote-requests=yes',
                  desc: 'Mengaktifkan DNS resolver cache untuk klien lokal.',
                },
                {
                  title: '5. DHCP Server Setup Cepat',
                  cmd: '/ip dhcp-server setup',
                  desc: 'Wizard interaktif untuk membagikan IP dinamis ke siswa.',
                },
                {
                  title: '6. Blokir Situs via Raw Firewall',
                  cmd: '/ip firewall filter add chain=forward content="youtube.com" action=drop',
                  desc: 'Memblokir akses domain tertentu saat jam ujian berlangsung.',
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-[#161512] border border-[#f5f1ca]/10 space-y-2 relative group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-serif-title font-bold text-sm text-[#f2eb87]">
                      {item.title}
                    </span>
                    <button
                      onClick={() => copyToClipboard(item.cmd)}
                      className="p-1.5 rounded-lg text-[#9e9a8d] hover:text-[#f2eb87] hover:bg-[#1f1d19] transition-all"
                      title="Salin Perintah"
                    >
                      {copiedText === item.cmd ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                  <pre className="p-3 rounded-xl bg-[#11100e] text-[#f5f1ca] font-mono text-[11px] overflow-x-auto">
                    <code>{item.cmd}</code>
                  </pre>
                  <p className="text-[11px] text-[#9e9a8d]">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Debian Linux Server */}
        {activeTab === 'linux' && (
          <div className="p-6 sm:p-10 rounded-3xl bg-[#1f1d19] border border-[#f5f1ca]/15 shadow-2xl space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-serif-title font-bold text-[#f5f1ca]">
                Perintah Esensial Debian Linux Server
              </h2>
              <p className="text-xs text-[#9e9a8d] mt-1">
                Konfigurasi network interface, service management, dan web server Apache/Nginx.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[
                {
                  title: 'Konfigurasi IP Statis Debian',
                  cmd: 'nano /etc/network/interfaces\n# auto ens33\n# iface ens33 inet static\n# address 192.168.27.10/24',
                  desc: 'File konfigurasi kartu jaringan utama Linux Debian.',
                },
                {
                  title: 'Restart Layanan Jaringan',
                  cmd: 'systemctl restart networking',
                  desc: 'Menerapkan perubahan konfigurasi IP tanpa perlu reboot.',
                },
                {
                  title: 'Instalasi Web Server & DNS',
                  cmd: 'apt update && apt install apache2 bind9 isc-dhcp-server -y',
                  desc: 'Paket server utama untuk uji kompetensi server.',
                },
                {
                  title: 'Cek Status Service Berjalan',
                  cmd: 'systemctl status apache2',
                  desc: 'Memeriksa apakah web server aktif (running) atau error.',
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-[#161512] border border-[#f5f1ca]/10 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-serif-title font-bold text-sm text-[#f2eb87]">
                      {item.title}
                    </span>
                    <button
                      onClick={() => copyToClipboard(item.cmd)}
                      className="p-1.5 rounded-lg text-[#9e9a8d] hover:text-[#f2eb87] hover:bg-[#1f1d19] transition-all"
                    >
                      {copiedText === item.cmd ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                  <pre className="p-3 rounded-xl bg-[#11100e] text-[#f5f1ca] font-mono text-[11px] overflow-x-auto">
                    <code>{item.cmd}</code>
                  </pre>
                  <p className="text-[11px] text-[#9e9a8d]">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 5: Kode Warna Fiber Optic */}
        {activeTab === 'fo' && (
          <div className="p-6 sm:p-10 rounded-3xl bg-[#1f1d19] border border-[#f5f1ca]/15 shadow-2xl space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-serif-title font-bold text-[#f5f1ca]">
                Standar 12 Warna Core Fiber Optic (TIA-598C)
              </h2>
              <p className="text-xs text-[#9e9a8d] mt-1">
                Jembatan keledai hafalan: &ldquo;BOHCA PUMIH KUPINTO&rdquo; (Biru, Orange, Hijau, Cokelat, Abu-abu, Putih, Merah, Hitam, Kuning, Ungu, Pink, Toska).
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {[
                { core: 1, name: 'Biru', hex: '#2563eb' },
                { core: 2, name: 'Orange', hex: '#ea580c' },
                { core: 3, name: 'Hijau', hex: '#16a34a' },
                { core: 4, name: 'Cokelat', hex: '#78350f' },
                { core: 5, name: 'Abu-abu', hex: '#6b7280' },
                { core: 6, name: 'Putih', hex: '#f3f4f6', darkBorder: true },
                { core: 7, name: 'Merah', hex: '#dc2626' },
                { core: 8, name: 'Hitam', hex: '#000000', lightBorder: true },
                { core: 9, name: 'Kuning', hex: '#eab308' },
                { core: 10, name: 'Ungu', hex: '#9333ea' },
                { core: 11, name: 'Pink', hex: '#ec4899' },
                { core: 12, name: 'Toska (Aqua)', hex: '#06b6d4' },
              ].map((c) => (
                <div
                  key={c.core}
                  className="p-4 rounded-2xl bg-[#161512] border border-[#f5f1ca]/10 flex items-center gap-3 font-mono text-xs"
                >
                  <span
                    className="w-6 h-6 rounded-lg border flex-shrink-0"
                    style={{
                      backgroundColor: c.hex,
                      borderColor: c.darkBorder ? '#999' : 'rgba(255,255,255,0.2)',
                    }}
                  />
                  <div>
                    <span className="text-[#9e9a8d] text-[10px] block">Core #{c.core}</span>
                    <span className="font-bold text-[#f5f1ca]">{c.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
