import { useMutation } from '../hooks/useMutation'
import Header from '../components/Header'
import Footer from '../components/Footer'
import useAuthStore from '../store/useAuth'
import './Login.css'

function Login({ navigate }) {
  const { execute, loading, error } = useMutation()
  const { login } = useAuthStore()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { username, password } = e.target.elements
    const response = await execute('http://localhost:3000/api/auth/login', {
      method: 'POST',
      body: { username: username.value, password: password.value },
    })
    if (response) {
      login(response.user)
      if (response.user.role === 'admin') {
        navigate('administration')
      } else {
        navigate('home')
      }
    }
  }

  return (
    <>
      <Header currentPage="login" navigate={navigate} />
      <main className="login-page">
        <div className="login-card">
          <h1 className="login-title">Iniciar sesión</h1>

          {error && (
            <p className="login-error">Credenciales incorrectas. Inténtalo de nuevo.</p>
          )}

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="login-field">
              <label htmlFor="username">Correo electrónico</label>
              <input
                id="username"
                name="username"
                type="text"
                placeholder="nombre.apellido@ejemplo.com"
              />
            </div>

            <div className="login-field">
              <label htmlFor="password">Contraseña</label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••••••"
              />
            </div>

            <button
              type="submit"
              className="login-submit"
              disabled={loading}
            >
              {loading ? 'Cargando...' : 'Ingresar'}
            </button>
          </form>

          <a className="login-back" onClick={() => navigate('home')}>
            Volver al inicio
          </a>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default Login
