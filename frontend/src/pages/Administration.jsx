import { useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import useProductStore from '../store/useProductStore'
import './Administration.css'

const EMPTY_FORM = {
  nombre: '',
  descripcion: '',
  precio: '',
  categoria: '',
  imagen: '/api/placeholder.co/600×400',
  stock: '',
}

function ProductTable({ products, navigate, onDelete }) {
  return (
    <section className="admin-section">
      <h1>Administración de productos</h1>
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
                <td>${(product.precio / 100).toFixed(2)}</td>
                <td>
                  <span className="category-badge">{product.categoria}</span>
                </td>
                <td>{product.stock}</td>
                <td className="admin-actions">
                  <button
                    className="btn-edit"
                    onClick={() => navigate('edit', product.id)}
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

  const hasEmptyFields = () => {
    return Object.values(formData).some((val) => val === '' || val === null)
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (hasEmptyFields()) {
      setError('Por favor completa todos los campos antes de agregar el producto.')
      return
    }

    onAdd({
      nombre: formData.nombre,
      descripcion: formData.descripcion,
      precio: Number(formData.precio),
      categoria: formData.categoria,
      imagen: formData.imagen,
      stock: Number(formData.stock),
    })

    setFormData({ ...EMPTY_FORM })
    setError('')
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
            placeholder="/api/placeholder.co/600×400"
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

function Administration({ navigate }) {
  const products = useProductStore((state) => state.products)
  const addProduct = useProductStore((state) => state.addProduct)
  const deleteProduct = useProductStore((state) => state.deleteProduct)

  return (
    <>
      <Header currentPage="administration" navigate={navigate} />
      <main className="administration-container">
        <ProductTable
          products={products}
          navigate={navigate}
          onDelete={deleteProduct}
        />
        <AddProductForm onAdd={addProduct} />
      </main>
      <Footer />
    </>
  )
}

export default Administration
