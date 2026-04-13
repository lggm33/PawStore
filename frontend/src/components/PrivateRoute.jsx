import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function PrivateRoute({ role }) {
  const { token, usuario } = useAuth()

  if (token === null) {
    return <Navigate to="/login" replace />
  }

  if (role && usuario?.role !== role) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}

export default PrivateRoute
