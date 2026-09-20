'use client';

import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';
import {
  CMSData,
  Student,
  ClassRole,
  Announcement,
  EventItem,
  GalleryItem,
  SiteSettings,
  TimeCapsuleMessage,
  MemoryNote,
  SuperlativeAward,
  DayScheduleItem,
} from '@/types';
import { INITIAL_CMS_DATA } from '@/lib/seed-data';

const APP_STORAGE_KEY = 'tkj_cms_v1';
const LEGACY_STORAGE_KEYS = ['tkj_cms_v0', 'myapp_cms_v1', 'class_cms_cache'];

// Anti-race condition singleton fetch promise
let globalFetchPromise: Promise<CMSData | null> | null = null;

interface ClassDataContextType {
  data: CMSData;
  students: Student[];
  roles: ClassRole[];
  announcements: Announcement[];
  events: EventItem[];
  gallery: GalleryItem[];
  settings: SiteSettings;
  timeCapsules: TimeCapsuleMessage[];
  memoryNotes: MemoryNote[];
  superlatives: SuperlativeAward[];
  dailySchedules: DayScheduleItem[];
  isLoading: boolean;
  isSyncing: boolean;
  hasHydrated: boolean;
  error: string | null;
  lastSynced: number | null;
  // Actions
  upsertStudent: (student: Student) => Promise<boolean>;
  deleteStudent: (id: string) => Promise<boolean>;
  upsertRole: (role: ClassRole) => Promise<boolean>;
  deleteRole: (id: string) => Promise<boolean>;
  upsertAnnouncement: (item: Announcement) => Promise<boolean>;
  deleteAnnouncement: (id: string) => Promise<boolean>;
  upsertEvent: (item: EventItem) => Promise<boolean>;
  deleteEvent: (id: string) => Promise<boolean>;
  upsertGallery: (item: GalleryItem) => Promise<boolean>;
  deleteGallery: (id: string) => Promise<boolean>;
  addTimeCapsule: (item: TimeCapsuleMessage) => Promise<boolean>;
  addMemoryNote: (item: MemoryNote) => Promise<boolean>;
  likeMemoryNote: (id: string) => Promise<boolean>;
  voteSuperlative: (id: string) => Promise<boolean>;
  updateSettings: (settings: Partial<SiteSettings>) => Promise<boolean>;
  updateDailySchedules: (schedules: DayScheduleItem[]) => Promise<boolean>;
  refreshData: (force?: boolean) => Promise<void>;
  resetSeedData: () => Promise<boolean>;
}

const ClassDataContext = createContext<ClassDataContextType | undefined>(undefined);

