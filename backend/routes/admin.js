import { Router } from 'express';
import { getProducts, saveProducts } from '../lib/db.js';
import { requireTelegram, requireOwner } from '../middleware/auth.js';

const router = Router();

// All admin routes require telegram + owner
router.use(requireTelegram, requireOwner);

router.get('/products', (_req, res) => {
  res.json(getProducts());
});

router.post('/products', (req, res) => {
  const products = getProducts();
  const item = req.body;
  if (!item || !item.id) {
    return res.status(400).json({ error: 'Missing id' });
  }
  if (products.find(p => p.id === item.id)) {
    return res.status(409).json({ error: 'ID already exists' });
  }
  products.push(item);
  saveProducts(products);
  res.json({ ok: true, item });
});

router.put('/products/:id', (req, res) => {
  const products = getProducts();
  const idx = products.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  products[idx] = { ...products[idx], ...req.body, id: products[idx].id };
  saveProducts(products);
  res.json({ ok: true, item: products[idx] });
});

router.delete('/products/:id', (req, res) => {
  const products = getProducts();
  const idx = products.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  const [removed] = products.splice(idx, 1);
  saveProducts(products);
  res.json({ ok: true, removed });
});

export default router;
