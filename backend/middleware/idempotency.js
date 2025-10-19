const store = new Map();

/**
 * Simple idempotency middleware.
 * Clients should send 'Idempotency-Key' header for POST endpoints.
 * For demo we keep results in memory; in production use Redis/db with TTL.
 */
export function idempotency() {
  return (req, res, next) => {
    const key = req.get('Idempotency-Key');
    if (!key) return next();
    if (store.has(key)) {
      const { status, body, headers } = store.get(key);
      if (headers) Object.entries(headers).forEach(([k,v]) => res.setHeader(k, v));
      return res.status(status).json(body);
    }
    const json = res.json.bind(res);
    res.json = (payload) => {
      try { store.set(key, { status: res.statusCode || 200, body: payload, headers: {} }); } catch {}
      return json(payload);
    }
    next();
  };
}
