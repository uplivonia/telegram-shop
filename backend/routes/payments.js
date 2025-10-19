import { Router } from 'express';
import { idempotency } from '../middleware/idempotency.js';
import dotenv from 'dotenv';
import { verifyInitData } from '../lib/telegramVerify.js';
import { touchKey } from '../lib/idempotency.js';

dotenv.config();

const router = Router();

// Lazy import to avoid requiring stripe if not configured
let stripe = null;
const getStripe = () => {
  if (!stripe) {
    const key = process.env.STRIPE_SECRET_KEY || '';
    if (!key) throw new Error('STRIPE_SECRET_KEY is not set');
    // dynamic import to keep deps minimal in skeleton
    const Stripe = require('stripe');
    stripe = Stripe(key, { apiVersion: '2023-10-16' });
  }
  return stripe;
};

/**
 * Create PaymentIntent (test mode) — skeleton
 * Body: { amount: number (in major units), currency: string, initData?: string }
 */
router.post('/create-intent', idempotency(), async (req, res) => {
  try {
    const { amount, currency='usd', initData } = req.body || {};
    if (!amount || amount <= 0) return res.status(400).json({ error: 'Invalid amount' });

    // Optional: verify Telegram initData (if provided)
    if (initData) {
      const ok = verifyInitData(initData, process.env.TELEGRAM_BOT_TOKEN || '');
      if (!ok) return res.status(403).json({ error: 'Invalid Telegram initData' });
    }

    // Convert major units -> cents (basic; real apps must mind currency decimals)
    const value = Math.round(Number(amount) * 100);

    const stripe = getStripe();
    const pi = await stripe.paymentIntents.create({
      amount: value,
      currency,
      automatic_payment_methods: { enabled: true }
    });

    res.json({ ok: true, client_secret: pi.client_secret, payment_intent: pi.id, currency, amount: value });
  } catch (e) {
    res.status(500).json({ error: e.message || 'Stripe error' });
  }
});

export default router;
