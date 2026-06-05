import { useApp } from '../../context/AppContext'
import { INITIAL_ESTUDIANTES } from '../../data/mockData'

const TIPO_CONFIG = {
  baja: { label: 'Baja', icon: '📤', className: 'hist-baja' },
  aceptacion: { label: 'Aceptación', icon: '✅', className: 'hist-aceptacion' },
  rechazo: { label: 'Rechazo', icon: '❌', className: 'hist-rechazo' },
}

export default function HistorialAdmin() {
  const { historial, materias } = useApp()

  const getEstudiante = (legajo) => INITIAL_ESTUDIANTES.find(e => e.legajo === legajo)

  const formatFecha = (iso) => new Date(iso).toLocaleString('es-AR', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  })

  return (
    <div className="view-container">
      <h2 className="view-title">Historial de Movimientos</h2>

      {historial.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">🕐</span>
          <p>No hay movimientos registrados aún.</p>
          <p className="empty-hint">Los movimientos aparecerán aquí cuando registres bajas.</p>
        </div>
      ) : (
        <div className="historial-list">
          {historial.map(entry => {
            const config = TIPO_CONFIG[entry.tipo] || { label: entry.tipo, icon: '📌', className: '' }
            const est = getEstudiante(entry.estudianteId)
            return (
              <div key={entry.id} className={`historial-item ${config.className}`}>
                <span className="hist-icon">{config.icon}</span>
                <div className="hist-info">
                  <p className="hist-label">
                    {config.label}
                    <span className="hist-tipo-badge"> · {entry.tipo}</span>
                  </p>
                  <p className="hist-materia">{entry.materiaNombre}</p>
                  <p className="hist-detalle">
                    {est?.nombre || entry.estudianteId} · Leg. {entry.estudianteId}
                  </p>
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
