import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      agregarAlCarrito: (producto) => {
        const items = get().items
        const existente = items.find((item) => item.id === producto.id)
        if (existente) {
          set({
            items: items.map((item) =>
              item.id === producto.id
                ? { ...item, cantidad: item.cantidad + 1 }
                : item
            ),
          })
        } else {
          set({ items: [...items, { ...producto, cantidad: 1 }] })
        }
      },
      modificarCantidad: (id, cantidad) => {
        if (cantidad <= 0) {
          set({ items: get().items.filter((item) => item.id !== id) })
        } else {
          set({
            items: get().items.map((item) =>
              item.id === id ? { ...item, cantidad } : item
            ),
          })
        }
      },
      quitarDelCarrito: (id) => {
        set({ items: get().items.filter((item) => item.id !== id) })
      },
      vaciarCarrito: () => set({ items: [] }),
    }),
    { name: 'cart-storage' }
  )
)

/**
 * Selector derivado para el total del carrito.
 * Uso: const total = useCartStore(selectTotal)
 * Zustand compara números → re-renderiza solo cuando el total cambia.
 */
export const selectTotal = (state) =>
  state.items.reduce((acc, item) => acc + item.precio * item.cantidad, 0)

export default useCartStore
