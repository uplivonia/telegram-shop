import en from './locales/en.json'
import ru from './locales/ru.json'
import es from './locales/es.json'
import de from './locales/de.json'

const dicts = { en, ru, es, de }

export function getLangFromTelegram(tg) {
  const code = tg?.initDataUnsafe?.user?.language_code
  if (code && dicts[code]) return code
  const nav = (navigator.language || 'en').slice(0,2)
  return dicts[nav] ? nav : 'en'
}

export function createT(lang) {
  const d = dicts[lang] || en
  return (key) => d[key] || key
}
