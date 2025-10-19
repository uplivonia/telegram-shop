import { Router } from 'express'
import { getOrders, saveOrders } from '../lib/db.js'
import { requireTelegram, requireOwner } from '../middleware/auth.js'
import { touchKey } from '../lib/idempotency.js'

const router = Router()

// Create order
router.post('/', (req, res) => {
    const idem = req.get('Idempotency-Key')
    if (idem && !touchKey(`ord:${idem}`, 600)) {
        return res.status(409).json({ error: 'Duplicate order request' })
    }

    const { cart, user, payment } = req.body || {}
    // basic validation
    if (!Array.isArray(cart) || cart.length === 0) {
        return res.status(400).json({ error: 'Cart is empty' })
    }
    for (const it of cart) {
        if (typeof it.id !== 'string' || typeof it.title !== 'string' || typeof it.price !== 'number') {
            return res.status(400).json({ error: 'Invalid cart item' })
        }
    }

    const total = cart.reduce((sum, item) => sum + item.price * (item.qty || 1), 0)
    const order = {
        id: 'ord_' + Math.random().toString(36).slice(2, 10),
        items: cart,
        amount: Number(total.toFixed(2)),
        user: user || null,
        status: 'pending',
        created_at: new Date().toISOString(),
        payment_intent: payment?.payment_intent || null
    }

    const orders = getOrders()
    orders.push(order)
    saveOrders(orders)
    res.json({ ok: true, order })
})

// List my orders (Telegram only)
router.get('/mine', requireTelegram, (req, res) => {
    const username = (req.tgUser?.username || '').toLowerCase()
    if (!username) return res.status(400).json({ error: 'No username in Telegram initData' })
    const all = getOrders()
    const mine = all.filter(o => (o.user?.username || '').toLowerCase() === username)
    res.json({ ok: true, orders: mine })
})

// List all orders (owner only)
router.get('/all', requireTelegram, requireOwner, (_req, res) => {
    res.json({ ok: true, orders: getOrders() })
})

// Get order by id (IMPORTANT: after specific routes)
router.get('/:id', (req, res) => {
    const orders = getOrders()
    const order = orders.find(o => o.id === req.params.id)
    if (!order) return res.status(404).json({ error: 'Not found' })
    res.json({ ok: true, order })
})

// Mark paid (Telegram only, owner of order)
router.post('/mark-paid', requireTelegram, (req, res) => {
    const { orderId } = req.body || {}
    if (!orderId) return res.status(400).json({ error: 'Missing orderId' })
    const orders = getOrders()
    const idx = orders.findIndex(o => o.id === orderId)
    if (idx === -1) return res.status(404).json({ error: 'Order not found' })
    const username = (req.tgUser?.username || '').toLowerCase()
    const orderUser = (orders[idx].user?.username || '').toLowerCase()
    if (!username || username !== orderUser) {
        return res.status(403).json({ error: 'Forbidden' })
    }
    orders[idx].status = 'paid'
    orders[idx].paid_at = new Date().toISOString()
    saveOrders(orders)
    res.json({ ok: true, order: orders[idx] })
})

export default router
