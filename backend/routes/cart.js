const express = require('express');
const { v4: uuidv4 } = require('uuid');
const db = require('../db');
const { authMiddleware } = require('../middleware/auth');
const router = express.Router();

router.get('/', authMiddleware, (req, res) => {
  const items = db.collection('cart_items').findAll({ user_id: req.user.id });
  const enriched = items.map(item => {
    const product = db.collection('products').findOne({ id: item.product_id });
    if (!product) return null;
    return { ...item, name: product.name, price: product.price, original_price: product.original_price, image_url: product.image_url, stock: product.stock, category: product.category };
  }).filter(Boolean);
  res.json(enriched);
});

router.post('/', authMiddleware, (req, res) => {
  const { product_id, quantity = 1, size, color } = req.body;
  if (!product_id) return res.status(400).json({ error: 'product_id required' });
  const product = db.collection('products').findOne({ id: product_id });
  if (!product) return res.status(404).json({ error: 'Product not found' });
  const items = db.collection('cart_items').findAll({ user_id: req.user.id, product_id });
  const existing = items.find(i => i.size === (size || null) && i.color === (color || null));
  if (existing) {
    db.collection('cart_items').update({ id: existing.id }, { quantity: existing.quantity + quantity });
    return res.json({ message: 'Cart updated', id: existing.id });
  }
  const id = uuidv4();
  db.collection('cart_items').insert({ id, user_id: req.user.id, product_id, quantity, size: size || null, color: color || null });
  res.status(201).json({ message: 'Added to cart', id });
});

router.put('/:id', authMiddleware, (req, res) => {
  const { quantity } = req.body;
  if (quantity < 1) {
    db.collection('cart_items').delete({ id: req.params.id, user_id: req.user.id });
    return res.json({ message: 'Item removed' });
  }
  db.collection('cart_items').update({ id: req.params.id, user_id: req.user.id }, { quantity });
  res.json({ message: 'Cart updated' });
});

router.delete('/:id', authMiddleware, (req, res) => {
  db.collection('cart_items').delete({ id: req.params.id, user_id: req.user.id });
  res.json({ message: 'Item removed' });
});

router.delete('/', authMiddleware, (req, res) => {
  const data = db.get();
  data.cart_items = data.cart_items.filter(i => i.user_id !== req.user.id);
  db.save();
  res.json({ message: 'Cart cleared' });
});

module.exports = router;
