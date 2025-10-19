import en from './locales/en.json'
import ru from './locales/ru.json'
import es from './locales/es.json'
import de from './locales/de.json'

const dicts = { en, ru, es, de }

/**
 * Определяет язык пользователя из Telegram или браузера
 * и возвращает ISO-код (en / ru / es / de).
 * По умолчанию — 'en'
 */
export function getLangFromTelegram(tg) {
    const tgLang = tg?.initDataUnsafe?.user?.language_code?.slice(0, 2)?.toLowerCase()
    if (tgLang && dicts[tgLang]) return tgLang

    const navLang = (navigator.language || 'en').slice(0, 2).toLowerCase()
    return dicts[navLang] ? navLang : 'en'
}

/**
 * Создаёт функцию перевода
 */
export function createT(lang) {
    const d = dicts[lang] || en
    return (key) => d[key] || en[key] || key
}
