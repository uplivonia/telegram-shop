import React, { useEffect, useState } from 'react'
import useTelegram from '../hooks/useTelegram.js'
import { createT, getLangFromTelegram } from '../i18n.js'

export function AdminPage() {
  const { tg, initData, initDataUnsafe } = useTelegram()
  const lang = getLangFromTelegram(tg)
  const t = createT(lang)

  const [list, setList] = useState([])
  const [form, setForm] = useState({ id:'', title:'', price:0, image:'', stock:0 })
  const headers = { 'Content-Type':'application/json', 'X-Telegram-InitData': initData || '' }

  const load = async () => {
    const res = await fetch('http://localhost:4000/api/admin/products', { headers })
    const data = await res.json()
    setList(Array.isArray(data) ? data : [])
  }

  useEffect(() => { load() }, [])

  const createItem = async () => {
    await fetch('http://localhost:4000/api/admin/products', {
      method:'POST',
      headers,
      body: JSON.stringify({ ...form, price: Number(form.price), stock: form.stock === '' ? null : Number(form.stock) })
    })
    setForm({ id:'', title:'', price:0, image:'', stock:0 })
    load()
  }

  const updateItem = async (id, patch) => {
    await fetch(`http://localhost:4000/api/admin/products/${id}`, {
      method:'PUT', headers, body: JSON.stringify(patch)
    })
    load()
  }

  const removeItem = async (id) => {
    await fetch(`http://localhost:4000/api/admin/products/${id}`, { method:'DELETE', headers })
    load()
  }

  return (
    <div style={{padding:16}}>
      <a href="#home">← {t('back')}</a>
      <h2>{t('admin_products')}</h2>

      <div style={{display:'grid',gap:8,maxWidth:420,marginTop:8}}>
        <input placeholder="id" value={form.id} onChange={e=>setForm({...form,id:e.target.value})} />
        <input placeholder={t('title')} value={form.title} onChange={e=>setForm({...form,title:e.target.value})} />
        <input placeholder={t('price')} type="number" value={form.price} onChange={e=>setForm({...form,price:e.target.value})} />
        <input placeholder={t('image')} value={form.image} onChange={e=>setForm({...form,image:e.target.value})} />
        <input placeholder={t('stock')} type="number" value={form.stock} onChange={e=>setForm({...form,stock:e.target.value})} />
        <button onClick={createItem}>{t('create')}</button>
      </div>

      <ul style={{marginTop:16}}>
        {list.map(p => (
          <li key={p.id} style={{display:'flex',gap:8,alignItems:'center',padding:'6px 0'}}>
            <code>{p.id}</code> — <strong>{p.title}</strong> (${p.price})
            <button onClick={()=>updateItem(p.id, { title: p.title + ' *' })} style={{marginLeft:8}}>{t('update')}</button>
            <button onClick={()=>removeItem(p.id)}>{t('delete')}</button>
          </li>
        ))}
      </ul>
    </div>
  )
}
