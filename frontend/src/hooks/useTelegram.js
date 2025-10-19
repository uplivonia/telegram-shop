import { useEffect, useMemo, useState } from 'react'

export default function useTelegram() {
  const [tg, setTg] = useState(null)

  useEffect(() => {
    if (window.Telegram && window.Telegram.WebApp) {
      setTg(window.Telegram.WebApp)
      window.Telegram.WebApp.ready && window.Telegram.WebApp.ready()
    }
  }, [])

  const isTelegram = !!tg
  const username = useMemo(() => {
    return tg?.initDataUnsafe?.user?.username || null
  }, [tg])

  return { tg, isTelegram, username }
}
