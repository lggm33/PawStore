import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { api } from '../utils/api'
import './Login.css'

function Register() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    const { name, email, username, password, confirmPassword } = e.target.elements

    if (password.value !== confirmPassword.value) {
      setError('Las contraseñas no coinciden')
      return
    }

    setLoading(true)

    try {
      const data = await api.post('/auth/register', {
        name: name.value,
        email: email.value,
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
        <h1 className="login-title">Crear cuenta</h1>

        {error && <p className="login-error">{error}</p>}

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-field">
            <label htmlFor="name">Nombre</label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Tu nombre completo"
              required
            />
          </div>

          <div className="login-field">
            <label htmlFor="email">Correo</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="correo@ejemplo.com"
              required
            />
          </div>

          <div className="login-field">
            <label htmlFor="username">Usuario</label>
            <input
              id="username"
              name="username"
              type="text"
              placeholder="nombre de usuario"
              required
            />
          </div>

          <div className="login-field">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••••••"
              required
            />
          </div>

          <div className="login-field">
            <label htmlFor="confirmPassword">Confirmar contraseña</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="••••••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="login-submit"
            disabled={loading}
          >
            {loading ? 'Cargando...' : 'Registrarse'}
          </button>
        </form>

        <button className="login-back" onClick={() => navigate('/login')}>
          ¿Ya tienes cuenta? Inicia sesión
        </button>
      </div>
    </main>
  )
}

export default Register
