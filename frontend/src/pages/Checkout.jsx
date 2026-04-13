import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { api } from '../utils/api'
import { formatPrice } from '../utils/formatPrice'
import './Checkout.css'

function Checkout() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const { token } = useAuth()
  const { items, total, vaciarCarrito } = useCart()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const { nombre, correo, direccion, telefono } = e.target.elements

    try {
      await api.post('/orders', {
        nombre: nombre.value,
        correo: correo.value,
        direccion: direccion.value,
        telefono: telefono.value,
        items,
        total,
      }, token)

      const orderItems = [...items]
      const orderTotal = total
      vaciarCarrito()
      navigate('/confirmacion', { state: { items: orderItems, total: orderTotal } })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="checkout-container">
      <div className="checkout-layout">
        <div className="checkout-form-col">
          <div className="checkout-card">
            <h2>Información de compra</h2>

            <form className="checkout-form" onSubmit={handleSubmit} id="checkout-form">
              <div className="checkout-field">
                <label htmlFor="nombre">Nombre completo</label>
                <input id="nombre" name="nombre" type="text" placeholder="Juan Pérez" required />
              </div>

              <div className="checkout-field">
                <label htmlFor="correo">Correo electrónico</label>
                <input id="correo" name="correo" type="email" placeholder="juan.perez@email.com" required />
              </div>

              <div className="checkout-field">
                <label htmlFor="direccion">Dirección</label>
                <input id="direccion" name="direccion" type="text" placeholder="Calle Ficticia 456, San José, Costa Rica" required />
              </div>

              <div className="checkout-field">
                <label htmlFor="telefono">Teléfono</label>
                <input id="telefono" name="telefono" type="tel" placeholder="8888-8888" required />
              </div>

              <p className="checkout-aviso">Esta información se utilizará para completar la compra.</p>
            </form>
          </div>
        </div>

        <div className="checkout-resumen-col">
          <div className="checkout-card">
            <h2>Resumen del pedido</h2>

            <div className="checkout-items">
              {items.map((item) => (
                <div key={item.id} className="checkout-item">
                  <div className="checkout-item-info">
                    <span className="checkout-item-nombre">{item.nombre}</span>
                    <span className="checkout-item-qty">{item.cantidad} x {formatPrice(item.precio)}</span>
                  </div>
                  <span className="checkout-item-subtotal">{formatPrice(item.precio * item.cantidad)}</span>
                </div>
              ))}
            </div>

            <div className="checkout-total">
              <span>Total:</span>
              <strong>{formatPrice(total)}</strong>
            </div>

            {error && <p className="checkout-error">{error}</p>}

            <button
              type="submit"
              form="checkout-form"
              className="checkout-btn-confirmar"
              disabled={loading}
            >
              {loading ? 'Procesando...' : 'Confirmar compra'}
            </button>

            <button
              type="button"
              className="checkout-btn-cancelar"
              onClick={() => navigate('/carrito')}
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Checkout
