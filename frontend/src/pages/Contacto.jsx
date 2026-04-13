import './Contacto.css'

function Contacto() {
  return (
    <main className="contacto-container">
      <div className="contacto-card">
        <h1>Contacto</h1>
        <p className="contacto-intro">
          ¿Tenés preguntas sobre tu pedido o nuestros productos? Escribinos, estamos para ayudarte.
        </p>

        <div className="contacto-info">
          <div className="contacto-item">
            <h3>Dirección</h3>
            <p>Av. Central 145, San José, Costa Rica</p>
          </div>

          <div className="contacto-item">
            <h3>Correo electrónico</h3>
            <p>hola@pawstore.cr</p>
          </div>

          <div className="contacto-item">
            <h3>Teléfono</h3>
            <p>+506 2222-3344</p>
          </div>

          <div className="contacto-item">
            <h3>Horarios de atención</h3>
            <p>Lunes a viernes: 8:00 am – 6:00 pm</p>
            <p>Sábados: 9:00 am – 1:00 pm</p>
            <p>Domingos y feriados: cerrado</p>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Contacto
