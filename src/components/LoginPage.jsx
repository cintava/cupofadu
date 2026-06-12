import { useState } from 'react'
import { useApp } from '../context/AppContext'

export default function LoginPage() {
  const { login } = useApp()
  const [legajo, setLegajo] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    // Simular pequeña latencia
    await new Promise(r => setTimeout(r, 400))
    const result = login(legajo.trim(), password.trim())
    if (!result.ok) setError(result.error)
    setLoading(false)
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">
            <span className="login-logo-icon">🎓</span>
          </div>
          <h1 className="login-title">VacanteFADU</h1>
          <p className="login-subtitle">Sistema de Lista de Espera</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="dni" className="form-label">DNI</label>
            <input
              id="dni"
              type="text"
              className="form-input"
              placeholder="ej. 12345"
              value={legajo}
              onChange={e => setLegajo(e.target.value)}
              autoComplete="username"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">Contraseña</label>
            <input
              id="password"
              type="password"
              className="form-input"
              placeholder="Tu contraseña"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          {error && <p className="form-error">{error}</p>}

          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>

        <div className="login-demo">
          <p className="login-demo-title">DNI de prueba:</p>
          <div className="login-demo-users">
            {[
              { dni: '12345', nombre: 'Cintia' },
              { dni: '67890', nombre: 'Tomás' },
              { dni: '11111', nombre: 'Valentina' },
              { dni: '22222', nombre: 'Matías' },
              { dni: '33333', nombre: 'Lucía' },
              { dni: '44444', nombre: 'Bruno' },
              { dni: '55555', nombre: 'Agustina' },
            ].map(u => (
              <span
                key={u.dni}
                className="demo-chip"
                onClick={() => { setLegajo(u.dni); setPassword(u.dni) }}
              >
                {u.nombre}
              </span>
            ))}
            <span
              className="demo-chip demo-chip-admin"
              onClick={() => { setLegajo('admin'); setPassword('admin') }}
            >
              Admin
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
