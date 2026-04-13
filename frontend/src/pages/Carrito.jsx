import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { formatPrice } from '../utils/formatPrice'
import './Carrito.css'

function Carrito() {
  const { items, total, modificarCantidad, quitarDelCarrito, vaciarCarrito } = useCart()

  if (items.length === 0) {
    return (
      <main className="carrito-container">
        <h1 className="carrito-titulo">Carrito de compras</h1>
        <p className="carrito-vacio">Tu carrito está vacío.</p>
        <Link to="/productos" className="carrito-link-catalogo">Ver productos</Link>
      </main>
    )
  }

  return (
    <main className="carrito-container">
      <h1 className="carrito-titulo">Carrito de compras</h1>
      <div className="carrito-layout">
        <div className="carrito-items">
          {items.map((item) => (
            <div key={item.id} className="carrito-item">
              <div className="carrito-item-img-wrap">
                {item.imagen && (
                  <img
                    src={item.imagen}
                    alt={item.nombre}
                    className="carrito-item-img"
                    onError={(e) => { e.target.style.display = 'none' }}
                  />
                )}
              </div>
              <div className="carrito-item-info">
                <span className="carrito-item-nombre">{item.nombre}</span>
              </div>
              <div className="carrito-item-cantidad">
                <button onClick={() => modificarCantidad(item.id, item.cantidad - 1)}>—</button>
                <span>{item.cantidad}</span>
                <button onClick={() => modificarCantidad(item.id, item.cantidad + 1)}>+</button>
              </div>
              <div className="carrito-item-precios">
                <span>Precio: {formatPrice(item.precio)}</span>
                <span>Subtotal: {formatPrice(item.precio * item.cantidad)}</span>
              </div>
              <button
                className="carrito-btn-eliminar"
                onClick={() => quitarDelCarrito(item.id)}
              >
                🗑 Eliminar
              </button>
            </div>
          ))}
        </div>

        <div className="carrito-sidebar">
          <div className="carrito-total-card">
            <div className="carrito-total-label">
              <span>Total:</span>
              <strong>{formatPrice(total)}</strong>
            </div>
            <Link to="/checkout" className="carrito-btn-checkout">
              Continuar al checkout
            </Link>
            <button
              className="carrito-btn-vaciar"
              onClick={vaciarCarrito}
            >
              Vaciar carrito completo
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Carrito
