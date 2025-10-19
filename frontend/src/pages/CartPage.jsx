import React from 'react'
import { createT, getLangFromTelegram } from '../i18n.js'
import useTelegram from '../hooks/useTelegram.js'
import { API } from '../config.js'

export function CartPage({ cart, onCheckout, onClear }) {
  const { tg } = useTelegram()
  const lang = getLangFromTelegram(tg)
  const t = createT(lang)
  const total = cart.reduce((sum, i) => sum + i.price * (i.qty || 1), 0).toFixed(2)

  return (
    <div style={{padding:16}}>
      <a href="#home">← {t('back')}</a>
      <h2>{t('cart')}</h2>
      {cart.length === 0 ? (
        <div>{t('empty_cart')}</div>
      ) : (
        <>
          <ul>
            {cart.map(item => (
              <li key={item.id}>{item.title} × {item.qty || 1} — ${item.price}</li>
            ))}
          </ul>
          <div style={{marginTop:8,fontWeight:600}}>{t('total')}: ${total}</div>
          <div style={{display:'flex',gap:8,marginTop:12}}>
            <button onClick={onCheckout}>{t('checkout')}</button>
            <button onClick={onClear}>{t('clear')}</button>
          </div>
        </>
      )}
    </div>
  )
}