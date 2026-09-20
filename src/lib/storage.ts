import fs from 'fs';
import path from 'path';
import { CMSData } from '@/types';
import { INITIAL_CMS_DATA, INITIAL_STUDENTS, INITIAL_ROLES } from './seed-data';
import { supabaseClient, isSupabaseConfigured } from './supabase';
import { loadFromNeon, saveToNeon, isNeonConfigured } from './neon';

const DATA_DIR = path.join(process.cwd(), '.data');
const DATA_FILE = path.join(DATA_DIR, 'class_cms_data.json');
const DATA_TMP_FILE = path.join(DATA_DIR, 'class_cms_data.tmp');

// In-memory cache singleton with short TTL
let memoryCache: CMSData | null = null;
let lastCacheTime = 0;
const CACHE_TTL_MS = 2500; // 2.5s cache to avoid excessive DB reads in parallel render tree

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
    lastCacheTime = Date.now();
    return true;
  } catch (err) {
    console.error('Error writing atomic data file:', err);
    memoryCache = data;
    lastCacheTime = Date.now();
    return false;
  }
}

/**
 * Safe schema normalizer that NEVER destroys or overwrites user modifications
 */
export function selfHealCMSData(raw: Partial<CMSData> | null | undefined): CMSData {
  if (!raw) {
    return {
      ...INITIAL_CMS_DATA,
      timestamp: Date.now(),
    };
  }

  // Preserve user collections (even if empty); only seed if completely missing/undefined
  const students = Array.isArray(raw.students) ? raw.students : INITIAL_STUDENTS;
  const roles = Array.isArray(raw.roles) ? raw.roles : INITIAL_ROLES;
  const announcements = Array.isArray(raw.announcements) ? raw.announcements : (INITIAL_CMS_DATA.announcements || []);
  const events = Array.isArray(raw.events) ? raw.events : (INITIAL_CMS_DATA.events || []);
  const gallery = Array.isArray(raw.gallery) ? raw.gallery : (INITIAL_CMS_DATA.gallery || []);
  const time_capsules = Array.isArray(raw.time_capsules) ? raw.time_capsules : (INITIAL_CMS_DATA.time_capsules || []);
  const memory_notes = Array.isArray(raw.memory_notes) ? raw.memory_notes : (INITIAL_CMS_DATA.memory_notes || []);
  const superlatives = Array.isArray(raw.superlatives) ? raw.superlatives : (INITIAL_CMS_DATA.superlatives || []);

  const rawSchedules = Array.isArray(raw.daily_schedules)
    ? raw.daily_schedules
    : INITIAL_CMS_DATA.daily_schedules || [];

  const daily_schedules = rawSchedules.map((day) => ({
    ...day,
    subjects: (day.subjects || []).map((sub) => ({
      ...sub,
      block: sub.block || (sub.room?.toLowerCase().includes('lab') ? ('praktik' as const) : ('teori' as const)),
    })),
  }));

  const settings = {
    ...INITIAL_CMS_DATA.settings,
    ...(raw.settings || {}),
  };

  return {
    version: 'tkj_cms_v1',
    timestamp: typeof raw.timestamp === 'number' ? raw.timestamp : Date.now(),
    students,
    roles,
    announcements,
    events,
    gallery,
    settings,
    time_capsules,
    memory_notes,
    superlatives,
    daily_schedules,
  };
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
      console.warn('Supabase query error, falling back:', errStudents || errRoles);
      return null;
    }

    if (!students) return null;

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
 * @param forceRefresh - If true, bypasses the in-memory cache and loads fresh data from DB/file
 */
export async function getCMSData(forceRefresh: boolean = false): Promise<CMSData> {
  const now = Date.now();

  // 1. If memoryCache is already fresh and within TTL, return it
  if (!forceRefresh && memoryCache && (now - lastCacheTime < CACHE_TTL_MS)) {
    return memoryCache;
  }

  // 2. Try Neon PostgreSQL if configured (Primary for Vercel & Production)
  if (isNeonConfigured) {
    try {
      const neonData = await loadFromNeon();
      if (neonData && Array.isArray(neonData.students)) {
        const validated = selfHealCMSData(neonData);
        memoryCache = validated;
        lastCacheTime = Date.now();
        return validated;
      }

      // If Neon is connected but table is empty, seed it once
      if (neonData === null) {
        console.log('Neon DB is empty; initializing seed data...');
        const initial = selfHealCMSData(INITIAL_CMS_DATA);
        await saveToNeon(initial);
        memoryCache = initial;
        lastCacheTime = Date.now();
        return initial;
      }
    } catch (neonErr) {
      console.warn('Neon DB load error, falling back:', neonErr);
    }
  }

  // 3. Try Supabase if configured
  if (isSupabaseConfigured) {
    const supabaseData = await loadFromSupabase();
    if (supabaseData && Array.isArray(supabaseData.students)) {
      const validated = selfHealCMSData(supabaseData);
      memoryCache = validated;
      lastCacheTime = Date.now();
      return validated;
    }
  }

  // 4. Try reading local atomic file (for local development or offline mode)
  try {
    ensureDataDir();
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, 'utf8');
      const parsed = JSON.parse(content);
      const validated = selfHealCMSData(parsed);
      memoryCache = validated;
      lastCacheTime = Date.now();

      // If Neon is configured but was empty/failed, attempt sync
      if (isNeonConfigured) {
        saveToNeon(validated).catch((e) => console.warn('Neon background sync error:', e));
      }

      return validated;
    }
  } catch (err) {
    console.warn('Local data file read error:', err);
  }

  // 5. Default initial seed
  const initialized = selfHealCMSData(INITIAL_CMS_DATA);
  memoryCache = initialized;
  lastCacheTime = Date.now();
  writeDataAtomic(initialized);

  if (isNeonConfigured) {
    try {
      await saveToNeon(initialized);
    } catch (e) {
      console.warn('Neon init save error:', e);
    }
  }

  return initialized;
}

/**
 * Main function to atomically save CMS Data.
 * Fully awaits Neon PostgreSQL upsert so serverless lambdas never freeze mid-save.
 */
export async function saveCMSData(data: CMSData): Promise<CMSData> {
  // Enforce version and updated timestamp
  const updatedData: CMSData = {
    ...data,
    version: 'tkj_cms_v1',
    timestamp: Date.now(),
  };

  // Safe schema normalization (preserves all modifications)
  const validated = selfHealCMSData(updatedData);

  // Update in-memory cache immediately
  memoryCache = validated;
  lastCacheTime = Date.now();

  // Write atomically to local disk
  writeDataAtomic(validated);

  // Sync to Neon PostgreSQL (primary for Vercel) - MUST BE AWAITED!
  if (isNeonConfigured) {
    try {
      const success = await saveToNeon(validated);
      if (!success) {
        console.error('saveToNeon returned false during saveCMSData');
      }
    } catch (err) {
      console.error('Neon DB save error during saveCMSData:', err);
    }
  }

  // Trigger non-blocking Supabase sync if configured
  if (isSupabaseConfigured) {
    syncToSupabase(validated).catch((err) => {
      console.warn('Supabase background sync error:', err);
    });
  }

  return validated;
}
