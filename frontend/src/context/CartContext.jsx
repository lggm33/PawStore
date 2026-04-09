import { createContext, useContext, useState, useMemo, useEffect } from 'react'

const CART_STORAGE_KEY = 'pawstore-cart'

const CartContext = createContext(null)

function loadCartFromStorage() {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => loadCartFromStorage())

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
  }, [items])

  function agregarAlCarrito(producto) {
    setItems((prev) => {
      const existente = prev.find((item) => item.id === producto.id)
      if (existente) {
        return prev.map((item) =>
          item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item
        )
      }
      return [...prev, { ...producto, cantidad: 1 }]
    })
  }

  function modificarCantidad(id, cantidad) {
    setItems((prev) =>
      cantidad <= 0
        ? prev.filter((item) => item.id !== id)
        : prev.map((item) => (item.id === id ? { ...item, cantidad } : item))
    )
  }

  function quitarDelCarrito(id) {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  function vaciarCarrito() {
    setItems([])
  }

  const total = useMemo(
    () => items.reduce((acc, item) => acc + item.precio * item.cantidad, 0),
    [items]
  )

  return (
    <CartContext.Provider value={{ items, total, agregarAlCarrito, modificarCantidad, quitarDelCarrito, vaciarCarrito }}>
      {children}
    </CartContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
