import { Link, useLocation } from 'react-router-dom'
import './Header.css'
import MainIcon from '../assets/main-icon.svg?react'
import useAuthStore from '../stores/useAuthStore'
import useCartStore from '../stores/useCartStore'

function Header() {
  const location = useLocation()
  const { usuario, token, logout } = useAuthStore()
  const items = useCartStore((state) => state.items)
  const totalItems = items.reduce((sum, item) => sum + item.cantidad, 0)

  const isActive = (path) => location.pathname === path ? 'link-active' : ''

  return (
    <header className="header-container">
      <div className="header-container-left">
        <div className="header-logo-container">
          <MainIcon className="header-logo" />
        </div>
        <h1 className="header-title">PawStore</h1>
      </div>
      <nav>
        <Link to="/" className={isActive('/')}>
          Inicio
        </Link>
        <Link to="/productos" className={isActive('/productos')}>
          Productos
        </Link>
        <Link to="/contacto" className={isActive('/contacto')}>
          Contacto
        </Link>
        <Link to="/carrito" className={isActive('/carrito')}>
          Carrito ({totalItems})
        </Link>
      </nav>

      <nav className="nav-admin-container">
        {token && (
          <div>Hola, {usuario?.username || usuario?.name}</div>
        )}
        {token && usuario?.role === 'admin' && (
          <Link to="/admin" className={isActive('/admin')}>
            Administración
          </Link>
        )}
        {token ? (
          <button className="nav-admin-btn" onClick={logout}>
            Cerrar sesión
          </button>
        ) : (
          <Link to="/login" className="nav-admin-btn">
            Iniciar sesión
          </Link>
        )}
      </nav>
    </header>
  )
}

export default Header
