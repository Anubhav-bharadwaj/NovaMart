import { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import CartDrawer from './CartDrawer'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { count, setDrawerOpen } = useCart()
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const handleLogout = () => { logout(); navigate('/') }

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        background: scrolled ? 'rgba(10,15,30,0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.08)' : 'none',
        transition: 'all 0.3s ease', padding: '0 24px',
      }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 70 }}>
          <Link to="/" style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '1.5rem', background: 'linear-gradient(135deg,#a78bfa,#f43f5e)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            NovaMart
          </Link>

          <div style={{ display: 'flex', gap: 32, alignItems: 'center' }} className="nav-links">
            {['/', '/products'].map((path, i) => (
              <NavLink key={path} to={path} end={path === '/'} style={({ isActive }) => ({ color: isActive ? '#a78bfa' : '#9ca3af', fontWeight: 500, fontSize: '0.95rem', transition: 'color 0.2s' })}>
                {['Home', 'Shop'][i]}
              </NavLink>
            ))}
            {user?.role === 'admin' && <NavLink to="/admin" style={({ isActive }) => ({ color: isActive ? '#a78bfa' : '#9ca3af', fontWeight: 500 })}>Admin</NavLink>}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <button onClick={() => setDrawerOpen(true)} style={{ position: 'relative', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '8px 14px', color: '#f9fafb', display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(124,58,237,0.2)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}>
              🛒
              {count > 0 && <span style={{ background: 'linear-gradient(135deg,#7c3aed,#f43f5e)', borderRadius: 99, width: 20, height: 20, fontSize: '0.7rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{count}</span>}
            </button>
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Link to="/profile" style={{ background: 'linear-gradient(135deg,#7c3aed,#a78bfa)', borderRadius: 99, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.9rem' }}>
                  {user.name[0].toUpperCase()}
                </Link>
                <button onClick={handleLogout} style={{ background: 'rgba(244,63,94,0.15)', border: '1px solid rgba(244,63,94,0.3)', borderRadius: 8, padding: '6px 14px', color: '#fb7185', fontSize: '0.85rem', cursor: 'pointer' }}>Logout</button>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: 8 }}>
                <Link to="/login" className="btn btn-ghost btn-sm">Login</Link>
                <Link to="/register" className="btn btn-primary btn-sm">Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      </nav>
      <CartDrawer />
    </>
  )
}
