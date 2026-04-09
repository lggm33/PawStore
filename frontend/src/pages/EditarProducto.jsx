import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { api } from '../utils/api'
import { hasEmptyFields } from '../utils/validateForm'
import './EditarProducto.css'

function EditarProducto() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { token } = useAuth()

  const [formData, setFormData] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/products/' + id)
      .then((data) => {
        setFormData({
          nombre: data.nombre,
          descripcion: data.descripcion,
          precio: data.precio,
          categoria: data.categoria,
          imagen: data.imagen,
          stock: data.stock,
        })
      })
      .catch(() => navigate('/admin'))
      .finally(() => setLoading(false))
  }, [id, navigate])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (hasEmptyFields(formData)) {
      setError('Por favor completa todos los campos antes de guardar los cambios.')
      return
    }

    try {
      await api.put('/products/' + id, {
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        precio: Number(formData.precio),
        categoria: formData.categoria,
        imagen: formData.imagen,
        stock: Number(formData.stock),
      }, token)
      navigate('/admin')
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading) return <main className="editar-product-container"><p>Cargando...</p></main>
  if (!formData) return null

  return (
    <main className="editar-product-container">
      <h1>Editar producto</h1>
      <div className="editar-product-card">
        {error && <p className="form-error">{error}</p>}

        <form className="edit-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nombre">Nombre</label>
            <input
              id="nombre"
              name="nombre"
              type="text"
              value={formData.nombre}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="descripcion">Descripción</label>
            <textarea
              id="descripcion"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              rows={3}
            />
          </div>

          <div className="form-group">
            <label htmlFor="precio">Precio</label>
            <input
              id="precio"
              name="precio"
              type="number"
              min="0"
              step="0.01"
              value={formData.precio}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="categoria">Categoría</label>
            <input
              id="categoria"
              name="categoria"
              type="text"
              value={formData.categoria}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="imagen">URL de la imagen</label>
            <input
              id="imagen"
              name="imagen"
              type="text"
              value={formData.imagen}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="stock">Stock</label>
            <input
              id="stock"
              name="stock"
              type="number"
              min="0"
              value={formData.stock}
              onChange={handleChange}
            />
          </div>

          <div className="edit-form-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={() => navigate('/admin')}
            >
              Cancelar
            </button>
            <button type="submit" className="btn-save">
              Guardar cambios
            </button>
          </div>
        </form>
      </div>
    </main>
  )
}

export default EditarProducto
