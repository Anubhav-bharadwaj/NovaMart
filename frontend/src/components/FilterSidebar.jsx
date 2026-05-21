import { useState } from 'react'

export default function FilterSidebar({ filters, onChange }) {
  const categories = ['All', 'Electronics', 'Clothing', 'Home', 'Sports', 'Beauty']
  const sorts = [
    { value: '', label: 'Featured' },
    { value: 'price_asc', label: 'Price: Low to High' },
    { value: 'price_desc', label: 'Price: High to Low' },
    { value: 'rating', label: 'Top Rated' },
    { value: 'newest', label: 'Newest' },
    { value: 'popular', label: 'Most Popular' },
  ]

  return (
    <aside style={{ width: 250, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div className="card" style={{ padding: 20 }}>
        <h3 style={{ fontWeight: 700, marginBottom: 16, fontSize: '0.95rem' }}>Category</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {categories.map(c => (
            <button key={c} onClick={() => onChange({ category: c })}
              style={{ background: filters.category === c || (!filters.category && c === 'All') ? 'linear-gradient(135deg,rgba(124,58,237,0.3),rgba(167,139,250,0.15))' : 'transparent',
                border: filters.category === c || (!filters.category && c === 'All') ? '1px solid rgba(124,58,237,0.5)' : '1px solid transparent',
                borderRadius: 8, padding: '8px 14px', color: filters.category === c || (!filters.category && c === 'All') ? '#a78bfa' : '#9ca3af',
                textAlign: 'left', cursor: 'pointer', transition: 'all 0.2s', fontWeight: 500, fontSize: '0.9rem' }}>
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="card" style={{ padding: 20 }}>
        <h3 style={{ fontWeight: 700, marginBottom: 16, fontSize: '0.95rem' }}>Sort By</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {sorts.map(s => (
            <button key={s.value} onClick={() => onChange({ sort: s.value })}
              style={{ background: filters.sort === s.value ? 'linear-gradient(135deg,rgba(124,58,237,0.3),rgba(167,139,250,0.15))' : 'transparent',
                border: filters.sort === s.value ? '1px solid rgba(124,58,237,0.5)' : '1px solid transparent',
                borderRadius: 8, padding: '8px 14px', color: filters.sort === s.value ? '#a78bfa' : '#9ca3af',
                textAlign: 'left', cursor: 'pointer', transition: 'all 0.2s', fontWeight: 500, fontSize: '0.9rem' }}>
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="card" style={{ padding: 20 }}>
        <h3 style={{ fontWeight: 700, marginBottom: 16, fontSize: '0.95rem' }}>Price Range</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="form-group">
            <label>Min Price ($)</label>
            <input type="number" className="input" placeholder="0" value={filters.minPrice || ''} onChange={e => onChange({ minPrice: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Max Price ($)</label>
            <input type="number" className="input" placeholder="1000" value={filters.maxPrice || ''} onChange={e => onChange({ maxPrice: e.target.value })} />
          </div>
        </div>
      </div>
    </aside>
  )
}
