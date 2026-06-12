import { useState } from 'react'
import { useApp } from '../context/AppContext'

export default function DetalleMateria({ materiaId, onClose }) {
  const { materias, inscripciones, usuario, registrarBaja } = useApp()
  const materia = materias.find(m => m.id === materiaId)
  const [confirmBaja, setConfirmBaja] = useState(false)

  if (!materia) return null

  const miInscripcion = inscripciones.find(
    i => i.estudianteId === usuario.legajo && i.materiaId === materiaId && ['inscripto', 'espera'].includes(i.estado)
  )

  const enEspera = inscripciones.filter(i => i.materiaId === materiaId && i.estado === 'espera')
  const llena = materia.inscriptos >= materia.cupo

  const handleBaja = () => {
    registrarBaja(usuario.legajo, materiaId)
    setConfirmBaja(false)
    onClose()
  }

  return (
    <div className="detalle-overlay" onClick={onClose}>
      <div className="detalle-modal" onClick={e => e.stopPropagation()}>
        <div className="detalle-header">
          <button className="btn btn-ghost btn-sm" onClick={onClose}>← Volver</button>
          <h2 className="detalle-title">{materia.nombre}</h2>
        </div>

        <div className="detalle-body">
          {/* Información General */}
          <section className="detalle-section">
            <h3 className="detalle-section-title">Información General</h3>
            <div className="detalle-info">
              <p><span className="detalle-label">Docente:</span> {materia.docente}</p>
              <p><span className="detalle-label">Cátedra:</span> {materia.comision}</p>
              <p><span className="detalle-label">Año:</span> {materia.año}° año</p>
            </div>
          </section>

          {/* Cupos */}
          <section className="detalle-section">
            <h3 className="detalle-section-title">Cupos Disponibles</h3>
            <div className="detalle-cupos">
              <p>Cupo máximo: <strong>{materia.cupo}</strong></p>
              <p>Inscritos: <strong>{materia.inscriptos}</strong></p>
              {llena ? (
                <>
                  <span className="badge badge-danger">LLENO</span>
                  <p>En espera: <strong>{enEspera.length} personas</strong></p>
                </>
              ) : (
                <>
                  <span className="badge badge-success">{materia.cupo - materia.inscriptos} DISPONIBLES</span>
                </>
              )}
            </div>
          </section>

          {/* Tu Información */}
          {miInscripcion && (
            <section className="detalle-section detalle-section-warning">
              <h3 className="detalle-section-title">Tu Información</h3>
              <div className="detalle-tu-info">
                {miInscripcion.estado === 'inscripto' ? (
                  <p>✅ Estás inscripto en esta materia</p>
                ) : (
                  <>
                    <p>⏳ Estás en lista de espera</p>
                    <p>Tu posición: <strong>#{miInscripcion.posicion}</strong></p>
                    <p>Total en espera: {enEspera.length}</p>
                  </>
                )}
                <p>Tu score: <strong>{usuario.score} pts</strong></p>
              </div>
            </section>
          )}

          {/* Acciones */}
          {miInscripcion && miInscripcion.estado === 'inscripto' && (
            <section className="detalle-actions">
              <button
                className="btn btn-danger btn-full"
                onClick={() => setConfirmBaja(true)}
              >
                Darme de baja
              </button>
            </section>
          )}
        </div>
      </div>

      {confirmBaja && (
        <div className="modal-overlay" onClick={() => setConfirmBaja(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <div className="modal-icon-wrap">
              <span style={{ fontSize: '2rem' }}>⚠️</span>
            </div>
            <h3 className="modal-title">Confirmar baja</h3>
            <p className="modal-subtitle">
              ¿Confirmás la baja de <strong>{materia.nombre}</strong>? Si hay alumnos en lista de espera, se les notificará automáticamente.
            </p>
            <div className="modal-actions">
              <button className="btn btn-danger" onClick={handleBaja}>
                Sí, darme de baja
              </button>
              <button className="btn btn-ghost" onClick={() => setConfirmBaja(false)}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
