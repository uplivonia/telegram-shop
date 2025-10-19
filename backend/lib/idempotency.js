import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const storeFile = path.join(__dirname, '..', 'data', 'idempotency.json');

function load() {
  try {
    const raw = fs.readFileSync(storeFile, 'utf8');
    return JSON.parse(raw || '{}');
  } catch { return {}; }
}
function save(obj) {
  fs.writeFileSync(storeFile, JSON.stringify(obj, null, 2), 'utf8');
}

/**
 * Simple idempotency: if key exists and not expired => reject; else store now.
 * @param {string} key
 * @param {number} ttlSec
 * @returns {boolean} true if stored fresh, false if duplicate
 */
export function touchKey(key, ttlSec = 300) {
  if (!key) return true;
  const now = Date.now();
  const db = load();
  // purge old
  for (const k of Object.keys(db)) {
    if (now - (db[k]?.ts || 0) > ttlSec * 1000) delete db[k];
  }
  if (db[key]) {
    return false;
  }
  db[key] = { ts: now };
  save(db);
  return true;
}
