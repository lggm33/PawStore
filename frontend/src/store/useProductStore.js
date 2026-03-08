import { create } from 'zustand'
import initialData from '../assets/data.json'

const generateNextId = (products) => {
  const maxId = products.reduce((max, p) => Math.max(max, p.id), 0)
  return maxId + 1
}

const useProductStore = create((set, get) => ({
  products: [...initialData],

  addProduct(productData) {
    set((state) => ({
      products: [
        ...state.products,
        { ...productData, id: generateNextId(state.products) },
      ],
    }))
  },

  updateProduct(id, updatedData) {
    set((state) => ({
      products: state.products.map((product) =>
        product.id === id ? { ...product, ...updatedData } : product
      ),
    }))
  },

  deleteProduct(id) {
    set((state) => ({
      products: state.products.filter((product) => product.id !== id),
    }))
  },

  getProductById(id) {
    return get().products.find((product) => product.id === id)
  },
}))

export default useProductStore
