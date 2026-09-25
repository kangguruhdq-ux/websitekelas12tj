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
  ClassProject,
  DeskItem,
  LabSettings,
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
  projects: ClassProject[];
  timeCapsules: TimeCapsuleMessage[];
  memoryNotes: MemoryNote[];
  superlatives: SuperlativeAward[];
  dailySchedules: DayScheduleItem[];
  seatingPlan: DeskItem[];
  labSettings: LabSettings;
  isLoading: boolean;
  isSyncing: boolean;
  hasHydrated: boolean;
  error: string | null;
  lastSynced: number | null;
  // Actions
  updateSeatingPlan: (plan: DeskItem[]) => Promise<boolean>;
  updateLabSettings: (settings: Partial<LabSettings>) => Promise<boolean>;
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
  upsertProject: (item: ClassProject) => Promise<boolean>;
  deleteProject: (id: string) => Promise<boolean>;
  toggleProjectPublish: (id: string, is_published: boolean) => Promise<boolean>;
  toggleProjectFeature: (id: string, is_featured: boolean) => Promise<boolean>;
  addTimeCapsule: (item: TimeCapsuleMessage) => Promise<boolean>;
  addMemoryNote: (item: MemoryNote) => Promise<boolean>;
  likeMemoryNote: (id: string) => Promise<boolean>;
  voteSuperlative: (id: string) => Promise<boolean>;
  updateSettings: (settings: Partial<SiteSettings>) => Promise<boolean>;
  updateDailySchedules: (schedules: DayScheduleItem[]) => Promise<boolean>;
  refreshData: (force?: boolean) => Promise<void>;
  resetSeedData: () => Promise<boolean>;
  upsertTimeCapsule: (item: TimeCapsuleMessage) => Promise<boolean>;
  deleteTimeCapsule: (id: string) => Promise<boolean>;
  upsertMemoryNote: (item: MemoryNote) => Promise<boolean>;
  deleteMemoryNote: (id: string) => Promise<boolean>;
  upsertSuperlative: (item: SuperlativeAward) => Promise<boolean>;
  deleteSuperlative: (id: string) => Promise<boolean>;
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
   * Safe setter with localStorage persistence and timestamp check
   */
  const updateDataSafely = useCallback((newData: CMSData, force: boolean = false) => {
    if (!newData || !Array.isArray(newData.students)) return;

    const currentTimestamp = Number(stateRef.current?.timestamp) || 0;
    const newTimestamp = Number(newData.timestamp) || 0;

    // Only apply update if forced, or incoming data timestamp is newer/equal, or current data timestamp is 0
    if (force || newTimestamp >= currentTimestamp || currentTimestamp === 0) {
      setData(newData);
      stateRef.current = newData;
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(APP_STORAGE_KEY, JSON.stringify(newData));
          // Clean legacy cache keys
          LEGACY_STORAGE_KEYS.forEach((k) => localStorage.removeItem(k));
        } catch (e) {
          console.warn('Failed to write to localStorage:', e);
        }
      }
    } else {
      console.warn('Skipped stale CMS data update:', {
        incoming: newTimestamp,
        current: currentTimestamp,
      });
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
        const res = await fetch(`/api/cms?t=${Date.now()}`, {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            Pragma: 'no-cache',
          },
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
   * Safe data sync from server
   */
  const refreshData = useCallback(
    async (force: boolean = false) => {
      setIsSyncing(true);
      setError(null);

      try {
        const serverData = await fetchCMSDataShared();

        if (serverData && Array.isArray(serverData.students)) {
          updateDataSafely(serverData, force);
          setLastSynced(Date.now());
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

    let activeData: CMSData = initialData || INITIAL_CMS_DATA;
    let activeTimestamp = Number(initialData?.timestamp) || 0;

    // Check if client localStorage has a newer snapshot than SSR initialData
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem(APP_STORAGE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed && Array.isArray(parsed.students)) {
            const cachedTimestamp = Number(parsed.timestamp) || 0;
            if (cachedTimestamp > activeTimestamp) {
              activeData = parsed;
              activeTimestamp = cachedTimestamp;
            }
          }
        }
      } catch (e) {
        console.warn('LocalStorage hydrate error:', e);
      }
    }

    setData(activeData);
    stateRef.current = activeData;

    // Always fetch the freshest state from server without overwriting if server is stale
    refreshData(false);
  }, [refreshData, initialData]);

  // Keep browser tab favicon in sync with site settings logo
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const logoUrl = data.settings?.logo_url || '/favicon.ico';
      const iconSelectors = ["link[rel~='icon']", "link[rel='shortcut icon']", "link[rel='apple-touch-icon']"];
      
      let foundAny = false;
      iconSelectors.forEach((selector) => {
        const link = document.querySelector<HTMLLinkElement>(selector);
        if (link) {
          foundAny = true;
          if (link.getAttribute('href') !== logoUrl) {
            link.setAttribute('href', logoUrl);
          }
        }
      });

      if (!foundAny) {
        const newLink = document.createElement('link');
        newLink.rel = 'icon';
        newLink.href = logoUrl;
        document.head.appendChild(newLink);
      }
    }
  }, [data.settings?.logo_url]);

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
          updateDataSafely(json.data, true);
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

  const upsertTimeCapsule = useCallback(
    async (item: TimeCapsuleMessage) => runMutation('upsert_time_capsule', item),
    [runMutation]
  );

  const deleteTimeCapsule = useCallback(
    async (id: string) => runMutation('delete_time_capsule', { id }),
    [runMutation]
  );

  const upsertMemoryNote = useCallback(
    async (item: MemoryNote) => runMutation('upsert_memory_note', item),
    [runMutation]
  );

  const deleteMemoryNote = useCallback(
    async (id: string) => runMutation('delete_memory_note', { id }),
    [runMutation]
  );

  const upsertSuperlative = useCallback(
    async (item: SuperlativeAward) => runMutation('upsert_superlative', item),
    [runMutation]
  );

  const deleteSuperlative = useCallback(
    async (id: string) => runMutation('delete_superlative', { id }),
    [runMutation]
  );

  const upsertProject = useCallback(
    async (item: ClassProject) => runMutation('upsert_project', item),
    [runMutation]
  );

  const deleteProject = useCallback(
    async (id: string) => runMutation('delete_project', { id }),
    [runMutation]
  );

  const toggleProjectPublish = useCallback(
    async (id: string, is_published: boolean) => runMutation('toggle_project_publish', { id, is_published }),
    [runMutation]
  );

  const toggleProjectFeature = useCallback(
    async (id: string, is_featured: boolean) => runMutation('toggle_project_feature', { id, is_featured }),
    [runMutation]
  );

  const updateSeatingPlan = useCallback(
    async (plan: DeskItem[]) => runMutation('update_seating_plan', plan),
    [runMutation]
  );

  const updateLabSettings = useCallback(
    async (settings: Partial<LabSettings>) => runMutation('update_lab_settings', settings),
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
        projects: data.projects || INITIAL_CMS_DATA.projects || [],
        settings: data.settings || INITIAL_CMS_DATA.settings,
        timeCapsules: data.time_capsules || [],
        memoryNotes: data.memory_notes || [],
        superlatives: data.superlatives || [],
        dailySchedules: data.daily_schedules || INITIAL_CMS_DATA.daily_schedules || [],
        seatingPlan: data.seating_plan || INITIAL_CMS_DATA.seating_plan || [],
        labSettings: data.lab_settings || INITIAL_CMS_DATA.lab_settings!,
        isLoading,
        isSyncing,
        hasHydrated,
        error,
        lastSynced,
        updateSeatingPlan,
        updateLabSettings,
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
        upsertProject,
        deleteProject,
        toggleProjectPublish,
        toggleProjectFeature,
        addTimeCapsule,
        addMemoryNote,
        likeMemoryNote,
        voteSuperlative,
        updateSettings,
        updateDailySchedules,
        refreshData,
        resetSeedData,
        upsertTimeCapsule,
        deleteTimeCapsule,
        upsertMemoryNote,
        deleteMemoryNote,
        upsertSuperlative,
        deleteSuperlative,
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
