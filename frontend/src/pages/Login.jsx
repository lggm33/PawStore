import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { api } from '../utils/api'
import './Login.css'

function Login() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const { username, password } = e.target.elements

    try {
      const data = await api.post('/auth/login', {
        username: username.value,
        password: password.value,
      })
      login(data.usuario, data.token)
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="login-page">
      <div className="login-card">
        <h1 className="login-title">Iniciar sesión</h1>

        {error && <p className="login-error">{error}</p>}

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-field">
            <label htmlFor="username">Usuario o Correo</label>
            <input
              id="username"
              name="username"
              type="text"
              placeholder="admin o admin@pawstore.com"
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

        <button className="login-back" onClick={() => navigate('/')}>
          Volver al inicio
        </button>

        <button className="login-back" onClick={() => navigate('/register')}>
          ¿No tienes cuenta? Regístrate
        </button>
      </div>
    </main>
  )
}

export default Login
