import { useEffect } from 'react'

export default function Toast({ toasts, remove }) {
  useEffect(() => {
    if (toasts.length === 0) return
    const t = setTimeout(() => remove(toasts[0].id), 3500)
    return () => clearTimeout(t)
  }, [toasts])

  return (
    <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 10 }}>
      {toasts.map(t => (
        <div key={t.id} style={{
          background: t.type === 'error' ? 'rgba(244,63,94,0.15)' : 'rgba(34,197,94,0.15)',
          border: `1px solid ${t.type === 'error' ? 'rgba(244,63,94,0.4)' : 'rgba(34,197,94,0.4)'}`,
          borderRadius: 12, padding: '14px 20px', minWidth: 280, maxWidth: 360,
          backdropFilter: 'blur(20px)', display: 'flex', alignItems: 'center', gap: 12,
          animation: 'fadeInUp 0.3s ease', boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        }}>
          <span style={{ fontSize: '1.2rem' }}>{t.type === 'error' ? '❌' : '✅'}</span>
          <span style={{ color: '#f9fafb', fontSize: '0.9rem', flex: 1 }}>{t.message}</span>
          <button onClick={() => remove(t.id)} style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', fontSize: '1rem' }}>×</button>
        </div>
      ))}
    </div>
  )
}
