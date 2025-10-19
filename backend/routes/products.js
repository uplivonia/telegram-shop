import { Router } from 'express';
import { getProducts } from '../lib/db.js';

const router = Router();

router.get('/', (_req, res) => {
  res.json(getProducts());
});

router.get('/:id', (req, res) => {
  const item = getProducts().find(p => p.id === req.params.id);
  if (!item) return res.status(404).json({ error: 'Not found' });
  res.json(item);
});

export default router;
