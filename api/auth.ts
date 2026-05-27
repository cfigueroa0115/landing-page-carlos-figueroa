import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createHash } from 'crypto';

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') { res.status(200).end(); return; }
  if (req.method !== 'POST') { res.status(405).json({ success: false }); return; }

  const { username, password } = req.body || {};
  const adminUser = process.env.ADMIN_USER;
  const adminPass = process.env.ADMIN_PASS;

  if (!adminUser || !adminPass) {
    res.status(503).json({ success: false, message: 'Admin not configured' });
    return;
  }

  if (username === adminUser && password === adminPass) {
    // Generate a simple session token (hash of user + timestamp + secret)
    const token = createHash('sha256')
      .update(`${adminUser}:${Date.now()}:${adminPass}`)
      .digest('hex');

    res.status(200).json({ success: true, token });
  } else {
    res.status(401).json({ success: false, message: 'Credenciales inválidas' });
  }
}
