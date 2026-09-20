import fs from 'fs';
import path from 'path';
import { CMSData } from '@/types';
import { INITIAL_CMS_DATA, INITIAL_STUDENTS, INITIAL_ROLES } from './seed-data';
import { supabaseClient, isSupabaseConfigured } from './supabase';
import { loadFromNeon, saveToNeon, isNeonConfigured } from './neon';

const DATA_DIR = path.join(process.cwd(), '.data');
const DATA_FILE = path.join(DATA_DIR, 'class_cms_data.json');
const DATA_TMP_FILE = path.join(DATA_DIR, 'class_cms_data.tmp');

// In-memory cache singleton
let memoryCache: CMSData | null = null;
let isWriting = false;

/**
 * Ensure data directory exists
 */
function ensureDataDir() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  } catch (err) {
    console.warn('Could not create .data directory, running in memory mode:', err);
  }
}

/**
 * Atomic file writer using temporary file swap
 */
function writeDataAtomic(data: CMSData): boolean {
  try {
    ensureDataDir();
    const serialized = JSON.stringify(data, null, 2);
    fs.writeFileSync(DATA_TMP_FILE, serialized, 'utf8');
    fs.renameSync(DATA_TMP_FILE, DATA_FILE);
    memoryCache = data;
    return true;
  } catch (err) {
    console.error('Error writing atomic data file:', err);
    memoryCache = data;
    return false;
  }
}

/**
 * Self-healing and validation guard on dataset
 */
function selfHealCMSData(raw: Partial<CMSData> | null): CMSData {
  const currentStudents = Array.isArray(raw?.students) ? raw!.students : [];
  const currentRoles = Array.isArray(raw?.roles) ? raw!.roles : [];
  const currentAnnouncements = Array.isArray(raw?.announcements) ? raw!.announcements : [];
  const currentEvents = Array.isArray(raw?.events) ? raw!.events : [];
  const currentGallery = Array.isArray(raw?.gallery) ? raw!.gallery : [];
  const currentTimeCapsules = Array.isArray(raw?.time_capsules) ? raw!.time_capsules : INITIAL_CMS_DATA.time_capsules;
  const currentMemoryNotes = Array.isArray(raw?.memory_notes) ? raw!.memory_notes : INITIAL_CMS_DATA.memory_notes;
  const currentSuperlatives = Array.isArray(raw?.superlatives) ? raw!.superlatives : INITIAL_CMS_DATA.superlatives;
  const currentSettings = raw?.settings && typeof raw.settings === 'object' ? raw.settings : INITIAL_CMS_DATA.settings;

  let needsHeal = false;

  // Check 1: Ensure all 34 initial students exist (by name or ID)
  const studentMap = new Map(currentStudents.map((s) => [s.name.toLowerCase().trim(), s]));
  const mergedStudents = [...currentStudents];

  for (const seedStudent of INITIAL_STUDENTS) {
    const existing = studentMap.get(seedStudent.name.toLowerCase().trim());
    if (!existing) {
      mergedStudents.push(seedStudent);
      needsHeal = true;
    }
  }

  // Check 2: Ensure all initial roles exist
  const roleMap = new Map(currentRoles.map((r) => [r.role_name.toLowerCase().trim(), r]));
  const mergedRoles = [...currentRoles];

  for (const seedRole of INITIAL_ROLES) {
    const existing = roleMap.get(seedRole.role_name.toLowerCase().trim());
    if (!existing) {
      mergedRoles.push(seedRole);
      needsHeal = true;
    }
  }

  // Check 3: Minimum counts
  if (mergedStudents.length < 34) {
    needsHeal = true;
  }

  if (!raw?.time_capsules || !raw?.memory_notes || !raw?.superlatives) {
    needsHeal = true;
  }

  const normalizedSchedules = (
    Array.isArray(raw?.daily_schedules) && raw!.daily_schedules.length > 0
      ? raw!.daily_schedules
      : INITIAL_CMS_DATA.daily_schedules || []
  ).map((day) => ({
    ...day,
    subjects: (day.subjects || []).map((sub) => ({
      ...sub,
      block: sub.block || (sub.room?.toLowerCase().includes('lab') ? ('praktik' as const) : ('teori' as const)),
    })),
  }));

  const healed: CMSData = {
    version: 'tkj_cms_v1',
    timestamp: Date.now(),
    students: mergedStudents.length >= 34 ? mergedStudents : INITIAL_STUDENTS,
    roles: mergedRoles.length >= 18 ? mergedRoles : INITIAL_ROLES,
    announcements: currentAnnouncements.length > 0 ? currentAnnouncements : INITIAL_CMS_DATA.announcements,
    events: currentEvents.length > 0 ? currentEvents : INITIAL_CMS_DATA.events,
    gallery: currentGallery.length > 0 ? currentGallery : INITIAL_CMS_DATA.gallery,
    settings: {
      ...INITIAL_CMS_DATA.settings,
      ...currentSettings,
    },
    time_capsules: currentTimeCapsules,
    memory_notes: currentMemoryNotes,
    superlatives: currentSuperlatives,
    daily_schedules: normalizedSchedules,
  };

  if (needsHeal || !raw) {
    writeDataAtomic(healed);
  }

  return healed;
}

