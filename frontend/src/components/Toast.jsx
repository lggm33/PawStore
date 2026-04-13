import { useState, useEffect, useCallback, createContext, useContext } from 'react'
import { createPortal } from 'react-dom'
import './Toast.css'

const ToastContext = createContext(null)

const TOAST_DURATION = 3000
const EXIT_ANIMATION_MS = 300

function ToastItem({ id, message, onRemove }) {
  const [exiting, setExiting] = useState(false)

  const startExit = useCallback(() => {
    setExiting(true)
    setTimeout(() => onRemove(id), EXIT_ANIMATION_MS)
  }, [id, onRemove])

  useEffect(() => {
    const timer = setTimeout(startExit, TOAST_DURATION)
    return () => clearTimeout(timer)
  }, [startExit])

  return (
    <div className={`toast${exiting ? ' toast--exit' : ''}`} role="status" aria-live="polite">
      <span className="toast-icon" aria-hidden="true">🛒</span>
      <span className="toast-message">{message}</span>
      <button className="toast-close" onClick={startExit} aria-label="Cerrar notificación">
        ✕
      </button>
    </div>
  )
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((message) => {
    const id = Date.now() + Math.random()
    setToasts((prev) => [...prev, { id, message }])
  }, [])

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={addToast}>
      {children}
      {createPortal(
        <div className="toast-container">
          {toasts.map((t) => (
            <ToastItem key={t.id} id={t.id} message={t.message} onRemove={removeToast} />
          ))}
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}
