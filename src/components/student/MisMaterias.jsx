import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import BuscarMateria from '../BuscarMateria'
import DetalleMateria from '../DetalleMateria'
import ChatAlumnos from '../ChatAlumnos'
import EncontraAula from '../EncontraAula'
import Calendario from '../Calendario'
import StudentFooter from './StudentFooter'

export default function MisMaterias() {
  const { usuario, materias, inscripciones, inscribirseDirecto, inscribirseEnEspera, registrarBaja } = useApp()
  const [confirmBaja, setConfirmBaja] = useState(null)
  const [mostrarBuscar, setMostrarBuscar] = useState(false)
  const [detalleMateria, setDetalleMateria] = useState(null)
  const [mostrarChat, setMostrarChat] = useState(false)
  const [mostrarAula, setMostrarAula] = useState(false)
  const [mostrarCalendario, setMostrarCalendario] = useState(false)

  const miEstado = (materiaId) =>
    inscripciones.find(
      i => i.estudianteId === usuario.legajo && i.materiaId === materiaId
        && ['inscripto', 'espera'].includes(i.estado)
    ) || null

  const handleDarseDeBaja = () => {
    registrarBaja(usuario.legajo, confirmBaja.materiaId)
    setConfirmBaja(null)
  }

  if (mostrarBuscar) {
    return <BuscarMateria onClose={() => setMostrarBuscar(false)} />
  }

  if (detalleMateria) {
    return <DetalleMateria materiaId={detalleMateria} onClose={() => setDetalleMateria(null)} />
  }

  if (mostrarChat) {
    return <ChatAlumnos onClose={() => setMostrarChat(false)} />
  }

  if (mostrarAula) {
    return <EncontraAula onClose={() => setMostrarAula(false)} />
  }

  if (mostrarCalendario) {
    return <Calendario onClose={() => setMostrarCalendario(false)} />
  }

  return (
    <div className="view-container">

      {/* Header con score */}
      <div className="mis-materias-header">
        <div className="header-dni">DNI {usuario?.legajo}</div>
        <div className="header-score">
          <div className="score-badge">
            <span className="score-valor">{usuario?.score || 0}</span>
            <span className="score-label">score %</span>
          </div>
        </div>
      </div>

      <h2 className="view-title">Mis Materias</h2>
      <p className="view-subtitle">
        Inscribite si hay lugar, anotate en lista de espera si está llena, o date de baja si ya estás inscripto.
      </p>

      <div className="materias-list">
        {materias.map(materia => {
          const insc = miEstado(materia.id)
          const llena = materia.inscriptos >= materia.cupo
          const libres = materia.cupo - materia.inscriptos
          const enEsperaTotal = inscripciones.filter(i => i.materiaId === materia.id && i.estado === 'espera').length
          const ocupacion = Math.round((materia.inscriptos / materia.cupo) * 100)

          return (
            <div key={materia.id} className={`materia-row ${insc ? 'materia-row-activa' : ''}`}>
              <div className="materia-row-info">
                <div className="materia-row-top">
                  <h3 className="materia-row-nombre">{materia.nombre}</h3>
                  {insc?.estado === 'inscripto' && <span className="badge badge-success">Inscripto</span>}
                  {insc?.estado === 'espera'    && <span className="badge badge-warning">En espera #{insc.posicion}</span>}
                </div>

                <p className="materia-row-meta">
                  👩‍🏫 {materia.docente} &nbsp;·&nbsp; {materia.año}° año &nbsp;·&nbsp; Com. {materia.comision}
                </p>

                <div className="cupo-bar-wrap">
                  <div className="cupo-bar-labels">
                    <span className={llena ? 'text-danger' : 'text-success'}>
                      {llena
                        ? `Llena · ${enEsperaTotal > 0 ? `${enEsperaTotal} en espera` : 'sin lista de espera'}`
                        : `${libres} lugar${libres > 1 ? 'es' : ''} disponible${libres > 1 ? 's' : ''}`}
                    </span>
                    <span>{materia.inscriptos}/{materia.cupo}</span>
                  </div>
                  <div className="cupo-bar">
                    <div
                      className={`cupo-bar-fill ${ocupacion >= 100 ? 'bar-red' : ocupacion >= 75 ? 'bar-yellow' : 'bar-green'}`}
                      style={{ width: `${Math.min(ocupacion, 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="materia-row-action">
                {/* Sin inscripción → inscribirse o anotarse en lista */}
                {!insc && !llena && (
                  <button className="btn btn-primary btn-sm" onClick={() => inscribirseDirecto(usuario.legajo, materia.id)}>
                    Inscribirme
                  </button>
                )}
                {!insc && llena && (
                  <button className="btn btn-outline btn-sm" onClick={() => inscribirseEnEspera(usuario.legajo, materia.id)}>
                    Anotarme en lista
                  </button>
                )}

                {/* Ya inscripto → mostrar baja */}
                {insc?.estado === 'inscripto' && (
                  <button
                    className="btn btn-baja btn-sm"
                    onClick={() => setConfirmBaja({ materiaId: materia.id, materiaNombre: materia.nombre })}
                  >
                    Darme de baja
                  </button>
                )}

                {/* En espera → mostrar posición + opción de salir de la lista */}
                {insc?.estado === 'espera' && (
                  <div className="espera-actions">
                    <span className="accion-label text-warning">⏳ Posición #{insc.posicion}</span>
                    <button
                      className="btn btn-ghost btn-sm baja-espera"
                      onClick={() => setConfirmBaja({ materiaId: materia.id, materiaNombre: materia.nombre, esEspera: true })}
                    >
                      Salir de la lista
                    </button>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* FAB Button */}
      <button
        className="fab-button"
        onClick={() => setMostrarBuscar(true)}
        title="Buscar materia"
      >
        +
      </button>

      {/* Footer Actions */}
      <StudentFooter
        onCalendarioClick={() => setMostrarCalendario(true)}
        onChatClick={() => setMostrarChat(true)}
        onAulaClick={() => setMostrarAula(true)}
      />

      {/* Modal de confirmación de baja */}
      {confirmBaja && (
        <div className="modal-overlay" onClick={() => setConfirmBaja(null)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <div className="modal-icon-wrap">
              <span style={{ fontSize: '2rem' }}>⚠️</span>
            </div>
            <h3 className="modal-title">
              {confirmBaja.esEspera ? 'Salir de la lista de espera' : 'Confirmar baja'}
            </h3>
            <p className="modal-subtitle">
              {confirmBaja.esEspera
                ? <>¿Salís de la lista de espera de <strong>{confirmBaja.materiaNombre}</strong>? Perdés tu posición.</>
                : <>¿Confirmás la baja de <strong>{confirmBaja.materiaNombre}</strong>? Si hay alumnos en lista de espera, se les notificará automáticamente.</>
              }
            </p>

            {!confirmBaja.esEspera && (
              <div className="baja-aviso">
                <span>🔔</span>
                <span>El siguiente alumno en la lista de espera recibirá una notificación al instante.</span>
              </div>
            )}

            <div className="modal-actions">
              <button className="btn btn-danger" onClick={handleDarseDeBaja}>
                {confirmBaja.esEspera ? 'Sí, salir de la lista' : 'Sí, darme de baja'}
              </button>
              <button className="btn btn-ghost" onClick={() => setConfirmBaja(null)}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
