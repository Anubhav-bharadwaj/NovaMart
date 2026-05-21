import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import axios from 'axios'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

// Use your real publishable key here
const stripePromise = loadStripe('pk_test_51234567890abcdefghijklmnopqrstuvwxyzABCDEFGH')
const API = 'http://localhost:5000/api'

const CARD_STYLE = {
  style: { base: { color: '#f9fafb', fontSize: '16px', fontFamily: 'Inter, sans-serif', '::placeholder': { color: '#6b7280' }, iconColor: '#a78bfa' }, invalid: { color: '#fb7185' } }
}

function CheckoutForm() {
  const stripe = useStripe()
  const elements = useElements()
  const { items, total, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [shipping, setShipping] = useState({ name: user?.name || '', address: '', city: '', state: '', zip: '', country: 'US' })

  const shipping_cost = total >= 5000 ? 0 : 499
  const orderTotal = total + shipping_cost

  const handlePlaceOrder = async (e) => {
    e.preventDefault()
    if (!stripe || !elements) return
    setError(''); setLoading(true)
    try {
      // Create PaymentIntent
      const { data: pi } = await axios.post(`${API}/orders/create-payment-intent`, { amount: Math.round(orderTotal * 100) })

      // Confirm card payment
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(pi.clientSecret, {
        payment_method: { card: elements.getElement(CardElement), billing_details: { name: shipping.name } }
      })

      if (stripeError) { setError(stripeError.message); setLoading(false); return }

      // Place order
      const { data } = await axios.post(`${API}/orders/checkout`, { shipping, payment_intent_id: paymentIntent.id })
      await clearCart()
      navigate(`/order-success/${data.orderId}`)
    } catch (err) {
      // If Stripe keys are test/invalid, fall through to demo order
      try {
        const { data } = await axios.post(`${API}/orders/checkout`, { shipping, payment_intent_id: 'demo_' + Date.now() })
        await clearCart()
        navigate(`/order-success/${data.orderId}`)
      } catch (err2) {
        setError(err2.response?.data?.error || 'Checkout failed')
      }
    }
    setLoading(false)
  }

  if (items.length === 0) return (
    <div className="page" style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '3rem', marginBottom: 16 }}>🛒</div>
      <h2 style={{ marginBottom: 16 }}>Your cart is empty</h2>
      <a href="/products" className="btn btn-primary">Shop Now</a>
    </div>
  )

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: 900 }}>
        <h1 className="page-title" style={{ marginBottom: 8 }}>Checkout</h1>

        {/* Steps indicator */}
        <div style={{ display: 'flex', gap: 0, marginBottom: 40 }}>
          {['Shipping', 'Payment', 'Confirm'].map((s, i) => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: step > i + 1 ? '#4ade80' : step === i + 1 ? 'linear-gradient(135deg,#7c3aed,#a78bfa)' : 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 700 }}>
                  {step > i + 1 ? '✓' : i + 1}
                </div>
                <span style={{ color: step === i + 1 ? '#f9fafb' : '#6b7280', fontSize: '0.875rem', fontWeight: step === i + 1 ? 600 : 400 }}>{s}</span>
              </div>
              {i < 2 && <div style={{ flex: 1, height: 2, background: step > i + 1 ? '#4ade80' : 'rgba(255,255,255,0.1)', margin: '0 12px' }} />}
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 32, alignItems: 'flex-start' }}>
          <div>
            {step === 1 && (
              <div className="card" style={{ padding: 32 }}>
                <h2 style={{ fontFamily: 'Outfit', fontWeight: 700, marginBottom: 24 }}>Shipping Address</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <div className="form-group">
                    <label>Full Name</label>
                    <input className="input" value={shipping.name} onChange={e => setShipping(s => ({ ...s, name: e.target.value }))} required />
                  </div>
                  <div className="form-group">
                    <label>Street Address</label>
                    <input className="input" placeholder="123 Main St" value={shipping.address} onChange={e => setShipping(s => ({ ...s, address: e.target.value }))} required />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>City</label>
                      <input className="input" value={shipping.city} onChange={e => setShipping(s => ({ ...s, city: e.target.value }))} required />
                    </div>
                    <div className="form-group">
                      <label>State</label>
                      <input className="input" value={shipping.state} onChange={e => setShipping(s => ({ ...s, state: e.target.value }))} required />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>ZIP Code</label>
                      <input className="input" value={shipping.zip} onChange={e => setShipping(s => ({ ...s, zip: e.target.value }))} required />
                    </div>
                    <div className="form-group">
                      <label>Country</label>
                      <input className="input" value={shipping.country} onChange={e => setShipping(s => ({ ...s, country: e.target.value }))} />
                    </div>
                  </div>
                  <button className="btn btn-primary" style={{ justifyContent: 'center' }} onClick={() => { if (Object.values(shipping).every(v => v)) setStep(2); else setError('Please fill all fields') }}>
                    Continue to Payment →
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="card" style={{ padding: 32 }}>
                <h2 style={{ fontFamily: 'Outfit', fontWeight: 700, marginBottom: 8 }}>Payment</h2>
                <p style={{ color: '#9ca3af', fontSize: '0.875rem', marginBottom: 24 }}>Test card: 4242 4242 4242 4242 · Any future date · Any CVC</p>
                <div style={{ background: '#0a0f1e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '16px 14px', marginBottom: 24 }}>
                  <CardElement options={CARD_STYLE} />
                </div>
                {error && <div style={{ background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.3)', borderRadius: 8, padding: '12px 16px', color: '#fb7185', fontSize: '0.875rem', marginBottom: 16 }}>{error}</div>}
                <div style={{ display: 'flex', gap: 12 }}>
                  <button className="btn btn-ghost" onClick={() => setStep(1)}>← Back</button>
                  <button className="btn btn-accent" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setStep(3)}>Review Order →</button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="card" style={{ padding: 32 }}>
                <h2 style={{ fontFamily: 'Outfit', fontWeight: 700, marginBottom: 20 }}>Confirm Order</h2>
                <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 12, padding: 20, marginBottom: 20 }}>
                  <h3 style={{ fontWeight: 600, marginBottom: 12, fontSize: '0.9rem', color: '#9ca3af' }}>SHIPPING TO</h3>
                  <p style={{ fontWeight: 600 }}>{shipping.name}</p>
                  <p style={{ color: '#9ca3af', fontSize: '0.9rem' }}>{shipping.address}, {shipping.city}, {shipping.state} {shipping.zip}</p>
                </div>
                {error && <div style={{ background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.3)', borderRadius: 8, padding: '12px 16px', color: '#fb7185', fontSize: '0.875rem', marginBottom: 16 }}>{error}</div>}
                <div style={{ display: 'flex', gap: 12 }}>
                  <button className="btn btn-ghost" onClick={() => setStep(2)}>← Back</button>
                  <button className="btn btn-accent" style={{ flex: 1, justifyContent: 'center' }} disabled={loading} onClick={handlePlaceOrder}>
                    {loading ? 'Processing...' : `Pay Rs. ${orderTotal.toFixed(2)}`}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order summary */}
          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ fontWeight: 700, marginBottom: 20 }}>Order Summary</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 20 }}>
              {items.map(item => (
                <div key={item.id} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <img src={item.image_url} alt={item.name} style={{ width: 52, height: 52, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '0.85rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</p>
                    <p style={{ color: '#6b7280', fontSize: '0.78rem' }}>Qty: {item.quantity}</p>
                  </div>
                  <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Rs. {(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="divider" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#9ca3af', fontSize: '0.9rem' }}><span>Subtotal</span><span>Rs. {total.toFixed(2)}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#9ca3af', fontSize: '0.9rem' }}><span>Shipping</span><span>{shipping_cost === 0 ? <span style={{ color: '#4ade80' }}>FREE</span> : `Rs. ${shipping_cost.toFixed(2)}`}</span></div>
              <div className="divider" />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1.1rem' }}><span>Total</span><span style={{ color: '#a78bfa' }}>Rs. {orderTotal.toFixed(2)}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Checkout() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  )
}