/**
 * Sync from Supabase if configured
 */
async function loadFromSupabase(): Promise<CMSData | null> {
  if (!isSupabaseConfigured || !supabaseClient) return null;

  try {
    const [
      { data: students, error: errStudents },
      { data: roles, error: errRoles },
      { data: announcements, error: errAnnounce },
      { data: events, error: errEvents },
      { data: gallery, error: errGallery },
      { data: settings, error: errSettings },
    ] = await Promise.all([
      supabaseClient.from('students').select('*'),
      supabaseClient.from('class_roles').select('*'),
      supabaseClient.from('announcements').select('*'),
      supabaseClient.from('events').select('*'),
      supabaseClient.from('gallery').select('*'),
      supabaseClient.from('site_settings').select('*').limit(1).maybeSingle(),
    ]);

    if (errStudents || errRoles) {
      console.warn('Supabase query error, falling back to local storage:', errStudents || errRoles);
      return null;
    }

    if (!students || students.length < 34) {
      console.log('Supabase data incomplete, auto-healing...');
      return null;
    }

    return {
      version: 'tkj_cms_v1',
      timestamp: Date.now(),
      students: (students as any[]) || [],
      roles: (roles as any[]) || [],
      announcements: (announcements as any[]) || [],
      events: (events as any[]) || [],
      gallery: (gallery as any[]) || [],
      settings: (settings as any) || INITIAL_CMS_DATA.settings,
    };
  } catch (err) {
    console.warn('Supabase load error:', err);
    return null;
  }
}

/**
 * Sync to Supabase in background
 */
async function syncToSupabase(data: CMSData): Promise<void> {
  if (!isSupabaseConfigured || !supabaseClient) return;

  try {
    if (data.settings) {
      await supabaseClient.from('site_settings').upsert([data.settings]);
    }
  } catch (err) {
    console.warn('Supabase background sync failed:', err);
  }
}

/**
 * Main function to retrieve CMS Data with multi-tier resilience
 */
export async function getCMSData(): Promise<CMSData> {
  // 1. If memoryCache is already fresh, return it
  if (memoryCache && memoryCache.students.length >= 34) {
    return memoryCache;
  }

  // 2. Try Neon PostgreSQL if configured (Primary for Vercel)
  if (isNeonConfigured) {
    try {
      const neonData = await loadFromNeon();
      if (neonData && neonData.students && neonData.students.length >= 34) {
        const healed = selfHealCMSData(neonData);
        memoryCache = healed;
        return healed;
      }
    } catch (neonErr) {
      console.warn('Neon DB load error, falling back:', neonErr);
    }
  }

  // 3. Try Supabase if configured
  const supabaseData = await loadFromSupabase();
  if (supabaseData && supabaseData.students.length >= 34) {
    memoryCache = supabaseData;
    return supabaseData;
  }

  // 4. Try reading local atomic file
  try {
    ensureDataDir();
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, 'utf8');
      const parsed = JSON.parse(content);
      const healed = selfHealCMSData(parsed);
      memoryCache = healed;

      // If Neon is configured but was empty, seed it now
      if (isNeonConfigured) {
        saveToNeon(healed).catch((e) => console.warn('Neon background seed error:', e));
      }

      return healed;
    }
  } catch (err) {
    console.warn('Local data file read error:', err);
  }

  // 5. Default self-healing from INITIAL_CMS_DATA
  const initialized = selfHealCMSData(INITIAL_CMS_DATA);
  memoryCache = initialized;
  writeDataAtomic(initialized);

  if (isNeonConfigured) {
    saveToNeon(initialized).catch((e) => console.warn('Neon init save error:', e));
  }

  return initialized;
}

/**
 * Main function to atomically save CMS Data
 */
export async function saveCMSData(data: CMSData): Promise<CMSData> {
  // Enforce version and timestamp
  const updatedData: CMSData = {
    ...data,
    version: 'tkj_cms_v1',
    timestamp: Date.now(),
  };

  // Self-heal validation check
  const validated = selfHealCMSData(updatedData);

  // Write atomically to local disk
  writeDataAtomic(validated);

  // Sync to Neon PostgreSQL (primary for Vercel)
  if (isNeonConfigured) {
    saveToNeon(validated).catch((err) => {
      console.warn('Neon DB background sync error:', err);
    });
  }

  // Trigger non-blocking Supabase sync if configured
  syncToSupabase(validated).catch((err) => {
    console.warn('Supabase background sync error:', err);
  });

  return validated;
}
