import { NextResponse } from 'next/server';
import { getCMSData, saveCMSData } from '@/lib/storage';
import { INITIAL_CMS_DATA } from '@/lib/seed-data';
import { CMSData, Student, ClassRole, Announcement, EventItem, GalleryItem, SiteSettings, DayScheduleItem } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const data = await getCMSData();
    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error: any) {
    console.error('API /api/cms GET error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Internal Server Error',
        fallback: INITIAL_CMS_DATA,
      },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, payload } = body;

    const current = await getCMSData();

    switch (action) {
      case 'sync_all': {
        const updated = await saveCMSData(payload as CMSData);
        return NextResponse.json({ success: true, data: updated });
      }

      case 'upsert_student': {
        const student = payload as Student;
        const exists = current.students.some((s) => s.id === student.id);
        const updatedStudents = exists
          ? current.students.map((s) => (s.id === student.id ? { ...student, updated_at: new Date().toISOString() } : s))
          : [{ ...student, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }, ...current.students];

        const updated = await saveCMSData({ ...current, students: updatedStudents });
        return NextResponse.json({ success: true, data: updated });
      }

      case 'delete_student': {
        const { id } = payload as { id: string };
        const updatedStudents = current.students.filter((s) => s.id !== id);
        const updated = await saveCMSData({ ...current, students: updatedStudents });
        return NextResponse.json({ success: true, data: updated });
      }

      case 'upsert_role': {
        const role = payload as ClassRole;
        const exists = current.roles.some((r) => r.id === role.id);
        const updatedRoles = exists
          ? current.roles.map((r) => (r.id === role.id ? role : r))
          : [...current.roles, role];

        // Sort by position_order
        updatedRoles.sort((a, b) => a.position_order - b.position_order);

        const updated = await saveCMSData({ ...current, roles: updatedRoles });
        return NextResponse.json({ success: true, data: updated });
      }

      case 'delete_role': {
        const { id } = payload as { id: string };
        const updatedRoles = current.roles.filter((r) => r.id !== id);
        const updated = await saveCMSData({ ...current, roles: updatedRoles });
        return NextResponse.json({ success: true, data: updated });
      }

      case 'upsert_announcement': {
        const item = payload as Announcement;
        const exists = current.announcements.some((a) => a.id === item.id);
        const updatedAnnouncements = exists
          ? current.announcements.map((a) => (a.id === item.id ? { ...item, updated_at: new Date().toISOString() } : a))
          : [{ ...item, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }, ...current.announcements];

        const updated = await saveCMSData({ ...current, announcements: updatedAnnouncements });
        return NextResponse.json({ success: true, data: updated });
      }

      case 'delete_announcement': {
        const { id } = payload as { id: string };
        const updatedAnnouncements = current.announcements.filter((a) => a.id !== id);
        const updated = await saveCMSData({ ...current, announcements: updatedAnnouncements });
        return NextResponse.json({ success: true, data: updated });
      }

      case 'upsert_event': {
        const item = payload as EventItem;
        const exists = current.events.some((e) => e.id === item.id);
        const updatedEvents = exists
          ? current.events.map((e) => (e.id === item.id ? { ...item, updated_at: new Date().toISOString() } : e))
          : [{ ...item, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }, ...current.events];

        // Sort by event_date
        updatedEvents.sort((a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime());

        const updated = await saveCMSData({ ...current, events: updatedEvents });
        return NextResponse.json({ success: true, data: updated });
      }

      case 'delete_event': {
        const { id } = payload as { id: string };
        const updatedEvents = current.events.filter((e) => e.id !== id);
        const updated = await saveCMSData({ ...current, events: updatedEvents });
        return NextResponse.json({ success: true, data: updated });
      }

      case 'upsert_gallery': {
        const item = payload as GalleryItem;
        const exists = current.gallery.some((g) => g.id === item.id);
        const updatedGallery = exists
          ? current.gallery.map((g) => (g.id === item.id ? item : g))
          : [{ ...item, created_at: new Date().toISOString() }, ...current.gallery];

        const updated = await saveCMSData({ ...current, gallery: updatedGallery });
        return NextResponse.json({ success: true, data: updated });
      }

      case 'delete_gallery': {
        const { id } = payload as { id: string };
        const updatedGallery = current.gallery.filter((g) => g.id !== id);
        const updated = await saveCMSData({ ...current, gallery: updatedGallery });
        return NextResponse.json({ success: true, data: updated });
      }

      case 'update_settings': {
        const settings = payload as SiteSettings;
        const updated = await saveCMSData({
          ...current,
          settings: {
            ...current.settings,
            ...settings,
            updated_at: new Date().toISOString(),
          },
        });
        return NextResponse.json({ success: true, data: updated });
      }

      case 'add_time_capsule': {
        const capsule = payload;
        const existing = current.time_capsules || [];
        const updated = await saveCMSData({
          ...current,
          time_capsules: [capsule, ...existing],
        });
        return NextResponse.json({ success: true, data: updated });
      }

      case 'add_memory_note': {
        const note = payload;
        const existing = current.memory_notes || [];
        const updated = await saveCMSData({
          ...current,
          memory_notes: [note, ...existing],
        });
        return NextResponse.json({ success: true, data: updated });
      }

      case 'like_memory_note': {
        const { id } = payload as { id: string };
        const existing = current.memory_notes || [];
        const updatedNotes = existing.map((n) => (n.id === id ? { ...n, likes: (n.likes || 0) + 1 } : n));
        const updated = await saveCMSData({
          ...current,
          memory_notes: updatedNotes,
        });
        return NextResponse.json({ success: true, data: updated });
      }

      case 'vote_superlative': {
        const { id } = payload as { id: string };
        const existing = current.superlatives || [];
        const updatedSuperlatives = existing.map((s) => (s.id === id ? { ...s, votes: (s.votes || 0) + 1 } : s));
        const updated = await saveCMSData({
          ...current,
          superlatives: updatedSuperlatives,
        });
        return NextResponse.json({ success: true, data: updated });
      }

      case 'update_daily_schedules': {
        const schedules = payload as DayScheduleItem[];
        const updated = await saveCMSData({
          ...current,
          daily_schedules: schedules,
        });
        return NextResponse.json({ success: true, data: updated });
      }

      case 'reset_seed': {
        const resetData = await saveCMSData(INITIAL_CMS_DATA);
        return NextResponse.json({ success: true, data: resetData });
      }

      default:
        return NextResponse.json({ success: false, error: `Unknown action: ${action}` }, { status: 400 });
    }
  } catch (error: any) {
    console.error('API /api/cms POST error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Error processing request' }, { status: 500 });
  }
}
