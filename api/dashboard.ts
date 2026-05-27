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

    // Device types
    const deviceTypes = await pool.query(
      `SELECT event_data->>'user_agent_short' as device, COUNT(*) as count 
       FROM analytics_events 
       WHERE event_type = 'page_view' AND event_data->>'user_agent_short' IS NOT NULL
       GROUP BY event_data->>'user_agent_short' 
       ORDER BY count DESC`
    );

    // Scroll depth milestones
    const scrollDepth = await pool.query(
      `SELECT event_data->>'depth' as depth, COUNT(*) as count 
       FROM analytics_events 
       WHERE event_type = 'scroll_depth' 
       GROUP BY event_data->>'depth' 
       ORDER BY depth`
    );

    // Average session duration (from session_end events)
    const avgDuration = await pool.query(
      `SELECT AVG((event_data->>'time_spent_seconds')::int) as avg_seconds 
       FROM analytics_events 
       WHERE event_type = 'session_end' AND event_data->>'time_spent_seconds' IS NOT NULL`
    );

    // External link clicks
    const externalLinks = await pool.query(
      `SELECT event_data->>'url' as url, COUNT(*) as count 
       FROM analytics_events 
       WHERE event_type = 'external_link' 
       GROUP BY event_data->>'url' 
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
        deviceTypes: deviceTypes.rows,
        scrollDepth: scrollDepth.rows,
        avgSessionDuration: Math.round(parseFloat(avgDuration.rows[0]?.avg_seconds) || 0),
        externalLinks: externalLinks.rows,
      },
    });
  } catch (error) {
    console.error('Dashboard API error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  } finally {
    await pool.end();
  }
}
