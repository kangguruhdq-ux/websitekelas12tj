# WEBSITE KELAS XII TKJ — CLASS MANAGEMENT PORTAL
**Kelas XII — Teknik Komputer dan Jaringan (TKJ)**  
*Class of 2026/2027*

Portal kelas modern, responsif, dan production-ready yang dirancang khusus untuk keluarga besar **Kelas XII TKJ**. Dibangun dengan estetika *modern cyber / IT tech*, sistem animasi yang halus (*staggered reveal*), kartu siswa melayang dengan slider tombol panah, struktur organisasi visual, dan dashboard admin terpadu.

---

## 🚀 FITUR UTAMA

1. **Beranda Interaktif (Home)**:
   - Hero section cyber modern dengan partikel grid, glow subtle, dan foto hero yang dapat diganti admin.
   - *Tentang Kelas* dengan statistik dinamis otomatis dihitung dari database (34 Siswa: 22 Laki-laki & 12 Perempuan).
   - **Kartu Siswa Melayang**: Slider horizontal interaktif dengan tombol panah navigasi (kiri/kanan) dan animasi *hover glow*.
   - Cuplikan pengumuman terbaru, agenda mendatang, dan galeri kegiatan.

2. **Data Seluruh Siswa (`/siswa`)**:
   - Direktori lengkap 34 siswa kelas XII TKJ.
   - Pencarian cerdas berdasarkan nama, NISN, atau peminatan keahlian.
   - Filter tab jenis kelamin (Semua, Laki-laki, Perempuan) dan pengurutan nama (A-Z, Z-A).
   - Modal detail siswa dengan proteksi privasi informasi.

3. **Struktur Organisasi Visual (`/struktur`)**:
   - Hierarki visual interaktif dengan garis penghubung (*connector lines*).
   - Wali Kelas (Bu Febriyana, S.T.), Ketua (Anindito Aziz Purwanto), Wakil (Aloysius Christian Putra Sadewa), Sekretaris 1-2, Bendahara 1-2, Danton, Second Danton, serta Koordinator Kebersihan, Keamanan, dan Keagamaan.
   - 100% terhubung ke database.

4. **Agenda & Jadwal Kegiatan (`/agenda`)**:
   - Kalender dan daftar agenda kelas (UKK, sertifikasi MikroTik/Cisco, rapat, piket lab, acara sekolah).
   - Status agenda: Mendatang (*Upcoming*), Berlangsung (*Ongoing*), Selesai (*Completed*).

5. **Papan Pengumuman Resmi (`/pengumuman`)**:
   - Pengumuman resmi dari wali kelas dan pengurus.
   - Modal pembaca artikel penuh dengan dukungan lampiran gambar cover.

6. **Galeri Dokumentasi (`/galeri`)**:
   - Masonry/grid modern dengan filter kategori: Kegiatan Kelas, Praktik TKJ, Sekolah, Event, Kebersamaan, Lainnya.
   - *Lightbox Modal* dengan kontrol navigasi panah keyboard & layar sentuh.

7. **Dashboard Admin (`/admin`)**:
   - Login aman dengan *cookie session* di `/admin/login`.
   - Ringkasan KPI dan grafik rasio distribusi gender.
   - **CRUD Siswa**: Tambah, edit, hapus dengan dialog konfirmasi, dan upload foto profil siswa.
   - **CRUD Struktur**: Kelola jabatan, urutan posisi, dan penugasan siswa.
   - **CRUD Pengumuman & Agenda**: Manajemen konten kelas secara instan.
   - **CRUD Galeri**: Upload foto kegiatan dengan kategori dan caption.
   - **Media Manager (Mini CMS)**: Telusuri seluruh aset gambar di web, salin URL, dan upload langsung.
   - **Pengaturan Tampilan Web**: Ganti logo kelas, foto hero, nama kelas, tahun ajaran, dan tautan sosial media.
   - Tombol **Reset Database Seed** ke data resmi 34 siswa awal.

---

## 🛡️ ARSITEKTUR DATA PERSISTENCE "BULLETPROOF"

Website ini dirancang secara khusus untuk mencegah bug umum desinkronisasi: *"Saat halaman direfresh, data baru sempat muncul lalu kembali/revert ke data lama atau hilang"*.

Standar yang diterapkan:
1. **Source of Truth & Hydration Guard**: Database server adalah *Single Source of Truth*. Client state tidak akan menimpa data lokal dengan data server yang korup/kosong. Jika server terdeteksi kurang dari standar minimal (34 siswa), API server dan client akan melakukan *auto-heal* otomatis.
2. **Auto-Migration & Database Self-Healing**: Pada endpoint `GET /api/cms`, sistem secara otomatis memverifikasi dan memperbaiki struktur data yang hilang sebelum dikembalikan ke antarmuka.
3. **Cache Key Versioning (`tkj_cms_v1`)**: Mencegah sisa cache usang di localStorage pengguna.
4. **Idempotent Upsert & Atomic Write**: Penyimpanan file server menggunakan teknik *atomic swap* (`.tmp` -> `.json`) dan operasi *upsert* singleton.
5. **Zero Race-Condition pada Refresh**: Menggunakan *singleton promise sharing* untuk request fetching pertama saat refresh, sehingga tidak ada duplikasi request dari multiple hook render.
6. **Dual Persistence Engine**: Aplikasi langsung dapat berjalan *out-of-the-box* menggunakan local server persistence, sekaligus mendukung integrasi penuh dengan Supabase PostgreSQL & Supabase Storage.

---

## 💻 TECH STACK

- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS dengan Dark / Light Mode support
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Database / Backend**: Supabase (PostgreSQL + Storage) / Resilient Atomic Local Engine
- **Deployment**: Vercel

---

## 📦 CARA MENJALANKAN SECARA LOKAL

1. **Install Dependensi**:
   ```bash
   npm install
   ```

2. **Jalankan Development Server**:
   ```bash
   npm run dev
   ```

3. **Buka Aplikasi di Browser**:
   - Website Publik: [http://localhost:3000](http://localhost:3000)
   - Portal Admin: [http://localhost:3000/admin](http://localhost:3000/admin)

4. **Kredensial Login Admin Default**:
   - **Username**: `admin`
   - **Password**: `admin123`

---

## 🗄️ KONFIGURASI SUPABASE (OPSIONAL)

Jika Anda ingin menghubungkan database ke Supabase:
1. Buat project baru di [supabase.com](https://supabase.com).
2. Buka menu **SQL Editor** pada dashboard Supabase Anda.
3. Salin dan jalankan seluruh isi file `supabase/schema.sql`. Script ini akan membuat semua tabel, RLS policies, storage bucket `media`, dan seed data.
4. Salin URL dan Keys dari Supabase ke file `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
   ```

---

## 🌐 DEPLOY KE VERCEL

1. Push repository ini ke GitHub / GitLab.
2. Buka [vercel.com](https://vercel.com) dan klik **Add New Project**.
3. Import repositori `web-kelas`.
4. Tambahkan Environment Variables di Vercel:
   - `ADMIN_USERNAME`: username admin pilihan Anda (default: `admin`)
   - `ADMIN_PASSWORD`: password admin pilihan Anda (default: `admin123`)
   - *(Opsional)* `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY` jika menggunakan cloud Supabase.
5. Klik **Deploy**. Selesai!
