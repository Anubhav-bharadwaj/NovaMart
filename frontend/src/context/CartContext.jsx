import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { useAuth } from './AuthContext'

const CartContext = createContext(null)
export const useCart = () => useContext(CartContext)

const API = 'http://localhost:5000/api'

export function CartProvider({ children }) {
  const { user } = useAuth()
  const [items, setItems] = useState([])
  const [drawerOpen, setDrawerOpen] = useState(false)

  const fetchCart = useCallback(async () => {
    if (!user) { setItems([]); return }
    try {
      const { data } = await axios.get(`${API}/cart`)
      setItems(data)
    } catch { setItems([]) }
  }, [user])

  useEffect(() => { fetchCart() }, [fetchCart])

  const addToCart = async (product_id, quantity = 1, size, color) => {
    if (!user) return false
    await axios.post(`${API}/cart`, { product_id, quantity, size, color })
    await fetchCart()
    setDrawerOpen(true)
    return true
  }

  const updateQty = async (id, quantity) => {
    await axios.put(`${API}/cart/${id}`, { quantity })
    await fetchCart()
  }

  const removeItem = async (id) => {
    await axios.delete(`${API}/cart/${id}`)
    await fetchCart()
  }

  const clearCart = async () => {
    await axios.delete(`${API}/cart`)
    setItems([])
  }

  const total = items.reduce((s, i) => s + i.price * i.quantity, 0)
  const count = items.reduce((s, i) => s + i.quantity, 0)

  return (
    <CartContext.Provider value={{ items, total, count, drawerOpen, setDrawerOpen, addToCart, updateQty, removeItem, clearCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  )
}
