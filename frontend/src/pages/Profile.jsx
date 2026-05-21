import { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { Link, useNavigate } from 'react-router-dom'

const API = 'http://localhost:5000/api'

const STATUS_COLORS = { pending: '#fbbf24', confirmed: '#60a5fa', processing: '#a78bfa', shipped: '#fb923c', delivered: '#4ade80', cancelled: '#f87171' }

export default function Profile() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) { navigate('/login'); return }
    axios.get(`${API}/orders`).then(r => setOrders(r.data)).finally(() => setLoading(false))
  }, [user])

  const handleLogout = () => { logout(); navigate('/') }

  if (!user) return null

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: 800 }}>
        <div className="card" style={{ padding: 32, marginBottom: 32, display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg,#7c3aed,#f43f5e)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 800, flexShrink: 0 }}>
            {user.name[0].toUpperCase()}
          </div>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontFamily: 'Outfit', fontSize: '1.5rem', fontWeight: 800, marginBottom: 4 }}>{user.name}</h1>
            <p style={{ color: '#9ca3af' }}>{user.email}</p>
            {user.role === 'admin' && <span className="badge badge-primary" style={{ marginTop: 6 }}>Admin</span>}
          </div>
          <button onClick={handleLogout} className="btn btn-ghost btn-sm" style={{ color: '#fb7185', borderColor: 'rgba(244,63,94,0.3)' }}>Logout</button>
        </div>

        <h2 style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '1.3rem', marginBottom: 20 }}>Order History ({orders.length})</h2>

        {loading ? <div className="spinner" /> : orders.length === 0 ? (
          <div className="card" style={{ padding: 48, textAlign: 'center', color: '#6b7280' }}>
            <div style={{ fontSize: '3rem', marginBottom: 12 }}>📦</div>
            <h3 style={{ marginBottom: 8 }}>No orders yet</h3>
            <Link to="/products" className="btn btn-primary btn-sm">Start Shopping</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {orders.map(order => (
              <div key={order.id} className="card" style={{ padding: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
                  <div>
                    <p style={{ fontWeight: 700, marginBottom: 4 }}>#{order.id.slice(0, 8).toUpperCase()}</p>
                    <p style={{ color: '#6b7280', fontSize: '0.85rem' }}>{new Date(order.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ background: `${STATUS_COLORS[order.status]}22`, color: STATUS_COLORS[order.status], border: `1px solid ${STATUS_COLORS[order.status]}44`, borderRadius: 6, padding: '4px 12px', fontSize: '0.8rem', fontWeight: 700, textTransform: 'capitalize' }}>{order.status}</span>
                    <span style={{ fontWeight: 800, color: '#a78bfa', fontSize: '1.1rem' }}>Rs. {order.total?.toFixed(2)}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  {order.items?.map(item => (
                    <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.04)', borderRadius: 8, padding: '8px 12px' }}>
                      {item.image_url && <img src={item.image_url} alt={item.product_name} style={{ width: 36, height: 36, borderRadius: 6, objectFit: 'cover' }} />}
                      <div>
                        <p style={{ fontSize: '0.8rem', fontWeight: 600 }}>{item.product_name}</p>
                        <p style={{ color: '#6b7280', fontSize: '0.75rem' }}>× {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
