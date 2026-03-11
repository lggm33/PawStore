import { create } from 'zustand'
import { DEFAULT_HEADERS, handleResponse } from '../utils/fetchUtils'

const API_URL = 'http://localhost:3000/api/products'

const useProductStore = create((set, get) => ({
  products: [],
  loading: false,
  error: null,

  async fetchProducts() {
    set({ loading: true, error: null })
    try {
      const response = await fetch(API_URL)
      const products = await handleResponse(response)
      set({ products })
    } catch (err) {
      set({ error: err.message })
    } finally {
      set({ loading: false })
    }
  },

  async addProduct(productData) {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: DEFAULT_HEADERS,
        body: JSON.stringify(productData),
      })
      const newProduct = await handleResponse(response)
      set((state) => ({ products: [...state.products, newProduct] }))
    } catch (err) {
      set({ error: err.message })
      throw err
    }
  },

  async updateProduct(id, updatedData) {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: DEFAULT_HEADERS,
        body: JSON.stringify(updatedData),
      })
      const updated = await handleResponse(response)
      set((state) => ({
        products: state.products.map((product) =>
          product.id === id ? updated : product
        ),
      }))
    } catch (err) {
      set({ error: err.message })
      throw err
    }
  },

  async deleteProduct(id) {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: DEFAULT_HEADERS,
      })
      await handleResponse(response)
      set((state) => ({
        products: state.products.filter((product) => product.id !== id),
      }))
    } catch (err) {
      set({ error: err.message })
      throw err
    }
  },

  getProductById(id) {
    return get().products.find((product) => product.id === id)
  },
}))

export default useProductStore