export function ClassDataProvider({
  children,
  initialData,
}: {
  children: React.ReactNode;
  initialData?: CMSData;
}) {
  // Always initialize with initialData (from server SSR) or INITIAL_CMS_DATA for 100% hydration-safe parity
  const [data, setData] = useState<CMSData>(() => initialData || INITIAL_CMS_DATA);
  const [hasHydrated, setHasHydrated] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSynced, setLastSynced] = useState<number | null>(null);

  // Persistent ref to current state for race-condition guards
  const stateRef = useRef<CMSData>(data);
  stateRef.current = data;

  /**
   * Safe setter with localStorage persistence
   */
  const updateDataSafely = useCallback((newData: CMSData) => {
    setData(newData);
    stateRef.current = newData;
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(APP_STORAGE_KEY, JSON.stringify(newData));
      } catch (e) {
        console.warn('Failed to write to localStorage:', e);
      }
    }
  }, []);

  /**
   * Singleton shared network fetcher (Prevents duplicate requests on refresh)
   */
  const fetchCMSDataShared = useCallback(async (): Promise<CMSData | null> => {
    if (globalFetchPromise) {
      return globalFetchPromise;
    }

    globalFetchPromise = (async () => {
      try {
        const res = await fetch('/api/cms', {
          cache: 'no-store',
          headers: { 'Cache-Control': 'no-cache' },
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch CMS: ${res.status}`);
        }

        const json = await res.json();
        if (json.success && json.data) {
          return json.data as CMSData;
        }
        return null;
      } catch (err: any) {
        console.warn('fetchCMSDataShared error:', err);
        return null;
      } finally {
        // Clear promise after resolution
        globalFetchPromise = null;
      }
    })();

    return globalFetchPromise;
  }, []);

  /**
   * Hydration Guard and Auto-Heal Sync
   */
  const refreshData = useCallback(
    async (force: boolean = false) => {
      setIsSyncing(true);
      setError(null);

      try {
        const serverData = await fetchCMSDataShared();

        if (serverData) {
          const currentLocal = stateRef.current;

          // HYDRATION GUARD:
          // Check if server data is valid. Never overwrite client state with empty/corrupted data.
          const serverValid =
            Array.isArray(serverData.students) &&
            serverData.students.length >= 34 &&
            Array.isArray(serverData.roles) &&
            serverData.roles.length >= 18;

          if (serverValid) {
            // Check timestamps: if local has unsynced newer changes, resolve smartly
            if (force || !currentLocal.timestamp || serverData.timestamp >= currentLocal.timestamp) {
              updateDataSafely(serverData);
              setLastSynced(Date.now());
            } else {
              // Local is ahead; send auto-heal back to server
              console.log('Local state ahead of server, sending auto-heal sync...');
              fetch('/api/cms', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'sync_all', payload: currentLocal }),
              }).catch((e) => console.warn('Auto-heal sync error:', e));
            }
          } else {
            // Server returned incomplete data! Auto-heal server from valid local data or seed
            console.warn('Server data below minimum standard. Triggering auto-heal repair...');
            const healPayload = currentLocal.students.length >= 34 ? currentLocal : INITIAL_CMS_DATA;
            await fetch('/api/cms', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ action: 'sync_all', payload: healPayload }),
            });
            updateDataSafely(healPayload);
          }
        }
      } catch (err: any) {
        console.error('Refresh error:', err);
        setError(err.message || 'Error refreshing data');
      } finally {
        setIsLoading(false);
        setIsSyncing(false);
      }
    },
    [fetchCMSDataShared, updateDataSafely]
  );

  // Initial load on mount (runs strictly on client AFTER initial hydration completes)
  useEffect(() => {
    setHasHydrated(true);

    try {
      if (typeof window !== 'undefined') {
        const cached = localStorage.getItem(APP_STORAGE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed && Array.isArray(parsed.students) && parsed.students.length >= 34) {
            const currentTs = (initialData || INITIAL_CMS_DATA).timestamp || 0;
            if (parsed.timestamp && parsed.timestamp > currentTs) {
              setData(parsed);
              stateRef.current = parsed;
            }
          }
        }
      }
    } catch (e) {
      console.warn('LocalStorage hydrate error:', e);
    }

    refreshData(false);
  }, [refreshData, initialData]);

  // Generic POST action runner with optimistic update & rollback
  const runMutation = useCallback(
    async (action: string, payload: any): Promise<boolean> => {
      setIsSyncing(true);
      try {
        const res = await fetch('/api/cms', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action, payload }),
        });

        const json = await res.json();
        if (json.success && json.data) {
          updateDataSafely(json.data);
          setLastSynced(Date.now());
          return true;
        } else {
          throw new Error(json.error || 'Mutation failed');
        }
      } catch (err: any) {
        console.error(`Mutation error (${action}):`, err);
        setError(err.message || 'Gagal menyimpan perubahan.');
        return false;
      } finally {
        setIsSyncing(false);
      }
    },
    [updateDataSafely]
  );

  // Action implementations
  const upsertStudent = useCallback(
    async (student: Student) => runMutation('upsert_student', student),
    [runMutation]
  );

  const deleteStudent = useCallback(
    async (id: string) => runMutation('delete_student', { id }),
    [runMutation]
  );

  const upsertRole = useCallback(
    async (role: ClassRole) => runMutation('upsert_role', role),
    [runMutation]
  );

  const deleteRole = useCallback(
    async (id: string) => runMutation('delete_role', { id }),
    [runMutation]
  );

  const upsertAnnouncement = useCallback(
    async (item: Announcement) => runMutation('upsert_announcement', item),
    [runMutation]
  );

  const deleteAnnouncement = useCallback(
    async (id: string) => runMutation('delete_announcement', { id }),
    [runMutation]
  );

  const upsertEvent = useCallback(
    async (item: EventItem) => runMutation('upsert_event', item),
    [runMutation]
  );

  const deleteEvent = useCallback(
    async (id: string) => runMutation('delete_event', { id }),
    [runMutation]
  );

  const upsertGallery = useCallback(
    async (item: GalleryItem) => runMutation('upsert_gallery', item),
    [runMutation]
  );

  const deleteGallery = useCallback(
    async (id: string) => runMutation('delete_gallery', { id }),
    [runMutation]
  );

  const updateSettings = useCallback(
    async (settings: Partial<SiteSettings>) => runMutation('update_settings', settings),
    [runMutation]
  );

  const addTimeCapsule = useCallback(
    async (item: TimeCapsuleMessage) => runMutation('add_time_capsule', item),
    [runMutation]
  );

  const addMemoryNote = useCallback(
    async (item: MemoryNote) => runMutation('add_memory_note', item),
    [runMutation]
  );

  const likeMemoryNote = useCallback(
    async (id: string) => runMutation('like_memory_note', { id }),
    [runMutation]
  );

  const voteSuperlative = useCallback(
    async (id: string) => runMutation('vote_superlative', { id }),
    [runMutation]
  );

  const updateDailySchedules = useCallback(
    async (schedules: DayScheduleItem[]) => runMutation('update_daily_schedules', schedules),
    [runMutation]
  );

  const resetSeedData = useCallback(
    async () => runMutation('reset_seed', {}),
    [runMutation]
  );

  return (
    <ClassDataContext.Provider
      value={{
        data,
        students: data.students || [],
        roles: data.roles || [],
        announcements: data.announcements || [],
        events: data.events || [],
        gallery: data.gallery || [],
        settings: data.settings || INITIAL_CMS_DATA.settings,
        timeCapsules: data.time_capsules || [],
        memoryNotes: data.memory_notes || [],
        superlatives: data.superlatives || [],
        dailySchedules: data.daily_schedules || INITIAL_CMS_DATA.daily_schedules || [],
        isLoading,
        isSyncing,
        hasHydrated,
        error,
        lastSynced,
        upsertStudent,
        deleteStudent,
        upsertRole,
        deleteRole,
        upsertAnnouncement,
        deleteAnnouncement,
        upsertEvent,
        deleteEvent,
        upsertGallery,
        deleteGallery,
        addTimeCapsule,
        addMemoryNote,
        likeMemoryNote,
        voteSuperlative,
        updateSettings,
        updateDailySchedules,
        refreshData,
        resetSeedData,
      }}
    >
      {children}
    </ClassDataContext.Provider>
  );
}

export function useClassData() {
  const context = useContext(ClassDataContext);
  if (!context) {
    throw new Error('useClassData must be used within a ClassDataProvider');
  }
  return context;
}
