function redact(obj, depth = 0) {
  if (obj == null || typeof obj !== 'object' || depth > 3) return obj
  const out = Array.isArray(obj) ? [] : {}
  for (const k of Object.keys(obj)) {
    if (/(token|secret|key|password|provider)/i.test(k)) out[k] = '***masked***'
    else if (k === 'initData' || k === 'initDataUnsafe') out[k] = '[initData redacted]'
    else if (typeof obj[k] === 'object') out[k] = redact(obj[k], depth + 1)
    else out[k] = obj[k]
  }
  return out
}

export function jsonLogger(req, res, next) {
  const start = Date.now()
  const { method, originalUrl } = req
  const safeBody = redact(req.body || {})
  res.on('finish', () => {
    const ms = Date.now() - start
    const entry = { t: new Date().toISOString(), method, url: originalUrl, status: res.statusCode, ms, body: safeBody }
    try { console.log(JSON.stringify(entry)) } catch {}
  })
  next()
}
