import { useState } from 'react'
import { useApp } from '../context/AppContext'

export default function Onboarding() {
  const { usuario, actualizarPerfil } = useApp()
  const [formData, setFormData] = useState({
    carrera: usuario?.carrera || '',
    anosCarrera: '1',
    materiasCursadas: '0',
    tipoEstudiante: 'regular',
    turnoPreferido: 'mañana',
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 300))
    actualizarPerfil(formData)
    setLoading(false)
  }

  return (
    <div className="onboarding-page">
      <div className="onboarding-card">
        <div className="onboarding-header">
          <span className="onboarding-logo">🎓</span>
          <h1 className="onboarding-title">Completa tu Perfil</h1>
          <p className="onboarding-subtitle">Esto nos ayuda a recomendarte materias y posicionarte mejor en listas de espera</p>
        </div>

        <form className="onboarding-form" onSubmit={handleSubmit}>

          <div className="form-group">
            <label className="form-label">¿Qué carrera cursas?</label>
            <select
              className="form-input form-select"
              value={formData.carrera}
              onChange={e => handleChange('carrera', e.target.value)}
              required
            >
              <option value="">Selecciona tu carrera</option>
              <option value="DEIS">Diseño de Imagen y Sonido</option>
              <option value="DG">Diseño Gráfico</option>
              <option value="ARQ">Arquitectura</option>
              <option value="DA">Diseño de Ambientes</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">¿Cuántos años llevas en la carrera?</label>
            <select
              className="form-input form-select"
              value={formData.anosCarrera}
              onChange={e => handleChange('anosCarrera', e.target.value)}
            >
              <option value="1">1 año</option>
              <option value="2">2 años</option>
              <option value="3">3 años</option>
              <option value="4">4 años</option>
              <option value="5">5 años o más</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">¿Cuántas materias ya cursaste?</label>
            <select
              className="form-input form-select"
              value={formData.materiasCursadas}
              onChange={e => handleChange('materiasCursadas', e.target.value)}
            >
              <option value="0">0% - Todavía no</option>
              <option value="3">25% - Algunas</option>
              <option value="6">50% - Mitad</option>
              <option value="9">75% - Muchas</option>
              <option value="12">90% - Casi todas</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">¿Qué tipo de estudiante sos?</label>
            <div className="radio-group">
              {[
                { value: 'regular', label: 'Regular (sin trabajo)' },
                { value: 'trabajador', label: 'Trabajador' },
                { value: 'otros', label: 'Otros' }
              ].map(opt => (
                <label key={opt.value} className="radio-label">
                  <input
                    type="radio"
                    name="tipoEstudiante"
                    value={opt.value}
                    checked={formData.tipoEstudiante === opt.value}
                    onChange={e => handleChange('tipoEstudiante', e.target.value)}
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">¿Qué turno preferís?</label>
            <div className="radio-group">
              {[
                { value: 'mañana', label: 'Mañana' },
                { value: 'tarde', label: 'Tarde' },
                { value: 'noche', label: 'Noche' }
              ].map(opt => (
                <label key={opt.value} className="radio-label">
                  <input
                    type="radio"
                    name="turnoPreferido"
                    value={opt.value}
                    checked={formData.turnoPreferido === opt.value}
                    onChange={e => handleChange('turnoPreferido', e.target.value)}
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full btn-lg"
            disabled={loading || !formData.carrera}
          >
            {loading ? 'Guardando...' : 'Aceptar'}
          </button>
        </form>
      </div>
    </div>
  )
}
