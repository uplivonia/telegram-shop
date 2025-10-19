// frontend/src/components/Header.jsx
import React from 'react'
import { createT, getLangFromTelegram } from '../i18n.js'
import useTelegram from '../hooks/useTelegram.js'

export function Header() {
    const { tg, isTelegram } = useTelegram()
    const lang = getLangFromTelegram(tg)
    const t = createT(lang)
    const username = tg?.initDataUnsafe?.user?.username

    return (
        <header className="header">
            <div className="header-inner">
                <strong>Telegram Shop</strong>
                <nav>
                    <a href="#orders">{t('orders_link') || 'Orders'}</a>
                </nav>
                <span style={{ opacity: 0.6, fontSize: 12 }}>
                    {isTelegram
                        ? (username ? `@${username}` : 'Telegram WebApp')
                        : 'Dev Mode (Browser)'}
                </span>
            </div>
        </header>
    )
}
