import { useState, useEffect } from 'react'
import { useApp } from '../../context/AppContext'

/**
 * Modal que aparece cuando hay una notificación pendiente para el estudiante.
 * Muestra un countdown y permite aceptar o rechazar la vacante.
 */
export default function NotificationModal() {
  const { usuario, notificaciones, aceptarVacante, rechazarVacante } = useApp()
  const [confirmando, setConfirmando] = useState(false)

  // Primera notificación pendiente para este usuario
  const notif = notificaciones.find(
    n => n.estudianteId === usuario?.legajo && n.estado === 'pendiente'
  )

  // Tiempo restante hasta expiración
  const [timeLeft, setTimeLeft] = useState('')

  useEffect(() => {
    if (!notif) return
    const calcular = () => {
      const diff = new Date(notif.expira) - new Date()
      if (diff <= 0) { setTimeLeft('Expirada'); return }
      const hs = Math.floor(diff / 3600000)
      const min = Math.floor((diff % 3600000) / 60000)
      setTimeLeft(`${hs}h ${min}m restantes`)
    }
    calcular()
    const interval = setInterval(calcular, 60000)
    return () => clearInterval(interval)
  }, [notif])

  if (!notif) return null

  const handleAceptar = async () => {
    setConfirmando(true)
    await new Promise(r => setTimeout(r, 300))
    aceptarVacante(notif.id)
    setConfirmando(false)
  }

  const handleRechazar = async () => {
    setConfirmando(true)
    await new Promise(r => setTimeout(r, 300))
    rechazarVacante(notif.id)
    setConfirmando(false)
  }

  return (
    <div className="modal-overlay">
      <div className="modal-card modal-urgent">
        {/* Ícono de alerta urgente */}
        <div className="modal-icon-wrap">
          <span className="modal-icon">🔔</span>
        </div>

        <h2 className="modal-title">¡Hay una vacante disponible!</h2>
        <p className="modal-subtitle">
          Se liberó un lugar en:
        </p>

        <div className="modal-materia-box">
          <span className="modal-materia-nombre">{notif.materiaNombre}</span>
          <span className="modal-materia-motivo">
            {notif.motivo === 'baja' ? 'Un estudiante se dio de baja' : 'El anterior rechazó la vacante'}
          </span>
        </div>

        <div className="modal-expira">
          <span className="expira-icon">⏱</span>
          <span className="expira-text">{timeLeft}</span>
          <span className="expira-hint">Tenés 24 hs para responder. Si no respondés, la vacante pasa al siguiente.</span>
        </div>

        <div className="modal-actions">
          <button
            className="btn btn-success btn-lg"
            onClick={handleAceptar}
            disabled={confirmando}
          >
            ✓ Aceptar vacante
          </button>
          <button
            className="btn btn-danger btn-lg"
            onClick={handleRechazar}
            disabled={confirmando}
          >
            ✗ Rechazar
          </button>
        </div>

        <p className="modal-warning">
          Si rechazás, pasás al final de la lista y la vacante irá al siguiente estudiante en espera.
        </p>
      </div>
    </div>
  )
}
