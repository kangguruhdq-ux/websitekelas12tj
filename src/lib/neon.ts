import { neon, NeonQueryFunction } from '@neondatabase/serverless';
import { CMSData } from '@/types';

const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL || '';

export const isNeonConfigured = Boolean(
  databaseUrl && (databaseUrl.startsWith('postgres://') || databaseUrl.startsWith('postgresql://'))
);

export const sql: NeonQueryFunction<false, false> | null = isNeonConfigured
  ? neon(databaseUrl)
  : null;

let tableInitialized = false;

/**
 * Initialize table in Neon PostgreSQL if not exists
 */
export async function initNeonDB(): Promise<boolean> {
  if (!sql) return false;
  if (tableInitialized) return true;

  try {
    await sql`
      CREATE TABLE IF NOT EXISTS class_cms_store (
        id VARCHAR(50) PRIMARY KEY,
        data JSONB NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    tableInitialized = true;
    return true;
  } catch (err) {
    console.error('Failed to init Neon DB table:', err);
    return false;
  }
}

/**
 * Load CMS Data from Neon PostgreSQL
 */
export async function loadFromNeon(): Promise<CMSData | null> {
  if (!sql) return null;

  try {
    await initNeonDB();
    const rows = await sql`
      SELECT data FROM class_cms_store WHERE id = 'cms_singleton' LIMIT 1;
    `;
    if (rows && rows.length > 0 && rows[0].data) {
      return rows[0].data as CMSData;
    }
    return null;
  } catch (err) {
    console.warn('Error loading from Neon DB:', err);
    return null;
  }
}

/**
 * Save CMS Data to Neon PostgreSQL with atomic upsert
 */
export async function saveToNeon(data: CMSData): Promise<boolean> {
  if (!sql) return false;

  try {
    await initNeonDB();
    const serialized = JSON.stringify(data);
    await sql`
      INSERT INTO class_cms_store (id, data, updated_at)
      VALUES ('cms_singleton', CAST(${serialized} AS JSONB), NOW())
      ON CONFLICT (id) DO UPDATE
      SET data = EXCLUDED.data,
          updated_at = EXCLUDED.updated_at;
    `;
    return true;
  } catch (err) {
    console.error('Error saving to Neon DB:', err);
    return false;
  }
}
