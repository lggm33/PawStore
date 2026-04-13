import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { api } from '../utils/api'
import './Catalogo.css'

function Catalogo() {
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { agregarAlCarrito } = useCart()

  useEffect(() => {
    api.get('/products')
      .then(setProductos)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <main className="catalogo-container"><p>Cargando productos...</p></main>
  if (error) return <main className="catalogo-container"><p className="catalogo-error">{error}</p></main>

  return (
    <main className="catalogo-container">
      <h2>Catálogo de productos</h2>
      <div className="catalogo-grid">
        {productos.map((producto) => (
          <div key={producto.id} className="catalogo-grid-item">
            <img src={producto.imagen} alt={producto.nombre} />
            <h3>{producto.nombre}</h3>
            <p>₡{producto.precio}</p>
            <div className="catalogo-item-actions">
              <Link to={'/productos/' + producto.id} className="catalogo-btn-detalle">
                Ver detalles
              </Link>
              <button onClick={() => agregarAlCarrito(producto)}>
                Agregar al carrito
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}

export default Catalogo
