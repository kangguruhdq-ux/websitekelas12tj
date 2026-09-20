'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Heart,
  Bot,
  RotateCcw,
  Wifi,
  Radio,
  Smile,
} from 'lucide-react';
import { useClassData } from '@/context/ClassDataContext';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

type PetMood = 'idle' | 'happy' | 'love' | 'surprised' | 'thinking';

// Helper to clean raw markdown symbols like * or **
function sanitizeChatText(text: string): string {
  if (!text) return '';
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/\*/g, '')
    .trim();
}

export default function InteractivePetBot() {
  const { settings } = useClassData();
  const [isOpen, setIsOpen] = useState(false);
  const [mood, setMood] = useState<PetMood>('idle');
  const [isBlinking, setIsBlinking] = useState(false);
  const [petStreak, setPetStreak] = useState(0);
  const [petReaction, setPetReaction] = useState<string | null>(null);
  const [floatingHearts, setFloatingHearts] = useState<{ id: number; x: number; y: number }[]>([]);

  // Eye tracking state
  const petRef = useRef<HTMLDivElement>(null);
  const [eyeOffset, setEyeOffset] = useState({ x: 0, y: 0 });

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Halo! Aku ${settings.ai_bot_name || 'Ping-Ping si Kucing Router'}, maskot cerdas XII TKJ. Kamu bisa mengelus kepalaku di layar, dan tanyakan apa saja seputar kelas atau praktikum jaringan!`,
      timestamp: 'Baru saja',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Play gentle cute purr synthesizer chime when petted
  const playCutePurrSound = () => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.12); // E5
      osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.22); // G5

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.06, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.36);
    } catch {}
  };

  // Natural eye blinking timer
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 180);
    }, 3800);
    return () => clearInterval(blinkInterval);
  }, []);

  // Track cursor position to move eyes smoothly
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!petRef.current || mood === 'happy' || mood === 'love') return;
      const rect = petRef.current.getBoundingClientRect();
      const petCenterX = rect.left + rect.width / 2;
      const petCenterY = rect.top + rect.height / 2;

      const deltaX = e.clientX - petCenterX;
      const deltaY = e.clientY - petCenterY;
      const distance = Math.hypot(deltaX, deltaY);
      const angle = Math.atan2(deltaY, deltaX);

      // Max eye pupil travel
      const maxDistance = 4.2;
      const travel = Math.min(distance / 60, maxDistance);

      setEyeOffset({
        x: Math.cos(angle) * travel,
        y: Math.sin(angle) * travel,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mood]);

  // Petting interaction (Touch & Mouse)
  const handlePetAction = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    playCutePurrSound();

    const newStreak = petStreak + 1;
    setPetStreak(newStreak);

    // Switch to love eyes if petted more than 3 times consecutively
    const newMood: PetMood = newStreak >= 3 ? 'love' : 'happy';
    setMood(newMood);

    // Spawn floating heart
    const newHeart = {
      id: Date.now() + Math.random(),
      x: (Math.random() - 0.5) * 35,
      y: (Math.random() - 0.5) * 15,
    };
    setFloatingHearts((prev) => [...prev.slice(-5), newHeart]);

    const reactions = [
      'Purrrr... Sinyal 5GHz makin kencang!',
      'Meow! Latency turun jadi 0.1ms!',
      'Koneksi batin optimal! Packet loss 0%!',
      'Purrr... Bandwidth afeksi maksimal!',
      'Nyam nyam! Status routing 100% stabil!',
    ];
    setPetReaction(reactions[Math.floor(Math.random() * reactions.length)]);

    setTimeout(() => {
      setMood('idle');
    }, 1800);

    setTimeout(() => {
      setPetReaction(null);
    }, 3200);
  };

  // Scroll chat to bottom
  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || loading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: sanitizeChatText(text),
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setLoading(true);
    setMood('thinking');

    try {
      const historyPayload = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: historyPayload,
          userMessage: text,
        }),
      });

      const data = await res.json();
      const cleanReply = sanitizeChatText(data.reply || 'Meow! Maaf gateway router ku sedikit goyang.');

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: cleanReply,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
      setMood('happy');
      setTimeout(() => setMood('idle'), 2000);
    } catch {
      const errorMsg: ChatMessage = {
        id: `bot-err-${Date.now()}`,
        role: 'assistant',
        content: 'Maaf, kabel LAN ku sedang restart. Coba tanyakan lagi ya!',
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
      setMood('idle');
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = [
    'Siapa wali kelas kita?',
    'Berapa jumlah siswa XII TKJ?',
    'Urutan warna kabel T568B',
    'Tips ujian praktikum UKK',
  ];

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 select-none">
      {/* 1. Pet Mascot Container */}
      <div
        ref={petRef}
        onClick={handlePetAction}
        onTouchStart={handlePetAction}
        title="Klik / elus kepalaku!"
        className="relative group cursor-pointer flex flex-col items-end"
      >
        {/* Floating Pet Reaction Dialog */}
        <AnimatePresence>
          {petReaction && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: -12, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute -top-14 right-2 px-3 py-1.5 rounded-2xl bg-[#0f172a] border border-[#38bdf8]/50 text-[#f8fafc] text-xs font-semibold shadow-2xl whitespace-nowrap z-30 pointer-events-none"
            >
              {petReaction}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Hearts on Petting */}
        {floatingHearts.map((h) => (
          <motion.div
            key={h.id}
            initial={{ opacity: 1, y: 0, scale: 0.8 }}
            animate={{ opacity: 0, y: -50, scale: 1.4 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            style={{ left: `calc(50% + ${h.x}px)` }}
            className="absolute -top-6 text-pink-400 pointer-events-none z-30"
          >
            <Heart className="w-5 h-5 fill-pink-400 drop-shadow-md" />
          </motion.div>
        ))}

        <div className="flex items-center gap-2">
          {/* Quick Chat Pill */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(!isOpen);
            }}
            className="px-3 py-1.5 rounded-full bg-[#0f172a]/90 backdrop-blur-md border border-[#38bdf8]/40 text-[#f8fafc] hover:text-[#38bdf8] text-xs font-semibold shadow-xl flex items-center gap-1.5 hover:border-[#38bdf8] transition-all"
          >
            <MessageSquare className="w-3.5 h-3.5 text-[#38bdf8]" />
            <span className="text-[11px]">Tanya Ping-Ping</span>
          </button>

          {/* Futuristic Cyber Cat Pet Mascot SVG (Pearlescent Silver Chassis + Electric Cyan Neon) */}
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center filter drop-shadow-2xl">
            <svg
              viewBox="0 0 100 100"
              className="w-full h-full transition-transform duration-200 group-hover:scale-105 active:scale-95"
            >
              <defs>
                {/* Sleek Metallic Pearlescent Body Gradient */}
                <linearGradient id="cyberChassis" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="50%" stopColor="#e2e8f0" />
                  <stop offset="100%" stopColor="#cbd5e1" />
                </linearGradient>

                {/* Dark OLED Screen Gradient */}
                <linearGradient id="oledScreen" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#090d16" />
                  <stop offset="100%" stopColor="#0f172a" />
                </linearGradient>

                {/* Neon Cyan Glow */}
                <filter id="cyanGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="1.5" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Wi-Fi Antenna Ears (Titanium with Cyan Link LED) */}
              {/* Left Antenna */}
              <line x1="26" y1="36" x2="15" y2="14" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round" />
              <circle cx="15" cy="14" r="3.5" fill="#38bdf8" filter="url(#cyanGlow)" />
              {/* Left Wave */}
              <path d="M 10 11 A 7 7 0 0 1 20 11" fill="none" stroke="#38bdf8" strokeWidth="1.5" opacity="0.8" />

              {/* Right Antenna */}
              <line x1="74" y1="36" x2="85" y2="14" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round" />
              <circle cx="85" cy="14" r="3.5" fill="#38bdf8" filter="url(#cyanGlow)" />
              {/* Right Wave */}
              <path d="M 80 11 A 7 7 0 0 1 90 11" fill="none" stroke="#38bdf8" strokeWidth="1.5" opacity="0.8" />

              {/* Sleek Cat Robot Ears */}
              <polygon points="20,44 32,18 42,34" fill="url(#cyberChassis)" stroke="#94a3b8" strokeWidth="1.2" />
              <polygon points="23,40 32,23 39,33" fill="#38bdf8" opacity="0.4" />

              <polygon points="80,44 68,18 58,34" fill="url(#cyberChassis)" stroke="#94a3b8" strokeWidth="1.2" />
              <polygon points="77,40 68,23 61,33" fill="#38bdf8" opacity="0.4" />

              {/* Braided RJ-45 Ethernet Cable Tail with Clear Crystal Head */}
              <path
                d="M 22 75 Q 6 82 10 93 Q 17 94 22 84"
                fill="none"
                stroke="#0284c7"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              {/* RJ-45 Connector with Green Link Activity */}
              <rect x="7" y="89" width="8" height="7" rx="1.5" fill="#e2e8f0" stroke="#0284c7" strokeWidth="1" />
              <circle cx="11" cy="92.5" r="1.2" fill="#22c55e" className="animate-ping" />

              {/* Cat Head Robot Body (Pearlescent White/Silver) */}
              <rect
                x="18"
                y="30"
                width="64"
                height="54"
                rx="20"
                fill="url(#cyberChassis)"
                stroke="#94a3b8"
                strokeWidth="1.5"
              />

              {/* OLED Face Monitor */}
              <rect
                x="24"
                y="36"
                width="52"
                height="42"
                rx="14"
                fill="url(#oledScreen)"
                stroke="#38bdf8"
                strokeWidth="1.2"
              />

              {/* LED Status Indicator Lights on Forehead */}
              <circle cx="44" cy="40.5" r="1.5" fill="#22c55e" className="animate-pulse" />
              <circle cx="50" cy="40.5" r="1.5" fill="#38bdf8" />
              <circle cx="56" cy="40.5" r="1.5" fill="#a855f7" />

              {/* DYNAMIC EXPRESSIONS */}
              {isBlinking ? (
                // Blinking Eyes (Flat lines)
                <g stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="33" y1="53" x2="43" y2="53" />
                  <line x1="57" y1="53" x2="67" y2="53" />
                </g>
              ) : mood === 'love' ? (
                // Heart Eyes
                <g fill="#f43f5e">
                  <path d="M 38 49 A 3 3 0 0 0 33 52 C 33 55 38 58 38 58 C 38 58 43 55 43 52 A 3 3 0 0 0 38 49 Z" />
                  <path d="M 62 49 A 3 3 0 0 0 57 52 C 57 55 62 58 62 58 C 62 58 67 55 67 52 A 3 3 0 0 0 62 49 Z" />
                </g>
              ) : mood === 'happy' ? (
                // Happy Closed Eyes (^  ^)
                <g stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" fill="none">
                  <path d="M 33 54 Q 38 46 43 54" />
                  <path d="M 57 54 Q 62 46 67 54" />
                </g>
              ) : mood === 'thinking' ? (
                // Thinking Matrix Scanning Bar
                <g stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="33" y1="53" x2="43" y2="53" className="animate-pulse" />
                  <circle cx="62" cy="53" r="3" fill="#38bdf8" />
                </g>
              ) : (
                // Idle Tracking Eyes (Follows cursor)
                <g>
                  {/* Left Eye Socket */}
                  <ellipse cx="38" cy="52" rx="6" ry="7" fill="#030712" stroke="#38bdf8" strokeWidth="1" />
                  <circle
                    cx={38 + eyeOffset.x}
                    cy={52 + eyeOffset.y}
                    r="4"
                    fill="#38bdf8"
                    filter="url(#cyanGlow)"
                  />
                  <circle cx={38 + eyeOffset.x + 1.2} cy={52 + eyeOffset.y - 1.2} r="1.2" fill="#ffffff" />

                  {/* Right Eye Socket */}
                  <ellipse cx="62" cy="52" rx="6" ry="7" fill="#030712" stroke="#38bdf8" strokeWidth="1" />
                  <circle
                    cx={62 + eyeOffset.x}
                    cy={52 + eyeOffset.y}
                    r="4"
                    fill="#38bdf8"
                    filter="url(#cyanGlow)"
                  />
                  <circle cx={62 + eyeOffset.x + 1.2} cy={52 + eyeOffset.y - 1.2} r="1.2" fill="#ffffff" />
                </g>
              )}

              {/* Cute Cat Mouth */}
              <polygon points="50,60 48,58.5 52,58.5" fill="#38bdf8" />
              <path
                d="M 46 62.5 Q 50 66 50 62.5 Q 50 66 54 62.5"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="1.5"
                strokeLinecap="round"
              />

              {/* Rosy Cheeks */}
              <ellipse cx="29" cy="61" rx="3.5" ry="2" fill="#fb7185" opacity={mood === 'happy' || mood === 'love' ? 0.9 : 0.4} />
              <ellipse cx="71" cy="61" rx="3.5" ry="2" fill="#fb7185" opacity={mood === 'happy' || mood === 'love' ? 0.9 : 0.4} />

              {/* Whiskers */}
              <line x1="21" y1="52" x2="13" y2="50" stroke="#94a3b8" strokeWidth="1" opacity="0.6" />
              <line x1="21" y1="56" x2="12" y2="58" stroke="#94a3b8" strokeWidth="1" opacity="0.6" />
              <line x1="79" y1="52" x2="87" y2="50" stroke="#94a3b8" strokeWidth="1" opacity="0.6" />
              <line x1="79" y1="56" x2="88" y2="58" stroke="#94a3b8" strokeWidth="1" opacity="0.6" />

              {/* Front Paws */}
              <ellipse cx="36" cy="84" rx="6.5" ry="4.5" fill="#ffffff" stroke="#94a3b8" strokeWidth="1.2" />
              <ellipse cx="64" cy="84" rx="6.5" ry="4.5" fill="#ffffff" stroke="#94a3b8" strokeWidth="1.2" />
            </svg>
          </div>
        </div>
      </div>

      {/* 2. Chat Modal (100% Mobile & Desktop Responsive - Never Cut Off) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed inset-x-3 bottom-3 top-auto sm:inset-auto sm:bottom-24 sm:right-6 sm:w-[420px] max-h-[82vh] h-[550px] bg-[#1a1915]/98 backdrop-blur-2xl border border-[#f5f1ca]/20 rounded-3xl shadow-2xl shadow-black z-50 flex flex-col overflow-hidden text-[#d8d6c6]"
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-[#2a261f] via-[#1f1d19] to-[#161512] border-b border-[#f5f1ca]/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#0f172a] border border-[#38bdf8]/40 text-[#38bdf8] flex items-center justify-center relative shadow-inner">
                  <Bot className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#161512] animate-pulse" />
                </div>
                <div>
                  <h3 className="font-serif-title font-bold text-sm text-[#f5f1ca]">
                    {settings.ai_bot_name || 'Ping-Ping si Kucing Router'}
                  </h3>
                  <p className="text-[10px] text-[#9e9a8d] flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                    <span>Gateway XII TKJ Online • Latency 0.1ms</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() =>
                    setMessages([
                      {
                        id: 'welcome-reset',
                        role: 'assistant',
                        content: 'Obrolan dibersihkan! Ada yang ingin kamu tanyakan seputar kelas atau praktikum?',
                        timestamp: 'Baru saja',
                      },
                    ])
                  }
                  title="Bersihkan Obrolan"
                  className="p-2 rounded-xl text-[#9e9a8d] hover:text-[#f2eb87] transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-xl text-[#9e9a8d] hover:text-[#f5f1ca] transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Chat Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs scrollbar-thin scrollbar-thumb-[#f5f1ca]/10">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex gap-2.5 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {m.role === 'assistant' && (
                    <div className="w-6 h-6 rounded-lg bg-[#0f172a] border border-[#38bdf8]/40 text-[#38bdf8] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                  )}

                  <div
                    className={`max-w-[82%] p-3.5 rounded-2xl leading-relaxed whitespace-pre-wrap ${
                      m.role === 'user'
                        ? 'bg-[#f2eb87] text-[#111111] font-semibold rounded-br-none shadow-md'
                        : 'bg-[#1f1d19] border border-[#f5f1ca]/12 text-[#f5f1ca] rounded-bl-none shadow-sm'
                    }`}
                  >
                    {m.content}
                    <div
                      className={`text-[9px] mt-1 font-mono text-right ${
                        m.role === 'user' ? 'text-black/60' : 'text-[#9e9a8d]'
                      }`}
                    >
                      {m.timestamp}
                    </div>
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex gap-2 items-center text-[#9e9a8d] text-xs pl-8">
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#38bdf8] animate-bounce" />
                    <span className="w-2 h-2 rounded-full bg-[#38bdf8] animate-bounce [animation-delay:0.2s]" />
                    <span className="w-2 h-2 rounded-full bg-[#38bdf8] animate-bounce [animation-delay:0.4s]" />
                  </div>
                  <span className="text-[11px] italic text-[#38bdf8]">Ping-Ping sedang berpikir...</span>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Quick Chips */}
            <div className="px-4 py-2 border-t border-[#f5f1ca]/5 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {quickPrompts.map((p) => (
                <button
                  key={p}
                  onClick={() => handleSendMessage(p)}
                  className="px-2.5 py-1 rounded-full bg-[#161512] border border-[#f5f1ca]/10 text-[10px] text-[#d8d6c6] hover:text-[#f2eb87] hover:border-[#f2eb87]/40 whitespace-nowrap transition-colors"
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <div className="p-3 bg-[#161512] border-t border-[#f5f1ca]/10 flex items-center gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSendMessage();
                }}
                placeholder="Tanyakan sesuatu ke Ping-Ping..."
                className="flex-1 px-4 py-2.5 rounded-xl bg-[#1f1d19] border border-[#f5f1ca]/15 text-[#f5f1ca] text-xs focus:outline-none focus:border-[#f2eb87]"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={!inputValue.trim() || loading}
                className="p-2.5 rounded-xl bg-[#f2eb87] text-[#111111] hover:bg-[#eae26e] transition-all disabled:opacity-40"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
