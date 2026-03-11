import './Header.css'
import MainIcon from '../assets/main-icon.svg?react'
import useAuthStore from '../store/useAuth'

function Header({ currentPage, navigate }) {
  const { isAuthenticated, user, logout } = useAuthStore()

  const handleAuthAction = () => {
    if (isAuthenticated) {
      logout()
      navigate('home')
    } else {
      navigate('login')
    }
  }

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
        
        </nav>
       
        <nav className="nav-admin-container">

        {isAuthenticated && <div>Hello {user.name}</div>}
        {user?.role === 'admin' && <a onClick={() => navigate('administration')}>Administración</a>}
        <a 
          onClick={handleAuthAction}
          className="nav-admin-btn"
        >
          {isAuthenticated ? 'Cerrar sesión' : 'Iniciar sesión'}
        </a>
        
        </nav>
    </header>
  )
}

export default Header