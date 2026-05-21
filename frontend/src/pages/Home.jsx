import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import ProductCard from '../components/ProductCard'

const API = 'http://localhost:5000/api'

const categories = [
  { name: 'Electronics', icon: '💻', color: '#7c3aed' },
  { name: 'Clothing', icon: '👗', color: '#f43f5e' },
  { name: 'Home', icon: '🏠', color: '#fb923c' },
  { name: 'Sports', icon: '⚡', color: '#10b981' },
  { name: 'Beauty', icon: '✨', color: '#ec4899' },
]

export default function Home() {
  const [featured, setFeatured] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get(`${API}/products?featured=true&limit=4`)
      .then(r => setFeatured(r.data.products))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div style={{ paddingTop: 70 }}>
      {/* Hero */}
      <section style={{ minHeight: '90vh', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden', background: 'linear-gradient(135deg,#0a0f1e 0%,#1a0533 50%,#0a0f1e 100%)' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(ellipse at 30% 50%,rgba(124,58,237,0.15) 0%,transparent 60%),radial-gradient(ellipse at 70% 50%,rgba(244,63,94,0.1) 0%,transparent 60%)' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%239ca3af\' fill-opacity=\'0.03\'%3E%3Ccircle cx=\'30\' cy=\'30\' r=\'1\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")', opacity: 0.5 }} />
        <div className="container" style={{ position: 'relative', textAlign: 'center', padding: '80px 24px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)', borderRadius: 99, padding: '6px 18px', marginBottom: 24, animation: 'fadeInUp 0.6s ease' }}>
            <span style={{ color: '#a78bfa', fontSize: '0.85rem', fontWeight: 600 }}>✦ New Season Collection</span>
          </div>
          <h1 style={{ fontFamily: 'Outfit', fontSize: 'clamp(2.5rem,7vw,5rem)', fontWeight: 900, lineHeight: 1.1, marginBottom: 24, animation: 'fadeInUp 0.7s ease' }}>
            Shop the Future.<br />
            <span style={{ background: 'linear-gradient(135deg,#a78bfa,#f43f5e)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Feel the Difference.
            </span>
          </h1>
          <p style={{ fontSize: '1.15rem', color: '#9ca3af', maxWidth: 560, margin: '0 auto 40px', lineHeight: 1.7, animation: 'fadeInUp 0.8s ease' }}>
            Discover premium products curated for modern living. Electronics, fashion, home decor and sports gear — all in one place.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', animation: 'fadeInUp 0.9s ease' }}>
            <Link to="/products" className="btn btn-accent btn-lg">Shop Now →</Link>
            <Link to="/products?featured=true" className="btn btn-ghost btn-lg">View Featured</Link>
          </div>
          <div style={{ display: 'flex', gap: 40, justifyContent: 'center', marginTop: 60, flexWrap: 'wrap', animation: 'fadeInUp 1s ease' }}>
            {[['80+', 'Premium Products'], ['Free', 'Shipping Rs.999+'], ['4.8★', 'Avg Rating']].map(([n, l]) => (
              <div key={l} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'Outfit', fontSize: '2rem', fontWeight: 800, color: '#a78bfa' }}>{n}</div>
                <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section style={{ padding: '80px 0' }}>
        <div className="container">
          <h2 className="section-title" style={{ textAlign: 'center', marginBottom: 12 }}>Shop by Category</h2>
          <p style={{ textAlign: 'center', color: '#9ca3af', marginBottom: 48 }}>Everything you need, all in one place</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 20 }}>
            {categories.map(cat => (
              <Link key={cat.name} to={`/products?category=${cat.name}`}
                style={{ background: `linear-gradient(135deg,${cat.color}22,${cat.color}11)`, border: `1px solid ${cat.color}33`, borderRadius: 20, padding: '36px 24px', textAlign: 'center', transition: 'all 0.3s ease', display: 'block' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.boxShadow = `0 20px 40px ${cat.color}22` }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none' }}>
                <div style={{ fontSize: '3rem', marginBottom: 12 }}>{cat.icon}</div>
                <h3 style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '1.1rem', color: cat.color }}>{cat.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section style={{ padding: '0 0 80px' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40, flexWrap: 'wrap', gap: 16 }}>
            <div>
              <h2 className="section-title" style={{ marginBottom: 4 }}>Featured Products</h2>
              <p style={{ color: '#9ca3af' }}>Hand-picked favorites loved by our community</p>
            </div>
            <Link to="/products" className="btn btn-ghost">View All →</Link>
          </div>
          {loading ? <div className="spinner" /> : (
            <div className="product-grid">
              {featured.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </section>

      {/* Promo Banner */}
      <section style={{ padding: '0 0 80px' }}>
        <div className="container">
          <div style={{ background: 'linear-gradient(135deg,#7c3aed,#f43f5e)', borderRadius: 24, padding: '60px 40px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }} />
            <div style={{ position: 'absolute', bottom: -60, left: -60, width: 250, height: 250, background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }} />
            <h2 style={{ fontFamily: 'Outfit', fontSize: 'clamp(1.8rem,4vw,3rem)', fontWeight: 900, marginBottom: 16, position: 'relative' }}>Free Shipping on Orders Rs. 999+</h2>
            <p style={{ fontSize: '1.1rem', opacity: 0.9, marginBottom: 32, position: 'relative' }}>Join thousands of happy customers enjoying free, fast delivery</p>
            <Link to="/products" className="btn" style={{ background: '#fff', color: '#7c3aed', fontWeight: 700, fontSize: '1rem', padding: '14px 36px', borderRadius: 10, position: 'relative' }}>Start Shopping</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
