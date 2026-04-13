import { Link, useLocation } from 'react-router-dom'
import { formatPrice } from '../utils/formatPrice'
import './Confirmacion.css'

function Confirmacion() {
  const { state } = useLocation()
  const items = state?.items || []
  const total = state?.total || 0

  return (
    <main className="confirmacion-container">
      <div className="confirmacion-card">
        <div className="confirmacion-check">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <circle cx="24" cy="24" r="22" stroke="var(--button-action-color)" strokeWidth="2.5" />
            <path d="M14 24l7 7 13-14" stroke="var(--button-action-color)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <h1>Compra realizada con éxito</h1>
        <p>Tu pedido ha sido procesado correctamente. Recibirás un correo con la confirmación y los detalles de tu compra.</p>

        {items.length > 0 && (
          <div className="confirmacion-resumen">
            <h2>Resumen de la compra</h2>
            <table className="confirmacion-tabla">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Precio Unitario</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td>{item.nombre}</td>
                    <td>{item.cantidad}</td>
                    <td>{formatPrice(item.precio)}</td>
                    <td>{formatPrice(item.precio * item.cantidad)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="confirmacion-total">
              <span>Total</span>
              <strong>{formatPrice(total)}</strong>
            </div>
          </div>
        )}

        <div className="confirmacion-acciones">
          <Link to="/productos" className="confirmacion-btn-primario">Volver al catálogo</Link>
          <Link to="/" className="confirmacion-btn-secundario">Ir al inicio</Link>
        </div>
      </div>
    </main>
  )
}

export default Confirmacion
