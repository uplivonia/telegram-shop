import React, { useEffect, useState } from 'react'
import { createT, getLangFromTelegram } from '../i18n.js'
import useTelegram from '../hooks/useTelegram.js'
import { API } from '../config.js'

export function AdminPage() {
    const { initData, tg, isTelegram } = useTelegram()
    const lang = getLangFromTelegram(tg)
    const t = createT(lang)

    const [list, setList] = useState([])
    const [err, setErr] = useState(null)

    useEffect(() => {
        const load = async () => {
            try {
                const res = await fetch(`${API}/api/admin/products`, {
                    headers: { 'X-Telegram-InitData': initData || '' }
                })
                if (!res.ok) throw new Error(`HTTP ${res.status}`)
                const data = await res.json()
                setList(Array.isArray(data) ? data : [])
            } catch (e) {
                setErr('Failed to load products (open in Telegram as owner?)')
            }
        }
        load()
    }, [initData])

    if (!isTelegram) {
        return <div style={{ padding: 16 }}>
            <h2>Admin</h2>
            <p>Откройте мини-апп из Telegram (нужен initData и права владельца).</p>
        </div>
    }

    return (
        <div style={{ padding: 16 }}>
            <h2>{t('admin_title') || 'Admin'}</h2>
            {err && <div style={{ color: '#a00', marginBottom: 8 }}>{err}</div>}
            <ul>
                {list.map(p => (
                    <li key={p.id}>{p.title} — ${p.price}</li>
                ))}
            </ul>
        </div>
    )
}
