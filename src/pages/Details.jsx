import Header from '../components/Header'
import Footer from '../components/Footer'
import { searchProductById } from '../utils/searchProduct'
import './Details.css'

function Details({ productId, navigate }) {
  const producto = searchProductById(productId)
  
  if (!producto) {
    return <div>Producto no encontrado</div>
  }
  
  return (
    <>
      <Header currentPage="details" navigate={navigate} />
      <main className="details-page">
        <div className="details-container">
          <div className="details-container-image">
            <img src={producto.imagen} alt={producto.nombre} />
          </div>
          <div className="details-container-info">
            <h1>{producto.nombre}</h1>
            <p className="details-price">€{(producto.precio / 100).toFixed(2)}</p>
            <p className="details-category">{producto.categoria}</p>
            <p className="details-description">{producto.descripcion}</p>
            <p className="details-cart-notice">
              Más adelante se podrá agregar este producto al carrito y completar la compra.
            </p>
            <button className="details-back-button" onClick={() => navigate('products')}>
              Volver al catálogo
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default Details