import { useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import useProductStore from '../store/useProductStore'
import './EditProduct.css'

function EditProduct({ productId, navigate }) {
  const products = useProductStore((state) => state.products)
  const updateProduct = useProductStore((state) => state.updateProduct)

  const product = products.find((p) => p.id === productId)
  const categories = [...new Set(products.map((p) => p.category))]

  const [formData, setFormData] = useState(() => {
    if (!product) {
      return null
    }
    return {
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      image: product.image,
      stock: product.stock,
    }
  })
  const [error, setError] = useState('')

  if (!product || !formData) {
    queueMicrotask(() => navigate('administration'))
    return null
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const hasEmptyFields = () => {
    return Object.values(formData).some(
      (val) => val === '' || val === null || val === undefined
    )
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (hasEmptyFields()) {
      setError('Please fill in all fields before saving the changes.')
      return
    }

    updateProduct(productId, {
      ...formData,
      price: Number(formData.price),
      stock: Number(formData.stock),
    })

    navigate('administration')
  }

  const handleCancel = () => {
    navigate('administration')
  }

  return (
    <>
      <Header currentPage="edit" navigate={navigate} />
      <main className="edit-product-container">
        <h1>Edit product</h1>
        <div className="edit-product-card">
          {error && <p className="form-error">{error}</p>}

          <form className="edit-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
              />
            </div>

            <div className="form-group">
              <label htmlFor="price">Price</label>
              <input
                id="price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="image">URL of the image</label>
              <input
                id="image"
                name="image"
                type="text"
                value={formData.image}
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
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button type="submit" className="btn-save">
                Save changes
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default EditProduct
