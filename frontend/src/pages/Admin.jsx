import { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const API = 'http://localhost:5000/api'
const STATUS_COLORS = { pending: '#fbbf24', confirmed: '#60a5fa', processing: '#a78bfa', shipped: '#fb923c', delivered: '#4ade80', cancelled: '#f87171' }
const STATUSES = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']

export default function Admin() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState('stats')
  const [stats, setStats] = useState(null)
  const [orders, setOrders] = useState([])
  const [products, setProducts] = useState([])
  const [newProduct, setNewProduct] = useState({ name: '', description: '', price: '', category: 'Electronics', image_url: '', stock: 100, featured: false })
  const [loading, setLoading] = useState(true)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    if (!user || user.role !== 'admin') { navigate('/'); return }
    loadData()
  }, [user, tab])

  const loadData = async () => {
    setLoading(true)
    try {
      if (tab === 'stats') { const r = await axios.get(`${API}/admin/stats`); setStats(r.data) }
      if (tab === 'orders') { const r = await axios.get(`${API}/admin/orders`); setOrders(r.data) }
      if (tab === 'products') { const r = await axios.get(`${API}/products?limit=50`); setProducts(r.data.products) }
    } finally { setLoading(false) }
  }

  const updateOrderStatus = async (id, status) => {
    await axios.put(`${API}/admin/orders/${id}`, { status })
    setOrders(os => os.map(o => o.id === id ? { ...o, status } : o))
  }

  const handleAddProduct = async (e) => {
    e.preventDefault()
    await axios.post(`${API}/products`, { ...newProduct, price: Number(newProduct.price), stock: Number(newProduct.stock) })
    setMsg('Product added!'); setNewProduct({ name: '', description: '', price: '', category: 'Electronics', image_url: '', stock: 100, featured: false })
    const r = await axios.get(`${API}/products?limit=50`); setProducts(r.data.products)
    setTimeout(() => setMsg(''), 3000)
  }

  const handleDeleteProduct = async (id) => {
    if (!confirm('Delete this product?')) return
    await axios.delete(`${API}/products/${id}`)
    setProducts(ps => ps.filter(p => p.id !== id))
  }

  const TABS = ['stats', 'orders', 'products']

  return (
    <div className="page">
      <div className="container">
        <h1 className="page-title" style={{ marginBottom: 4 }}>Admin Dashboard</h1>
        <p style={{ color: '#9ca3af', marginBottom: 32 }}>Manage your NovaMart store</p>

        {/* Tab nav */}
        <div style={{ display: 'flex', gap: 4, background: 'rgba(255,255,255,0.04)', borderRadius: 12, padding: 4, marginBottom: 32, width: 'fit-content' }}>
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ padding: '10px 24px', borderRadius: 9, border: 'none', background: tab === t ? 'linear-gradient(135deg,#7c3aed,#a78bfa)' : 'transparent', color: tab === t ? '#fff' : '#9ca3af', fontWeight: 600, cursor: 'pointer', textTransform: 'capitalize', transition: 'all 0.2s', fontSize: '0.9rem' }}>
              {t === 'stats' ? '📊 Overview' : t === 'orders' ? '📦 Orders' : '🛍 Products'}
            </button>
          ))}
        </div>

        {loading ? <div className="spinner" /> : (
          <>
            {/* Stats */}
            {tab === 'stats' && stats && (
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 20, marginBottom: 40 }}>
                  {[
                    { label: 'Total Revenue', value: `Rs. ${stats.totalRevenue?.toFixed(2)}`, icon: '💰', color: '#4ade80' },
                    { label: 'Total Orders', value: stats.totalOrders, icon: '📦', color: '#60a5fa' },
                    { label: 'Total Users', value: stats.totalUsers, icon: '👥', color: '#a78bfa' },
                    { label: 'Products', value: stats.totalProducts, icon: '🛍', color: '#fb923c' },
                  ].map(s => (
                    <div key={s.label} className="card" style={{ padding: 24 }}>
                      <div style={{ fontSize: '2rem', marginBottom: 8 }}>{s.icon}</div>
                      <div style={{ fontSize: '2rem', fontWeight: 800, color: s.color, fontFamily: 'Outfit', marginBottom: 4 }}>{s.value}</div>
                      <div style={{ color: '#9ca3af', fontSize: '0.875rem' }}>{s.label}</div>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                  <div className="card" style={{ padding: 24 }}>
                    <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Order Status</h3>
                    {stats.ordersByStatus?.map(s => (
                      <div key={s.status} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <span style={{ color: STATUS_COLORS[s.status] || '#9ca3af', textTransform: 'capitalize', fontWeight: 600 }}>{s.status}</span>
                        <span style={{ fontWeight: 700 }}>{s.cnt}</span>
                      </div>
                    ))}
                  </div>
                  <div className="card" style={{ padding: 24 }}>
                    <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Top Products</h3>
                    {stats.topProducts?.map((p, i) => (
                      <div key={p.name} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <span style={{ fontSize: '0.875rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}><span style={{ color: '#a78bfa', marginRight: 8 }}>#{i + 1}</span>{p.name}</span>
                        <span style={{ color: '#4ade80', fontWeight: 700, flexShrink: 0, marginLeft: 12 }}>{p.sold} sold</span>
                      </div>
                    ))}
                    {!stats.topProducts?.length && <p style={{ color: '#6b7280' }}>No sales data yet</p>}
                  </div>
                </div>
              </div>
            )}

            {/* Orders */}
            {tab === 'orders' && (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                      {['Order ID', 'Customer', 'Total', 'Items', 'Status', 'Date', 'Action'].map(h => (
                        <th key={h} style={{ padding: '12px 16px', textAlign: 'left', color: '#9ca3af', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(order => (
                      <tr key={order.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <td style={{ padding: '14px 16px', fontWeight: 700, color: '#a78bfa', fontSize: '0.85rem' }}>#{order.id.slice(0, 8).toUpperCase()}</td>
                        <td style={{ padding: '14px 16px', fontSize: '0.875rem' }}>
                          <div style={{ fontWeight: 600 }}>{order.user_name}</div>
                          <div style={{ color: '#6b7280', fontSize: '0.8rem' }}>{order.email}</div>
                        </td>
                        <td style={{ padding: '14px 16px', fontWeight: 700 }}>Rs. {order.total?.toFixed(2)}</td>
                        <td style={{ padding: '14px 16px', color: '#9ca3af', fontSize: '0.875rem' }}>{order.items?.length} item(s)</td>
                        <td style={{ padding: '14px 16px' }}>
                          <span style={{ background: `${STATUS_COLORS[order.status]}22`, color: STATUS_COLORS[order.status], border: `1px solid ${STATUS_COLORS[order.status]}44`, borderRadius: 6, padding: '3px 10px', fontSize: '0.78rem', fontWeight: 700, textTransform: 'capitalize' }}>{order.status}</span>
                        </td>
                        <td style={{ padding: '14px 16px', color: '#9ca3af', fontSize: '0.8rem' }}>{new Date(order.created_at).toLocaleDateString()}</td>
                        <td style={{ padding: '14px 16px' }}>
                          <select value={order.status} onChange={e => updateOrderStatus(order.id, e.target.value)}
                            style={{ background: '#1f2937', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, color: '#f9fafb', padding: '6px 10px', fontSize: '0.8rem', cursor: 'pointer' }}>
                            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {orders.length === 0 && <p style={{ textAlign: 'center', color: '#6b7280', padding: 40 }}>No orders yet</p>}
              </div>
            )}

            {/* Products */}
            {tab === 'products' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, alignItems: 'flex-start' }}>
                <div>
                  <h2 style={{ fontFamily: 'Outfit', fontWeight: 700, marginBottom: 20, fontSize: '1.2rem' }}>Add New Product</h2>
                  {msg && <div style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 8, padding: '12px 16px', color: '#4ade80', marginBottom: 16 }}>{msg}</div>}
                  <form onSubmit={handleAddProduct} className="card" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {[['Name','name','text','Product name'],['Price (Rs.)','price','number','0.00'],['Image URL','image_url','url','https://...'],['Stock','stock','number','100']].map(([label, key, type, ph]) => (
                      <div key={key} className="form-group">
                        <label>{label}</label>
                        <input className="input" type={type} placeholder={ph} value={newProduct[key]} onChange={e => setNewProduct(p => ({ ...p, [key]: e.target.value }))} required={key !== 'image_url'} />
                      </div>
                    ))}
                    <div className="form-group">
                      <label>Category</label>
                      <select className="input" value={newProduct.category} onChange={e => setNewProduct(p => ({ ...p, category: e.target.value }))}>
                        {['Electronics', 'Clothing', 'Home', 'Sports'].map(c => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Description</label>
                      <textarea className="input" rows={3} value={newProduct.description} onChange={e => setNewProduct(p => ({ ...p, description: e.target.value }))} />
                    </div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                      <input type="checkbox" checked={newProduct.featured} onChange={e => setNewProduct(p => ({ ...p, featured: e.target.checked }))} />
                      <span style={{ fontSize: '0.9rem' }}>Featured product</span>
                    </label>
                    <button type="submit" className="btn btn-primary" style={{ justifyContent: 'center' }}>Add Product</button>
                  </form>
                </div>

                <div>
                  <h2 style={{ fontFamily: 'Outfit', fontWeight: 700, marginBottom: 20, fontSize: '1.2rem' }}>All Products ({products.length})</h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxHeight: 680, overflowY: 'auto' }}>
                    {products.map(p => (
                      <div key={p.id} className="card" style={{ padding: 16, display: 'flex', gap: 14, alignItems: 'center' }}>
                        <img src={p.image_url} alt={p.name} style={{ width: 56, height: 56, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }} onError={e => { e.target.style.display = 'none' }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontWeight: 600, fontSize: '0.875rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</p>
                          <p style={{ color: '#9ca3af', fontSize: '0.8rem' }}>{p.category} · Rs. {p.price} · {p.stock} in stock</p>
                        </div>
                        <button onClick={() => handleDeleteProduct(p.id)} style={{ background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.3)', borderRadius: 6, padding: '6px 12px', color: '#fb7185', cursor: 'pointer', fontSize: '0.8rem', flexShrink: 0 }}>Delete</button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
