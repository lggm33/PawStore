import { Navigate, Outlet } from 'react-router-dom'
import useAuthStore from '../stores/useAuthStore'

function PrivateRoute({ role }) {
  const { token, usuario } = useAuthStore()

  if (token === null) {
    return <Navigate to="/login" replace />
  }

  if (role && usuario?.role !== role) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}

export default PrivateRoute
