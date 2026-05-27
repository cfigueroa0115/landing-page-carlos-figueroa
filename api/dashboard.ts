import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Pool } from '@neondatabase/serverless';

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') { res.status(200).end(); return; }
  if (req.method !== 'GET') { res.status(405).json({ success: false }); return; }

  // Simple auth check via header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ success: false, message: 'No autorizado' });
    return;
  }

  if (!process.env.DATABASE_URL) {
    res.status(503).json({ success: false, message: 'Database not configured' });
    return;
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: true });

  try {
    // Total page views
    const totalViews = await pool.query(
      `SELECT COUNT(*) as count FROM analytics_events WHERE event_type = 'page_view'`
    );

    // Unique visitors (by session_id)
    const uniqueVisitors = await pool.query(
      `SELECT COUNT(DISTINCT session_id) as count FROM analytics_events WHERE event_type = 'page_view' AND session_id != ''`
    );

    // Views today
    const viewsToday = await pool.query(
      `SELECT COUNT(*) as count FROM analytics_events WHERE event_type = 'page_view' AND created_at >= CURRENT_DATE`
    );

    // Views this week
    const viewsWeek = await pool.query(
      `SELECT COUNT(*) as count FROM analytics_events WHERE event_type = 'page_view' AND created_at >= NOW() - INTERVAL '7 days'`
    );

    // Click events breakdown
    const clickEvents = await pool.query(
      `SELECT event_data->>'element' as element, COUNT(*) as count 
       FROM analytics_events 
       WHERE event_type = 'click' 
       GROUP BY event_data->>'element' 
       ORDER BY count DESC 
       LIMIT 15`
    );

    // Section views (most viewed sections)
    const sectionViews = await pool.query(
      `SELECT event_data->>'section' as section, COUNT(*) as count 
       FROM analytics_events 
       WHERE event_type = 'section_view' 
       GROUP BY event_data->>'section' 
       ORDER BY count DESC`
    );

    // Download attempts
    const downloads = await pool.query(
      `SELECT COUNT(*) as count FROM analytics_events WHERE event_type = 'download_cv'`
    );

    // Contact form submissions
    const contactSubmissions = await pool.query(
      `SELECT COUNT(*) as count FROM leads`
    );

    // Views per day (last 30 days)
    const viewsPerDay = await pool.query(
      `SELECT DATE(created_at) as date, COUNT(*) as count 
       FROM analytics_events 
       WHERE event_type = 'page_view' AND created_at >= NOW() - INTERVAL '30 days'
       GROUP BY DATE(created_at) 
       ORDER BY date DESC`
    );

    // Recent events (last 20)
    const recentEvents = await pool.query(
      `SELECT event_type, event_data, created_at, page_url 
       FROM analytics_events 
       ORDER BY created_at DESC 
       LIMIT 20`
    );

    // Referrers
    const referrers = await pool.query(
      `SELECT referrer, COUNT(*) as count 
       FROM analytics_events 
       WHERE event_type = 'page_view' AND referrer != '' 
       GROUP BY referrer 
       ORDER BY count DESC 
       LIMIT 10`
    );

    res.status(200).json({
      success: true,
      data: {
        totalViews: parseInt(totalViews.rows[0].count),
        uniqueVisitors: parseInt(uniqueVisitors.rows[0].count),
        viewsToday: parseInt(viewsToday.rows[0].count),
        viewsWeek: parseInt(viewsWeek.rows[0].count),
        downloads: parseInt(downloads.rows[0].count),
        contactSubmissions: parseInt(contactSubmissions.rows[0].count),
        clickEvents: clickEvents.rows,
        sectionViews: sectionViews.rows,
        viewsPerDay: viewsPerDay.rows,
        recentEvents: recentEvents.rows,
        referrers: referrers.rows,
      },
    });
  } catch (error) {
    console.error('Dashboard API error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  } finally {
    await pool.end();
  }
}
