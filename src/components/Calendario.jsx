import { useState } from 'react'

const EVENTOS = [
  {
    id: 1,
    fecha: '2026-07-15',
    tipo: 'examen',
    titulo: 'Examen Final - Dirección de Cámara',
    descripcion: 'Examen presencial en Pab. X, Aula 204',
    hora: '14:00'
  },
  {
    id: 2,
    fecha: '2026-07-20',
    tipo: 'inscripcion',
    titulo: 'Cierre de Inscripciones 2do Cuatrimestre',
    descripcion: 'Última fecha para inscribirse en materias',
    hora: '23:59'
  },
  {
    id: 3,
    fecha: '2026-08-01',
    tipo: 'inicio',
    titulo: 'Inicio 2do Cuatrimestre',
    descripcion: 'Comienza el segundo cuatrimestre del año',
    hora: '09:00'
  },
  {
    id: 4,
    fecha: '2026-07-25',
    tipo: 'examen',
    titulo: 'Examen - Edición Digital',
    descripcion: 'Examen presencial',
    hora: '09:00'
  },
  {
    id: 5,
    fecha: '2026-08-10',
    tipo: 'otro',
    titulo: 'Defensa de Trabajos Finales',
    descripcion: 'Presentación de trabajos prácticos',
    hora: '10:00'
  },
  {
    id: 6,
    fecha: '2026-07-30',
    tipo: 'feriado',
    titulo: 'Receso de Invierno',
    descripcion: 'Período de descanso académico',
    hora: '00:00'
  }
]

const TIPO_CONFIG = {
  examen: { label: 'Examen', icon: '📝', color: 'calendario-examen' },
  inscripcion: { label: 'Inscripción', icon: '📋', color: 'calendario-inscripcion' },
  inicio: { label: 'Inicio', icon: '🎓', color: 'calendario-inicio' },
  feriado: { label: 'Feriado', icon: '🏫', color: 'calendario-feriado' },
  otro: { label: 'Evento', icon: '📌', color: 'calendario-otro' }
}

