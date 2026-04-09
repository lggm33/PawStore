import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { api } from '../utils/api'
import { hasEmptyFields } from '../utils/validateForm'
import './Administration.css'

const EMPTY_FORM = {
  nombre: '',
  descripcion: '',
  precio: '',
  categoria: '',
  imagen: '',
  stock: '',
}

function ProductTable({ products, onEdit, onDelete }) {
  return (
    <section className="admin-section">
      <p className="admin-intro">
        En esta sección puedes gestionar el catálogo de productos de PawStore.
      </p>
      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Categoría</th>
              <th>Stock</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>PAW{String(product.id).padStart(3, '0')}</td>
                <td>{product.nombre}</td>
                <td>₡{product.precio}</td>
                <td>
                  <span className="category-badge">{product.categoria}</span>
                </td>
                <td>{product.stock}</td>
                <td className="admin-actions">
                  <button
                    className="btn-edit"
                    onClick={() => onEdit(product.id)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => onDelete(product.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

function AddProductForm({ onAdd }) {
  const [formData, setFormData] = useState({ ...EMPTY_FORM })
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (hasEmptyFields(formData)) {
      setError('Por favor completa todos los campos antes de agregar el producto.')
      return
    }

    try {
      await onAdd({
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        precio: Number(formData.precio),
        categoria: formData.categoria,
        imagen: formData.imagen,
        stock: Number(formData.stock),
      })
      setFormData({ ...EMPTY_FORM })
      setError('')
    } catch {
      setError('Error al agregar el producto. Intenta de nuevo.')
    }
  }

  return (
    <section className="admin-section">
      <h2>Agregar nuevo producto</h2>
      <form className="admin-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="nombre">Nombre</label>
          <input
            id="nombre"
            name="nombre"
            type="text"
            placeholder="Nombre del producto"
            value={formData.nombre}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="descripcion">Descripción</label>
          <textarea
            id="descripcion"
            name="descripcion"
            placeholder="Descripción detallada del producto"
            value={formData.descripcion}
            onChange={handleChange}
            rows={3}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="precio">Precio</label>
            <input
              id="precio"
              name="precio"
              type="number"
              placeholder="0.00"
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
              placeholder="Categoría del producto (ej. Alimento, Juguetes)"
              value={formData.categoria}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="imagen">URL de la imagen</label>
          <input
            id="imagen"
            name="imagen"
            type="text"
            placeholder="https://ejemplo.com/imagen.jpg"
            value={formData.imagen}
            onChange={handleChange}
          />
        </div>

        <div className="form-group form-group-half">
          <label htmlFor="stock">Stock</label>
          <input
            id="stock"
            name="stock"
            type="number"
            placeholder="0"
            min="0"
            value={formData.stock}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="btn-add-product">
          Agregar producto
        </button>

        {error && <p className="form-error">{error}</p>}
      </form>
    </section>
  )
}

function Administration() {
  const [products, setProducts] = useState([])
  const navigate = useNavigate()
  const { token } = useAuth()

  useEffect(() => {
    api.get('/products')
      .then(setProducts)
      .catch(console.error)
  }, [])

  const handleAdd = async (data) => {
    const nuevo = await api.post('/products', data, token)
    setProducts((prev) => [...prev, nuevo])
  }

  const handleDelete = async (id) => {
    await api.delete('/products/' + id, token)
    setProducts((prev) => prev.filter((p) => p.id !== id))
  }

  const handleEdit = (id) => {
    navigate('/admin/editar/' + id)
  }

  return (
    <main className="administration-container">
      <h1>Administración de productos</h1>
      <ProductTable
        products={products}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <AddProductForm onAdd={handleAdd} />
    </main>
  )
}

export default Administration
