import { Link } from 'react-router-dom'
import './Home.css'

function Home() {
  return (
    <main className="home-container">
      <h1 className="home-title">Bienvenido a PawStore</h1>
      <p>Somos una tienda dedicada a ofrecer productos de calidad para tus mascotas.</p>
      <p>Explora nuestro catálogo para encontrar camas, juguetes, accesorios y más.</p>
      <Link to="/productos">Ver productos</Link>
      <h4>Esta es la página principal de la aplicación. Más adelante aquí se podrán mostrar productos destacados.</h4>
    </main>
  )
}

export default Home
