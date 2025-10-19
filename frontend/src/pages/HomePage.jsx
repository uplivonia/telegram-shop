import React, { useEffect, useState } from 'react'
import { createT, getLangFromTelegram } from '../i18n.js'
import useTelegram from '../hooks/useTelegram.js
import { API } from '../config.js'

export function HomePage({ onOpen }) {
  const { tg } = useTelegram()
  const lang = getLangFromTelegram(tg)
  const t = createT(lang)
  const [items, setItems] = useState([])

  useEffect(() => {
      fetch(`${API}/api/products`)
      .then(r => r.json())
      .then(setItems)
      .catch(() => setItems([]))
  }, [])

  return (
    <div style={{padding:16}}>
      <h2>{t('catalog')}</h2>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
        {items.map(p => (
          <div key={p.id} style={{border:'1px solid #eee',borderRadius:12,padding:12}}>
            <div style={{height:100,display:'flex',alignItems:'center',justifyContent:'center',background:'#fafafa',borderRadius:8,marginBottom:8}}>
              <span role="img" aria-label="img">🛍️</span>
            </div>
            <div style={{fontWeight:600}}>{p.title}</div>
            <div style={{opacity:0.8,fontSize:14}}>${p.price}</div>
            <button style={{marginTop:8,width:'100%'}} onClick={()=>onOpen(p.id)}>{t('open')}</button>
          </div>
        ))}
      </div>
    </div>
  )
}
