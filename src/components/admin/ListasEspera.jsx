import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { INITIAL_ESTUDIANTES } from '../../data/mockData'

export default function ListasEspera() {
  const { materias, inscripciones, notificaciones } = useApp()
  const [filtro, setFiltro] = useState('')

  const materiasFiltradas = materias.filter(m =>
    m.nombre.toLowerCase().includes(filtro.toLowerCase())
  )

  const getEstudiante = (legajo) => INITIAL_ESTUDIANTES.find(e => e.legajo === legajo)

  const getListaEspera = (materiaId) =>
    inscripciones
      .filter(i => i.materiaId === materiaId && i.estado === 'espera')
      .sort((a, b) => a.posicion - b.posicion)

  const tieneNotifPendiente = (estudianteId, materiaId) =>
    notificaciones.some(
      n => n.estudianteId === estudianteId && n.materiaId === materiaId && n.estado === 'pendiente'
    )

  const formatFecha = (iso) => new Date(iso).toLocaleDateString('es-AR', {
    day: '2-digit', month: 'short'
  })

  return (
    <div className="view-container">
      <h2 className="view-title">Listas de Espera por Materia</h2>

      <div className="form-group search-bar">
        <input
          type="text"
          className="form-input"
          placeholder="🔍 Buscar materia..."
          value={filtro}
          onChange={e => setFiltro(e.target.value)}
        />
      </div>

      <div className="listas-grid">
        {materiasFiltradas.map(materia => {
          const lista = getListaEspera(materia.id)
          if (lista.length === 0) return null

          return (
            <div key={materia.id} className="lista-card">
              <div className="lista-card-header">
                <div>
                  <h3 className="lista-card-title">{materia.nombre}</h3>
                  <p className="lista-card-subtitle">
                    {materia.docente} · Cupo: {materia.inscriptos}/{materia.cupo}
                  </p>
                </div>
                <span className="badge badge-warning">{lista.length} en espera</span>
              </div>

              <div className="lista-tabla">
                {lista.map((insc) => {
                  const est = getEstudiante(insc.estudianteId)
                  const notifPendiente = tieneNotifPendiente(insc.estudianteId, materia.id)
                  return (
                    <div key={insc.id} className={`lista-fila ${notifPendiente ? 'fila-notificado' : ''}`}>
                      <span className="fila-pos">#{insc.posicion}</span>
                      <div className="fila-info">
                        <span className="fila-nombre">{est?.nombre || insc.estudianteId}</span>
                        <span className="fila-legajo">Leg. {insc.estudianteId}</span>
                      </div>
                      <span className="fila-fecha">{formatFecha(insc.timestamp)}</span>
                      {notifPendiente && (
                        <span className="fila-badge-notif" title="Notificación enviada">🔔 Notificado</span>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}

        {materiasFiltradas.every(m => getListaEspera(m.id).length === 0) && (
          <div className="empty-state">
            <span className="empty-icon">✅</span>
            <p>No hay listas de espera activas.</p>
          </div>
        )}
      </div>
    </div>
  )
}
