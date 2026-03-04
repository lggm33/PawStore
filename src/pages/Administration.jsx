import { useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import useProductStore from '../store/useProductStore'
import './Administration.css'

const EMPTY_FORM = {
  name: '',
  description: '',
  price: '',
  category: '',
  image: '/api/placeholder.co/600×400',
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
              <th>Name</th>
              <th>Price</th>
              <th>Category</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>PAW{String(product.id).padStart(3, '0')}</td>
                <td>{product.name}</td>
                <td>${(product.price / 100).toFixed(2)}</td>
                <td>
                  <span className="category-badge">{product.category}</span>
                </td>
                <td>{product.stock}</td>
                <td className="admin-actions">
                  <button
                    className="btn-edit"
                    onClick={() => navigate('edit', product.id)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => onDelete(product.id)}
                  >
                    Delete
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
      ...formData,
      precio: Number(formData.precio),
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
          <label htmlFor="name">Name</label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Name of the product"
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            placeholder="Description of the product"
            value={formData.description}
            onChange={handleChange}
            rows={3}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="price">Price</label>
            <input
              id="price"
              name="price"
              type="number"
              placeholder="0.00"
              min="0"
              step="0.01"
              value={formData.precio}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <input
              id="category"
              name="category"
              type="text"
              placeholder="Category of the product (e.g. Food, Toys)"
              value={formData.category}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="image">URL of the image</label>
          <input
            id="image"
            name="image"
            type="text"
            placeholder="/api/placeholder.co/600×400"
            value={formData.image}
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
          Add product
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
