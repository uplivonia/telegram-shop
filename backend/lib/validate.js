export function validateCart(cart) {
  if (!Array.isArray(cart) || cart.length === 0) return 'Cart must be a non-empty array';
  for (const it of cart) {
    if (!it || typeof it !== 'object') return 'Cart item invalid';
    if (!it.id || !it.title) return 'Cart item missing id/title';
    if (typeof it.price !== 'number' || !(it.price >= 0)) return 'Item price must be >= 0';
    const qty = it.qty ?? 1;
    if (!Number.isInteger(qty) || qty <= 0 || qty > 999) return 'Item qty invalid';
  }
  return null;
}

export function validatePrices(prices) {
  if (!Array.isArray(prices) || prices.length === 0) return 'prices must be an array with at least one element';
  for (const p of prices) {
    if (typeof p.amount !== 'number' || !Number.isInteger(p.amount) || p.amount <= 0) return 'price.amount must be positive integer (minor units)';
    if (!p.label) return 'price.label required';
  }
  return null;
}
