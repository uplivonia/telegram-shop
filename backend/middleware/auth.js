import { verifyInitData } from '../lib/telegramVerify.js';

export function requireTelegram(req, res, next) {
  const initData = req.get('X-Telegram-InitData') || req.body?.initData || '';
  const botToken = process.env.TELEGRAM_BOT_TOKEN || '';
  if (!verifyInitData(initData, botToken)) {
    return res.status(403).json({ error: 'Invalid Telegram initData' });
  }
  // parse minimal user info from initData (querystring) to attach
  const params = new URLSearchParams(initData);
  const userStr = params.get('user');
  try {
    req.tgUser = userStr ? JSON.parse(userStr) : null;
  } catch {
    req.tgUser = null;
  }
  next();
}

export function requireOwner(req, res, next) {
  const owner = (process.env.OWNER_USERNAME || '').toLowerCase();
  const username = (req.tgUser?.username || '').toLowerCase();
  if (!owner || !username || owner !== username) {
    return res.status(403).json({ error: 'Owner only' });
  }
  next();
}
