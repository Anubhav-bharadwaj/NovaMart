import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'

const API = 'http://localhost:5000/api'

export default function OrderSuccess() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)

  useEffect(() => {
    axios.get(`${API}/orders/${id}`).then(r => setOrder(r.data)).catch(() => {})
  }, [id])

  return (
    <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ maxWidth: 600, width: '100%', textAlign: 'center' }}>
        <div style={{ fontSize: '5rem', marginBottom: 24, animation: 'fadeInUp 0.5s ease' }}>🎉</div>
        <h1 style={{ fontFamily: 'Outfit', fontSize: '2.5rem', fontWeight: 900, marginBottom: 12 }}>Order Placed!</h1>
        <p style={{ color: '#9ca3af', fontSize: '1.1rem', marginBottom: 8 }}>Thank you for your purchase.</p>
        <p style={{ color: '#6b7280', marginBottom: 32 }}>Order ID: <span style={{ color: '#a78bfa', fontWeight: 600 }}>{id?.slice(0, 8).toUpperCase()}</span></p>

        {order && (
          <div className="card" style={{ padding: 24, marginBottom: 32, textAlign: 'left' }}>
            <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Order Details</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
              {order.items?.map(item => (
                <div key={item.id} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  {item.image_url && <img src={item.image_url} alt={item.product_name} style={{ width: 50, height: 50, borderRadius: 8, objectFit: 'cover' }} />}
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.product_name}</p>
                    <p style={{ color: '#6b7280', fontSize: '0.8rem' }}>Qty: {item.quantity} · Rs. {item.price.toFixed(2)} each</p>
                  </div>
                  <span style={{ fontWeight: 700 }}>Rs. {(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="divider" />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
              <span>Total Paid</span>
              <span style={{ color: '#a78bfa' }}>Rs. {order.total?.toFixed(2)}</span>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <Link to="/profile" className="btn btn-ghost">View Orders</Link>
          <Link to="/products" className="btn btn-accent">Continue Shopping →</Link>
        </div>
      </div>
    </div>
  )
}
