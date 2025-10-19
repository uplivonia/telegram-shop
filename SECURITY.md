# Security Notes

## Telegram WebApp `initData` Verification
Use `/lib/telegramVerify.js` and call `verifyInitData(initData, TELEGRAM_BOT_TOKEN)` on the backend for any request originating from the WebApp.
- Pass `window.Telegram.WebApp.initData` from the frontend to backend endpoints that require user context.
- Reject requests if verification fails.

## Stripe
- Keep `STRIPE_SECRET_KEY` on the backend only.
- Use test keys in development.
- Consider using Stripe Webhooks to validate payment status and update orders.

This repository is a skeleton and intentionally omits persistence, auth sessions, and production hardening.
