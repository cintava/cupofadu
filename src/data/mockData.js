/**
 * Datos iniciales para el MVP.
 * En producción esto vendría de la API de FADU.
 */

// cupo e inscriptos deben coincidir con la cantidad de registros en INITIAL_INSCRIPCIONES
export const INITIAL_MATERIAS = [
  { id: 1, nombre: 'Dirección de Cámara',   cupo: 3,  inscriptos: 1,  docente: 'María García',    año: 3, comision: 'A' },
  { id: 2, nombre: 'Edición Digital',        cupo: 3,  inscriptos: 3,  docente: 'Juan López',      año: 2, comision: 'B' },  // LLENA — 3 en espera
  { id: 3, nombre: 'Producción Audiovisual', cupo: 5,  inscriptos: 1,  docente: 'Ana Rodríguez',   año: 4, comision: 'A' },
  { id: 4, nombre: 'Diseño de Sonido',       cupo: 3,  inscriptos: 3,  docente: 'Carlos Méndez',   año: 3, comision: 'C' },  // LLENA — 2 en espera
  { id: 5, nombre: 'Guión I',                cupo: 5,  inscriptos: 2,  docente: 'Laura Fernández', año: 1, comision: 'A' },
]

export const INITIAL_ESTUDIANTES = [
  { legajo: '12345', nombre: 'Martina García',    email: 'martina@fadu.uba.ar',  carrera: 'DEIS', password: '12345' },
  { legajo: '67890', nombre: 'Tomás Herrera',    email: 'tomas@fadu.uba.ar',   carrera: 'DEIS', password: '67890' },
  { legajo: '11111', nombre: 'Valentina Cruz',   email: 'valen@fadu.uba.ar',   carrera: 'DEIS', password: '11111' },
  { legajo: '22222', nombre: 'Matías Soria',     email: 'matias@fadu.uba.ar',  carrera: 'DEIS', password: '22222' },
  // Estudiantes extra para tener inscriptos reales en materias llenas
  { legajo: '33333', nombre: 'Lucía Mendez',     email: 'lucia@fadu.uba.ar',   carrera: 'DEIS', password: '33333' },
  { legajo: '44444', nombre: 'Bruno Ferreyra',   email: 'bruno@fadu.uba.ar',   carrera: 'DEIS', password: '44444' },
  { legajo: '55555', nombre: 'Agustina Romero',  email: 'agus@fadu.uba.ar',    carrera: 'DEIS', password: '55555' },
  { legajo: 'admin', nombre: 'Departamento Alumnos', email: 'alumnos@fadu.uba.ar', carrera: null, password: 'admin', rol: 'admin' },
]

export const INITIAL_INSCRIPCIONES = [
  // ── Martina (12345)
  // inscripta en Dirección de Cámara (con cupo libre → puede probar inscribirte)
  { id: 1,  estudianteId: '12345', materiaId: 1, estado: 'inscripto', posicion: null, timestamp: '2026-05-01T09:00:00Z' },
  // en espera #1 en Edición Digital (llena)
  { id: 2,  estudianteId: '12345', materiaId: 2, estado: 'espera',    posicion: 1,    timestamp: '2026-05-10T11:00:00Z' },
  // en espera #1 en Diseño de Sonido (llena)
  { id: 10, estudianteId: '12345', materiaId: 4, estado: 'espera',    posicion: 1,    timestamp: '2026-05-08T08:00:00Z' },

  // ── Tomás (67890)
  { id: 3,  estudianteId: '67890', materiaId: 5, estado: 'inscripto', posicion: null, timestamp: '2026-05-01T10:00:00Z' },
  { id: 4,  estudianteId: '67890', materiaId: 2, estado: 'espera',    posicion: 2,    timestamp: '2026-05-12T14:00:00Z' },
  { id: 5,  estudianteId: '67890', materiaId: 4, estado: 'espera',    posicion: 2,    timestamp: '2026-05-09T09:30:00Z' },

  // ── Valentina (11111)
  { id: 6,  estudianteId: '11111', materiaId: 3, estado: 'inscripto', posicion: null, timestamp: '2026-05-02T08:00:00Z' },

  // ── Matías (22222): en espera #3 en Edición Digital
  { id: 8,  estudianteId: '22222', materiaId: 2, estado: 'espera',    posicion: 3,    timestamp: '2026-05-15T10:00:00Z' },

  // ── Lucía, Bruno, Agustina → inscriptos en Edición Digital (cupo 3 = llena)
  { id: 11, estudianteId: '33333', materiaId: 2, estado: 'inscripto', posicion: null, timestamp: '2026-04-20T10:00:00Z' },
  { id: 13, estudianteId: '44444', materiaId: 2, estado: 'inscripto', posicion: null, timestamp: '2026-04-21T09:00:00Z' },
  { id: 15, estudianteId: '55555', materiaId: 2, estado: 'inscripto', posicion: null, timestamp: '2026-04-22T11:00:00Z' },

  // ── Lucía, Bruno, Agustina → inscriptos en Diseño de Sonido (cupo 3 = llena)
  { id: 12, estudianteId: '33333', materiaId: 4, estado: 'inscripto', posicion: null, timestamp: '2026-04-20T10:30:00Z' },
  { id: 14, estudianteId: '44444', materiaId: 4, estado: 'inscripto', posicion: null, timestamp: '2026-04-21T09:30:00Z' },
  { id: 16, estudianteId: '55555', materiaId: 4, estado: 'inscripto', posicion: null, timestamp: '2026-04-22T11:30:00Z' },

  // ── Guión I: Tomás + Lucía inscriptos (cupo 5, inscriptos 2 → libre)
  { id: 17, estudianteId: '33333', materiaId: 5, estado: 'inscripto', posicion: null, timestamp: '2026-04-20T12:00:00Z' },
]

export const INITIAL_NOTIFICACIONES = []

export const INITIAL_HISTORIAL = []
