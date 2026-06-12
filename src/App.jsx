import { useState } from 'react'
import { AppProvider, useApp } from './context/AppContext'
import LoginPage from './components/LoginPage'
import Onboarding from './components/Onboarding'
import AppBar from './components/AppBar'
import ToastContainer from './components/ToastContainer'
import NotificationModal from './components/student/NotificationModal'

// Vistas estudiante
import MisMaterias from './components/student/MisMaterias'
import EnEspera from './components/student/EnEspera'
import MiHistorial from './components/student/MiHistorial'

// Vistas admin
import Dashboard from './components/admin/Dashboard'
import ListasEspera from './components/admin/ListasEspera'
import HistorialAdmin from './components/admin/HistorialAdmin'

function AppInner() {
  const { usuario, notificaciones } = useApp()
  const [activeTab, setActiveTab] = useState(
    usuario?.rol === 'admin' ? 'dashboard' : 'materias'
  )

  if (!usuario) return <LoginPage />

  // Mostrar onboarding si estudiante no completó perfil
  if (usuario.rol !== 'admin' && !usuario.perfil) return <Onboarding />

  // Notificación pendiente para este estudiante — se muestra en cualquier pestaña
  const notifPendiente = usuario.rol !== 'admin' && notificaciones.find(
    n => n.estudianteId === usuario.legajo && n.estado === 'pendiente'
  )

  const renderView = () => {
    if (usuario.rol === 'admin') {
      switch (activeTab) {
        case 'dashboard': return <Dashboard />
        case 'listas':    return <ListasEspera />
        case 'historial': return <HistorialAdmin />
        default:          return <Dashboard />
      }
    } else {
      switch (activeTab) {
        case 'materias':  return <MisMaterias />
        case 'espera':    return <EnEspera />
        case 'historial': return <MiHistorial />
        default:          return <MisMaterias />
      }
    }
  }

  return (
    <div className="app-layout">
      <AppBar activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="app-content">
        {renderView()}
      </main>

      {/* Modal de vacante disponible — aparece sobre cualquier vista */}
      {notifPendiente && <NotificationModal />}

      <ToastContainer />
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  )
}
