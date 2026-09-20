import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { supabaseClient, isSupabaseConfigured } from '@/lib/supabase';
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
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Limit size to 10MB
    if (buffer.length > 10 * 1024 * 1024) {
      return NextResponse.json({ success: false, error: 'File exceeds 10MB limit' }, { status: 400 });
    }

    const ext = path.extname(file.name) || '.jpg';
    const cleanExt = ext.startsWith('.') ? ext : `.${ext}`;
    const safeBaseName = path.basename(file.name, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    const uniqueFileName = `${Date.now()}_${safeBaseName}${cleanExt}`;

    // 1. Try Supabase Storage if configured
    if (isSupabaseConfigured && supabaseClient) {
      try {
        const { data: uploadData, error: uploadError } = await supabaseClient.storage
          .from('media')
          .upload(uniqueFileName, buffer, {
            contentType: file.type || 'image/jpeg',
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
        console.warn('Supabase storage upload failed, falling back to local/data-url:', sbErr);
      }
    }

    // 2. Try writing to public/uploads and .data/uploads directory
    try {
      const publicUploadsDir = path.join(process.cwd(), 'public', 'uploads');
      const dataUploadsDir = path.join(process.cwd(), '.data', 'uploads');
      if (!fs.existsSync(publicUploadsDir)) fs.mkdirSync(publicUploadsDir, { recursive: true });
      if (!fs.existsSync(dataUploadsDir)) fs.mkdirSync(dataUploadsDir, { recursive: true });

      const filePath = path.join(publicUploadsDir, uniqueFileName);
      const dataFilePath = path.join(dataUploadsDir, uniqueFileName);
      fs.writeFileSync(filePath, buffer);
      fs.writeFileSync(dataFilePath, buffer);

      return NextResponse.json({
        success: true,
        url: `/uploads/${uniqueFileName}`,
        fileName: uniqueFileName,
        storage: 'local',
      });
    } catch (fsErr) {
      console.warn('Local fs write failed, using data-url fallback:', fsErr);
    }

    // 3. Fallback: Base64 Data URL (guaranteed to work in any serverless/read-only environment)
    const mimeType = file.type || 'image/jpeg';
    const base64 = buffer.toString('base64');
    const dataUrl = `data:${mimeType};base64,${base64}`;

    return NextResponse.json({
      success: true,
      url: dataUrl,
      fileName: uniqueFileName,
      storage: 'data-url',
    });
  } catch (error: any) {
    console.error('Upload handler error:', error);
    return NextResponse.json({ success: false, error: error.message || 'File upload failed' }, { status: 500 });
  }
}
