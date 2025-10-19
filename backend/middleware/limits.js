// backend/middleware/limits.js
import rateLimit from 'express-rate-limit'

const base = {
    windowMs: 60 * 1000,
    limit: 100,
    standardHeaders: true,
    legacyHeaders: false,
    // 👇 глушим строгую проверку X-Forwarded-For
    validate: { xForwardedForHeader: false },
    keyGenerator: (req) => req.ip,
    skip: (req) => req.path === '/api/payments/webhook' || req.path === '/api/health',
}

export const strictLimiter = rateLimit(base)
export const paymentsLimiter = rateLimit({ ...base, windowMs: 15 * 60 * 1000, limit: 30 })