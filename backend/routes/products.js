const express = require('express');
const { v4: uuidv4 } = require('uuid');
const db = require('../db');
const { adminMiddleware } = require('../middleware/auth');
const router = express.Router();

router.get('/', (req, res) => {
  const { search, category, minPrice, maxPrice, sort, featured, page = 1, limit = 12 } = req.query;
  let products = db.collection('products').findAll();

  if (search) {
    const s = search.toLowerCase();
    products = products.filter(p => p.name.toLowerCase().includes(s) || p.description?.toLowerCase().includes(s) || p.tags?.some(t => t.includes(s)));
  }
  if (category && category !== 'All') products = products.filter(p => p.category === category);
  if (minPrice) products = products.filter(p => p.price >= Number(minPrice));
  if (maxPrice) products = products.filter(p => p.price <= Number(maxPrice));
  if (featured === 'true') products = products.filter(p => p.featured);

  const sortFns = {
    price_asc: (a, b) => a.price - b.price,
    price_desc: (a, b) => b.price - a.price,
    rating: (a, b) => b.rating - a.rating,
    popular: (a, b) => b.reviews_count - a.reviews_count,
    newest: (a, b) => new Date(b.created_at) - new Date(a.created_at),
  };
  if (sortFns[sort]) products.sort(sortFns[sort]);
  else products.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));

  const total = products.length;
  const p = Number(page), l = Number(limit);
  const paginated = products.slice((p - 1) * l, p * l);
  res.json({ products: paginated, total, pages: Math.ceil(total / l), page: p });
});

router.get('/:id', (req, res) => {
  const product = db.collection('products').findOne({ id: req.params.id });
  if (!product) return res.status(404).json({ error: 'Product not found' });
  const reviews = db.collection('reviews').findAll({ product_id: req.params.id });
  res.json({ ...product, reviews });
});

router.post('/', adminMiddleware, (req, res) => {
  const { name, description, price, original_price, category, image_url, stock, sizes, colors, featured } = req.body;
  if (!name || !price || !category) return res.status(400).json({ error: 'Name, price and category required' });
  const id = uuidv4();
  const product = { id, name, description: description || '', price: Number(price), original_price: original_price || null, category, image_url: image_url || '', images: image_url ? [image_url] : [], stock: Number(stock) || 100, rating: 0, reviews_count: 0, tags: [], sizes: sizes || [], colors: colors || [], featured: featured ? true : false, created_at: new Date().toISOString() };
  db.collection('products').insert(product);
  res.status(201).json({ id, message: 'Product created' });
});

router.put('/:id', adminMiddleware, (req, res) => {
  const product = db.collection('products').findOne({ id: req.params.id });
  if (!product) return res.status(404).json({ error: 'Product not found' });
  const updates = {};
  ['name','description','price','original_price','category','image_url','stock','featured'].forEach(k => { if (req.body[k] !== undefined) updates[k] = req.body[k]; });
  if (req.body.price) updates.price = Number(req.body.price);
  db.collection('products').update({ id: req.params.id }, updates);
  res.json({ message: 'Product updated' });
});

router.delete('/:id', adminMiddleware, (req, res) => {
  const n = db.collection('products').delete({ id: req.params.id });
  if (n === 0) return res.status(404).json({ error: 'Product not found' });
  res.json({ message: 'Product deleted' });
});

router.post('/:id/reviews', (req, res) => {
  const { rating, comment, user_id, user_name } = req.body;
  if (!rating || !user_id) return res.status(400).json({ error: 'Rating and user required' });
  const id = uuidv4();
  db.collection('reviews').insert({ id, product_id: req.params.id, user_id, user_name, rating: Number(rating), comment: comment || '', created_at: new Date().toISOString() });
  const reviews = db.collection('reviews').findAll({ product_id: req.params.id });
  const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
  db.collection('products').update({ id: req.params.id }, { rating: Math.round(avg * 10) / 10, reviews_count: reviews.length });
  res.status(201).json({ id });
});

module.exports = router;
