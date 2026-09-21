import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { supabaseClient, isSupabaseConfigured } from '@/lib/supabase';
import { saveMediaFileToNeon, isNeonConfigured } from '@/lib/neon';
import { isAdminAuthenticated } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ success: false, error: 'Sesi admin tidak valid.' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: 'File tidak ditemukan' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Limit size to 10MB
    if (buffer.length > 10 * 1024 * 1024) {
      return NextResponse.json({ success: false, error: 'Ukuran file melebihi batas 10MB' }, { status: 400 });
    }

    const ext = path.extname(file.name) || '.jpg';
    const cleanExt = ext.startsWith('.') ? ext : `.${ext}`;
    const safeBaseName = path.basename(file.name, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    const uniqueFileName = `${Date.now()}_${safeBaseName}${cleanExt}`;
    const mimeType = file.type || 'image/jpeg';
    const base64 = buffer.toString('base64');

    let savedToNeon = false;

    // 1. Primary: Save to Neon PostgreSQL persistent media table
    if (isNeonConfigured) {
      try {
        savedToNeon = await saveMediaFileToNeon(uniqueFileName, mimeType, base64, buffer.length);
        if (savedToNeon) {
          console.log(`Successfully persisted image "${uniqueFileName}" to Neon PostgreSQL database.`);
        }
      } catch (neonErr) {
        console.warn('Neon media upload warning:', neonErr);
      }
    }

    // 2. Secondary: Sync to Supabase Storage if configured
    if (isSupabaseConfigured && supabaseClient) {
      try {
        const { data: uploadData, error: uploadError } = await supabaseClient.storage
          .from('media')
          .upload(uniqueFileName, buffer, {
            contentType: mimeType,
            upsert: true,
          });

        if (!uploadError && uploadData) {
          const { data: publicUrlData } = supabaseClient.storage.from('media').getPublicUrl(uniqueFileName);
          return NextResponse.json({
            success: true,
            url: publicUrlData.publicUrl,
            fileName: uniqueFileName,
            storage: 'supabase',
          });
        }
      } catch (sbErr) {
        console.warn('Supabase storage upload failed:', sbErr);
      }
    }

    // 3. Local disk cache (best-effort for local development or multi-worker caching)
    try {
      const publicUploadsDir = path.join(process.cwd(), 'public', 'uploads');
      const dataUploadsDir = path.join(process.cwd(), '.data', 'uploads');
      if (!fs.existsSync(publicUploadsDir)) fs.mkdirSync(publicUploadsDir, { recursive: true });
      if (!fs.existsSync(dataUploadsDir)) fs.mkdirSync(dataUploadsDir, { recursive: true });

      const filePath = path.join(publicUploadsDir, uniqueFileName);
      const dataFilePath = path.join(dataUploadsDir, uniqueFileName);
      fs.writeFileSync(filePath, buffer);
      fs.writeFileSync(dataFilePath, buffer);
    } catch (fsErr) {
      // Ephemeral serverless container (e.g. Vercel) may have read-only cwd; this is expected and safe
    }

    // If successfully stored in Neon DB or local disk, return standard /uploads/ URL
    if (savedToNeon) {
      return NextResponse.json({
        success: true,
        url: `/uploads/${uniqueFileName}`,
        fileName: uniqueFileName,
        storage: 'neon_db',
      });
    }

    // 4. Fallback if DB was unreachable: Base64 Data URL
    const dataUrl = `data:${mimeType};base64,${base64}`;
    return NextResponse.json({
      success: true,
      url: dataUrl,
      fileName: uniqueFileName,
      storage: 'data-url',
    });
  } catch (error: any) {
    console.error('Upload handler error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Gagal mengunggah file' }, { status: 500 });
  }
}
