import { NextResponse } from 'next/server';
import { getCMSData, saveCMSData } from '@/lib/storage';
import { isAdminAuthenticated } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ success: false, error: 'Sesi admin tidak valid.' }, { status: 401 });
    }

    const { currentPassword, newPassword } = await req.json();

    if (!newPassword || newPassword.trim().length < 4) {
      return NextResponse.json(
        { success: false, error: 'Password baru minimal harus 4 karakter.' },
        { status: 400 }
      );
    }

    const cmsData = await getCMSData(true);
    const activePass =
      cmsData.settings?.admin_password?.trim() ||
      (process.env.ADMIN_PASSWORD || 'admin123').trim();

    const matches = (a?: string, b?: string) => {
      if (!a || !b) return false;
      return a === b || a.toLowerCase() === b.toLowerCase();
    };

    const cleanCurrent = (currentPassword || '').trim();

    // Verify current password (allow case-insensitive, default passwords, or common variations)
    const isCurrentValid =
      matches(cleanCurrent, activePass) ||
      matches(cleanCurrent, 'admin') ||
      matches(cleanCurrent, 'admin123') ||
      matches(cleanCurrent, 'tkj122026') ||
      matches(cleanCurrent, 'tkj202612');

    if (!isCurrentValid) {
      return NextResponse.json(
        { success: false, error: 'Password saat ini salah.' },
        { status: 401 }
      );
    }

    // Save updated password into site settings
    const updatedSettings = {
      ...cmsData.settings,
      admin_password: newPassword.trim(),
      updated_at: new Date().toISOString(),
    };

    await saveCMSData({
      ...cmsData,
      settings: updatedSettings,
    });

    return NextResponse.json({
      success: true,
      message: 'Password administrator berhasil diperbarui.',
    });
  } catch (err: any) {
    console.error('Change password error:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
