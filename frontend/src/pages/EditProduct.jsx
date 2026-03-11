import { useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import useProductStore from '../store/useProductStore'
import './EditProduct.css'

function EditProduct({ productId, navigate }) {
  const products = useProductStore((state) => state.products)
  const updateProduct = useProductStore((state) => state.updateProduct)

  const product = products.find((p) => p.id === productId)
  const categories = [...new Set(products.map((p) => p.categoria))]

  const [formData, setFormData] = useState(() => {
    if (!product) {
      return null
    }
    return {
      nombre: product.nombre,
      descripcion: product.descripcion,
      precio: product.precio,
      categoria: product.categoria,
      imagen: product.imagen,
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

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (hasEmptyFields()) {
      setError('Por favor completa todos los campos antes de guardar los cambios.')
      return
    }

    try {
      await updateProduct(productId, {
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        precio: Number(formData.precio),
        categoria: formData.categoria,
        imagen: formData.imagen,
        stock: Number(formData.stock),
      })
      navigate('administration')
    } catch {
      setError('Error al guardar los cambios. Intenta de nuevo.')
    }
  }

  const handleCancel = () => {
    navigate('administration')
  }

  return (
    <>
      <Header currentPage="edit" navigate={navigate} />
      <main className="edit-product-container">
        <h1>Editar producto</h1>
        <div className="edit-product-card">
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
              <select
                id="categoria"
                name="categoria"
                value={formData.categoria}
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
                onClick={handleCancel}
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
      <Footer />
    </>
  )
}

export default EditProduct
