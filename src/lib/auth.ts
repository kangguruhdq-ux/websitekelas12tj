import { createHmac, timingSafeEqual } from 'crypto';
import { cookies } from 'next/headers';

export const ADMIN_SESSION_COOKIE = 'admin_session';
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

type SessionPayload = {
  user: string;
  role: 'ADMIN';
  created: number;
  expires: number;
};

function getSessionSecret() {
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || 'tkj-admin-session-secret';
}

function encode(value: string) {
  return Buffer.from(value).toString('base64url');
}

function decode(value: string) {
  return Buffer.from(value, 'base64url').toString('utf8');
}

function sign(payload: string) {
  return createHmac('sha256', getSessionSecret()).update(payload).digest('base64url');
}

export function createAdminSession(username: string) {
  const now = Math.floor(Date.now() / 1000);
  const payload: SessionPayload = {
    user: username,
    role: 'ADMIN',
    created: now,
    expires: now + SESSION_MAX_AGE_SECONDS,
  };
  const encodedPayload = encode(JSON.stringify(payload));
  return `${encodedPayload}.${sign(encodedPayload)}`;
}

export function verifyAdminSession(token: string | undefined): SessionPayload | null {
  if (!token) return null;

  try {
    const [encodedPayload, signature] = token.split('.');
    if (!encodedPayload || !signature) return null;

    const expected = Buffer.from(sign(encodedPayload));
    const received = Buffer.from(signature);
    if (expected.length !== received.length || !timingSafeEqual(expected, received)) return null;

    const payload = JSON.parse(decode(encodedPayload)) as SessionPayload;
    const now = Math.floor(Date.now() / 1000);
    if (payload.role !== 'ADMIN' || !payload.user || payload.expires <= now) return null;
    return payload;
  } catch {
    return null;
  }
}

export async function getAdminSession() {
  const cookieStore = await cookies();
  return verifyAdminSession(cookieStore.get(ADMIN_SESSION_COOKIE)?.value);
}

export async function isAdminAuthenticated() {
  return Boolean(await getAdminSession());
}

export const ADMIN_SESSION_MAX_AGE = SESSION_MAX_AGE_SECONDS;
