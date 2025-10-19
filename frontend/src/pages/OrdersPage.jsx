import React, { useEffect, useState } from 'react'
import useTelegram from '../hooks/useTelegram.js'
import { API } from '../config.js'
import AppShell from '../components/AppShell.jsx'
import { SkeletonCard } from '../components/Skeleton.jsx'

export function OrdersPage() {
    const { initData, isTelegram } = useTelegram()
    const [orders, setOrders] = useState(null)
    const [err, setErr] = useState(null)

    useEffect(() => {
        (async () => {
            try {
                if (!isTelegram || !initData) { setOrders([]); return }
                const r = await fetch(`${API}/api/orders/mine`, {
                    headers: { 'X-Telegram-InitData': initData }
                })
                if (!r.ok) throw new Error('HTTP ' + r.status)
                const data = await r.json()
                setOrders(Array.isArray(data) ? data : [])
            } catch (e) {
                setErr('Failed to load orders')
                setOrders([])
            }
        })()
    }, [isTelegram, initData])

    return (
        <AppShell active="orders">
            <h2 style={{ margin: '8px 0 16px' }}>📦 My Orders</h2>

            {orders === null && (
                <div className="cards">{Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}</div>
            )}

            {err && <div className="small" style={{ color: '#b00020', marginBottom: 12 }}>{err}</div>}

            {orders && orders.length === 0 && !err && (
                <div className="small">No orders yet.</div>
            )}

            {orders && !!orders.length && (
                <div className="cards">
                    {orders.map(o => (
                        <div className="card" key={o.id}>
                            <h4>Order #{o.id}</h4>
                            <div className="small">{new Date(o.created_at || Date.now()).toLocaleString()}</div>
                            <div className="price">${(o.total ?? 0).toFixed(2)}</div>
                        </div>
                    ))}
                </div>
            )}
            <div style={{ height: 70 }} />
        </AppShell>
    )
}
