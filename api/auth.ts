import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createHash } from 'crypto';

// Pre-computed SHA-256 hashes of admin credentials
const ADMIN_USER_HASH = '5c4ef26b7386d50c5bd2758b0715a261a3b277ab5718be761a3d5a0dab84b448';
const ADMIN_PASS_HASH = '6e1e7bd850237d7745054bdcf5ece9b3844333eeaa9385ab7033926ed234a1eb';

function sha256(input: string): string {
  return createHash('sha256').update(input).digest('hex');
}

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
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

  const { username, password } = req.body || {};

  if (!username || !password) {
    res.status(400).json({ success: false, message: 'Usuario y contraseña son requeridos' });
    return;
  }

  const userHash = sha256(String(username).trim());
  const passHash = sha256(String(password).trim());

  if (userHash === ADMIN_USER_HASH && passHash === ADMIN_PASS_HASH) {
    // Generate session token
    const token = createHash('sha256')
      .update(`admin:${Date.now()}:${userHash}`)
      .digest('hex');

    res.status(200).json({ success: true, token });
  } else {
    res.status(401).json({ success: false, message: 'Credenciales inválidas' });
  }
}
