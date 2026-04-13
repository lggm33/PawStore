import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { api } from '../utils/api'
import NotFound from './NotFound'
import './DetalleProducto.css'

function DetalleProducto() {
  const { id } = useParams()
  const [producto, setProducto] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { agregarAlCarrito } = useCart()

  useEffect(() => {
    api.get('/products/' + id)
      .then(setProducto)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <main className="detalle-page"><p>Cargando producto...</p></main>

  if (error || !producto) return <NotFound message="Producto no encontrado" />

  return (
    <main className="detalle-page">
      <div className="detalle-container">
        <div className="detalle-container-image">
          <img src={producto.imagen} alt={producto.nombre} />
        </div>
        <div className="detalle-container-info">
          <h1>{producto.nombre}</h1>
          <p className="detalle-price">₡{producto.precio}</p>
          <p className="detalle-category">{producto.categoria}</p>
          <p className="detalle-description">{producto.descripcion}</p>
          <button
            className="detalle-cart-button"
            onClick={() => agregarAlCarrito(producto)}
          >
            Agregar al carrito
          </button>
          <Link to="/productos" className="detalle-back-link">
            Volver al catálogo
          </Link>
        </div>
      </div>
    </main>
  )
}

export default DetalleProducto
