import { Link } from 'react-router-dom'
import './NotFound.css'

function NotFound({ message }) {
  return (
    <main className="notfound-container">
      <div className="notfound-icon">
        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
      </div>
      <h1>{message ?? 'Página no encontrada'}</h1>
      <p>La página que estás buscando no existe o ha sido movida.</p>
      <Link to="/" className="notfound-btn">Volver al inicio</Link>
    </main>
  )
}

export default NotFound
