import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import ChatAlumnos from '../ChatAlumnos'
import EncontraAula from '../EncontraAula'
import Calendario from '../Calendario'

const TIPO_CONFIG = {
  baja: { label: 'Baja registrada', icon: '📤', className: 'hist-baja' },
  aceptacion: { label: 'Vacante aceptada', icon: '✅', className: 'hist-aceptacion' },
  rechazo: { label: 'Vacante rechazada', icon: '❌', className: 'hist-rechazo' },
}

export default function MiHistorial() {
  const { usuario, historial } = useApp()
  const [mostrarChat, setMostrarChat] = useState(false)
  const [mostrarAula, setMostrarAula] = useState(false)
  const [mostrarCalendario, setMostrarCalendario] = useState(false)

  if (mostrarChat) {
    return <ChatAlumnos onClose={() => setMostrarChat(false)} />
  }

  if (mostrarAula) {
    return <EncontraAula onClose={() => setMostrarAula(false)} />
  }

  if (mostrarCalendario) {
    return <Calendario onClose={() => setMostrarCalendario(false)} />
  }

  const miHistorial = historial.filter(h => h.estudianteId === usuario.legajo)

  const formatFecha = (iso) => new Date(iso).toLocaleString('es-AR', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  })

  return (
    <div className="view-container">
      <h2 className="view-title">Mi Historial</h2>

      {miHistorial.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">🕐</span>
          <p>Todavía no hay actividad en tu historial.</p>
        </div>
      ) : (
        <div className="historial-list">
          {miHistorial.map(entry => {
            const config = TIPO_CONFIG[entry.tipo] || { label: entry.tipo, icon: '📌', className: '' }
            return (
              <div key={entry.id} className={`historial-item ${config.className}`}>
                <span className="hist-icon">{config.icon}</span>
                <div className="hist-info">
                  <p className="hist-label">{config.label}</p>
                  <p className="hist-materia">{entry.materiaNombre}</p>
                  {entry.detalle && <p className="hist-detalle">{entry.detalle}</p>}
                </div>
                <span className="hist-fecha">{formatFecha(entry.timestamp)}</span>
              </div>
            )
          })}
        </div>
      )}

    </div>
  )
}
