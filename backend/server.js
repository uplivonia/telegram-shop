// backend/server.js
import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'

import productsRouter from './routes/products.js'
import ordersRouter from './routes/orders.js'
import paymentsRouter from './routes/payments.js'
import paymentsWebhook from './routes/paymentsWebhook.js'
import adminRouter from './routes/admin.js'
import { strictLimiter, paymentsLimiter } from './middleware/limits.js'

dotenv.config()

const app = express()

// ✅ ВАЖНО: Render за прокси — включаем доверие ДО лимитеров
app.set('trust proxy', 1)

// CORS — раньше всего
const ORIGIN = process.env.CORS_ORIGIN || '*'
const corsMw = cors({
    origin: ORIGIN,
    credentials: false,
    allowedHeaders: ['Content-Type', 'Idempotency-Key', 'X-Telegram-InitData'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    maxAge: 600,
})
app.use(corsMw)
app.options('*', corsMw)

// Stripe webhook — ДО json и вне лимитеров
app.use('/api/payments/webhook', paymentsWebhook)

// Лимитеры — после trust proxy
app.use('/api', strictLimiter)
app.use('/api/payments', paymentsLimiter)
app.use('/api/admin', paymentsLimiter)

// JSON парсер — после вебхука
app.use(express.json())

// Health
app.get('/api/health', (_req, res) => {
    res.json({ ok: true, service: 'telegram-shop-backend' })
})

// Роуты
app.use('/api/products', productsRouter)
app.use('/api/orders', ordersRouter)
app.use('/api/payments', paymentsRouter)
app.use('/api/admin', adminRouter)

const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
    console.log(`[backend] listening on http://localhost:${PORT}`)
})
