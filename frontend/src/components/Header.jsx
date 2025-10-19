import React from 'react'
import useTelegram from '../hooks/useTelegram.js'
import { createT, getLangFromTelegram } from '../i18n.js'

const OWNER = import.meta.env.VITE_OWNER_USERNAME || ''

export function Header() {
  const { tg, isTelegram } = useTelegram() {
  const { username, isTelegram, tg } = useTelegram()
  const lang = getLangFromTelegram(tg)
  const t = createT(lang)
  const isOwner = OWNER && username && OWNER.toLowerCase() === username.toLowerCase()

  return (
    <header style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'12px 16px',position:'sticky',top:0,background:'#fff',borderBottom:'1px solid #eee',zIndex:1}}>
      <div style={{display:'flex',gap:12,alignItems:'center'}}>
        <a href="#home" style={{fontWeight:700,textDecoration:'none',color:'inherit'}}>Telegram Shop</a>
        <a href="#orders" style={{fontSize:14,opacity:0.9}}>Orders</a>
        {isOwner && <a href="#admin" style={{fontSize:14,opacity:0.9}}>{t('admin')}</a>}
      </div>
      <div style={{fontSize:12,opacity:0.8}}>
        {isTelegram ? `@${username || 'user'}` : 'Dev Mode (Browser)'}
      </div>
    </header>
  )
}
