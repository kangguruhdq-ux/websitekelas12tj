-- ==============================================================================
-- DATABASE SCHEMA & POLICIES FOR PORTAL KELAS XII TKJ
-- Target: Supabase (PostgreSQL 15+)
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABLE: STUDENTS
CREATE TABLE IF NOT EXISTS students (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  nisn TEXT,
  elective_subject TEXT DEFAULT 'Cloud Computing & Cyber Security',
  major TEXT DEFAULT 'Teknik Komputer dan Jaringan',
  gender TEXT CHECK (gender IN ('L', 'P')),
  birth_place TEXT,
  birth_date TEXT,
  parent_name TEXT,
  photo_url TEXT DEFAULT '',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. TABLE: CLASS ROLES (ORGANISATIONAL HIERARCHY)
CREATE TABLE IF NOT EXISTS class_roles (
  id TEXT PRIMARY KEY,
  role_name TEXT NOT NULL,
  category TEXT DEFAULT 'koordinator',
  person_name TEXT NOT NULL,
  student_id TEXT REFERENCES students(id) ON DELETE SET NULL,
  position_order INTEGER DEFAULT 1,
  badge TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. TABLE: ANNOUNCEMENTS
CREATE TABLE IF NOT EXISTS announcements (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT DEFAULT 'Akademik',
  cover_url TEXT DEFAULT '',
  author TEXT DEFAULT 'Wali Kelas',
  is_published BOOLEAN DEFAULT true,
  published_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 5. TABLE: EVENTS (AGENDA KELAS)
CREATE TABLE IF NOT EXISTS events (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  event_date TEXT NOT NULL,
  event_time TEXT DEFAULT '08:00 WIB',
  location TEXT DEFAULT 'Laboratorium Jaringan',
  category TEXT DEFAULT 'kegiatan',
  person_in_charge TEXT DEFAULT 'Ketua Kelas',
  status TEXT DEFAULT 'upcoming',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 6. TABLE: GALLERY
CREATE TABLE IF NOT EXISTS gallery (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  image_url TEXT NOT NULL,
  category TEXT DEFAULT 'Praktik TKJ',
  caption TEXT DEFAULT '',
  uploaded_by TEXT DEFAULT 'Admin',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 7. TABLE: SITE SETTINGS (SINGLETON)
CREATE TABLE IF NOT EXISTS site_settings (
  id TEXT PRIMARY KEY,
  class_name TEXT DEFAULT 'XII TKJ',
  class_subtitle TEXT DEFAULT 'Teknik Komputer dan Jaringan',
  academic_year TEXT DEFAULT '2026/2027',
  tagline TEXT DEFAULT 'Class of 2026/2027',
  description TEXT DEFAULT 'Tempat kami belajar, berkembang, berkarya, dan membangun cerita bersama.',
  logo_url TEXT DEFAULT '',
  hero_image_url TEXT DEFAULT '',
  favicon_url TEXT DEFAULT '/favicon.ico',
  homeroom_teacher TEXT DEFAULT 'Bu Febriyana, S.T.',
  instagram_url TEXT DEFAULT 'https://instagram.com',
  github_url TEXT DEFAULT 'https://github.com',
  youtube_url TEXT DEFAULT 'https://youtube.com',
  contact_email TEXT DEFAULT 'tkj.duabelas@sekolah.sch.id',
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Allow Public Read Access
CREATE POLICY "Public Read Students" ON students FOR SELECT USING (true);
CREATE POLICY "Public Read Roles" ON class_roles FOR SELECT USING (true);
CREATE POLICY "Public Read Announcements" ON announcements FOR SELECT USING (is_published = true);
CREATE POLICY "Public Read Events" ON events FOR SELECT USING (true);
CREATE POLICY "Public Read Gallery" ON gallery FOR SELECT USING (true);
CREATE POLICY "Public Read Settings" ON site_settings FOR SELECT USING (true);

-- Allow Service Role and Authenticated Admins Full CRUD
CREATE POLICY "Admin Full Students" ON students FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin Full Roles" ON class_roles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin Full Announcements" ON announcements FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin Full Events" ON events FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin Full Gallery" ON gallery FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin Full Settings" ON site_settings FOR ALL USING (true) WITH CHECK (true);

-- ==============================================================================
-- STORAGE BUCKET CREATION (FOR SUPABASE STORAGE)
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public) 
VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public Media Access" ON storage.objects FOR SELECT USING (bucket_id = 'media');
CREATE POLICY "Admin Media Upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'media');
CREATE POLICY "Admin Media Update" ON storage.objects FOR UPDATE USING (bucket_id = 'media');
CREATE POLICY "Admin Media Delete" ON storage.objects FOR DELETE USING (bucket_id = 'media');
