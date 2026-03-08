import './Header.css'
import MainIcon from '../assets/main-icon.svg?react'
function Header({ currentPage, navigate }) {
  return (
    <header className={`header-container`}>
      <div className="header-container-left">
        <div className="header-logo-container">
          <MainIcon className="header-logo" />
        </div>
        <h1 className="header-title">PawStore</h1>
      </div>
      <nav>
        <a 
          onClick={() => navigate('home')}
          className={currentPage === 'home' ? 'link-active' : ''}
        >
          Inicio
        </a>
        <a 
          onClick={() => navigate('products')}
          className={currentPage === 'products' || currentPage === 'details' ? 'link-active' : ''}
        >
          Productos
        </a>
        <a 
          onClick={() => navigate('contact')}
          className={currentPage === 'contact' ? 'link-active' : ''}
        >
          Contacto
        </a>
        <a 
          onClick={() => navigate('administration')}
          className="nav-admin-btn"
        >
          Administración
        </a>
      </nav>
    </header>
  )
}

export default Header