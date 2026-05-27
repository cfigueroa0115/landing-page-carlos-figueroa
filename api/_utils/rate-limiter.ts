import { createHash } from 'crypto';
import { Pool } from '@neondatabase/serverless';

const MAX_SUBMISSIONS_PER_HOUR = 3;

/**
 * Checks if the given IP hash has exceeded the rate limit (3 submissions per hour).
 * Returns true if under the limit, false if exceeded.
 */
export async function checkRateLimit(pool: Pool, ipHash: string): Promise<boolean> {
  const result = await pool.query(
    `SELECT COUNT(*) as count FROM leads WHERE ip_hash = $1 AND created_at > NOW() - INTERVAL '1 hour'`,
    [ipHash]
  );

  const count = parseInt(result.rows[0].count, 10);
  return count < MAX_SUBMISSIONS_PER_HOUR;
}

/**
 * Produces a deterministic SHA-256 hash of the given IP address string.
 */
export function hashIP(ip: string): string {
  return createHash('sha256').update(ip).digest('hex');
}
