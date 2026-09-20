export type Gender = 'L' | 'P';

export interface Student {
  id: string;
  name: string;
  nisn: string;
  elective_subject: string;
  major: string;
  gender: Gender;
  birth_place: string;
  birth_date: string;
  parent_name: string;
  photo_url: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type RoleCategory = 'wali' | 'pimpinan' | 'administrasi' | 'komando' | 'koordinator';

export interface ClassRole {
  id: string;
  role_name: string;
  category: RoleCategory;
  person_name: string;
  student_id?: string | null;
  position_order: number;
  badge?: string;
  created_at?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  category: string;
  cover_url: string;
  author: string;
  is_published: boolean;
  published_at: string;
  created_at: string;
  updated_at: string;
}

export type EventStatus = 'upcoming' | 'ongoing' | 'completed';
export type EventCategory = 'kegiatan' | 'rapat' | 'piket' | 'sekolah' | 'ujian' | 'lainnya';

export interface EventItem {
  id: string;
  title: string;
  description: string;
  event_date: string;
  event_time: string;
  location: string;
  category: EventCategory;
  person_in_charge: string;
  status: EventStatus;
  created_at: string;
  updated_at: string;
}

export type GalleryCategory =
  | 'Kegiatan Kelas'
  | 'Sekolah'
  | 'Praktik TKJ'
  | 'Event'
  | 'Kebersamaan'
  | 'Lainnya';

export interface GalleryItem {
  id: string;
  title: string;
  image_url: string;
  category: GalleryCategory;
  caption: string;
  description?: string;
  date?: string;
  location?: string;
  uploaded_by: string;
  created_at: string;
}

export interface ClassMemoryPhoto {
  id: string;
  title: string;
  caption: string;
  image_url: string;
  date?: string;
  location?: string;
}

export interface DayLesson {
  id: string;
  time: string;
  subject: string;
  teacher: string;
  room: string;
  block?: 'teori' | 'praktik';
}

export interface DayScheduleItem {
  dayNumber: number; // 1 = Senin, 2 = Selasa, 3 = Rabu, 4 = Kamis, 5 = Jumat
  dayName: string;
  picketTeam: string[];
  motto?: string;
  subjects: DayLesson[];
}

export interface SiteSettings {
  id: string;
  class_name: string;
  class_subtitle: string;
  academic_year: string;
  tagline: string;
  description: string;
  logo_url: string;
  hero_image_url: string;
  favicon_url: string;
  homeroom_teacher: string;
  instagram_url?: string;
  tiktok_url?: string;
  github_url?: string;
  youtube_url?: string;
  contact_email?: string;
  admin_password?: string;
  gemini_api_key?: string;
  groq_api_key?: string;
  openrouter_api_key?: string;
  active_ai_provider?: 'gemini' | 'groq' | 'openrouter' | 'mock';
  ai_bot_name?: string;

  // Milestone Countdown UKK & Wisuda
  milestone_ukk_title?: string;
  milestone_ukk_subtitle?: string;
  milestone_ukk_date?: string;
  milestone_ukk_badge?: string;
  milestone_ukk_desc?: string;
  milestone_wisuda_title?: string;
  milestone_wisuda_subtitle?: string;
  milestone_wisuda_date?: string;
  milestone_wisuda_badge?: string;
  milestone_wisuda_desc?: string;

  // Foto Kenangan & Foto Bersama Kelas (/tentang)
  class_photo_url?: string;
  class_photo_title?: string;
  class_photo_description?: string;
  class_memories?: ClassMemoryPhoto[];

  updated_at: string;
}

export interface AdminUser {
  id: string;
  username: string;
  role: 'ADMIN';
  name: string;
}

export interface TimeCapsuleMessage {
  id: string;
  sender_name: string;
  avatar?: string;
  title: string;
  target_year: number;
  message: string;
  created_at: string;
  is_locked: boolean;
}

export interface MemoryNote {
  id: string;
  sender_name: string;
  role_or_relation: string;
  message: string;
  color: string;
  likes: number;
  created_at: string;
}

export interface SuperlativeAward {
  id: string;
  title: string;
  category: string;
  student_name: string;
  student_id?: string;
  badge_icon: string;
  description: string;
  votes: number;
}

export type ProjectCategory =
  | 'Web Development'
  | 'Mobile App'
  | 'Network'
  | 'Cyber Security'
  | 'IoT'
  | 'AI / Machine Learning'
  | 'System Administration'
  | 'UI/UX'
  | 'Other';

export type ProjectStatus = 'In Development' | 'Completed' | 'Maintenance' | 'Archived';

export interface ClassProject {
  id: string;
  name: string;
  slug?: string;
  short_description: string;
  full_description: string;
  cover_url: string;
  student_creator: string;
  team_members?: string[];
  category: ProjectCategory;
  tech_stack: string[];
  year: string;
  status: ProjectStatus;
  github_url?: string;
  demo_url?: string;
  apk_url?: string;
  key_features?: string[];
  screenshots?: string[];
  is_published: boolean;
  is_featured: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface LabSeatAssignment {
  student_id?: string;
  student_name: string;
  ip_address: string;
  pc_name?: string;
  status?: 'online' | 'offline' | 'maintenance';
}

export interface DeskItem {
  id: string;
  deskNum: number;
  vlan: number;
  seatA: LabSeatAssignment;
  seatB: LabSeatAssignment;
  notes?: string;
}

export interface LabSettings {
  page_title?: string;
  page_subtitle?: string;
  server_rack_name?: string;
  server_rack_desc?: string;
  board_title?: string;
  board_desc?: string;
  podium_title?: string;
  podium_teacher?: string;
}

export interface CMSData {
  version: string;
  timestamp: number;
  students: Student[];
  roles: ClassRole[];
  announcements: Announcement[];
  events: EventItem[];
  gallery: GalleryItem[];
  settings: SiteSettings;
  projects?: ClassProject[];
  time_capsules?: TimeCapsuleMessage[];
  memory_notes?: MemoryNote[];
  superlatives?: SuperlativeAward[];
  daily_schedules?: DayScheduleItem[];
  seating_plan?: DeskItem[];
  lab_settings?: LabSettings;
}
