import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

const API = 'http://localhost:5000/api'

function Stars({ rating }) {
  return <div style={{ display: 'flex', gap: 2 }}>
    {[1,2,3,4,5].map(s => <span key={s} style={{ color: s <= Math.round(rating) ? '#fbbf24' : '#374151', fontSize: 18 }}>★</span>)}
  </div>
}

export default function ProductDetail() {
  const { id } = useParams()
  const { addToCart } = useCart()
  const { user } = useAuth()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeImg, setActiveImg] = useState(0)
  const [qty, setQty] = useState(1)
  const [size, setSize] = useState('')
  const [color, setColor] = useState('')
  const [adding, setAdding] = useState(false)
  const [added, setAdded] = useState(false)
  const [review, setReview] = useState({ rating: 5, comment: '' })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    axios.get(`${API}/products/${id}`)
      .then(r => { setProduct(r.data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [id])

  const handleAdd = async () => {
    if (!user) { window.location.href = '/login'; return }
    setAdding(true)
    await addToCart(product.id, qty, size || null, color || null)
    setAdding(false); setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const handleReview = async (e) => {
    e.preventDefault()
    if (!user) { window.location.href = '/login'; return }
    setSubmitting(true)
    await axios.post(`${API}/products/${id}/reviews`, { ...review, user_id: user.id, user_name: user.name })
    const r = await axios.get(`${API}/products/${id}`)
    setProduct(r.data); setReview({ rating: 5, comment: '' }); setSubmitting(false)
  }

  if (loading) return <div className="page"><div className="spinner" /></div>
  if (!product) return <div className="page"><div className="container"><h2>Product not found</h2></div></div>

  const discount = product.original_price ? Math.round((1 - product.price / product.original_price) * 100) : null

  return (
    <div className="page">
      <div className="container">
        <div style={{ marginBottom: 24 }}>
          <Link to="/products" style={{ color: '#9ca3af', fontSize: '0.9rem' }}>← Back to Products</Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, marginBottom: 60 }}>
          {/* Images */}
          <div>
            <div style={{ borderRadius: 20, overflow: 'hidden', marginBottom: 16, background: '#111827', height: 420 }}>
              <img src={product.images?.[activeImg] || product.image_url} alt={product.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'opacity 0.3s' }}
                onError={e => { e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600' }} />
            </div>
            {product.images?.length > 1 && (
              <div style={{ display: 'flex', gap: 10 }}>
                {product.images.map((img, i) => (
                  <button key={i} onClick={() => setActiveImg(i)} style={{ width: 80, height: 80, borderRadius: 10, overflow: 'hidden', border: activeImg === i ? '2px solid #7c3aed' : '2px solid transparent', cursor: 'pointer', padding: 0 }}>
                    <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <div style={{ fontSize: '0.8rem', color: '#7c3aed', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>{product.category}</div>
            <h1 style={{ fontFamily: 'Outfit', fontSize: '2rem', fontWeight: 800, lineHeight: 1.3, marginBottom: 16 }}>{product.name}</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <Stars rating={product.rating} />
              <span style={{ color: '#9ca3af', fontSize: '0.9rem' }}>{product.rating} ({product.reviews_count} reviews)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 24 }}>
              <span style={{ fontSize: '2.5rem', fontWeight: 800, color: '#a78bfa' }}>Rs. {product.price.toFixed(2)}</span>
              {product.original_price && <span style={{ fontSize: '1.2rem', color: '#6b7280', textDecoration: 'line-through' }}>Rs. {product.original_price.toFixed(2)}</span>}
              {discount && <span style={{ background: 'rgba(244,63,94,0.2)', color: '#fb7185', borderRadius: 6, padding: '4px 10px', fontSize: '0.85rem', fontWeight: 700 }}>-{discount}%</span>}
            </div>
            <p style={{ color: '#9ca3af', lineHeight: 1.7, marginBottom: 28 }}>{product.description}</p>

            {product.sizes?.length > 0 && (
              <div style={{ marginBottom: 20 }}>
                <p style={{ fontWeight: 600, marginBottom: 10, fontSize: '0.9rem' }}>Size</p>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {product.sizes.map(s => (
                    <button key={s} onClick={() => setSize(s)} style={{ padding: '8px 16px', borderRadius: 8, border: size === s ? '2px solid #7c3aed' : '1px solid rgba(255,255,255,0.15)', background: size === s ? 'rgba(124,58,237,0.2)' : 'transparent', color: size === s ? '#a78bfa' : '#9ca3af', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}>{s}</button>
                  ))}
                </div>
              </div>
            )}
            {product.colors?.length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <p style={{ fontWeight: 600, marginBottom: 10, fontSize: '0.9rem' }}>Color</p>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {product.colors.map(c => (
                    <button key={c} onClick={() => setColor(c)} style={{ padding: '8px 16px', borderRadius: 8, border: color === c ? '2px solid #7c3aed' : '1px solid rgba(255,255,255,0.15)', background: color === c ? 'rgba(124,58,237,0.2)' : 'transparent', color: color === c ? '#a78bfa' : '#9ca3af', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}>{c}</button>
                  ))}
                </div>
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.06)', borderRadius: 10, overflow: 'hidden' }}>
                <button onClick={() => setQty(Math.max(1, qty - 1))} style={{ width: 40, height: 44, background: 'none', border: 'none', color: '#f9fafb', fontSize: '1.2rem', cursor: 'pointer' }}>−</button>
                <span style={{ width: 40, textAlign: 'center', fontWeight: 700 }}>{qty}</span>
                <button onClick={() => setQty(qty + 1)} style={{ width: 40, height: 44, background: 'none', border: 'none', color: '#f9fafb', fontSize: '1.2rem', cursor: 'pointer' }}>+</button>
              </div>
              <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>{product.stock} in stock</span>
            </div>

            <button onClick={handleAdd} disabled={adding} className="btn btn-accent btn-lg" style={{ width: '100%', justifyContent: 'center', fontSize: '1rem' }}>
              {added ? '✓ Added to Cart!' : adding ? 'Adding...' : '🛒 Add to Cart'}
            </button>
          </div>
        </div>

        {/* Reviews */}
        <div style={{ maxWidth: 700 }}>
          <h2 style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '1.5rem', marginBottom: 24 }}>Reviews ({product.reviews?.length || 0})</h2>
          {user && (
            <form onSubmit={handleReview} className="card" style={{ padding: 24, marginBottom: 32 }}>
              <h3 style={{ fontWeight: 600, marginBottom: 16 }}>Write a Review</h3>
              <div style={{ marginBottom: 16 }}>
                <p style={{ fontSize: '0.875rem', color: '#9ca3af', marginBottom: 8 }}>Rating</p>
                <div style={{ display: 'flex', gap: 6 }}>
                  {[1,2,3,4,5].map(s => (
                    <button key={s} type="button" onClick={() => setReview(r => ({ ...r, rating: s }))} style={{ background: 'none', border: 'none', fontSize: '1.8rem', cursor: 'pointer', color: s <= review.rating ? '#fbbf24' : '#374151' }}>★</button>
                  ))}
                </div>
              </div>
              <textarea className="input" rows={3} placeholder="Share your experience..." value={review.comment} onChange={e => setReview(r => ({ ...r, comment: e.target.value }))} style={{ resize: 'vertical', marginBottom: 16 }} />
              <button type="submit" disabled={submitting} className="btn btn-primary">{submitting ? 'Submitting...' : 'Submit Review'}</button>
            </form>
          )}
          {product.reviews?.length === 0 ? <p style={{ color: '#6b7280' }}>No reviews yet. Be the first!</p> : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {product.reviews?.map(r => (
                <div key={r.id} className="card" style={{ padding: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'linear-gradient(135deg,#7c3aed,#f43f5e)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>{r.user_name[0]}</div>
                      <div>
                        <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{r.user_name}</p>
                        <Stars rating={r.rating} />
                      </div>
                    </div>
                    <span style={{ color: '#6b7280', fontSize: '0.8rem' }}>{new Date(r.created_at).toLocaleDateString()}</span>
                  </div>
                  {r.comment && <p style={{ color: '#9ca3af', fontSize: '0.9rem', lineHeight: 1.6 }}>{r.comment}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
