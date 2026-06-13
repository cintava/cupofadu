import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import {
  INITIAL_MATERIAS,
  INITIAL_ESTUDIANTES,
  INITIAL_INSCRIPCIONES,
  INITIAL_NOTIFICACIONES,
  INITIAL_HISTORIAL,
} from '../data/mockData'

const AppContext = createContext(null)

// Helpers de localStorage
const load = (key, fallback) => {
  try {
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : fallback
  } catch {
    return fallback
  }
}
const save = (key, value) => localStorage.setItem(key, JSON.stringify(value))

// Cálculo de score para ordenar listas de espera
const calcularScore = (usuario) => {
  if (!usuario?.perfil) return 0
  let score = 0
  // Factor permanencia (años en carrera): 0-30 pts
  score += Math.min((usuario.perfil.anosCarrera || 1) * 10, 30)
  // Materias cursadas: 0-25 pts
  score += Math.min((usuario.perfil.materiasCursadas || 0) * 2.5, 25)
  // Tipo de estudiante: 0-20 pts (regular > trabajador > otros)
  const tipoScore = { regular: 20, trabajador: 10, otros: 5 }
  score += tipoScore[usuario.perfil.tipoEstudiante] || 0
  // Preferencia de turno + bonus (si coincide): 0-25 pts
  score += 15 // base
  return Math.round(score)
}

