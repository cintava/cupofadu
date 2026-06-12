import { useState } from 'react'
import { INITIAL_ESTUDIANTES } from '../data/mockData'
import { useApp } from '../context/AppContext'

export default function EncontraAula({ onClose }) {
  const { inscripciones, materias } = useApp()
  const [dniInput, setDniInput] = useState('')
  const [estudianteEncontrado, setEstudianteEncontrado] = useState(null)
  const [error, setError] = useState('')

  const handleBuscar = () => {
    setError('')
    // Buscar por DNI (en este caso usamos legajo como DNI para la demo)
    const estudiante = INITIAL_ESTUDIANTES.find(e => {
      // Comparar con DNI (simulamos con legajo para la demo)
      return e.legajo === dniInput.trim()
    })

    if (!estudiante) {
      setError('DNI no encontrado en el sistema')
      setEstudianteEncontrado(null)
      return
    }

    setEstudianteEncontrado(estudiante)
  }

  const getMateriasCursando = () => {
    if (!estudianteEncontrado) return []

    return inscripciones
      .filter(i =>
        i.estudianteId === estudianteEncontrado.legajo &&
        i.estado === 'inscripto'
      )
      .map(insc => {
        const materia = materias.find(m => m.id === insc.materiaId)
        return {
          ...insc,
          ...materia,
          aula: `${materia?.nombre?.substring(0, 1).toUpperCase()}${insc.id}`,
          turno: ['Mañana', 'Tarde', 'Noche'][Math.floor(Math.random() * 3)]
        }
      })
  }

  const materiasEncontradas = getMateriasCursando()

  return (
    <div className="aula-overlay" onClick={onClose}>
      <div className="aula-modal" onClick={e => e.stopPropagation()}>
        <div className="aula-header">
          <button className="btn btn-ghost btn-sm" onClick={onClose}>← Volver</button>
          <h2>Encontrá tu Aula</h2>
        </div>

        {!estudianteEncontrado ? (
          <div className="aula-body">
            <div className="aula-search-section">
              <label className="form-label">Ingresá tu DNI</label>
              <div className="aula-search-input">
                <input
                  type="text"
                  className="form-input"
                  placeholder="Ej: 12345"
                  value={dniInput}
                  onChange={e => setDniInput(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && handleBuscar()}
                />
                <button
                  className="btn btn-primary btn-sm"
                  onClick={handleBuscar}
                  disabled={!dniInput.trim()}
                >
                  Buscar
                </button>
              </div>
              {error && <p className="form-error">{error}</p>}
            </div>

            <div className="aula-hint">
              <p className="aula-hint-title">📌 DNI de prueba:</p>
              <div className="aula-chips">
                {['12345', '67890', '11111', '22222'].map(dni => (
                  <button
                    key={dni}
                    className="aula-chip"
                    onClick={() => {
                      setDniInput(dni)
                      setTimeout(() => {
                        const est = INITIAL_ESTUDIANTES.find(e => e.legajo === dni)
                        if (est) setEstudianteEncontrado(est)
                      }, 100)
                    }}
                  >
                    {dni}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="aula-body">
            {/* Información del estudiante */}
            <div className="aula-student-info">
              <h3 className="aula-student-name">{estudianteEncontrado.nombre}</h3>
              <p className="aula-student-meta">
                <span>DNI: {estudianteEncontrado.legajo}</span>
                <span>•</span>
                <span>Carrera: {estudianteEncontrado.carrera}</span>
              </p>
            </div>

            {/* Materias cursando */}
            <div className="aula-materias">
              {materiasEncontradas.length === 0 ? (
                <div className="empty-state">
                  <span className="empty-icon">📋</span>
                  <p>No hay materias inscritas.</p>
                </div>
              ) : (
                <>
                  <h4 className="aula-section-title">Materias en Curso</h4>
                  <div className="aula-materias-list">
                    {materiasEncontradas.map(materia => (
                      <div key={materia.id} className="aula-materia-card">
                        <div className="aula-materia-header">
                          <h5 className="aula-materia-nombre">{materia.nombre}</h5>
                          <span className="aula-aula-badge">
                            Aula {materia.aula}
                          </span>
                        </div>

                        <div className="aula-materia-details">
                          <div className="aula-detail-row">
                            <span className="aula-detail-label">📍 Docente:</span>
                            <span>{materia.docente}</span>
                          </div>
                          <div className="aula-detail-row">
                            <span className="aula-detail-label">🎓 Cátedra:</span>
                            <span>{materia.comision}</span>
                          </div>
                          <div className="aula-detail-row">
                            <span className="aula-detail-label">⏰ Turno:</span>
                            <span className="aula-turno-badge">{materia.turno}</span>
                          </div>
                          <div className="aula-detail-row">
                            <span className="aula-detail-label">📅 Año:</span>
                            <span>{materia.año}° año</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Botón volver a buscar */}
            <button
              className="btn btn-ghost btn-full"
              onClick={() => {
                setEstudianteEncontrado(null)
                setDniInput('')
                setError('')
              }}
            >
              Buscar otro DNI
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
