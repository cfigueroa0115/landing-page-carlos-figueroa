import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createHash } from 'crypto';

const ADMIN_USER_HASH = '5c4ef26b7386d50c5bd2758b0715a261a3b277ab5718be761a3d5a0dab84b448';
const ADMIN_PASS_HASH = '6e1e7bd850237d7745054bdcf5ece9b3844333eeaa9385ab7033926ed234a1eb';

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ success: false, message: 'Method not allowed' });

  const { username, password } = req.body || {};

  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Usuario y contraseña son requeridos' });
  }

  const userHash = createHash('sha256').update(String(username).trim()).digest('hex');
  const passHash = createHash('sha256').update(String(password).trim()).digest('hex');

  if (userHash === ADMIN_USER_HASH && passHash === ADMIN_PASS_HASH) {
    const token = createHash('sha256').update(`admin:${Date.now()}`).digest('hex');
    return res.status(200).json({ success: true, token });
  }

  return res.status(401).json({ success: false, message: 'Credenciales inválidas' });
}
