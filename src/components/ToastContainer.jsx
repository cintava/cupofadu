import { useApp } from '../context/AppContext'

export default function ToastContainer() {
  const { toasts } = useApp()

  if (!toasts.length) return null

  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <div key={toast.id} className={`toast toast-${toast.tipo}`}>
          <span className="toast-icon">
            {toast.tipo === 'success' && '✅'}
            {toast.tipo === 'error' && '❌'}
            {toast.tipo === 'warning' && '⚠️'}
            {toast.tipo === 'info' && 'ℹ️'}
          </span>
          <span className="toast-msg">{toast.mensaje}</span>
        </div>
      ))}
    </div>
  )
}
