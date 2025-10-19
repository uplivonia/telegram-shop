import React, { useEffect, useState } from 'react'
import { createT, getLangFromTelegram } from '../i18n.js'
import useTelegram from '../hooks/useTelegram.js'
import { API } from '../config.js'

export function ProductPage({ id, onAdd }) {
  const { tg } = useTelegram()
  const lang = getLangFromTelegram(tg)
  const t = createT(lang)
  const [product, setProduct] = useState(null)

  useEffect(() => {
    if (!id) return
      fetch(`${API}/api/products/${id}`)
      .then(r => r.json())
      .then(setProduct)
      .catch(() => setProduct(null))
  }, [id])

  if (!product) return <div style={{padding:16}}>Loading...</div>

  return (
    <div style={{padding:16}}>
      <a href="#home">← {t('back')}</a>
      <div style={{marginTop:12,border:'1px solid #eee',borderRadius:12,padding:16}}>
        <div style={{height:160,display:'flex',alignItems:'center',justifyContent:'center',background:'#fafafa',borderRadius:8,marginBottom:12}}>
          <span role="img" aria-label="img" style={{fontSize:48}}>🧩</span>
        </div>
        <h2>{product.title}</h2>
        <div style={{opacity:0.8}}>${product.price}</div>
        <button style={{marginTop:12}} onClick={() => onAdd(product)}>{t('add_to_cart')}</button>
      </div>
    </div>
  )
}
