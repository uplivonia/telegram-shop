import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

import productsRouter from './routes/products.js'
import ordersRouter from './routes/orders.js'
import paymentsRouter from './routes/payments.js'
import paymentsWebhook from './routes/paymentsWebhook.js'
import adminRouter from './routes/admin.js'
import { strictLimiter, paymentsLimiter } from './middleware/limits.js'

dotenv.config()

const app = express()

// ⚠️ Stripe webhook должен идти ДО express.json(), потому что ему нужен raw body
app.use('/api/payments/webhook', paymentsWebhook)

// Rate limits (общий и для чувствительных роутов)
app.use('/api', strictLimiter)
app.use('/api/payments', paymentsLimiter)
app.use('/api/admin', paymentsLimiter)

// JSON парсер — после вебхука
app.use(express.json())

const PORT = process.env.PORT || 4000
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173'
app.use(cors({ origin: CORS_ORIGIN }))

app.get('/api/health', (_req, res) => {
    res.json({ ok: true, service: 'telegram-shop-backend' })
})

// Роуты (по одному подключению каждый)
app.use('/api/products', productsRouter)
app.use('/api/orders', ordersRouter)
app.use('/api/payments', paymentsRouter)
app.use('/api/admin', adminRouter)

app.listen(PORT, () => {
    console.log(`[backend] listening on http://localhost:${PORT}`)
})
