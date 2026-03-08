import Header from '../components/Header'
import Footer from '../components/Footer'
import './Home.css'

function Home({ navigate }) {
  return (
    <>
      <Header currentPage="home" navigate={navigate} />
      <main className="home-container">
        <h1 className="home-title">Bienvenido a PawStore</h1>
        <p>Somos una tienda dedicada a ofrecer productos de calidad para tus mascotas.</p>
        <p>Explora nuestro catálogo para encontrar camas, juguetes, accesorios y más.</p>
        <a onClick={() => navigate('products')}>
          Ver productos
        </a>
        <h4>Esta es la página principal de la aplicación. Más adelante aquí se podrán mostrar productos destacados.</h4>
      </main>
      <Footer />
    </>
  )
}

export default Home
