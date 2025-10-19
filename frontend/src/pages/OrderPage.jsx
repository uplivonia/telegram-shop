import React, { useEffect, useState } from 'react'
import { API } from '../config.js'

export function OrderPage({ id }) {
  const [order, setOrder] = useState(null)
  const [err, setErr] = useState(null)

  useEffect(() => {
    const load = async () => {
      try {
        const r = await fetch(`${API}/api/orders/${id}`)
        const d = await r.json()
        if (d?.order) setOrder(d.order)
        else setErr(d?.error || 'Not found')
      } catch(e) { setErr('Failed to load') }
    }
    load()
  }, [id])

  if (err) return <div className="container"><a href="#home">← Back</a><p style={{color:'#a00'}}>{String(err)}</p></div>
  if (!order) return <div className="container">Loading...</div>

  return (
    <div className="container">
      <a href="#home">← Back</a>
      <div className="card" style={{marginTop:12}}>
        <h2>Order <code>{order.id}</code></h2>
        <div className="badge">{order.status}{order.paid_at ? ` · ${new Date(order.paid_at).toLocaleString()}` : ''}</div>
        <div className="hr" />
        <div>Amount: <strong>${order.amount}</strong></div>
        <div className="hr" />
        <div>
          <div style={{fontWeight:600, marginBottom:6}}>Items</div>
          <ul>
            {order.items.map(i => (
              <li key={i.id}>{i.title} × {i.qty || 1} — ${i.price}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
