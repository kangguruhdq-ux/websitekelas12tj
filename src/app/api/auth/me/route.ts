import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get('admin_session');

    if (!session?.value) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    try {
      const decoded = JSON.parse(Buffer.from(session.value, 'base64').toString('utf8'));
      if (decoded.role === 'ADMIN') {
        return NextResponse.json({
          authenticated: true,
          user: {
            id: 'admin-1',
            username: decoded.user,
            role: 'ADMIN',
            name: 'Administrator XII TKJ',
          },
        });
      }
    } catch {
      // Invalid token
    }

    return NextResponse.json({ authenticated: false }, { status: 401 });
  } catch (err: any) {
    return NextResponse.json({ authenticated: false, error: err.message }, { status: 500 });
  }
}
