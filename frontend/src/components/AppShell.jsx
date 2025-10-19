import React from 'react'
import useTelegram from '../hooks/useTelegram.js'

export default function AppShell({ children, active = 'catalog' }) {
    const { username } = useTelegram()
    return (
        <div className="app">
            <header className="header">
                <div className="header-inner container">
                    <div className="brand">Telegram Shop</div>
                    <div className="spacer" />
                    {username && <div className="user">@{username}</div>}
                </div>
            </header>

            <main className="container">{children}</main>

            <nav className="bar">
                <div className="bar-inner container">
                    <a href="#/" className="nav-btn" style={{ fontWeight: active === 'catalog' ? 800 : 500 }}>🛍 Catalog</a>
                    <a href="#/orders" className="nav-btn" style={{ fontWeight: active === 'orders' ? 800 : 500 }}>📦 Orders</a>
                    <a href="#/cart" className="nav-btn" style={{ fontWeight: active === 'cart' ? 800 : 500 }}>🧺 Cart</a>
                </div>
            </nav>
        </div>
    )
}
