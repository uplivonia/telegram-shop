import React, { useEffect, useState } from 'react'
import { HomePage } from './pages/HomePage.jsx'
import { ProductPage } from './pages/ProductPage.jsx'
import { CartPage } from './pages/CartPage.jsx'
import { CheckoutPage } from './pages/CheckoutPage.jsx'
import { SuccessPage } from './pages/SuccessPage.jsx'
import { OrdersPage } from './pages/OrdersPage.jsx'
import { Watermark } from './components/Watermark.jsx'
import { TermsPage } from './pages/TermsPage.jsx'
import { PrivacyPage } from './pages/PrivacyPage.jsx'
import { Footer } from './components/Footer.jsx'
import { AdminPage } from './pages/AdminPage.jsx'
import { createT, getLangFromTelegram } from './i18n.js'
import useTelegram from './hooks/useTelegram.js'
import { Header } from './components/Header.jsx'

export default function App() {
  const { tg } = useTelegram()
  const lang = getLangFromTelegram(tg)
  const t = createT(lang)
  const [route, setRoute] = useState('home')
  const [productId, setProductId] = useState(null)
  const [cart, setCart] = useState([])

  useEffect(() => {
    // simple hash router
    const onHash = () => {
      const hash = window.location.hash.replace('#', '')
      const [name, param] = hash.split('/')
      setRoute(name || 'home')
      setProductId(param || null)
    }
    window.addEventListener('hashchange', onHash)
    onHash()
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const addToCart = (item) => {
    setCart(prev => {
      const idx = prev.findIndex(p => p.id === item.id)
      if (idx >= 0) {
        const next = [...prev]
        next[idx] = { ...next[idx], qty: (next[idx].qty || 1) + 1 }
        return next
      }
      return [...prev, { ...item, qty: 1 }]
    })
    window.location.hash = 'cart'
  }

  const clearCart = () => setCart([])

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', paddingBottom: 24 }}>
      <Header />
      {route === 'home' && <HomePage onOpen={(id)=>{ window.location.hash = `product/${id}` }} />}
      {route === 'product' && <ProductPage id={productId} onAdd={addToCart} />}
      {route === 'cart' && <CartPage cart={cart} onCheckout={()=>{ window.location.hash='checkout'}} onClear={clearCart} />}
      {route === 'checkout' && <CheckoutPage cart={cart} onSuccess={()=>{ window.location.hash='success' }} />}
      {route === 'success' && <SuccessPage />}
      {route === 'terms' && <TermsPage />}
      {route === 'privacy' && <PrivacyPage />}
      {route === 'orders' && <OrdersPage />}
      {route === 'admin' && <AdminPage />}
          <Footer />
      <Watermark />
    </div>
  )
}
