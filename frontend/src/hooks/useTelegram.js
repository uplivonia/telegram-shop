import { useEffect, useState } from 'react'

export default function useTelegram() {
  const [tg, setTg] = useState(null)
  const [isTelegram, setIsTelegram] = useState(false)
  const [initData, setInitData] = useState('')

  useEffect(() => {
    const w = window
    const app = w.Telegram && w.Telegram.WebApp ? w.Telegram.WebApp : null
    if (app) {
      try { app.ready?.(); app.expand?.() } catch {}
      setIsTelegram(true)
      setTg(app)
      const viaApi = app.initData || ''
      const viaHash = new URLSearchParams(w.location.hash.replace(/^#/, '')).get('tgWebAppData') || ''
      const viaSearch = new URLSearchParams(w.location.search).get('tgWebAppData') || ''
      setInitData(viaApi || viaHash || viaSearch || '')
    } else {
      setIsTelegram(false)
      setTg(null)
      setInitData('')
    }
  }, [])

  return { tg, isTelegram, initData }
}
