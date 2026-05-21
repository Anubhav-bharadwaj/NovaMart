const express = require('express');
const { v4: uuidv4 } = require('uuid');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const db = require('../db');
const { authMiddleware } = require('../middleware/auth');
const router = express.Router();

router.post('/create-payment-intent', authMiddleware, async (req, res) => {
  const { amount } = req.body;
  if (!amount || amount < 50) return res.status(400).json({ error: 'Invalid amount' });
  try {
    const pi = await stripe.paymentIntents.create({ amount: Math.round(amount), currency: 'usd', automatic_payment_methods: { enabled: true } });
    res.json({ clientSecret: pi.client_secret, paymentIntentId: pi.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/checkout', authMiddleware, (req, res) => {
  const { shipping, payment_intent_id } = req.body;
  if (!shipping) return res.status(400).json({ error: 'Shipping required' });
  const cartItems = db.collection('cart_items').findAll({ user_id: req.user.id });
  if (cartItems.length === 0) return res.status(400).json({ error: 'Cart is empty' });

  const enriched = cartItems.map(ci => {
    const p = db.collection('products').findOne({ id: ci.product_id });
    return p ? { ...ci, price: p.price, name: p.name, image_url: p.image_url } : null;
  }).filter(Boolean);

  const subtotal = enriched.reduce((s, i) => s + i.price * i.quantity, 0);
  const total = subtotal + (subtotal >= 50 ? 0 : 9.99);
  const orderId = uuidv4();

  const order = { id: orderId, user_id: req.user.id, total, status: 'confirmed', shipping_name: shipping.name, shipping_address: shipping.address, shipping_city: shipping.city, shipping_state: shipping.state, shipping_zip: shipping.zip, shipping_country: shipping.country, payment_intent_id: payment_intent_id || null, created_at: new Date().toISOString() };
  db.collection('orders').insert(order);

  enriched.forEach(item => {
    db.collection('order_items').insert({ id: uuidv4(), order_id: orderId, product_id: item.product_id, product_name: item.name, quantity: item.quantity, price: item.price, size: item.size, color: item.color, image_url: item.image_url });
    db.collection('products').update({ id: item.product_id }, { stock: Math.max(0, (db.collection('products').findOne({ id: item.product_id })?.stock || 0) - item.quantity) });
  });

  // Clear cart
  const data = db.get();
  data.cart_items = data.cart_items.filter(i => i.user_id !== req.user.id);
  db.save();

  res.status(201).json({ orderId, message: 'Order placed successfully' });
});

router.get('/', authMiddleware, (req, res) => {
  const orders = db.collection('orders').findAll({ user_id: req.user.id }).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  const result = orders.map(o => ({ ...o, items: db.collection('order_items').findAll({ order_id: o.id }) }));
  res.json(result);
});

router.get('/:id', authMiddleware, (req, res) => {
  const order = db.collection('orders').findOne({ id: req.params.id, user_id: req.user.id });
  if (!order) return res.status(404).json({ error: 'Order not found' });
  res.json({ ...order, items: db.collection('order_items').findAll({ order_id: order.id }) });
});

module.exports = router;
