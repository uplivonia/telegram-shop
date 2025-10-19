import { Router } from 'express'
import { verifyTelegramInitData } from '../utils/telegram.js' // функция верификации по BOT_TOKEN

const router = Router()

router.get('/mine', async (req, res) => {
    try {
        const raw = req.get('X-Telegram-InitData') || ''
        if (!raw) return res.status(401).json({ error: 'Missing InitData' })

        // Если есть токен — проверяем подпись
        if (process.env.TELEGRAM_BOT_TOKEN) {
            const ok = verifyTelegramInitData(raw, process.env.TELEGRAM_BOT_TOKEN)
            if (!ok) return res.status(401).json({ error: 'Bad InitData' })
        }

        // Разбор initData (user.username и т.д.)
        const params = new URLSearchParams(raw)
        const userStr = params.get('user') || '{}'
        const user = JSON.parse(userStr)
        const username = user?.username || `u${user?.id || 'anon'}`

        // верни заказы пользователя (пока — из файлов/памяти)
        const store = req.app.get('ordersStore') || []
        const mine = store.filter(o => o.user?.username === username)
        return res.json(mine)
    } catch (e) {
        console.error('orders/mine error:', e)
        return res.status(500).json({ error: 'Internal error' })
    }
})

export default router
