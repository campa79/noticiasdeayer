import crypto from 'crypto';

const SECRET = process.env.ADMIN_SESSION_SECRET || 'noticias_de_ayer_jwt_session_secret_key_1970_2026';

export function createSessionSignature(): string {
  const timestamp = Date.now().toString();
  const payload = `admin_authorized:${timestamp}`;
  const hmac = crypto.createHmac('sha256', SECRET).update(payload).digest('hex');
  return `${payload}.${hmac}`;
}

export function verifySessionSignature(token: string | undefined): boolean {
  if (!token) return false;
  const parts = token.split('.');
  if (parts.length !== 2) return false;

  const [payload, hmac] = parts;
  const expectedHmac = crypto.createHmac('sha256', SECRET).update(payload).digest('hex');

  try {
    const isMatch = crypto.timingSafeEqual(
      Buffer.from(hmac, 'hex'),
      Buffer.from(expectedHmac, 'hex')
    );
    if (!isMatch) return false;

    // Check expiration (session valid for 7 days)
    const timestamp = Number(payload.split(':')[1]);
    const maxAge = 7 * 24 * 60 * 60 * 1000;
    if (Date.now() - timestamp > maxAge) return false;

    return true;
  } catch {
    return false;
  }
}

export function verifyAdminPassword(inputPassword: string): boolean {
  const expectedPassword = process.env.ADMIN_PASSWORD || 'Noticias2016!';
  
  // Safe comparison
  const inputBuffer = Buffer.from(inputPassword);
  const expectedBuffer = Buffer.from(expectedPassword);

  if (inputBuffer.length !== expectedBuffer.length) {
    // Constant time dummy compare to prevent timing leak
    crypto.timingSafeEqual(inputBuffer, inputBuffer);
    return false;
  }

  return crypto.timingSafeEqual(inputBuffer, expectedBuffer);
}
