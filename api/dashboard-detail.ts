import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Pool } from '@neondatabase/serverless';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ success: false });

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'No autorizado' });
  }

  if (!process.env.DATABASE_URL) {
    return res.status(503).json({ success: false, message: 'Database not configured' });
  }

  const type = req.query.type as string;
  const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: true });

  try {
    let query = '';
    let params: any[] = [];

    switch (type) {
      case 'total':
        query = `SELECT created_at, event_data->>'url' as info FROM analytics_events WHERE event_type = 'page_view' ORDER BY created_at DESC LIMIT 100`;
        break;
      case 'unique':
        query = `SELECT DISTINCT ON (session_id) created_at, session_id as info FROM analytics_events WHERE event_type = 'page_view' AND session_id != '' ORDER BY session_id, created_at DESC LIMIT 100`;
        break;
      case 'today':
        query = `SELECT created_at, event_data->>'user_agent_short' as info FROM analytics_events WHERE event_type = 'page_view' AND created_at >= CURRENT_DATE ORDER BY created_at DESC LIMIT 100`;
        break;
      case 'week':
        query = `SELECT created_at, event_data->>'user_agent_short' as info FROM analytics_events WHERE event_type = 'page_view' AND created_at >= NOW() - INTERVAL '7 days' ORDER BY created_at DESC LIMIT 100`;
        break;
      case 'downloads':
        query = `SELECT created_at, event_data->>'file' as info FROM analytics_events WHERE event_type = 'download_cv' ORDER BY created_at DESC LIMIT 100`;
        break;
      case 'contacts':
        query = `SELECT created_at, nombre || ' - ' || email as info FROM leads ORDER BY created_at DESC LIMIT 100`;
        break;
      default:
        return res.status(400).json({ success: false, message: 'Invalid type' });
    }

    const result = await pool.query(query, params);

    return res.status(200).json({
      success: true,
      records: result.rows,
    });
  } catch (error) {
    console.error('Dashboard detail error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  } finally {
    await pool.end();
  }
}
