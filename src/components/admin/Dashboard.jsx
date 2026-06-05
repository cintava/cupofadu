import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { INITIAL_ESTUDIANTES } from '../../data/mockData'

export default function Dashboard() {
  const { materias, inscripciones, registrarBaja, notificaciones } = useApp()
  const [selectedMateria, setSelectedMateria] = useState(null)
  const [bajaModal, setBajaModal] = useState(false)
  const [bajaLegajo, setBajaLegajo] = useState('')
  const [bajaError, setBajaError] = useState('')

  const getInscriptos = (materiaId) =>
    inscripciones.filter(i => i.materiaId === materiaId && i.estado === 'inscripto')

  const getEnEspera = (materiaId) =>
    inscripciones.filter(i => i.materiaId === materiaId && i.estado === 'espera')
      .sort((a, b) => a.posicion - b.posicion)

  const getEstudiante = (legajo) =>
    INITIAL_ESTUDIANTES.find(e => e.legajo === legajo)

  const notifPendientes = notificaciones.filter(n => n.estado === 'pendiente').length

  const handleAbrirBaja = (materia) => {
    setSelectedMateria(materia)
    setBajaModal(true)
    setBajaLegajo('')
    setBajaError('')
  }

  const handleRegistrarBaja = () => {
    setBajaError('')
    const result = registrarBaja(bajaLegajo.trim(), selectedMateria.id)
    if (!result.ok) {
      setBajaError(result.error || 'Error al registrar la baja')
      return
    }
    setBajaModal(false)
  }

  return (
    <div className="view-container">
      {/* KPIs */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <span className="kpi-value">{materias.length}</span>
          <span className="kpi-label">Materias activas</span>
        </div>
        <div className="kpi-card">
          <span className="kpi-value">
            {inscripciones.filter(i => i.estado === 'inscripto').length}
          </span>
          <span className="kpi-label">Inscripciones totales</span>
        </div>
        <div className="kpi-card kpi-warning">
          <span className="kpi-value">
            {inscripciones.filter(i => i.estado === 'espera').length}
          </span>
          <span className="kpi-label">En lista de espera</span>
        </div>
        <div className="kpi-card kpi-info">
          <span className="kpi-value">{notifPendientes}</span>
          <span className="kpi-label">Notificaciones pendientes</span>
        </div>
      </div>

      <h2 className="view-title mt-lg">Materias y Cupos</h2>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Materia</th>
              <th>Docente</th>
              <th>Año</th>
              <th>Inscriptos</th>
              <th>En Espera</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {materias.map(materia => {
              const inscriptos = getInscriptos(materia.id).length
              const enEspera = getEnEspera(materia.id).length
              const llena = inscriptos >= materia.cupo
              return (
                <tr key={materia.id}>
                  <td className="table-materia-nombre">{materia.nombre}</td>
                  <td>{materia.docente}</td>
                  <td>{materia.año}°</td>
                  <td>
                    <span className={`cupo-text ${llena ? 'cupo-lleno' : 'cupo-ok'}`}>
                      {inscriptos}/{materia.cupo}
                    </span>
                  </td>
                  <td>
                    {enEspera > 0
                      ? <span className="badge badge-warning">{enEspera} esperando</span>
                      : <span className="text-muted">—</span>
                    }
                  </td>
                  <td>
                    {llena
                      ? <span className="badge badge-danger">Llena</span>
                      : <span className="badge badge-success">Con cupo</span>
                    }
                  </td>
                  <td>
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => handleAbrirBaja(materia)}
                    >
                      Registrar baja
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Modal registrar baja */}
      {bajaModal && (
        <div className="modal-overlay" onClick={() => setBajaModal(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <h3 className="modal-title">Registrar Baja</h3>
            <p className="modal-subtitle">
              Materia: <strong>{selectedMateria?.nombre}</strong>
            </p>

            {/* Lista de inscriptos — el admin elige directamente */}
            <div className="form-group">
              <label className="form-label">Seleccioná el estudiante que se da de baja</label>
              <div className="inscriptos-list">
                {getInscriptos(selectedMateria?.id).length === 0 ? (
                  <p className="form-hint error">No hay estudiantes inscriptos en esta materia.</p>
                ) : (
                  getInscriptos(selectedMateria?.id).map(insc => {
                    const est = getEstudiante(insc.estudianteId)
                    const selected = bajaLegajo === insc.estudianteId
                    return (
                      <div
                        key={insc.id}
                        className={`inscripto-row ${selected ? 'inscripto-selected' : ''}`}
                        onClick={() => setBajaLegajo(insc.estudianteId)}
                      >
                        <div className="inscripto-info">
                          <span className="inscripto-nombre">{est?.nombre || insc.estudianteId}</span>
                          <span className="inscripto-legajo">Legajo: {insc.estudianteId}</span>
                        </div>
                        {selected && <span className="inscripto-check">✓</span>}
                      </div>
                    )
                  })
                )}
              </div>
            </div>

            {bajaError && <p className="form-error">{bajaError}</p>}

            <div className="modal-actions">
              <button
                className="btn btn-primary"
                onClick={handleRegistrarBaja}
                disabled={!bajaLegajo}
              >
                Confirmar baja
              </button>
              <button className="btn btn-ghost" onClick={() => setBajaModal(false)}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
