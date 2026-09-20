'use client';

import React, { useMemo, useState } from 'react';
import { useClassData } from '@/context/ClassDataContext';
import { MemoryNote, SuperlativeAward, TimeCapsuleMessage } from '@/types';
import { Clock3, Edit3, Heart, Plus, Save, Sparkles, Trash2, Trophy, X } from 'lucide-react';

type Tab = 'capsules' | 'memories' | 'superlatives';

const emptyCapsule = (): TimeCapsuleMessage => ({
  id: '', sender_name: '', title: '', target_year: 2030, message: '', created_at: new Date().toISOString(), is_locked: true,
});
const emptyMemory = (): MemoryNote => ({
  id: '', sender_name: '', role_or_relation: 'Siswa XII TKJ', message: '', color: '#f2eb87', likes: 0, created_at: new Date().toISOString(),
});
const emptySuperlative = (): SuperlativeAward => ({
  id: '', title: '', category: 'Kelas', student_name: '', student_id: '', badge_icon: 'Sparkles', description: '', votes: 0,
});

export default function AdminInteractivePage() {
  const {
    timeCapsules, memoryNotes, superlatives,
    upsertTimeCapsule, deleteTimeCapsule,
    upsertMemoryNote, deleteMemoryNote,
    upsertSuperlative, deleteSuperlative,
  } = useClassData();
  const [tab, setTab] = useState<Tab>('capsules');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [capsule, setCapsule] = useState<TimeCapsuleMessage>(emptyCapsule);
  const [memory, setMemory] = useState<MemoryNote>(emptyMemory);
  const [superlative, setSuperlative] = useState<SuperlativeAward>(emptySuperlative);
  const [saving, setSaving] = useState(false);

  const tabs = useMemo(() => [
    { id: 'capsules' as const, label: 'Kapsul Waktu', count: timeCapsules.length, icon: Clock3 },
    { id: 'memories' as const, label: 'Dinding Kenangan', count: memoryNotes.length, icon: Heart },
    { id: 'superlatives' as const, label: 'Superlatif', count: superlatives.length, icon: Trophy },
  ], [timeCapsules.length, memoryNotes.length, superlatives.length]);

  const resetForm = () => {
    setEditingId(null);
    setCapsule(emptyCapsule());
    setMemory(emptyMemory());
    setSuperlative(emptySuperlative());
  };

  const startCreate = (nextTab: Tab = tab) => {
    resetForm();
    setTab(nextTab);
  };

  const startEdit = (item: TimeCapsuleMessage | MemoryNote | SuperlativeAward, itemTab: Tab) => {
    setTab(itemTab);
    setEditingId(item.id);
    if (itemTab === 'capsules') setCapsule({ ...(item as TimeCapsuleMessage) });
    if (itemTab === 'memories') setMemory({ ...(item as MemoryNote) });
    if (itemTab === 'superlatives') setSuperlative({ ...(item as SuperlativeAward) });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    const id = editingId || `${tab}-${Date.now()}`;
    let success = false;
    if (tab === 'capsules') success = await upsertTimeCapsule({ ...capsule, id, created_at: capsule.created_at || new Date().toISOString() });
    if (tab === 'memories') success = await upsertMemoryNote({ ...memory, id, created_at: memory.created_at || new Date().toISOString() });
    if (tab === 'superlatives') success = await upsertSuperlative({ ...superlative, id });
    setSaving(false);
    if (success) resetForm();
  };

  const handleDelete = async (id: string, itemTab: Tab) => {
    if (!window.confirm('Hapus konten ini dari website publik?')) return;
    if (itemTab === 'capsules') await deleteTimeCapsule(id);
    if (itemTab === 'memories') await deleteMemoryNote(id);
    if (itemTab === 'superlatives') await deleteSuperlative(id);
    if (editingId === id) resetForm();
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1f1d19] text-[#f2eb87] border border-[#f2eb87]/30 mb-2">
            <Sparkles className="w-3.5 h-3.5" /><span className="text-[10px] uppercase tracking-widest font-bold">Konten Interaktif</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif-title font-bold text-[#f5f1ca]">Interaksi & Kenangan</h1>
          <p className="text-xs sm:text-sm text-[#9e9a8d] mt-1">Kelola seluruh kiriman pengunjung, kapsul waktu, dan penghargaan kelas.</p>
        </div>
        <button type="button" onClick={() => startCreate()} className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#f2eb87] text-[#161512] text-xs font-bold hover:bg-[#e6df73] transition-colors">
          <Plus className="w-4 h-4" /> Konten Baru
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[240px_minmax(0,1fr)] gap-5 items-start w-full min-w-0">
        <div className="p-2 rounded-2xl bg-[#1f1d19] border border-[#f5f1ca]/12 flex lg:flex-col gap-1 overflow-x-auto w-full min-w-0">
          {tabs.map(({ id, label, count, icon: Icon }) => (
            <button key={id} type="button" onClick={() => { setTab(id); resetForm(); }} className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors flex-shrink-0 lg:flex-shrink ${tab === id ? 'bg-[#f2eb87] text-[#161512]' : 'text-[#d8d6c6] hover:bg-[#f5f1ca]/10'}`}>
              <Icon className="w-4 h-4" /><span>{label}</span><span className="ml-auto opacity-70">{count}</span>
            </button>
          ))}
        </div>

        <div className="space-y-5 w-full min-w-0">
          <form onSubmit={handleSave} className="p-5 sm:p-6 rounded-2xl bg-[#1f1d19] border border-[#f2eb87]/25 space-y-4 w-full min-w-0">
            <div className="flex items-center justify-between border-b border-[#f5f1ca]/10 pb-3">
              <h2 className="font-serif-title font-bold text-lg text-[#f5f1ca]">{editingId ? 'Edit Konten' : 'Tambah Konten'}</h2>
              {editingId && <button type="button" onClick={resetForm} className="text-[#9e9a8d] hover:text-[#f2eb87]" aria-label="Batalkan edit"><X className="w-4 h-4" /></button>}
            </div>

            {tab === 'capsules' && <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <Field label="Nama Pengirim"><input required value={capsule.sender_name} onChange={(e) => setCapsule({ ...capsule, sender_name: e.target.value })} /></Field>
              <Field label="Judul"><input required value={capsule.title} onChange={(e) => setCapsule({ ...capsule, title: e.target.value })} /></Field>
              <Field label="Tahun Dibuka"><input required type="number" min={2026} value={capsule.target_year} onChange={(e) => setCapsule({ ...capsule, target_year: Number(e.target.value) })} /></Field>
              <Field label="Status"><select value={capsule.is_locked ? 'locked' : 'open'} onChange={(e) => setCapsule({ ...capsule, is_locked: e.target.value === 'locked' })}><option value="locked">Terkunci</option><option value="open">Terbuka</option></select></Field>
              <div className="sm:col-span-2"><Field label="Isi Pesan"><textarea required rows={4} value={capsule.message} onChange={(e) => setCapsule({ ...capsule, message: e.target.value })} /></Field></div>
            </div>}

            {tab === 'memories' && <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <Field label="Nama Pengirim"><input required value={memory.sender_name} onChange={(e) => setMemory({ ...memory, sender_name: e.target.value })} /></Field>
              <Field label="Peran / Hubungan"><input required value={memory.role_or_relation} onChange={(e) => setMemory({ ...memory, role_or_relation: e.target.value })} /></Field>
              <div className="sm:col-span-2"><Field label="Pesan"><textarea required rows={4} value={memory.message} onChange={(e) => setMemory({ ...memory, message: e.target.value })} /></Field></div>
              <Field label="Warna Kartu"><input type="text" value={memory.color} onChange={(e) => setMemory({ ...memory, color: e.target.value })} /></Field>
              <Field label="Jumlah Apresiasi"><input type="number" min={0} value={memory.likes} onChange={(e) => setMemory({ ...memory, likes: Number(e.target.value) })} /></Field>
            </div>}

            {tab === 'superlatives' && <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <Field label="Judul Gelar"><input required value={superlative.title} onChange={(e) => setSuperlative({ ...superlative, title: e.target.value })} /></Field>
              <Field label="Kategori"><input required value={superlative.category} onChange={(e) => setSuperlative({ ...superlative, category: e.target.value })} /></Field>
              <Field label="Nama Siswa"><input required value={superlative.student_name} onChange={(e) => setSuperlative({ ...superlative, student_name: e.target.value })} /></Field>
              <Field label="Ikon (Sparkles, Zap, Wifi, Mic, Cpu, Shield)"><input value={superlative.badge_icon} onChange={(e) => setSuperlative({ ...superlative, badge_icon: e.target.value })} /></Field>
              <div className="sm:col-span-2"><Field label="Deskripsi"><textarea required rows={3} value={superlative.description} onChange={(e) => setSuperlative({ ...superlative, description: e.target.value })} /></Field></div>
              <Field label="Jumlah Suara"><input type="number" min={0} value={superlative.votes} onChange={(e) => setSuperlative({ ...superlative, votes: Number(e.target.value) })} /></Field>
            </div>}

            <button disabled={saving} type="submit" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#f2eb87] text-[#161512] text-xs font-bold disabled:opacity-50 transition-all active:scale-95"><Save className="w-4 h-4" />{saving ? 'Menyimpan...' : editingId ? 'Simpan Perubahan' : 'Tambah ke Website'}</button>
          </form>

          <div className="space-y-3 w-full min-w-0">
            {tab === 'capsules' && timeCapsules.map((item) => <ContentRow key={item.id} title={item.title} detail={`${item.sender_name} · ${item.target_year}`} onEdit={() => startEdit(item, 'capsules')} onDelete={() => handleDelete(item.id, 'capsules')} />)}
            {tab === 'memories' && memoryNotes.map((item) => <ContentRow key={item.id} title={item.message} detail={`${item.sender_name} · ${item.likes} apresiasi`} onEdit={() => startEdit(item, 'memories')} onDelete={() => handleDelete(item.id, 'memories')} />)}
            {tab === 'superlatives' && superlatives.map((item) => <ContentRow key={item.id} title={item.title} detail={`${item.student_name} · ${item.votes} suara`} onEdit={() => startEdit(item, 'superlatives')} onDelete={() => handleDelete(item.id, 'superlatives')} />)}
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block space-y-1"><span className="block font-semibold text-[#d8d6c6]">{label}</span>{React.cloneElement(children as React.ReactElement<any>, { className: 'w-full px-3 py-2.5 rounded-xl bg-[#161512] border border-[#f5f1ca]/15 text-[#f5f1ca] focus:outline-none focus:border-[#f2eb87]' })}</label>;
}

function ContentRow({ title, detail, onEdit, onDelete }: { title: string; detail: string; onEdit: () => void; onDelete: () => void }) {
  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-[#1f1d19] border border-[#f5f1ca]/12 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 transition-all hover:border-[#f2eb87]/30 w-full min-w-0 shadow-sm">
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm text-[#f5f1ca] line-clamp-2 leading-relaxed break-words">
          {title}
        </p>
        <p className="text-[11px] text-[#9e9a8d] mt-1 break-words">
          {detail}
        </p>
      </div>
      <div className="flex items-center gap-1.5 flex-shrink-0 self-end sm:self-center">
        <button
          type="button"
          onClick={onEdit}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-[#d8d6c6] bg-[#161512] border border-[#f5f1ca]/15 hover:bg-[#f2eb87] hover:text-[#161512] hover:border-[#f2eb87] transition-all active:scale-95"
          aria-label="Edit"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Edit</span>
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-red-400 bg-[#161512] border border-red-500/20 hover:bg-red-500 hover:text-white transition-all active:scale-95"
          aria-label="Hapus"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Hapus</span>
        </button>
      </div>
    </div>
  );
}
