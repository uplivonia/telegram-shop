import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.join(__dirname, '..', 'data');

const productsFile = path.join(dataDir, 'products.json');
const ordersFile = path.join(dataDir, 'orders.json');

function readJSON(file, fallback) {
  try {
    if (!fs.existsSync(file)) return fallback;
    const raw = fs.readFileSync(file, 'utf8');
    return JSON.parse(raw || 'null') ?? fallback;
  } catch {
    return fallback;
  }
}

function writeJSON(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
}

export function getProducts() {
  return readJSON(productsFile, [
    { id: 'p1', title: 'Handmade Mug', price: 19.99, image: '/mug.png', stock: 12 },
    { id: 'p2', title: 'Custom Sticker Pack', price: 6.50, image: '/stickers.png', stock: 50 },
    { id: 'p3', title: 'Digital Guide (PDF)', price: 9.99, image: '/guide.png', stock: null }
  ]);
}

export function saveProducts(products) {
  writeJSON(productsFile, products);
}

export function getOrders() {
  return readJSON(ordersFile, []);
}

export function saveOrders(orders) {
  writeJSON(ordersFile, orders);
}
