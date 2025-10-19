import React, { useState } from 'react'
import { createT, getLangFromTelegram } from '../i18n.js'
import useTelegram from '../hooks/useTelegram.js'

export function CheckoutPage({ cart, onSuccess }) {
  const lang = getLangFromTelegram(tg)
  const t = createT(lang)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { initData, tg, isTelegram } = useTelegram()
  const USE_TG_PAY = (import.meta.env.VITE_USE_TELEGRAM_PAYMENTS ?? 'false').toString() !== 'false'
  const handlePay = async () => {
    setLoading(true)
    setError(null)
    try {
      // Telegram Payments flow (if enabled and inside Telegram)
      if (USE_TG_PAY && isTelegram && tg) {
        try {
          const amount = cart.reduce((sum, i) => sum + i.price * (i.qty || 1), 0)
          const prices = [{ label: 'Order', amount: Math.round(amount * 100) }]
          // create invoice link on backend
          const invRes = await fetch('http://localhost:4000/api/payments/telegram/create-link', {
            method:'POST', headers:{ 'Content-Type':'application/json' },
            body: JSON.stringify({ title: 'Order', description: 'Mini app order', payload: 'order', currency: 'USD', prices })
          })
          const inv = await invRes.json()
          if (inv?.link) {
            // open invoice inside Telegram
            await tg.openInvoice(inv.link, (status) => {
              console.log('invoiceClosed:', status)
              if (status === 'paid') {
                // mark order paid after creation
                window.__tg_paid = true
              }
            })
          }
        } catch(e) { console.warn('Telegram Payments failed', e) }
      }

      // 1) Create a PaymentIntent (Stripe skeleton); if backend not configured, it will fail and we fallback to stub
      try {
        const amount = cart.reduce((sum, i) => sum + i.price * (i.qty || 1), 0)
        const piRes = await fetch('http://localhost:4000/api/payments/create-intent', {
          method: 'POST', headers: { 'Content-Type': 'application/json', 'Idempotency-Key': 'pi-' + Date.now() },
          body: JSON.stringify({ amount, currency: 'usd', initData })
        })
        const pi = await piRes.json()
        console.log('Stripe PI:', pi)
        if (pi && pi.payment_intent) {
          // attach PI id for webhook reconciliation
          window.__lastPI = pi
        }
      } catch (e) {
        console.warn('Stripe PI failed (ok in skeleton):', e)
      }

      // 2) Create app-side order (stub)
      const res = await fetch('http://localhost:4000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Idempotency-Key': 'ord-' + Date.now() },
        body: JSON.stringify({ cart, user: { username: 'demo' }, payment: window.__lastPI })
      })
      const data = await res.json()
      console.log('Order created:', data)
      if (data?.order?.id) sessionStorage.setItem('last_order_id', data.order.id)
      if (window.__tg_paid && data?.order?.id) {
        try {
          await fetch('http://localhost:4000/api/orders/mark-paid', {
            method:'POST', headers:{ 'Content-Type':'application/json', 'X-Telegram-InitData': initData || '' },
            body: JSON.stringify({ orderId: data.order.id })
          })
        } catch(e) { console.warn('mark-paid failed', e) }
      }
      onSuccess()
    } catch (e) {
      setError('Payment failed or unavailable. You can try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{padding:16}}>
      <a href="#cart">← {t('back')}</a>
      <h2>{t('checkout_title')}</h2>
      <p>{t('checkout_note')}</p>
      <button disabled={loading} onClick={handlePay}>{loading ? t('processing') : t('pay')}</button>
          {error && <div style={{marginTop:8,color:'#a00'}}>{error}</div>}
    </div>
  )
}