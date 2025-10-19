import React from 'react'
import './styles.css'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

function applyTelegramTheme() {
    const tg = window?.Telegram?.WebApp
    const tp = tg?.themeParams || {}
    const set = (k, v) => document.documentElement.style.setProperty(k, v)

    // базовые цвета с дефолтами под светлую тему
    set('--bg', tp.bg_color || '#ffffff')
    set('--bg-sec', tp.secondary_bg_color || '#f4f4f5')
    set('--text', tp.text_color || '#0b0c0d')
    set('--hint', tp.hint_color || '#707579')
    set('--link', tp.link_color || '#3390ec')
    set('--accent', tp.accent_text_color || tp.button_color || '#3390ec')
    set('--btn-text', tp.button_text_color || '#ffffff')
    set('--border', 'color-mix(in srgb, var(--text) 10%, transparent)')
}

applyTelegramTheme()

createRoot(document.getElementById('root')).render(<App />)
