import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import SimpleLayout from './components/SimpleLayout'
import PrivateRoute from './components/PrivateRoute'
import Home from './pages/Home'
import Catalogo from './pages/Catalogo'
import DetalleProducto from './pages/DetalleProducto'
import Contacto from './pages/Contacto'
import Login from './pages/Login'
import Register from './pages/Register'
import Carrito from './pages/Carrito'
import Checkout from './pages/Checkout'
import Confirmacion from './pages/Confirmacion'
import Administration from './pages/Administration'
import EditarProducto from './pages/EditarProducto'
import NotFound from './pages/NotFound'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/productos" element={<Catalogo />} />
        <Route path="/productos/:id" element={<DetalleProducto />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/carrito" element={<Carrito />} />

        <Route element={<PrivateRoute role="admin" />}>
          <Route path="/admin" element={<Administration />} />
          <Route path="/admin/editar/:id" element={<EditarProducto />} />
        </Route>
      </Route>

      {/* Rutas con Layout Minimalista */}
      <Route element={<SimpleLayout />}>
        <Route element={<PrivateRoute />}>
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/confirmacion" element={<Confirmacion />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default App
