import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

export default function CartDrawer() {
  const { items, total, count, drawerOpen, setDrawerOpen, updateQty, removeItem } = useCart()
  const { user } = useAuth()
  const shipping = total >= 5000 ? 0 : 499

  if (!drawerOpen) return null

  return (
    <>
      <div onClick={() => setDrawerOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1100, backdropFilter: 'blur(4px)', animation: 'fadeIn 0.2s ease' }} />
      <div style={{ position: 'fixed', right: 0, top: 0, bottom: 0, width: 420, maxWidth: '95vw', background: '#111827', borderLeft: '1px solid rgba(255,255,255,0.08)', zIndex: 1101, display: 'flex', flexDirection: 'column', animation: 'slideInRight 0.3s ease' }}>
        <div style={{ padding: '24px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '1.3rem' }}>Cart ({count})</h2>
          <button onClick={() => setDrawerOpen(false)} style={{ background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: 8, width: 36, height: 36, color: '#f9fafb', fontSize: '1.2rem', cursor: 'pointer' }}>×</button>
        </div>

        {items.length === 0 ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, color: '#6b7280' }}>
            <div style={{ fontSize: '4rem' }}>🛒</div>
            <p>Your cart is empty</p>
            <Link to="/products" onClick={() => setDrawerOpen(false)} className="btn btn-primary btn-sm">Shop Now</Link>
          </div>
        ) : (
          <>
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
              {items.map(item => (
                <div key={item.id} style={{ display: 'flex', gap: 14, background: 'rgba(255,255,255,0.04)', borderRadius: 12, padding: 12 }}>
                  <img src={item.image_url} alt={item.name} style={{ width: 70, height: 70, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</p>
                    <p style={{ color: '#9ca3af', fontSize: '0.8rem', marginBottom: 8 }}>{[item.size, item.color].filter(Boolean).join(' · ')}</p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <button onClick={() => updateQty(item.id, item.quantity - 1)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: 6, width: 28, height: 28, color: '#f9fafb', cursor: 'pointer', fontSize: '1rem' }}>−</button>
                        <span style={{ fontWeight: 600, minWidth: 20, textAlign: 'center' }}>{item.quantity}</span>
                        <button onClick={() => updateQty(item.id, item.quantity + 1)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: 6, width: 28, height: 28, color: '#f9fafb', cursor: 'pointer', fontSize: '1rem' }}>+</button>
                      </div>
                      <span style={{ fontWeight: 700, color: '#a78bfa' }}>Rs. {(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  </div>
                  <button onClick={() => removeItem(item.id)} style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', fontSize: '1.1rem', alignSelf: 'flex-start' }}>🗑</button>
                </div>
              ))}
            </div>

            <div style={{ padding: '20px 24px', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#9ca3af', fontSize: '0.9rem' }}>
                <span>Subtotal</span><span>Rs. {total.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#9ca3af', fontSize: '0.9rem' }}>
                <span>Shipping</span><span>{shipping === 0 ? <span style={{ color: '#4ade80' }}>FREE</span> : `Rs. ${shipping.toFixed(2)}`}</span>
              </div>
              {total < 5000 && <p style={{ fontSize: '0.8rem', color: '#9ca3af' }}>Add Rs. {(5000 - total).toFixed(2)} more for free shipping</p>}
              <div className="divider" />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1.1rem' }}>
                <span>Total</span><span style={{ color: '#a78bfa' }}>Rs. {(total + shipping).toFixed(2)}</span>
              </div>
              {user ? (
                <Link to="/checkout" onClick={() => setDrawerOpen(false)} className="btn btn-accent" style={{ justifyContent: 'center', marginTop: 4 }}>Checkout →</Link>
              ) : (
                <Link to="/login" onClick={() => setDrawerOpen(false)} className="btn btn-primary" style={{ justifyContent: 'center', marginTop: 4 }}>Login to Checkout</Link>
              )}
            </div>
          </>
        )}
      </div>
    </>
  )
}
