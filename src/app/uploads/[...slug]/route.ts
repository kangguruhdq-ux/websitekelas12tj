import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string[] }> }
) {
  try {
    const { slug } = await context.params;
    if (!slug || !Array.isArray(slug) || slug.length === 0) {
      return new NextResponse('Bad Request', { status: 400 });
    }

    const relativePath = slug.join('/');
    // Prevent directory traversal
    const safeFilename = path.normalize(relativePath).replace(/^(\.\.[\/\\])+/, '');

    // Search in public/uploads first, then .data/uploads
    const pathsToTry = [
      path.join(process.cwd(), 'public', 'uploads', safeFilename),
      path.join(process.cwd(), '.data', 'uploads', safeFilename),
    ];

    let foundPath: string | null = null;
    for (const p of pathsToTry) {
      if (fs.existsSync(/*turbopackIgnore: true*/ p)) {
        foundPath = p;
        break;
      }
    }

    if (!foundPath) {
      return new NextResponse('File not found', { status: 404 });
    }

    const ext = path.extname(foundPath).toLowerCase();
    const mimeMap: Record<string, string> = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.webp': 'image/webp',
      '.gif': 'image/gif',
      '.svg': 'image/svg+xml',
      '.ico': 'image/x-icon',
      '.avif': 'image/avif',
      '.mp4': 'video/mp4',
      '.pdf': 'application/pdf',
    };

    const contentType = mimeMap[ext] || 'application/octet-stream';
    const fileBuffer = fs.readFileSync(/*turbopackIgnore: true*/ foundPath);

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error: any) {
    console.error('Error serving upload:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
