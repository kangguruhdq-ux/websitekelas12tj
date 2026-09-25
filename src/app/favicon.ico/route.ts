import { NextRequest, NextResponse } from 'next/server';
import { getCMSData } from '@/lib/storage';
import { loadMediaFileFromNeon, isNeonConfigured } from '@/lib/neon';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const data = await getCMSData(true);
    const logoUrl = data.settings?.logo_url;

    if (logoUrl) {
      if (logoUrl.startsWith('/uploads/')) {
        const filename = logoUrl.replace(/^\/uploads\//, '');

        // 1. Check local disk cache
        const pathsToTry = [
          path.join(process.cwd(), 'public', 'uploads', filename),
          path.join(process.cwd(), '.data', 'uploads', filename),
        ];

        for (const p of pathsToTry) {
          try {
            if (fs.existsSync(/*turbopackIgnore: true*/ p)) {
              const buffer = fs.readFileSync(/*turbopackIgnore: true*/ p);
              const ext = path.extname(p).toLowerCase();
              const mimeMap: Record<string, string> = {
                '.webp': 'image/webp',
                '.png': 'image/png',
                '.jpg': 'image/jpeg',
                '.jpeg': 'image/jpeg',
                '.svg': 'image/svg+xml',
                '.ico': 'image/x-icon',
              };
              return new NextResponse(buffer, {
                headers: {
                  'Content-Type': mimeMap[ext] || 'image/webp',
                  'Cache-Control': 'public, max-age=86400, must-revalidate',
                },
              });
            }
          } catch {}
        }

        // 2. Fetch from Neon DB
        if (isNeonConfigured) {
          const media = await loadMediaFileFromNeon(filename);
          if (media && media.dataBase64) {
            const buffer = Buffer.from(media.dataBase64, 'base64');
            return new NextResponse(buffer, {
              headers: {
                'Content-Type': media.mimeType || 'image/webp',
                'Cache-Control': 'public, max-age=86400, must-revalidate',
              },
            });
          }
        }
      } else if (logoUrl.startsWith('http://') || logoUrl.startsWith('https://')) {
        return NextResponse.redirect(new URL(logoUrl));
      }
    }
  } catch (err) {
    console.warn('favicon route error:', err);
  }

  // Fallback: Custom XII TJ SVG Monogram
  const fallbackSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="24" fill="#161512"/><text x="50" y="65" font-size="46" font-family="system-ui, -apple-system, sans-serif" font-weight="900" fill="#f2eb87" text-anchor="middle">TJ</text></svg>`;
  return new NextResponse(fallbackSvg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