export function AppProvider({ children }) {
  const [usuario, setUsuario] = useState(() => load('fadu_usuario', null))
  const [materias, setMaterias] = useState(() => load('fadu_materias', INITIAL_MATERIAS))
  const [inscripciones, setInscripciones] = useState(() => load('fadu_inscripciones', INITIAL_INSCRIPCIONES))
  const [notificaciones, setNotificaciones] = useState(() => load('fadu_notificaciones', INITIAL_NOTIFICACIONES))
  const [historial, setHistorial] = useState(() => load('fadu_historial', INITIAL_HISTORIAL))
  const [toasts, setToasts] = useState([])

  // Agregar score del usuario cada vez que cambia el perfil
  const usuarioConScore = usuario ? {
    ...usuario,
    score: calcularScore(usuario)
  } : null

  // Persistir en localStorage ante cada cambio
  useEffect(() => { save('fadu_usuario', usuario) }, [usuario])
  useEffect(() => { save('fadu_materias', materias) }, [materias])
  useEffect(() => { save('fadu_inscripciones', inscripciones) }, [inscripciones])
  useEffect(() => { save('fadu_notificaciones', notificaciones) }, [notificaciones])
  useEffect(() => { save('fadu_historial', historial) }, [historial])

  // ─── Toast ────────────────────────────────────────────────────────────────
  const addToast = useCallback((mensaje, tipo = 'info') => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, mensaje, tipo }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000)
  }, [])

  // ─── Auth ─────────────────────────────────────────────────────────────────
  const login = useCallback((dni, password) => {
    // Buscar por DNI (legajo sirve como DNI en el sistema)
    const estudiante = INITIAL_ESTUDIANTES.find(
      e => e.legajo === dni && e.password === password
    )
    if (!estudiante) return { ok: false, error: 'DNI o contraseña incorrectos' }
    const { password: _, ...datosSeguros } = estudiante
    setUsuario({ ...datosSeguros, rol: estudiante.rol || 'estudiante', perfil: null })
    return { ok: true }
  }, [])

  const logout = useCallback(() => {
    setUsuario(null)
  }, [])

  // ─── Perfil académico ──────────────────────────────────────────────────────
  const actualizarPerfil = useCallback((perfil) => {
    setUsuario(prev => ({
      ...prev,
      perfil: {
        carrera: perfil.carrera,
        anosCarrera: parseInt(perfil.anosCarrera) || 1,
        materiasCursadas: parseInt(perfil.materiasCursadas) || 0,
        tipoEstudiante: perfil.tipoEstudiante || 'regular',
        turnoPreferido: perfil.turnoPreferido || 'mañana',
        completadoEn: new Date().toISOString()
      }
    }))
  }, [])

  // ─── Utilidades internas ──────────────────────────────────────────────────

  /** Siguiente inscripción en lista de espera para una materia, por antigüedad */
  const proximoEnEspera = useCallback((materiaId, excluyeIds = []) => {
    return inscripciones
      .filter(i => i.materiaId === materiaId && i.estado === 'espera' && !excluyeIds.includes(i.id))
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))[0] || null
  }, [inscripciones])

  /** Recalcula posiciones en lista de espera de una materia */
  const recalcularPosiciones = useCallback((updatedList, materiaId, ests = estudiantes) => {
    const enEspera = updatedList.filter(i => i.materiaId === materiaId && i.estado === 'espera')

    // Ordenar por score descendente (mayor score = mejor posición #1)
    const conScore = enEspera.map(insc => ({
      ...insc,
      score: calcularScore(ests.find(e => e.legajo === insc.estudianteId)) || 0
    })).sort((a, b) => b.score - a.score)

    // Asignar nuevas posiciones
    const posicionadas = conScore.map((insc, idx) => ({
      ...insc,
      posicion: idx + 1
    }))

    // Reemplazar en la lista original
    return updatedList.map(i => {
      const actualizada = posicionadas.find(p => p.id === i.id)
      return actualizada || i
    })
  }, [])

  /** Genera una notificación para el siguiente en espera */
  const generarNotificacion = useCallback((inscripcionEspera, motivo) => {
    const materia = materias.find(m => m.id === inscripcionEspera.materiaId)
    const nueva = {
      id: Date.now(),
      inscripcionId: inscripcionEspera.id,
      estudianteId: inscripcionEspera.estudianteId,
      materiaId: inscripcionEspera.materiaId,
      materiaNombre: materia?.nombre || '',
      estado: 'pendiente', // pendiente | aceptada | rechazada | expirada
      motivo, // 'baja' | 'rechazo'
      timestamp: new Date().toISOString(),
      expira: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hs
    }
    setNotificaciones(prev => [...prev, nueva])
    return nueva
  }, [materias])

  // ─── Flujo crítico: Admin registra baja ───────────────────────────────────
  const registrarBaja = useCallback((estudianteId, materiaId) => {
    const inscripcion = inscripciones.find(
      i => i.estudianteId === estudianteId && i.materiaId === materiaId && i.estado === 'inscripto'
    )
    // También permitir salir de lista de espera
    const enEspera = !inscripcion && inscripciones.find(
      i => i.estudianteId === estudianteId && i.materiaId === materiaId && i.estado === 'espera'
    )

    if (!inscripcion && !enEspera) return { ok: false, error: 'Inscripción no encontrada' }

    const materia = materias.find(m => m.id === materiaId)

    // Si era espera → simplemente eliminar de la lista y recalcular posiciones
    if (enEspera) {
      let updated = inscripciones.map(i =>
        i.id === enEspera.id ? { ...i, estado: 'baja' } : i
      )
      updated = recalcularPosiciones(updated, materiaId)
      setInscripciones(updated)
      setHistorial(prev => [{ id: Date.now(), tipo: 'baja', estudianteId, materiaId, materiaNombre: materia?.nombre, timestamp: new Date().toISOString(), detalle: 'Salió de la lista de espera' }, ...prev])
      addToast(`Saliste de la lista de espera de ${materia?.nombre}.`, 'info')
      return { ok: true }
    }

    // 1. Marcar inscripción como baja
    let updated = inscripciones.map(i =>
      i.id === inscripcion.id ? { ...i, estado: 'baja' } : i
    )

    // 2. Registrar en historial
    const entrada = {
      id: Date.now(),
      tipo: 'baja',
      estudianteId,
      materiaId,
      materiaNombre: materia?.nombre,
      timestamp: new Date().toISOString(),
      detalle: 'Baja voluntaria del estudiante',
    }
    setHistorial(prev => [entrada, ...prev])

    // 3. Actualizar cupo en materia
    setMaterias(prev => prev.map(m =>
      m.id === materiaId ? { ...m, inscriptos: Math.max(0, m.inscriptos - 1) } : m
    ))

    // 4. Buscar el primero en lista de espera
    const siguiente = updated
      .filter(i => i.materiaId === materiaId && i.estado === 'espera')
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))[0]

    setInscripciones(updated)

    if (siguiente) {
      generarNotificacion(siguiente, 'baja')
      addToast(`¡Notificación enviada al siguiente en lista de ${materia?.nombre}!`, 'success')
    } else {
      addToast(`Baja registrada. No hay estudiantes en lista de espera para ${materia?.nombre}.`, 'info')
    }

    return { ok: true }
  }, [inscripciones, materias, generarNotificacion, addToast])

  // ─── Estudiante acepta vacante ─────────────────────────────────────────────
  const aceptarVacante = useCallback((notificacionId) => {
    const notif = notificaciones.find(n => n.id === notificacionId)
    if (!notif || notif.estado !== 'pendiente') return

    // 1. Marcar notificación como aceptada
    setNotificaciones(prev => prev.map(n =>
      n.id === notificacionId ? { ...n, estado: 'aceptada' } : n
    ))

    // 2. Cambiar estado de la inscripción a inscripto
    let updated = inscripciones.map(i =>
      i.id === notif.inscripcionId ? { ...i, estado: 'inscripto', posicion: null } : i
    )

    // 3. Recalcular posiciones del resto en espera
    updated = recalcularPosiciones(updated, notif.materiaId)
    setInscripciones(updated)

    // 4. Actualizar cupo: se ocupa el lugar liberado
    setMaterias(prev => prev.map(m =>
      m.id === notif.materiaId ? { ...m, inscriptos: m.inscriptos + 1 } : m
    ))

    // 5. Historial
    setHistorial(prev => [{
      id: Date.now(),
      tipo: 'aceptacion',
      estudianteId: notif.estudianteId,
      materiaId: notif.materiaId,
      materiaNombre: notif.materiaNombre,
      timestamp: new Date().toISOString(),
      detalle: 'Estudiante aceptó la vacante',
    }, ...prev])

    addToast(`¡Inscripción confirmada en ${notif.materiaNombre}!`, 'success')
  }, [notificaciones, inscripciones, recalcularPosiciones, addToast])

  // ─── Estudiante rechaza vacante ────────────────────────────────────────────
  const rechazarVacante = useCallback((notificacionId) => {
    const notif = notificaciones.find(n => n.id === notificacionId)
    if (!notif || notif.estado !== 'pendiente') return

    // 1. Marcar notificación como rechazada
    setNotificaciones(prev => prev.map(n =>
      n.id === notificacionId ? { ...n, estado: 'rechazada' } : n
    ))

    // 2. Mover la inscripción al final de la lista (o marcarla como rechazada)
    let updated = inscripciones.map(i =>
      i.id === notif.inscripcionId
        ? { ...i, estado: 'rechazado', posicion: null }
        : i
    )
    setInscripciones(updated)

    // 3. Buscar el siguiente en espera (excluyendo al que rechazó)
    const siguiente = updated
      .filter(i => i.materiaId === notif.materiaId && i.estado === 'espera')
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))[0]

    // 4. Historial
    setHistorial(prev => [{
      id: Date.now(),
      tipo: 'rechazo',
      estudianteId: notif.estudianteId,
      materiaId: notif.materiaId,
      materiaNombre: notif.materiaNombre,
      timestamp: new Date().toISOString(),
      detalle: 'Estudiante rechazó la vacante',
    }, ...prev])

    if (siguiente) {
      // Recalcular posiciones antes de notificar
      const updatedFinal = recalcularPosiciones(updated, notif.materiaId)
      setInscripciones(updatedFinal)
      const nextInscripcion = updatedFinal.find(i => i.id === siguiente.id)
      generarNotificacion(nextInscripcion || siguiente, 'rechazo')
      addToast('Vacante pasada al siguiente en lista.', 'info')
    } else {
      // Nadie más en espera: el cupo queda libre hasta que alguien se anote
      addToast('No hay más estudiantes en lista de espera para esa materia.', 'warning')
    }
  }, [notificaciones, inscripciones, recalcularPosiciones, generarNotificacion, addToast])

  // ─── Inscribirse directamente (cuando hay cupo) ───────────────────────────
  const inscribirseDirecto = useCallback((estudianteId, materiaId) => {
    const materia = materias.find(m => m.id === materiaId)
    if (!materia) return { ok: false, error: 'Materia no encontrada' }
    if (materia.inscriptos >= materia.cupo) return { ok: false, error: 'Ya no hay cupo disponible' }

    const yaExiste = inscripciones.find(
      i => i.estudianteId === estudianteId && i.materiaId === materiaId && ['inscripto', 'espera'].includes(i.estado)
    )
    if (yaExiste) return { ok: false, error: 'Ya estás inscripto en esta materia' }

    const nueva = {
      id: Date.now(),
      estudianteId,
      materiaId,
      estado: 'inscripto',
      posicion: null,
      timestamp: new Date().toISOString(),
    }
    setInscripciones(prev => [...prev, nueva])
    setMaterias(prev => prev.map(m =>
      m.id === materiaId ? { ...m, inscriptos: m.inscriptos + 1 } : m
    ))
    const nombreMateria = materia.nombre
    addToast(`¡Inscripto en ${nombreMateria}!`, 'success')
    return { ok: true }
  }, [materias, inscripciones, addToast])

  // ─── Inscribirse en lista de espera (cuando está llena) ───────────────────
  const inscribirseEnEspera = useCallback((estudianteId, materiaId) => {
    const yaExiste = inscripciones.find(
      i => i.estudianteId === estudianteId && i.materiaId === materiaId && ['inscripto', 'espera'].includes(i.estado)
    )
    if (yaExiste) return { ok: false, error: 'Ya estás inscripto o en lista de espera' }

    const materia = materias.find(m => m.id === materiaId)

    const nueva = {
      id: Date.now(),
      estudianteId,
      materiaId,
      estado: 'espera',
      posicion: 1, // será recalculada
      timestamp: new Date().toISOString(),
    }

    // Agregar y recalcular posiciones por score
    const nuevasInscripciones = recalcularPosiciones([...inscripciones, nueva], materiaId)
    setInscripciones(nuevasInscripciones)

    const posicion = nuevasInscripciones.find(i => i.id === nueva.id)?.posicion || 1
    addToast(`Quedaste en lista de espera para ${materia?.nombre}. Posición #${posicion}.`, 'info')
    return { ok: true }
  }, [materias, inscripciones, recalcularPosiciones, addToast])

  // ─── Resetear datos (útil para demos) ─────────────────────────────────────
  const resetearDatos = useCallback(() => {
    setMaterias(INITIAL_MATERIAS)
    setInscripciones(INITIAL_INSCRIPCIONES)
    setNotificaciones(INITIAL_NOTIFICACIONES)
    setHistorial(INITIAL_HISTORIAL)
    addToast('Datos reseteados al estado inicial.', 'info')
  }, [addToast])

  const value = {
    usuario: usuarioConScore, login, logout, actualizarPerfil,
    materias, setMaterias,
    inscripciones,
    notificaciones,
    historial,
    toasts,
    addToast,
    registrarBaja,
    aceptarVacante,
    rechazarVacante,
    inscribirseDirecto,
    inscribirseEnEspera,
    resetearDatos,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export const useApp = () => {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp debe usarse dentro de AppProvider')
  return ctx
}
