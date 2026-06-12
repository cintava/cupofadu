import { useState } from 'react'

const CHATS_MOCK = [
  {
    id: 1,
    carrera: 'DEIS',
    catedra: 'A',
    comision: 'Lunes 14:00',
    materia: 'Dirección de Cámara',
    mensajes: [
      {
        id: 1,
        autor: 'María García',
        contenido: 'Muy buena cátedra, la profe explica muy bien',
        referencias: 2,
        comentarios: [
          { id: 1, autor: 'Juan', texto: 'Totalmente de acuerdo' }
        ]
      },
      {
        id: 2,
        autor: 'Carlos López',
        contenido: 'El examen final es difícil, studiá bien',
        referencias: 5,
        comentarios: [
          { id: 1, autor: 'Ana', texto: 'Confirmo, muy exigente' }
        ]
      }
    ]
  }
]

export default function ChatAlumnos({ onClose }) {
  const [step, setStep] = useState('carrera') // carrera, catedra, comision, chat
  const [filtros, setFiltros] = useState({
    carrera: '',
    catedra: '',
    comision: ''
  })
  const [nuevoMensaje, setNuevoMensaje] = useState('')
  const [chatSeleccionado, setChatSeleccionado] = useState(null)

  const handleSeleccionarCarrera = (carrera) => {
    setFiltros(prev => ({ ...prev, carrera }))
    setStep('catedra')
  }

  const handleSeleccionarCatedra = (catedra) => {
    setFiltros(prev => ({ ...prev, catedra }))
    setStep('comision')
  }

  const handleSeleccionarComision = (comision) => {
    setFiltros(prev => ({ ...prev, comision }))
    const chat = CHATS_MOCK.find(c =>
      c.carrera === filtros.carrera &&
      c.catedra === filtros.catedra &&
      c.comision === comision
    )
    if (chat) {
      setChatSeleccionado(chat)
      setStep('chat')
    }
  }

  const handleEnviarMensaje = () => {
    if (nuevoMensaje.trim()) {
      // En una app real, esto se enviaría a un backend
      setNuevoMensaje('')
    }
  }

  if (step === 'carrera') {
    return (
      <div className="chat-overlay" onClick={onClose}>
        <div className="chat-modal" onClick={e => e.stopPropagation()}>
          <div className="chat-header">
            <button className="btn btn-ghost btn-sm" onClick={onClose}>← Volver</button>
            <h2>Chat de Alumnos</h2>
          </div>
          <div className="chat-body">
            <h3 className="chat-step-title">Selecciona tu carrera</h3>
            <div className="chat-options">
              {['DEIS', 'DG', 'ARQ'].map(car => (
                <button
                  key={car}
                  className="chat-option-btn"
                  onClick={() => handleSeleccionarCarrera(car)}
                >
                  {car}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (step === 'catedra') {
    return (
      <div className="chat-overlay" onClick={onClose}>
        <div className="chat-modal" onClick={e => e.stopPropagation()}>
          <div className="chat-header">
            <button className="btn btn-ghost btn-sm" onClick={() => setStep('carrera')}>← Atrás</button>
            <h2>Selecciona Cátedra</h2>
          </div>
          <div className="chat-body">
            <p className="chat-breadcrumb">{filtros.carrera}</p>
            <div className="chat-options">
              {['A', 'B', 'C'].map(cat => (
                <button
                  key={cat}
                  className="chat-option-btn"
                  onClick={() => handleSeleccionarCatedra(cat)}
                >
                  Cátedra {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (step === 'comision') {
    return (
      <div className="chat-overlay" onClick={onClose}>
        <div className="chat-modal" onClick={e => e.stopPropagation()}>
          <div className="chat-header">
            <button className="btn btn-ghost btn-sm" onClick={() => setStep('catedra')}>← Atrás</button>
            <h2>Selecciona Comisión</h2>
          </div>
          <div className="chat-body">
            <p className="chat-breadcrumb">{filtros.carrera} • Cátedra {filtros.catedra}</p>
            <div className="chat-options">
              {['Lunes 14:00', 'Martes 09:00', 'Jueves 19:00'].map(com => (
                <button
                  key={com}
                  className="chat-option-btn"
                  onClick={() => handleSeleccionarComision(com)}
                >
                  {com}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="chat-overlay" onClick={onClose}>
      <div className="chat-modal chat-messages-modal" onClick={e => e.stopPropagation()}>
        <div className="chat-header">
          <button className="btn btn-ghost btn-sm" onClick={() => setStep('comision')}>← Atrás</button>
          <div>
            <h2>{chatSeleccionado?.materia}</h2>
            <p className="chat-meta">
              {filtros.carrera} • Cátedra {filtros.catedra} • {filtros.comision}
            </p>
          </div>
        </div>

        <div className="chat-messages">
          {chatSeleccionado?.mensajes.map(msg => (
            <div key={msg.id} className="chat-message">
              <div className="chat-message-header">
                <span className="chat-autor">{msg.autor}</span>
              </div>
              <p className="chat-contenido">{msg.contenido}</p>
              <div className="chat-message-footer">
                <button className="chat-ref-btn">
                  👍 {msg.referencias} referencias
                </button>
                <button className="chat-comment-btn">
                  💬 {msg.comentarios.length} comentarios
                </button>
              </div>
              {msg.comentarios.length > 0 && (
                <div className="chat-comentarios">
                  {msg.comentarios.map(com => (
                    <div key={com.id} className="chat-comentario">
                      <span className="chat-comment-autor">{com.autor}:</span>
                      <span>{com.texto}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="chat-input-area">
          <textarea
            className="chat-input"
            placeholder="Comparte tu opinión..."
            value={nuevoMensaje}
            onChange={e => setNuevoMensaje(e.target.value)}
            rows="3"
          />
          <button
            className="btn btn-primary btn-full"
            onClick={handleEnviarMensaje}
            disabled={!nuevoMensaje.trim()}
          >
            Publicar opinión
          </button>
        </div>
      </div>
    </div>
  )
}
