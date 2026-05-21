import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(''); setLoading(true)
    try {
      await login(form.email, form.password)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed')
    } finally { setLoading(false) }
  }

  return (
    <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="card" style={{ width: '100%', maxWidth: 420, padding: 40 }}>
        <h1 style={{ fontFamily: 'Outfit', fontSize: '2rem', fontWeight: 800, marginBottom: 8 }}>Welcome back</h1>
        <p style={{ color: '#9ca3af', marginBottom: 32 }}>Sign in to your NovaMart account</p>
        {error && <div style={{ background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.3)', borderRadius: 8, padding: '12px 16px', color: '#fb7185', fontSize: '0.875rem', marginBottom: 20 }}>{error}</div>}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="form-group">
            <label>Email</label>
            <input className="input" type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input className="input" type="password" placeholder="••••••••" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required />
          </div>
          <button type="submit" disabled={loading} className="btn btn-primary" style={{ justifyContent: 'center', padding: '14px' }}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <p style={{ textAlign: 'center', color: '#9ca3af', marginTop: 24, fontSize: '0.875rem' }}>
          Don't have an account? <Link to="/register" style={{ color: '#a78bfa', fontWeight: 600 }}>Sign up</Link>
        </p>
        <div className="divider" />
        <p style={{ textAlign: 'center', fontSize: '0.8rem', color: '#6b7280' }}>Admin: admin@shop.com / admin123</p>
      </div>
    </div>
  )
}
