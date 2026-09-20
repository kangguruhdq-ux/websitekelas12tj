'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, X, Minimize2, Maximize2, Sparkles, Monitor } from 'lucide-react';
import { useClassData } from '@/context/ClassDataContext';

interface TerminalLine {
  id: string;
  type: 'input' | 'output' | 'error' | 'system';
  text: string;
}

export default function TerminalModal() {
  const { settings, students } = useClassData();
  const [isOpen, setIsOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [matrixActive, setMatrixActive] = useState(false);

  const [lines, setLines] = useState<TerminalLine[]>([
    {
      id: 'init-1',
      type: 'system',
      text: 'Debian GNU/Linux XII-TKJ-CORE (tty1) - RouterOS v7.14 Enterprise',
    },
    {
      id: 'init-2',
      type: 'system',
      text: `Connected to gateway: 192.168.27.1 (Interface: ether1-bridge) | 34 Nodes Active`,
    },
    {
      id: 'init-3',
      type: 'system',
      text: 'Ketik "help" untuk melihat daftar perintah kejuruan & rahasia kelas.',
    },
  ]);

  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Keyboard shortcut Ctrl + ` (tilde) or Ctrl + ~
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === '`' || e.key === '~')) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [isOpen, lines]);

  // Matrix Effect Canvas
  useEffect(() => {
    if (!matrixActive) return;
    const canvas = document.getElementById('matrix-canvas') as HTMLCanvasElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const chars = '01TKJNETWORKING192168ROUTERMIKROTIK1010';
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = Array(columns).fill(1);

    const interval = setInterval(() => {
      ctx.fillStyle = 'rgba(22, 21, 18, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#f2eb87';
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    }, 35);

    const handleStop = () => setMatrixActive(false);
    window.addEventListener('click', handleStop);
    window.addEventListener('keydown', handleStop);

    return () => {
      clearInterval(interval);
      window.removeEventListener('click', handleStop);
      window.removeEventListener('keydown', handleStop);
    };
  }, [matrixActive]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = inputVal.trim();
    if (!cmd) return;

    const newCmdLine: TerminalLine = {
      id: `in-${Date.now()}`,
      type: 'input',
      text: `xii-tkj@router:~$ ${cmd}`,
    };

    setCmdHistory((prev) => [...prev, cmd]);
    setHistoryIndex(-1);
    setInputVal('');

    const parts = cmd.toLowerCase().split(' ');
    const mainCmd = parts[0];
    const arg = parts[1];

    let outputLines: TerminalLine[] = [];

    switch (mainCmd) {
      case 'help':
        outputLines = [
          {
            id: `out-${Date.now()}-1`,
            type: 'output',
            text: `[PERINTAH RESMI XII TKJ TERMINAL]
  help                : Menampilkan menu bantuan ini
  whoami              : Informasi sesi & identitas pengunjung
  ping [target]       : Uji koneksi (contoh: ping siswa, ping wali-kelas, ping gateway)
  ls / dir            : Menampilkan direktori berkas rahasia
  cat [file]          : Membaca isi berkas (contoh: cat cita-cita.txt)
  uptime              : Status kebersamaan & countdown kelulusan
  matrix              : Masuk ke mode hujan kode biner emas (Tekan apa saja untuk keluar)
  siswa               : Ringkasan 34 siswa XII TKJ
  clear / cls         : Membersihkan layar terminal
  exit / quit         : Menutup terminal`,
          },
        ];
        break;

      case 'whoami':
        outputLines = [
          {
            id: `out-${Date.now()}`,
            type: 'output',
            text: `USER: Tamu Kehormatan XII TKJ | IP: 192.168.27.254 | ACCESS: Read-Only VIP | STATUS: Terhubung ke Hati XII TKJ`,
          },
        ];
        break;

      case 'ping': {
        const target = arg || '8.8.8.8';
        outputLines = [
          {
            id: `out-${Date.now()}-1`,
            type: 'output',
            text: `PING ${target} (192.168.27.1) 56(84) bytes of data.
64 bytes from ${target}: icmp_seq=1 ttl=64 time=0.428 ms
64 bytes from ${target}: icmp_seq=2 ttl=64 time=0.512 ms
64 bytes from ${target}: icmp_seq=3 ttl=64 time=0.389 ms
--- ${target} ping statistics ---
3 packets transmitted, 3 received, 0% packet loss, time 2002ms
rtt min/avg/max = 0.389/0.443/0.512 ms (Solid tanpa hambatan!)`,
          },
        ];
        break;
      }

      case 'ls':
      case 'dir':
        outputLines = [
          {
            id: `out-${Date.now()}`,
            type: 'output',
            text: `total 48K
drwxr-xr-x 2 root root 4.0K Sep 20 2026 .
-rw-r--r-- 1 admin root  512 Sep 20 2026 cita-cita.txt
-rw-r--r-- 1 admin root  780 Sep 20 2026 pesan-wali-kelas.txt
-rw-r--r-- 1 admin root  256 Sep 20 2026 mikrotik-rules.conf
-rwxr-xr-x 1 admin root  1024 Sep 20 2026 kenangan-lab.sh*`,
          },
        ];
        break;

      case 'cat':
        if (arg === 'cita-cita.txt') {
          outputLines = [
            {
              id: `out-${Date.now()}`,
              type: 'output',
              text: `"Melangkah bersama dari kabel UTP yang kusut, menuju arsitek jaringan masa depan yang tangguh, jujur, dan berkelas dunia. Kami adalah XII TKJ 2026/2027!"`,
            },
          ];
        } else if (arg === 'pesan-wali-kelas.txt') {
          outputLines = [
            {
              id: `out-${Date.now()}`,
              type: 'output',
              text: `Pesan Bu Febriyana, S.T.: "Ilmu teknis itu penting, tapi integritas dan kekompakan kalian adalah yang membuat kalian benar-benar berhasil di masa depan."`,
            },
          ];
        } else if (arg === 'mikrotik-rules.conf') {
          outputLines = [
            {
              id: `out-${Date.now()}`,
              type: 'output',
              text: `/ip firewall filter add chain=forward action=accept comment="Allow XII TKJ to Success"\n/ip firewall nat add chain=srcnat out-interface=ether1-future action=masquerade`,
            },
          ];
        } else {
          outputLines = [
            {
              id: `out-${Date.now()}`,
              type: 'error',
              text: `cat: ${arg || 'file'}: File tidak ditemukan. Coba ketik "ls" untuk melihat daftar file.`,
            },
          ];
        }
        break;

      case 'uptime':
        outputLines = [
          {
            id: `out-${Date.now()}`,
            type: 'output',
            text: `UPTIME: 3 Tahun Kebersamaan | Load Average: 0.00 (Santai tapi Pasti) | Menuju UKK & Wisuda: Menghitung hari menuju puncak kelulusan 2027!`,
          },
        ];
        break;

      case 'matrix':
        setMatrixActive(true);
        outputLines = [
          {
            id: `out-${Date.now()}`,
            type: 'system',
            text: 'Memulai Matrix Digital Stream... Tekan tombol apa saja untuk kembali.',
          },
        ];
        break;

      case 'siswa':
        outputLines = [
          {
            id: `out-${Date.now()}`,
            type: 'output',
            text: `[XII TKJ ROSTER]: Total ${students.length} Siswa terdaftar aktif.\nKetua Kelas: Daffa Haidar F. | Wakil: Gabriel Putra P. | Danton: Maheswara Ceta P.\nBuka halaman /siswa untuk melihat profil lengkap!`,
          },
        ];
        break;

      case 'sudo':
        outputLines = [
          {
            id: `out-${Date.now()}`,
            type: 'error',
            text: `[SECURITY ALERT]: User 'tamu' is not in the sudoers file. Insiden ini akan dilaporkan ke Bu Febriyana, S.T.!`,
          },
        ];
        break;

      case 'clear':
      case 'cls':
        setLines([]);
        return;

      case 'exit':
      case 'quit':
        setIsOpen(false);
        return;

      default:
        outputLines = [
          {
            id: `out-${Date.now()}`,
            type: 'error',
            text: `bash: ${cmd}: perintah tidak dikenali. Ketik "help" untuk melihat daftar perintah.`,
          },
        ];
    }

    setLines((prev) => [...prev, newCmdLine, ...outputLines]);
  };

  return (
    <>
      {/* Launcher Button di Pojok Kiri Bawah */}
      <button
        onClick={() => setIsOpen(true)}
        title="Buka Terminal CLI TKJ (Ctrl + ~)"
        className="fixed bottom-5 left-5 z-40 p-3 rounded-2xl bg-[#1f1d19]/90 backdrop-blur-md border border-[#f5f1ca]/15 text-[#f2eb87] hover:border-[#f2eb87] hover:scale-105 shadow-xl transition-all flex items-center gap-2 group"
      >
        <Terminal className="w-4 h-4" />
        <span className="hidden sm:inline text-[11px] font-mono font-semibold text-[#f5f1ca] group-hover:text-[#f2eb87]">
          CLI Terminal
        </span>
      </button>

      {/* Matrix Overlay */}
      {matrixActive && (
        <canvas id="matrix-canvas" className="fixed inset-0 z-50 pointer-events-auto bg-[#161512]" />
      )}

      {/* Terminal Modal Window */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className={`relative z-10 w-full bg-[#11100e] border border-[#f2eb87]/30 rounded-2xl shadow-2xl shadow-black overflow-hidden flex flex-col font-mono text-xs transition-all ${
                isMaximized ? 'h-[92vh] max-w-[96vw]' : 'h-[500px] max-w-3xl'
              }`}
            >
              {/* Window Titlebar */}
              <div className="px-4 py-2.5 bg-[#1a1814] border-b border-[#f5f1ca]/10 flex items-center justify-between select-none">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <span
                      onClick={() => setIsOpen(false)}
                      className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-500 cursor-pointer inline-block"
                    />
                    <span
                      onClick={() => setIsMaximized(!isMaximized)}
                      className="w-3 h-3 rounded-full bg-amber-500/80 hover:bg-amber-500 cursor-pointer inline-block"
                    />
                    <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                  </div>
                  <span className="text-[11px] text-[#9e9a8d] ml-2 flex items-center gap-1">
                    <Monitor className="w-3 h-3 text-[#f2eb87]" />
                    <span>root@xii-tkj-core: ~ (bash)</span>
                  </span>
                </div>

                <div className="flex items-center gap-2 text-[#9e9a8d]">
                  <button
                    onClick={() => setIsMaximized(!isMaximized)}
                    className="p-1 hover:text-[#f5f1ca]"
                  >
                    {isMaximized ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                  </button>
                  <button onClick={() => setIsOpen(false)} className="p-1 hover:text-[#f5f1ca]">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Console Body */}
              <div
                ref={scrollRef}
                onClick={() => inputRef.current?.focus()}
                className="flex-1 p-4 overflow-y-auto space-y-2 text-[#d8d6c6] scrollbar-thin scrollbar-thumb-[#f5f1ca]/10 cursor-text"
              >
                {lines.map((l) => (
                  <div
                    key={l.id}
                    className={`leading-relaxed whitespace-pre-wrap ${
                      l.type === 'input'
                        ? 'text-[#f2eb87] font-bold'
                        : l.type === 'error'
                        ? 'text-red-400'
                        : l.type === 'system'
                        ? 'text-emerald-400/90'
                        : 'text-[#d8d6c6]'
                    }`}
                  >
                    {l.text}
                  </div>
                ))}

                {/* Input Prompt */}
                <form onSubmit={handleCommand} className="flex items-center gap-2 pt-1">
                  <span className="text-[#f2eb87] font-bold flex-shrink-0">
                    xii-tkj@router:~$
                  </span>
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                    className="flex-1 bg-transparent text-[#f5f1ca] focus:outline-none border-none p-0 font-mono text-xs"
                    autoFocus
                  />
                </form>
              </div>

              {/* Footer status */}
              <div className="px-4 py-1.5 bg-[#141310] border-t border-[#f5f1ca]/5 text-[10px] text-[#9e9a8d] flex justify-between">
                <span>Tekan <kbd className="px-1 py-0.5 rounded bg-[#1f1d19] text-[#f2eb87]">Ctrl + ~</kbd> untuk buka/tutup</span>
                <span>Port 22 SSH • MikroTik RouterOS</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
