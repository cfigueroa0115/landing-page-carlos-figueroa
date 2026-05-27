import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Pool } from '@neondatabase/serverless';
import { validateContactForm } from './_utils/validation';
import { checkRateLimit, hashIP } from './_utils/rate-limiter';

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  // Only accept POST
  if (req.method !== 'POST') {
    res.status(405).json({ success: false, message: 'Method not allowed' });
    return;
  }

  // Check DATABASE_URL
  if (!process.env.DATABASE_URL) {
    res.status(503).json({ success: false, message: 'Database not configured' });
    return;
  }

  // Validate body
  const { valid, errors } = validateContactForm(req.body);
  if (!valid) {
    res.status(400).json({ success: false, errors });
    return;
  }

  const { nombre, empresa, email, motivo, mensaje } = req.body;

  // Hash IP
  const forwarded = req.headers['x-forwarded-for'];
  const rawIp = typeof forwarded === 'string'
    ? forwarded.split(',')[0].trim()
    : req.socket?.remoteAddress || '0.0.0.0';
  const ipHash = hashIP(rawIp);

  // Create pool with timeout
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: true,
  });

  try {
    // Check rate limit
    const withinLimit = await Promise.race([
      checkRateLimit(pool, ipHash),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Connection timeout')), 10000)
      ),
    ]);

    if (!withinLimit) {
      res.status(429).json({
        success: false,
        message: 'Has excedido el límite de envíos. Intenta de nuevo más tarde.',
      });
      return;
    }

    // Insert into leads table
    await Promise.race([
      pool.query(
        `INSERT INTO leads (nombre, empresa, email, motivo, mensaje, ip_hash)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [nombre, empresa || null, email, motivo, mensaje, ipHash]
      ),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Connection timeout')), 10000)
      ),
    ]);

    res.status(200).json({
      success: true,
      message: 'Tu mensaje ha sido enviado exitosamente.',
    });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'Connection timeout') {
      res.status(504).json({ success: false, message: 'Gateway timeout' });
    } else {
      console.error('Contact API error:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  } finally {
    await pool.end();
  }
}
