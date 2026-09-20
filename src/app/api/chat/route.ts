import { NextResponse } from 'next/server';
import { getCMSData } from '@/lib/storage';

export const dynamic = 'force-dynamic';

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

// Function to clean raw markdown symbols like asterisks (*) so text is clear
function cleanReplyText(text: string): string {
  if (!text) return '';
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1') // remove bold asterisks
    .replace(/\*(.*?)\*/g, '$1')     // remove italic asterisks
    .replace(/\*/g, '')              // remove any stray asterisks
    .trim();
}

export async function POST(req: Request) {
  try {
    const { messages, userMessage } = await req.json();

    const history: ChatMessage[] = Array.isArray(messages) ? messages : [];
    const query = (userMessage || (history.length > 0 ? history[history.length - 1].content : '')).trim();

    if (!query) {
      return NextResponse.json({ success: false, error: 'Pesan tidak boleh kosong.' }, { status: 400 });
    }

    const cmsData = await getCMSData();
    const settings = cmsData.settings || {};

    const activeProvider = settings.active_ai_provider || 'mock';
    const botName = settings.ai_bot_name || 'Ping-Ping si Kucing Router';

    const systemPrompt = `Kamu adalah ${botName}, maskot kucing cyber & asisten pintar resmi kelas XII Teknik Komputer dan Jaringan (XII TKJ) angkatan 2026/2027.
Karaktermu:
- Ceria, ramah, suka teknologi, lucu, suka memakai analogi jaringan/TKJ (seperti ping, latency, packet loss, bandwidth, routing, subnetting, Mikrotik, Cisco).
- Kamu sangat hafal tentang kelas XII TKJ:
  * Wali Kelas: ${settings.homeroom_teacher || 'Bu Febriyana, S.T.'}
  * Jumlah Siswa: ${cmsData.students?.length || 34} siswa (semua aktif dan solid).
  * Motto: Bridging Excellence in Networking.
  * Mata pelajaran favorit: Mikrotik MTCNA, Cisco Routing, Debian Linux Server, Fiber Optic Splicing, Cyber Security.
  * Sikap: Selalu suportif, menyemangati teman-teman yang sedang praktikum atau mempersiapkan UKK & kelulusan.
PENTING: Jangan pernah gunakan tanda bintang (*) atau simbol aneh markdown dalam jawabanmu. Gunakan teks bahasa Indonesia yang bersih, ramah, dan santai (maksimal 2-3 paragraf).`;

    // 1. If provider is Gemini
    if (activeProvider === 'gemini' && settings.gemini_api_key) {
      try {
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${settings.gemini_api_key}`;

        const contents = [
          { role: 'user', parts: [{ text: `System Instruction: ${systemPrompt}` }] },
          { role: 'model', parts: [{ text: `Halo! Aku ${botName}, siap membantu seputar jaringan dan kelas XII TKJ!` }] },
          ...history.slice(-8).map((m) => ({
            role: m.role === 'user' ? 'user' : 'model',
            parts: [{ text: m.content }],
          })),
        ];

        if (query && (!history.length || history[history.length - 1].content !== query)) {
          contents.push({ role: 'user', parts: [{ text: query }] });
        }

        const res = await fetch(geminiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents }),
        });

        const json = await res.json();
        const replyText = json.candidates?.[0]?.content?.parts?.[0]?.text;

        if (replyText) {
          return NextResponse.json({
            success: true,
            provider: 'gemini',
            reply: cleanReplyText(replyText),
          });
        }
      } catch (err) {
        console.warn('Gemini call failed, falling back:', err);
      }
    }

    // 2. If provider is Groq
    if (activeProvider === 'groq' && settings.groq_api_key) {
      try {
        const groqUrl = 'https://api.groq.com/openai/v1/chat/completions';
        const formattedMessages = [
          { role: 'system', content: systemPrompt },
          ...history.slice(-8).map((m) => ({ role: m.role, content: m.content })),
        ];
        if (query && (!history.length || history[history.length - 1].content !== query)) {
          formattedMessages.push({ role: 'user', content: query });
        }

        const res = await fetch(groqUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${settings.groq_api_key}`,
          },
          body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            messages: formattedMessages,
            temperature: 0.7,
            max_tokens: 500,
          }),
        });

        const json = await res.json();
        const replyText = json.choices?.[0]?.message?.content;

        if (replyText) {
          return NextResponse.json({
            success: true,
            provider: 'groq',
            reply: cleanReplyText(replyText),
          });
        }
      } catch (err) {
        console.warn('Groq call failed, falling back:', err);
      }
    }

    // 3. If provider is OpenRouter
    if (activeProvider === 'openrouter' && settings.openrouter_api_key) {
      try {
        const openRouterUrl = 'https://openrouter.ai/api/v1/chat/completions';
        const formattedMessages = [
          { role: 'system', content: systemPrompt },
          ...history.slice(-8).map((m) => ({ role: m.role, content: m.content })),
        ];
        if (query && (!history.length || history[history.length - 1].content !== query)) {
          formattedMessages.push({ role: 'user', content: query });
        }

        const res = await fetch(openRouterUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${settings.openrouter_api_key}`,
            'HTTP-Referer': 'https://tkj-class.vercel.app',
            'X-Title': 'XII TKJ Class Portal',
          },
          body: JSON.stringify({
            model: 'meta-llama/llama-3.1-8b-instruct:free',
            messages: formattedMessages,
            temperature: 0.7,
            max_tokens: 500,
          }),
        });

        const json = await res.json();
        const replyText = json.choices?.[0]?.message?.content;

        if (replyText) {
          return NextResponse.json({
            success: true,
            provider: 'openrouter',
            reply: cleanReplyText(replyText),
          });
        }
      } catch (err) {
        console.warn('OpenRouter call failed, falling back:', err);
      }
    }

    // 4. Intelligent Offline Fallback (Clean Indonesian Text without any asterisks or weird symbols)
    const lower = query.toLowerCase();
    let reply = '';

    if (lower.includes('halo') || lower.includes('hai') || lower.includes('pagi') || lower.includes('siang') || lower.includes('malam')) {
      reply = `Halo sobat jaringan! Aku ${botName}, kucing router penjaga gateway XII TKJ. Ada yang bisa kubantu seputar kelas, praktikum jaringan, atau info siswa? Ping latency kita 1ms nih!`;
    } else if (lower.includes('wali') || lower.includes('guru') || lower.includes('febriyana')) {
      reply = `Wali kelas kami yang tercinta adalah Ibu Febriyana, S.T.! Beliau adalah pembimbing yang sabar membimbing kami dari mulai crimping kabel UTP hingga konfigurasi BGP, Linux Server, dan Fiber Optic tingkat lanjut.`;
    } else if (lower.includes('siswa') || lower.includes('murid') || lower.includes('anggota') || lower.includes('berapa')) {
      reply = `Kelas XII TKJ memiliki total ${cmsData.students?.length || 34} siswa aktif! Terdiri dari calon teknisi handal di bidang Routing, Cloud Computing, Cyber Security, dan Fiber Optic. Kamu bisa melihat daftar lengkapnya di menu Siswa.`;
    } else if (lower.includes('ukk') || lower.includes('ujian') || lower.includes('lulus')) {
      reply = `Uji Kompetensi Keahlian (UKK) dan Ujian Kelulusan sudah semakin dekat. Seluruh siswa XII TKJ sedang giat latihan topologi MikroTik dan konfigurasi Debian Server. Doakan angkatan 2026/2027 lulus 100% dengan predikat terbaik!`;
    } else if (lower.includes('kabel') || lower.includes('warna') || lower.includes('crimping')) {
      reply = `Urutan standar warna kabel UTP T568B adalah: Putih-Orange, Orange, Putih-Hijau, Biru, Putih-Biru, Hijau, Putih-Cokelat, dan Cokelat. Pastikan pin 1 sampai 8 lurus sempurna saat dites di kabel tester!`;
    } else if (lower.includes('mikrotik') || lower.includes('cisco') || lower.includes('router') || lower.includes('ip')) {
      reply = `Di lab TKJ, konfigurasi MikroTik dan Cisco adalah makanan sehari-hari kami. Mulai dari IP address, routing OSPF, firewall filter, hingga hotspot login sekolah. Mau tips konfigurasi apa hari ini?`;
    } else if (lower.includes('lucu') || lower.includes('elus') || lower.includes('kucing')) {
      reply = `Meow! Terima kasih elusannya! Antena Wi-Fi ku langsung menangkap sinyal 5GHz penuh dan packet loss langsung 0%. Senang bisa menemani belajarmu hari ini!`;
    } else {
      reply = `Pesanmu sudah diterima di port gateway! Sebagai maskot router XII TKJ, aku selalu siap mendampingi aktivitas kelas. Kamu juga bisa menghubungkan API Key Gemini, Groq, atau OpenRouter di Portal Admin agar obrolan kita semakin luas!`;
    }

    return NextResponse.json({
      success: true,
      provider: 'offline_knowledge_base',
      reply: cleanReplyText(reply),
    });
  } catch (err: any) {
    console.error('API /api/chat error:', err);
    return NextResponse.json(
      {
        success: false,
        error: err.message || 'Chat service error',
        reply: 'Maaf, sepertinya gateway kabel LAN ku sedikit goyang. Coba kirim pesan sekali lagi ya!',
      },
      { status: 500 }
    );
  }
}
