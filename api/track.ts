import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Pool } from '@neondatabase/serverless';
import { createHash } from 'crypto';

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ success: false, message: 'Method not allowed' });
    return;
  }

  if (!process.env.DATABASE_URL) {
    res.status(503).json({ success: false, message: 'Database not configured' });
    return;
  }

  const { event_type, event_data, page_url, referrer, session_id } = req.body || {};

  if (!event_type || typeof event_type !== 'string') {
    res.status(400).json({ success: false, message: 'event_type is required' });
    return;
  }

  const forwarded = req.headers['x-forwarded-for'];
  const rawIp = typeof forwarded === 'string' ? forwarded.split(',')[0].trim() : '0.0.0.0';
  const ipHash = createHash('sha256').update(rawIp).digest('hex');
  const userAgent = req.headers['user-agent'] || '';

  const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: true });

  try {
    await pool.query(
      `INSERT INTO analytics_events (event_type, event_data, page_url, referrer, user_agent, ip_hash, session_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        event_type,
        JSON.stringify(event_data || {}),
        page_url || '',
        referrer || '',
        userAgent.substring(0, 500),
        ipHash,
        session_id || '',
      ]
    );
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Track API error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  } finally {
    await pool.end();
  }
}
