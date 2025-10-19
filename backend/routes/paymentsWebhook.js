import express from 'express';
import dotenv from 'dotenv';
import { getOrders, saveOrders } from '../lib/db.js';

dotenv.config();

const router = express.Router();

// Use raw body for Stripe signature verification
router.post('/', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const secret = process.env.STRIPE_WEBHOOK_SECRET || '';
    if (!secret) {
      return res.status(500).end('[webhook] STRIPE_WEBHOOK_SECRET not set');
    }
    // Lazy require stripe
    const Stripe = require('stripe');
    const stripe = Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2023-10-16' });

    const sig = req.headers['stripe-signature'];
    let event;
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, secret);
    } catch (err) {
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'payment_intent.succeeded') {
      const pi = event.data.object;
      // naive: mark order as paid if found by PI id
      const orders = getOrders();
      const idx = orders.findIndex(o => o.payment_intent === pi.id);
      if (idx >= 0) {
        orders[idx].status = 'paid';
        orders[idx].paid_at = new Date().toISOString();
        saveOrders(orders);
      }
    }

    res.json({ received: true });
  } catch (e) {
    res.status(500).send(e.message || 'Webhook failure');
  }
});

export default router;
