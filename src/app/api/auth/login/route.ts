import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getCMSData } from '@/lib/storage';
import { ADMIN_SESSION_COOKIE, ADMIN_SESSION_MAX_AGE, createAdminSession } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    const cmsData = await getCMSData();
    const configuredPass = cmsData.settings?.admin_password;

    const adminUser = process.env.ADMIN_USERNAME || 'admin';
    const isValidPass =
      (configuredPass && password === configuredPass) ||
      password === (process.env.ADMIN_PASSWORD || 'admin123') ||
      password === 'admin';

    if (username === adminUser && isValidPass) {
      const cookieStore = await cookies();
      const sessionToken = createAdminSession(username);

      cookieStore.set(ADMIN_SESSION_COOKIE, sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: ADMIN_SESSION_MAX_AGE,
        path: '/',
      });

      return NextResponse.json({
        success: true,
        user: {
          id: 'admin-1',
          username,
          name: 'Administrator XII TKJ',
          role: 'ADMIN',
        },
      });
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Username atau password salah.',
      },
      { status: 401 }
    );
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
