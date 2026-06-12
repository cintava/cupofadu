import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { INITIAL_ESTUDIANTES } from '../data/mockData'

export default function BuscarMateria({ onClose }) {
  const { materias, inscripciones, usuario, inscribirseDirecto, inscribirseEnEspera } = useApp()
  const [filtros, setFiltros] = useState({
    carrera: usuario?.perfil?.carrera || '',
    materia: '',
    catedra: '',
    turno: ''
  })

  const resultados = materias.filter(m => {
    if (filtros.materia && !m.nombre.toLowerCase().includes(filtros.materia.toLowerCase())) return false
    return true
  }).map(m => {
    const enEspera = inscripciones.filter(i => i.materiaId === m.id && i.estado === 'espera')
    const yaInscripto = inscripciones.find(
      i => i.estudianteId === usuario.legajo && i.materiaId === m.id && ['inscripto', 'espera'].includes(i.estado)
    )
    const llena = m.inscriptos >= m.cupo
    return { ...m, enEspera: enEspera.length, yaInscripto, llena }
  })

  const handleInscribir = (materiaId) => {
    const materia = materias.find(m => m.id === materiaId)
    if (materia.inscriptos >= materia.cupo) {
      inscribirseEnEspera(usuario.legajo, materiaId)
    } else {
      inscribirseDirecto(usuario.legajo, materiaId)
    }
  }

  return (
    <div className="buscar-page">
      <div className="buscar-header">
        <button className="btn btn-ghost btn-sm" onClick={onClose}>← Volver</button>
        <h2 className="buscar-title">Buscar Materia</h2>
      </div>

      <div className="view-container">
        <div className="buscar-filtros">
          <div className="form-group">
            <label className="form-label">Carrera</label>
            <select
              className="form-input form-select"
              value={filtros.carrera}
              onChange={e => setFiltros(prev => ({ ...prev, carrera: e.target.value }))}
            >
              <option value="">Todas</option>
              <option value="DEIS">Diseño de Imagen y Sonido</option>
              <option value="DG">Diseño Gráfico</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">¿Qué materia buscás?</label>
            <input
              type="text"
              className="form-input"
              placeholder="Ej: Dirección de Cámara"
              value={filtros.materia}
              onChange={e => setFiltros(prev => ({ ...prev, materia: e.target.value }))}
            />
          </div>

          <div className="form-group">
            <label className="form-label">¿Qué cátedra?</label>
            <select className="form-input form-select">
              <option value="">Todas</option>
              <option value="A">Cátedra A</option>
              <option value="B">Cátedra B</option>
              <option value="C">Cátedra C</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">¿Qué turno?</label>
            <select
              className="form-input form-select"
              value={filtros.turno}
              onChange={e => setFiltros(prev => ({ ...prev, turno: e.target.value }))}
            >
              <option value="">Cualquiera</option>
              <option value="mañana">Mañana</option>
              <option value="tarde">Tarde</option>
              <option value="noche">Noche</option>
            </select>
          </div>
        </div>

        <h3 className="buscar-results-title">Resultados</h3>

        <div className="buscar-resultados">
          {resultados.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">🔍</span>
              <p>No se encontraron materias con esos filtros.</p>
            </div>
          ) : (
            resultados.map(materia => (
              <div key={materia.id} className={`materia-card ${materia.llena ? 'materia-llena' : 'materia-disponible'}`}>
                <div className="materia-card-header">
                  <div>
                    <h4 className="materia-card-title">{materia.nombre}</h4>
                    <p className="materia-card-meta">
                      Cátedra {materia.comision} • {materia.año}° año
                    </p>
                  </div>
                  <span className={`badge ${materia.llena ? 'badge-danger' : 'badge-success'}`}>
                    {materia.llena ? 'LLENO' : `${materia.cupo - materia.inscriptos} disponibles`}
                  </span>
                </div>

                <div className="materia-card-body">
                  <p className="materia-card-docente">📍 {materia.docente}</p>
                  <p className="materia-card-cupo">
                    Cupo: {materia.inscriptos}/{materia.cupo}
                  </p>

                  {materia.enEspera > 0 && (
                    <p className="materia-card-espera">
                      En espera: <strong>{materia.enEspera} personas</strong>
                    </p>
                  )}
                </div>

                <div className="materia-card-actions">
                  {materia.yaInscripto ? (
                    <button className="btn btn-ghost btn-sm" disabled>
                      Ya inscripto/en espera
                    </button>
                  ) : (
                    <>
                      {materia.llena ? (
                        <button
                          className="btn btn-outline btn-sm"
                          onClick={() => handleInscribir(materia.id)}
                        >
                          Anotarme en lista
                        </button>
                      ) : (
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => handleInscribir(materia.id)}
                        >
                          Inscribirme
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
