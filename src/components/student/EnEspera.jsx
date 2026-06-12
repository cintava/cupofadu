import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import ChatAlumnos from '../ChatAlumnos'
import EncontraAula from '../EncontraAula'
import Calendario from '../Calendario'
import StudentFooter from './StudentFooter'

export default function EnEspera() {
  const { usuario, materias, inscripciones, notificaciones } = useApp()
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

  // Inscripciones en espera
  const enEspera = inscripciones
    .filter(i => i.estudianteId === usuario.legajo && i.estado === 'espera')
    .sort((a, b) => a.posicion - b.posicion)

  // Inscripciones rechazadas (historial personal)
  const rechazadas = inscripciones
    .filter(i => i.estudianteId === usuario.legajo && i.estado === 'rechazado')

  const materiaById = (id) => materias.find(m => m.id === id)

  const formatFecha = (iso) => new Date(iso).toLocaleDateString('es-AR', {
    day: '2-digit', month: 'short', year: 'numeric'
  })

  return (
    <div className="view-container">
      <h2 className="view-title">Mis Listas de Espera</h2>

      {enEspera.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">⏳</span>
          <p>No estás en ninguna lista de espera.</p>
          <p className="empty-hint">Podés anotarte en materias llenas desde "Mis Materias".</p>
        </div>
      ) : (
        <div className="cards-grid">
          {enEspera.map(insc => {
            const materia = materiaById(insc.materiaId)
            if (!materia) return null

            // Cuántas personas hay en total en espera para esta materia
            const totalEnEspera = inscripciones.filter(
              i => i.materiaId === insc.materiaId && i.estado === 'espera'
            ).length

            const adelante = insc.posicion - 1

            return (
              <div key={insc.id} className="card card-espera">
                <div className="card-header">
                  <div>
                    <h3 className="card-title">{materia.nombre}</h3>
                    <p className="card-subtitle">Comisión {materia.comision} · Año {materia.año}</p>
                  </div>
                  <div className="posicion-badge">
                    <span className="posicion-numero"># {insc.posicion}</span>
                    <span className="posicion-label">en lista</span>
                  </div>
                </div>

                <div className="card-body">
                  <p className="card-detail">👩‍🏫 {materia.docente}</p>

                  <div className="espera-stats">
                    <div className="espera-stat">
                      <span className="stat-value">{adelante}</span>
                      <span className="stat-label">
                        {adelante === 1 ? 'persona adelante' : 'personas adelante'}
                      </span>
                    </div>
                    <div className="espera-stat">
                      <span className="stat-value">{totalEnEspera}</span>
                      <span className="stat-label">total en espera</span>
                    </div>
                    <div className="espera-stat">
                      <span className="stat-value">{materia.cupo}</span>
                      <span className="stat-label">cupo total</span>
                    </div>
                  </div>

                  {/* Visualización de posición en cola */}
                  <div className="cola-visual">
                    {Array.from({ length: Math.min(totalEnEspera, 8) }).map((_, idx) => (
                      <div
                        key={idx}
                        className={`cola-dot ${idx < insc.posicion - 1 ? 'dot-adelante' : idx === insc.posicion - 1 ? 'dot-yo' : 'dot-atras'}`}
                        title={idx === insc.posicion - 1 ? 'Vos' : idx < insc.posicion - 1 ? 'Adelante' : 'Atrás'}
                      />
                    ))}
                    {totalEnEspera > 8 && <span className="cola-mas">+{totalEnEspera - 8}</span>}
                  </div>

                  <p className="card-detail-sm">Anotado el {formatFecha(insc.timestamp)}</p>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Rechazadas */}
      {rechazadas.length > 0 && (
        <>
          <h2 className="view-title mt-lg">Vacantes Rechazadas</h2>
          <div className="cards-grid">
            {rechazadas.map(insc => {
              const materia = materiaById(insc.materiaId)
              if (!materia) return null
              return (
                <div key={insc.id} className="card card-rechazada">
                  <div className="card-header">
                    <div>
                      <h3 className="card-title">{materia.nombre}</h3>
                      <p className="card-subtitle">Comisión {materia.comision}</p>
                    </div>
                    <span className="badge badge-danger">Rechazada</span>
                  </div>
                  <p className="card-detail-sm">Rechazaste esta vacante y saliste de la lista.</p>
                </div>
              )
            })}
          </div>
        </>
      )}

      <StudentFooter
        onCalendarioClick={() => setMostrarCalendario(true)}
        onChatClick={() => setMostrarChat(true)}
        onAulaClick={() => setMostrarAula(true)}
      />
    </div>
  )
}
