import rateLimit from 'express-rate-limit';

export const strictLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 30, // 30 requests / minute per IP
  standardHeaders: true,
  legacyHeaders: false
});

export const paymentsLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false
});
