import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

function StarRating({ rating, size = 14 }) {
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {[1,2,3,4,5].map(s => (
        <span key={s} style={{ fontSize: size, color: s <= Math.round(rating) ? '#fbbf24' : '#374151' }}>★</span>
      ))}
    </div>
  )
}

export default function ProductCard({ product }) {
  const { addToCart, setDrawerOpen } = useCart()
  const { user } = useAuth()
  const discount = product.original_price
    ? Math.round((1 - product.price / product.original_price) * 100) : null

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!user) { window.location.href = '/login'; return }
    await addToCart(product.id, 1)
    setDrawerOpen(true)
  }

  return (
    <Link to={`/products/${product.id}`} style={{ textDecoration: 'none' }}>
      <div className="card" style={{ overflow: 'hidden', transition: 'transform 0.3s ease, box-shadow 0.3s ease', cursor: 'pointer' }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 20px 40px rgba(124,58,237,0.2)' }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none' }}>
        <div style={{ position: 'relative', overflow: 'hidden', height: 220 }}>
          <img src={product.image_url} alt={product.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'none'}
            onError={e => { e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600' }} />
          {discount && (
            <div style={{ position: 'absolute', top: 12, left: 12, background: 'linear-gradient(135deg,#f43f5e,#fb923c)', borderRadius: 6, padding: '4px 10px', fontSize: '0.75rem', fontWeight: 700, color: '#fff' }}>
              -{discount}%
            </div>
          )}
          {product.featured === 1 && (
            <div style={{ position: 'absolute', top: 12, right: 12, background: 'linear-gradient(135deg,#7c3aed,#a78bfa)', borderRadius: 6, padding: '4px 10px', fontSize: '0.75rem', fontWeight: 700, color: '#fff' }}>
              ✦ Featured
            </div>
          )}
        </div>

        <div style={{ padding: '16px' }}>
          <div style={{ fontSize: '0.75rem', color: '#7c3aed', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>{product.category}</div>
          <h3 style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: 8, lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{product.name}</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <StarRating rating={product.rating} />
            <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>({product.reviews_count})</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <span style={{ fontSize: '1.2rem', fontWeight: 700, color: '#a78bfa' }}>Rs. {product.price.toFixed(2)}</span>
              {product.original_price && <span style={{ fontSize: '0.85rem', color: '#6b7280', textDecoration: 'line-through' }}>Rs. {product.original_price.toFixed(2)}</span>}
            </div>
            <button onClick={handleAdd} style={{ background: 'linear-gradient(135deg,#7c3aed,#a78bfa)', border: 'none', borderRadius: 8, padding: '8px 14px', color: '#fff', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
              + Add
            </button>
          </div>
        </div>
      </div>
    </Link>
  )
}
