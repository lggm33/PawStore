import Header from '../components/Header'
import Footer from '../components/Footer'
import './LoginRequired.css'

function LoginRequired({ navigate }) {
  return (
    <>
      <Header currentPage="login-required" navigate={navigate} />
      <main className="login-required-page">
        <div className="login-required-card">
          <div className="login-required-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <h1 className="login-required-title">Debes iniciar sesión para continuar</h1>
          <p className="login-required-description">
            Protege tus compras y gestiona tu perfil con facilidad.
          </p>
          <button
            className="login-required-btn"
            onClick={() => navigate('login')}
          >
            Ir a iniciar sesión
          </button>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default LoginRequired