export default function Calendario({ onClose }) {
  const [mesActual, setMesActual] = useState(new Date(2026, 6)) // Julio 2026
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null)

  const getDiasEnMes = (fecha) => {
    return new Date(fecha.getFullYear(), fecha.getMonth() + 1, 0).getDate()
  }

  const getPrimerDia = (fecha) => {
    return new Date(fecha.getFullYear(), fecha.getMonth(), 1).getDay()
  }

  const irAlMesAnterior = () => {
    setMesActual(new Date(mesActual.getFullYear(), mesActual.getMonth() - 1))
  }

  const irAlProxMes = () => {
    setMesActual(new Date(mesActual.getFullYear(), mesActual.getMonth() + 1))
  }

  const getEventosDelDia = (dia) => {
    const fechaStr = `${mesActual.getFullYear()}-${String(mesActual.getMonth() + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`
    return EVENTOS.filter(e => e.fecha === fechaStr)
  }

  const diasMes = getDiasEnMes(mesActual)
  const primerDia = getPrimerDia(mesActual)
  const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
  const diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

  return (
    <div className="calendario-overlay" onClick={onClose}>
      <div className="calendario-modal" onClick={e => e.stopPropagation()}>
        <div className="calendario-header">
          <button className="btn btn-ghost btn-sm" onClick={onClose}>← Volver</button>
          <h2>Calendario Académico</h2>
        </div>

        <div className="calendario-body">
          {/* Calendario Grid */}
          <div className="calendario-container">
            <div className="calendario-card">
              {/* Navegación mes */}
              <div className="calendario-nav">
                <button className="btn btn-ghost btn-sm" onClick={irAlMesAnterior}>←</button>
                <h3 className="calendario-mes-titulo">
                  {meses[mesActual.getMonth()]} {mesActual.getFullYear()}
                </h3>
                <button className="btn btn-ghost btn-sm" onClick={irAlProxMes}>→</button>
              </div>

              {/* Días de la semana */}
              <div className="calendario-semana-header">
                {diasSemana.map(dia => (
                  <div key={dia} className="calendario-dia-semana">
                    {dia}
                  </div>
                ))}
              </div>

              {/* Días del mes */}
              <div className="calendario-grid">
                {/* Espacios vacíos antes del primer día */}
                {Array.from({ length: primerDia }).map((_, i) => (
                  <div key={`empty-${i}`} className="calendario-dia-vacio" />
                ))}

                {/* Días del mes */}
                {Array.from({ length: diasMes }).map((_, i) => {
                  const dia = i + 1
                  const eventosHoy = getEventosDelDia(dia)
                  return (
                    <div
                      key={dia}
                      className={`calendario-dia ${eventosHoy.length > 0 ? 'calendario-dia-evento' : ''}`}
                      onClick={() => eventosHoy.length > 0 && setEventoSeleccionado(eventosHoy[0])}
                    >
                      <span className="calendario-dia-numero">{dia}</span>
                      {eventosHoy.length > 0 && (
                        <div className="calendario-dia-dots">
                          {eventosHoy.map(evt => (
                            <span
                              key={evt.id}
                              className={`calendario-dot ${TIPO_CONFIG[evt.tipo].color}`}
                              title={evt.titulo}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Leyenda */}
              <div className="calendario-leyenda">
                {Object.entries(TIPO_CONFIG).map(([tipo, config]) => (
                  <div key={tipo} className="calendario-leyenda-item">
                    <span className={`calendario-leyenda-dot ${config.color}`} />
                    <span>{config.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Próximos Eventos */}
            <div className="calendario-eventos-card">
              <h3 className="calendario-eventos-titulo">Próximos Eventos</h3>

              <div className="calendario-eventos-list">
                {EVENTOS
                  .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
                  .slice(0, 6)
                  .map(evento => {
                    const config = TIPO_CONFIG[evento.tipo]
                    const fecha = new Date(evento.fecha)
                    return (
                      <div
                        key={evento.id}
                        className={`calendario-evento-item ${config.color}`}
                        onClick={() => setEventoSeleccionado(evento)}
                      >
                        <div className="calendario-evento-icon">{config.icon}</div>
                        <div className="calendario-evento-content">
                          <h4 className="calendario-evento-titulo">{evento.titulo}</h4>
                          <p className="calendario-evento-fecha">
                            {new Date(evento.fecha).toLocaleDateString('es-AR', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric'
                            })} a las {evento.hora}
                          </p>
                          <p className="calendario-evento-desc">{evento.descripcion}</p>
                        </div>
                      </div>
                    )
                  })}
              </div>
            </div>
          </div>

          {/* Detalle del Evento Seleccionado */}
          {eventoSeleccionado && (
            <div className="calendario-detalle-overlay" onClick={() => setEventoSeleccionado(null)}>
              <div className="calendario-detalle-modal" onClick={e => e.stopPropagation()}>
                <div className="calendario-detalle-header">
                  <span className="calendario-detalle-icon">
                    {TIPO_CONFIG[eventoSeleccionado.tipo].icon}
                  </span>
                  <h3>{eventoSeleccionado.titulo}</h3>
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => setEventoSeleccionado(null)}
                  >
                    ✕
                  </button>
                </div>

                <div className="calendario-detalle-body">
                  <div className="calendario-detalle-item">
                    <span className="calendario-detalle-label">📅 Fecha:</span>
                    <span>
                      {new Date(eventoSeleccionado.fecha).toLocaleDateString('es-AR', {
                        weekday: 'long',
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </span>
                  </div>

                  <div className="calendario-detalle-item">
                    <span className="calendario-detalle-label">⏰ Hora:</span>
                    <span>{eventoSeleccionado.hora}</span>
                  </div>

                  <div className="calendario-detalle-item">
                    <span className="calendario-detalle-label">📝 Tipo:</span>
                    <span className={`badge ${TIPO_CONFIG[eventoSeleccionado.tipo].color}`}>
                      {TIPO_CONFIG[eventoSeleccionado.tipo].label}
                    </span>
                  </div>

                  <div className="calendario-detalle-item">
                    <span className="calendario-detalle-label">📋 Descripción:</span>
                    <span>{eventoSeleccionado.descripcion}</span>
                  </div>
                </div>

                <div className="calendario-detalle-actions">
                  <button className="btn btn-primary btn-full">
                    Recordarme
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
