import crypto from 'crypto';

/**
 * Verify Telegram WebApp initData according to Telegram docs.
 * @param {string} initData raw initData (querystring) from WebApp
 * @param {string} botToken Bot token from BotFather
 * @returns {boolean}
 */
export function verifyInitData(initData, botToken) {
  if (!initData || !botToken) return false;
  const urlSearchParams = new URLSearchParams(initData);
  // Build data-check-string
  const entries = [];
  for (const [key, value] of urlSearchParams.entries()) {
    if (key === 'hash') continue;
    entries.push(`${key}=${value}`);
  }
  entries.sort();
  const dataCheckString = entries.join('\n');
  const secretKey = crypto.createHmac('sha256', 'WebAppData')
    .update(botToken)
    .digest();
  const hash = crypto.createHmac('sha256', secretKey)
    .update(dataCheckString)
    .digest('hex');
  const providedHash = urlSearchParams.get('hash');
  return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(providedHash));
}
