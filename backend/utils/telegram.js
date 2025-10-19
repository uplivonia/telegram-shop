import crypto from 'crypto'

export function verifyTelegramInitData(initData, botToken) {
    try {
        const secretKey = crypto.createHmac('sha256', 'WebAppData').update(botToken).digest()
        const urlParams = new URLSearchParams(initData)
        const hash = urlParams.get('hash')
        urlParams.delete('hash')

        const dataCheckString = Array.from(urlParams.keys())
            .sort()
            .map(k => `${k}=${urlParams.get(k)}`)
            .join('\n')

        const hmac = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex')
        return hmac === hash
    } catch {
        return false
    }
}
