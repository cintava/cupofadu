import { useApp } from '../context/AppContext'

export default function AppBar({ activeTab, onTabChange }) {
  const { usuario, notificaciones, logout, resetearDatos } = useApp()

  const pendientes = notificaciones.filter(
    n => n.estudianteId === usuario?.legajo && n.estado === 'pendiente'
  ).length

  const tabs = usuario?.rol === 'admin'
    ? [
        { id: 'dashboard', label: 'Dashboard', icon: '📊' },
        { id: 'listas', label: 'Listas de Espera', icon: '📋' },
        { id: 'historial', label: 'Historial', icon: '🕐' },
      ]
    : [
        { id: 'materias', label: 'Mis Materias', icon: '📚' },
        { id: 'espera', label: 'En Espera', icon: '⏳', badge: pendientes },
        { id: 'historial', label: 'Mi Historial', icon: '🕐' },
      ]

  return (
    <>
      {/* Top bar */}
      <header className="appbar">
        <div className="appbar-brand">
          <span className="appbar-logo">🎓</span>
          <span className="appbar-title">CupoFADU</span>
        </div>
        <div className="appbar-user">
          <div className="appbar-user-info">
            {usuario?.rol === 'admin' ? (
              <>
                <span className="appbar-user-name">Administrador</span>
              </>
            ) : (
              <span className="appbar-user-name">Legajo: {usuario?.legajo}</span>
            )}
          </div>
          <div className="appbar-actions">
            {/* Solo mostrar reset en dev/demo */}
            <button
              className="btn btn-ghost btn-sm"
              onClick={resetearDatos}
              title="Resetear datos demo"
            >
              ↺
            </button>
            <button className="btn btn-ghost btn-sm" onClick={logout}>
              Salir
            </button>
          </div>
        </div>
      </header>

      {/* Tab bar */}
      <nav className="tabbar">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab-item ${activeTab === tab.id ? 'tab-active' : ''}`}
            onClick={() => onTabChange(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
            {tab.badge > 0 && (
              <span className="tab-badge">{tab.badge}</span>
            )}
          </button>
        ))}
      </nav>
    </>
  )
}
