import React, { useEffect, useState } from 'react'
import useTelegram from '../hooks/useTelegram.js'
import { createT, getLangFromTelegram } from '../i18n.js'
import { API } from '../config.js'
import AppShell from '../components/AppShell.jsx'
import { Button } from '../components/Button.jsx'
import { SkeletonCard } from '../components/Skeleton.jsx'

export function HomePage({ addToCart }) {
    const { tg } = useTelegram()
    const t = createT(getLangFromTelegram(tg))
    const [items, setItems] = useState(null)
    const [err, setErr] = useState(null)

    useEffect(() => {
        (async () => {
            try {
                const r = await fetch(`${API}/api/products`)
                const data = await r.json()
                setItems(Array.isArray(data) ? data : [])
            } catch (e) {
                setErr('Failed to load products')
                setItems([])
            }
        })()
    }, [])

    return (
        <AppShell active="catalog">
            <h2 style={{ margin: '8px 0 16px' }}>🛍 {t('catalog') || 'Catalog'}</h2>

            {items === null && (
                <div className="cards">
                    {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
                </div>
            )}

            {err && <div className="small" style={{ color: '#b00020', marginBottom: 12 }}>{err}</div>}

            {items && !!items.length && (
                <div className="cards">
                    {items.map(p => (
                        <div className="card" key={p.id}>
                            <h4>{p.title}</h4>
                            <div className="small">{p.description || '—'}</div>
                            <div className="price">${(p.price ?? 0).toFixed(2)}</div>
                            <Button onClick={() => addToCart?.(p)}>Add to cart</Button>
                        </div>
                    ))}
                </div>
            )}

            {items && items.length === 0 && !err && (
                <div className="small">No products yet.</div>
            )}

            <div className="small" style={{ textAlign: 'center', margin: '20px 0 80px' }}>
                <a href="#terms">Terms</a> · <a href="#privacy">Privacy</a>
            </div>
        </AppShell>
    )
}
