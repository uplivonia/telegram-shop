
import React, { useEffect, useState } from 'react'

export function SuccessPage() {
  const [status, setStatus] = useState('pending')
  const [orderId, setOrderId] = useState(null)

  useEffect(() => {
    const oid = sessionStorage.getItem('last_order_id')
    setOrderId(oid)
    let timer
    const poll = async () => {
      if (!oid) return
      try {
        const res = await fetch(`http://localhost:4000/api/orders/${oid}`)
        const data = await res.json()
        if (data?.order?.status) {
          setStatus(data.order.status)
          if (data.order.status === 'paid') return
        }
      } catch {}
      timer = setTimeout(poll, 1500)
    }
    poll()
    return () => clearTimeout(timer)
  }, [])

  return (
    <div style={{padding:16,textAlign:'center'}}>
      <h2>{status === 'paid' ? 'Thank you for your purchase! 🎉' : 'Order created, waiting for payment confirmation...'}</h2>
      {orderId && <div style={{marginTop:8,opacity:0.8}}>Order ID: <code>{orderId}</code></div>}
      <a href="#home" style={{display:'inline-block',marginTop:16}}>Back to shop</a>
    </div>
  )
}
