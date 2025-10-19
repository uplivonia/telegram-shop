import React, { useEffect, useState } from 'react'
import useTelegram from '../hooks/useTelegram.js'
import { API } from '../config.js'

export function OrdersPage() {
    const { initData, isTelegram } = useTelegram()
    const [orders, setOrders] = useState([])
    const [err, setErr] = useState(null)

    useEffect(() => {
        const load = async () => {
            if (!isTelegram || !initData) { setErr('Open inside Telegram'); return }
            try {
                const res = await fetch(`${API}/api/orders/mine`, {
                    headers: { 'X-Telegram-InitData': initData }
                })
                if (!res.ok) throw new Error(`HTTP ${res.status}`)
                const data = await res.json()
                setOrders(Array.isArray(data) ? data : [])
                setErr(null)
            } catch (e) {
                setErr('Failed to load orders')
            }
        }
        load()
    }, [isTelegram, initData])

  return (
    <div style={{padding:16}}>
      <a href="#home">← Back</a>
      <h2>My Orders</h2>
      {!isTelegram && <div style={{color:'#a00'}}>Open inside Telegram to see your orders.</div>}
      {err && <div style={{color:'#a00'}}>{err}</div>}
      <ul style={{marginTop:8}}>
        {orders.map(o => (
          <li key={o.id} style={{padding:'8px 0',borderBottom:'1px solid #eee'}}>
            <div><strong>#{o.id}</strong> — ${o.amount} — <em>{o.status}</em></div>
            <div style={{fontSize:12,opacity:0.8}}>Items: {o.items.map(i => `${i.title}×${i.qty||1}`).join(', ')}</div>
          </li>
        ))}
        {orders.length === 0 && !err && <div>No orders yet.</div>}
      </ul>
    </div>
  )
}