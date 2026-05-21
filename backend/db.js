const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const DB_PATH = path.join(__dirname, 'data.json');

const DEFAULT = { users: [], products: [], cart_items: [], orders: [], order_items: [], reviews: [] };

function load() {
  if (!fs.existsSync(DB_PATH)) return DEFAULT;
  try { return JSON.parse(fs.readFileSync(DB_PATH, 'utf8')); } catch { return DEFAULT; }
}
function save(data) { fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2)); }

let _db = load();

const db = {
  get: () => _db,
  save: () => save(_db),
  collection: (name) => ({
    findAll: (filter) => {
      let rows = _db[name] || [];
      if (filter) rows = rows.filter(r => Object.keys(filter).every(k => r[k] === filter[k]));
      return rows;
    },
    findOne: (filter) => {
      return (_db[name] || []).find(r => Object.keys(filter).every(k => r[k] === filter[k])) || null;
    },
    insert: (doc) => {
      if (!_db[name]) _db[name] = [];
      _db[name].push(doc);
      save(_db);
      return doc;
    },
    update: (filter, updates) => {
      let changed = 0;
      _db[name] = (_db[name] || []).map(r => {
        if (Object.keys(filter).every(k => r[k] === filter[k])) { changed++; return { ...r, ...updates }; }
        return r;
      });
      save(_db);
      return changed;
    },
    delete: (filter) => {
      const before = (_db[name] || []).length;
      _db[name] = (_db[name] || []).filter(r => !Object.keys(filter).every(k => r[k] === filter[k]));
      save(_db);
      return before - _db[name].length;
    }
  })
};

// Seed admin user
if (!db.collection('users').findOne({ email: 'admin@shop.com' })) {
  db.collection('users').insert({
    id: uuidv4(), email: 'admin@shop.com',
    password: bcrypt.hashSync('admin123', 10),
    name: 'Admin', role: 'admin', created_at: new Date().toISOString()
  });
}

// Seed products from both seed files
if (db.collection('products').findAll().length === 0) {
  const seeds1 = require('./seeds1');
  const seeds2 = require('./seeds2');
  const allProducts = [...seeds1, ...seeds2];
  allProducts.forEach(p => db.collection('products').insert(p));
  console.log(`✅ Seeded ${allProducts.length} products`);
}

module.exports = db;
