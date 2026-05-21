import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer style={{ background: '#0d1117', borderTop: '1px solid rgba(255,255,255,0.06)', padding: '60px 24px 30px', marginTop: 80 }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 40, marginBottom: 48 }}>
          <div>
            <div style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '1.4rem', background: 'linear-gradient(135deg,#a78bfa,#f43f5e)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 12 }}>NovaMart</div>
            <p style={{ color: '#6b7280', fontSize: '0.875rem', lineHeight: 1.7 }}>Premium shopping experience with curated products and fast, reliable delivery.</p>
          </div>
          <div>
            <h4 style={{ fontWeight: 600, marginBottom: 16, fontSize: '0.95rem' }}>Shop</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {['Electronics','Clothing','Home','Sports'].map(c => (
                <Link key={c} to={`/products?category=${c}`} style={{ color: '#6b7280', fontSize: '0.875rem', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.target.style.color = '#a78bfa'} onMouseLeave={e => e.target.style.color = '#6b7280'}>{c}</Link>
              ))}
            </div>
          </div>
          <div>
            <h4 style={{ fontWeight: 600, marginBottom: 16, fontSize: '0.95rem' }}>Account</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[['Login','/login'],['Register','/register'],['Profile','/profile'],['Orders','/profile']].map(([l,p]) => (
                <Link key={l} to={p} style={{ color: '#6b7280', fontSize: '0.875rem', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.target.style.color = '#a78bfa'} onMouseLeave={e => e.target.style.color = '#6b7280'}>{l}</Link>
              ))}
            </div>
          </div>
          <div>
            <h4 style={{ fontWeight: 600, marginBottom: 16, fontSize: '0.95rem' }}>Contact</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, color: '#6b7280', fontSize: '0.875rem' }}>
              <span>📧 hello@novamart.com</span>
              <span>📍 Lucknow, India</span>
            </div>
          </div>
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <p style={{ color: '#4b5563', fontSize: '0.825rem' }}>© 2026 NovaMart. All rights reserved.</p>
          <p style={{ color: '#4b5563', fontSize: '0.825rem' }}>Powered by Stripe · Secure Payments</p>
        </div>
      </div>
    </footer>
  )
}
