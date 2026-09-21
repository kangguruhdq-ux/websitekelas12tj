import { neon, NeonQueryFunction } from '@neondatabase/serverless';
import { CMSData } from '@/types';

const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL || '';

export const isNeonConfigured = Boolean(
  databaseUrl && (databaseUrl.startsWith('postgres://') || databaseUrl.startsWith('postgresql://'))
);

export const sql: NeonQueryFunction<false, false> | null = isNeonConfigured
  ? neon(databaseUrl)
  : null;

let tablesInitialized = false;

/**
 * Initialize tables in Neon PostgreSQL if they do not exist
 */
export async function initNeonDB(): Promise<boolean> {
  if (!sql) return false;
  if (tablesInitialized) return true;

  try {
    await sql`
      CREATE TABLE IF NOT EXISTS class_cms_store (
        id VARCHAR(50) PRIMARY KEY,
        data JSONB NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS class_media_files (
        file_name VARCHAR(255) PRIMARY KEY,
        mime_type VARCHAR(100) NOT NULL,
        data_base64 TEXT NOT NULL,
        size INTEGER NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    tablesInitialized = true;
    return true;
  } catch (err) {
    console.error('Failed to init Neon DB tables:', err);
    return false;
  }
}

export type NeonLoadResult =
  | { status: 'found'; data: CMSData }
  | { status: 'empty' }
  | { status: 'error'; error: Error };

/**
 * Load CMS Data from Neon PostgreSQL with auto-retry
 */
export async function loadFromNeon(): Promise<NeonLoadResult> {
  if (!sql) return { status: 'error', error: new Error('Neon DB is not configured') };

  let lastError: Error | null = null;
  const maxAttempts = 2;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      await initNeonDB();
      const rows = await sql`
        SELECT data FROM class_cms_store WHERE id = 'cms_singleton' LIMIT 1;
      `;

      if (rows && rows.length > 0 && rows[0].data) {
        return { status: 'found', data: rows[0].data as CMSData };
      }

      return { status: 'empty' };
    } catch (err: any) {
      lastError = err instanceof Error ? err : new Error(String(err));
      console.warn(`Attempt ${attempt}/${maxAttempts} loading from Neon DB failed:`, lastError.message);
      if (attempt < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, 350));
      }
    }
  }

  return { status: 'error', error: lastError || new Error('Unknown Neon load error') };
}

/**
 * Save CMS Data to Neon PostgreSQL with atomic upsert and auto-retry
 */
export async function saveToNeon(data: CMSData): Promise<boolean> {
  if (!sql) return false;

  const serialized = JSON.stringify(data);
  const maxAttempts = 2;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      await initNeonDB();
      await sql`
        INSERT INTO class_cms_store (id, data, updated_at)
        VALUES ('cms_singleton', CAST(${serialized} AS JSONB), NOW())
        ON CONFLICT (id) DO UPDATE
        SET data = EXCLUDED.data,
            updated_at = EXCLUDED.updated_at;
      `;
      return true;
    } catch (err: any) {
      console.error(`Attempt ${attempt}/${maxAttempts} saving to Neon DB failed:`, err);
      if (attempt < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, 450));
      }
    }
  }

  return false;
}

/**
 * Save binary/media file into Neon PostgreSQL class_media_files table
 */
export async function saveMediaFileToNeon(
  fileName: string,
  mimeType: string,
  dataBase64: string,
  size: number
): Promise<boolean> {
  if (!sql) return false;

  try {
    await initNeonDB();
    await sql`
      INSERT INTO class_media_files (file_name, mime_type, data_base64, size, created_at)
      VALUES (${fileName}, ${mimeType}, ${dataBase64}, ${size}, NOW())
      ON CONFLICT (file_name) DO UPDATE
      SET data_base64 = EXCLUDED.data_base64,
          mime_type = EXCLUDED.mime_type,
          size = EXCLUDED.size;
    `;
    return true;
  } catch (err) {
    console.error(`Failed to save media file "${fileName}" to Neon DB:`, err);
    return false;
  }
}

/**
 * Load media file from Neon PostgreSQL class_media_files table
 */
export async function loadMediaFileFromNeon(
  fileName: string
): Promise<{ mimeType: string; dataBase64: string } | null> {
  if (!sql) return null;

  try {
    await initNeonDB();
    const rows = await sql`
      SELECT mime_type, data_base64 FROM class_media_files WHERE file_name = ${fileName} LIMIT 1;
    `;

    if (rows && rows.length > 0 && rows[0].data_base64) {
      return {
        mimeType: rows[0].mime_type as string,
        dataBase64: rows[0].data_base64 as string,
      };
    }

    return null;
  } catch (err) {
    console.error(`Failed to load media file "${fileName}" from Neon DB:`, err);
    return null;
  }
}
