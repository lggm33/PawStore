import Header from '../components/Header'
import Footer from '../components/Footer'
import useProductStore from '../store/useProductStore'
import './Products.css'

function Products({ navigate }) {
  const productos = useProductStore((state) => state.products)
  
  return (
    <>
      <Header currentPage="products" navigate={navigate} />
      <main className="products-container">
        <h2>Catálogo de productos</h2>
        <div className="products-container-grid">
          {productos.map(producto => (
            <div key={producto.id} className="products-container-grid-item">
              <img src={producto.imagen} />
              <h3>{producto.nombre}</h3>
              <p>{`₡${producto.precio}`}</p>
              <button onClick={() => navigate('details', producto.id)}>
                Ver detalles
              </button>
            </div>
          ))}
        </div>
        
      </main>
      <Footer />
    </>
  )
}

export default Products