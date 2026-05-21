import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import axios from 'axios'
import ProductCard from '../components/ProductCard'
import FilterSidebar from '../components/FilterSidebar'

const API = 'http://localhost:5000/api'

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [total, setTotal] = useState(0)
  const [pages, setPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    sort: '', minPrice: '', maxPrice: '',
  })
  const [page, setPage] = useState(1)

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      const params = { ...filters, search, page, limit: 12 }
      Object.keys(params).forEach(k => !params[k] && delete params[k])
      const { data } = await axios.get(`${API}/products`, { params })
      setProducts(data.products)
      setTotal(data.total)
      setPages(data.pages)
    } finally { setLoading(false) }
  }, [filters, search, page])

  useEffect(() => { fetchProducts() }, [fetchProducts])

  const handleFilterChange = (update) => {
    setFilters(prev => ({ ...prev, ...update }))
    setPage(1)
  }

  return (
    <div className="page">
      <div className="container">
        <div style={{ marginBottom: 32 }}>
          <h1 className="page-title">Shop All Products</h1>
          <p style={{ color: '#9ca3af' }}>{total} products available</p>
        </div>

        {/* Search bar */}
        <div style={{ position: 'relative', marginBottom: 32, maxWidth: 600 }}>
          <span style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', fontSize: '1.1rem' }}>🔍</span>
          <input className="input" style={{ paddingLeft: 46 }} placeholder="Search products..."
            value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} />
        </div>

        <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start' }}>
          <FilterSidebar filters={filters} onChange={handleFilterChange} />

          <div style={{ flex: 1, minWidth: 0 }}>
            {loading ? <div className="spinner" /> : products.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '80px 0', color: '#6b7280' }}>
                <div style={{ fontSize: '3rem', marginBottom: 16 }}>🔍</div>
                <h3 style={{ fontWeight: 600, marginBottom: 8 }}>No products found</h3>
                <p>Try adjusting your filters or search terms</p>
              </div>
            ) : (
              <>
                <div className="product-grid">
                  {products.map(p => <ProductCard key={p.id} product={p} />)}
                </div>

                {pages > 1 && (
                  <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 40 }}>
                    {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                      <button key={p} onClick={() => setPage(p)}
                        style={{ width: 40, height: 40, borderRadius: 8, border: p === page ? '1px solid #7c3aed' : '1px solid rgba(255,255,255,0.1)',
                          background: p === page ? 'linear-gradient(135deg,#7c3aed,#a78bfa)' : 'rgba(255,255,255,0.04)',
                          color: '#f9fafb', cursor: 'pointer', fontWeight: p === page ? 700 : 400 }}>
                        {p}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
