import { Router } from 'express';
import { idempotency } from '../middleware/idempotency.js';
import { validatePrices } from '../lib/validate.js';

const router = Router();
import { touchKey } from '../lib/idempotency.js';

/**
 * Create Telegram invoice link using Bot API `createInvoiceLink`.
 * Requires: TELEGRAM_BOT_TOKEN, TELEGRAM_PROVIDER_TOKEN
 * Body: { title, description, payload, currency, prices: [{label, amount}], photo_url? }
 * amount is in minor units (e.g. cents)
 */
router.post('/create-link', idempotency(), async (req, res) => {
  try {
    const BOT = process.env.TELEGRAM_BOT_TOKEN || '';
    const PROVIDER = process.env.TELEGRAM_PROVIDER_TOKEN || '';
    if (!BOT || !PROVIDER) return res.status(500).json({ error: 'Telegram payment env not set' });
    const { title, description, payload, currency='USD', prices=[], photo_url } = req.body || {};
    const vErr = validatePrices(prices);
    if (!title || !payload || vErr) {
      return res.status(400).json({ error: vErr || 'Invalid request' });
    }

    const url = `https://api.telegram.org/bot${BOT}/createInvoiceLink`;
    const body = {
      title,
      description: description || title,
      payload,
      provider_token: PROVIDER,
      currency,
      prices,
      photo_url
    };

    const r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const data = await r.json();
    if (!data.ok) {
      return res.status(500).json({ error: 'Telegram API error', details: data });
    }
    res.json({ ok: true, link: data.result });
  } catch (e) {
    res.status(500).json({ error: e.message || 'Create link failed' });
  }
});

export default router;
