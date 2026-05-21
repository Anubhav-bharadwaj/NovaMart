const express = require('express');
const db = require('../db');
const { adminMiddleware } = require('../middleware/auth');
const router = express.Router();

router.get('/stats', adminMiddleware, (req, res) => {
  const orders = db.collection('orders').findAll();
  const users = db.collection('users').findAll();
  const products = db.collection('products').findAll();
  const orderItems = db.collection('order_items').findAll();

  const totalRevenue = orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + o.total, 0);
  const recentOrders = [...orders].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 10).map(o => {
    const u = db.collection('users').findOne({ id: o.user_id });
    return { ...o, user_name: u?.name, email: u?.email };
  });

  const statusCounts = {};
  orders.forEach(o => { statusCounts[o.status] = (statusCounts[o.status] || 0) + 1; });
  const ordersByStatus = Object.entries(statusCounts).map(([status, cnt]) => ({ status, cnt }));

  const productSales = {};
  orderItems.forEach(i => { productSales[i.product_id] = (productSales[i.product_id] || 0) + i.quantity; });
  const topProducts = Object.entries(productSales).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([id, sold]) => {
    const p = db.collection('products').findOne({ id });
    return { name: p?.name, category: p?.category, price: p?.price, sold };
  });

  res.json({ totalRevenue, totalOrders: orders.length, totalUsers: users.filter(u => u.role !== 'admin').length, totalProducts: products.length, recentOrders, ordersByStatus, topProducts });
});

router.get('/orders', adminMiddleware, (req, res) => {
  const { status } = req.query;
  let orders = db.collection('orders').findAll();
  if (status) orders = orders.filter(o => o.status === status);
  orders = orders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  const result = orders.map(o => {
    const u = db.collection('users').findOne({ id: o.user_id });
    return { ...o, user_name: u?.name, email: u?.email, items: db.collection('order_items').findAll({ order_id: o.id }) };
  });
  res.json(result);
});

router.put('/orders/:id', adminMiddleware, (req, res) => {
  const { status } = req.body;
  const valid = ['pending','confirmed','processing','shipped','delivered','cancelled'];
  if (!valid.includes(status)) return res.status(400).json({ error: 'Invalid status' });
  const n = db.collection('orders').update({ id: req.params.id }, { status });
  if (n === 0) return res.status(404).json({ error: 'Order not found' });
  res.json({ message: 'Order updated' });
});

router.get('/users', adminMiddleware, (req, res) => {
  const users = db.collection('users').findAll().map(({ password, ...u }) => u);
  res.json(users);
});

module.exports = router;
