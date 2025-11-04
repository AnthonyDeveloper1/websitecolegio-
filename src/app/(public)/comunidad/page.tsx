'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface Director {
  id: number
  nombre: string
  cargo: string
  descripcion: string | null
  fotoUrl: string | null
  orden: number
}

type TabType = 'directivos' | 'docentes' | 'estudiantes' | 'padres'

export default function ComunidadPage() {
  const [activeTab, setActiveTab] = useState<TabType>('directivos')
  const [directores, setDirectores] = useState<Director[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (activeTab === 'directivos') {
      loadDirectores()
    }
  }, [activeTab])

  const loadDirectores = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/directors')
      if (response.ok) {
        const data = await response.json()
        setDirectores(Array.isArray(data) ? data : [])
      }
    } catch (error) {
      console.error('Error loading directors:', error)
      setDirectores([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {/* HERO - Más alegre y colorido */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-24 overflow-hidden">
        {/* Formas decorativas */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-white opacity-5 rounded-full -translate-x-1/2 translate-y-1/2"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-block mb-6">
            <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-4 transform rotate-6">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-6">Nuestra Comunidad Educativa</h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Conoce a las personas que día a día hacen posible nuestra misión de formar ciudadanos íntegros y preparados para el futuro
          </p>
        </div>
      </section>

      {/* TABS - Diseño más moderno */}
      <section className="bg-white border-b border-slate-200 sticky top-20 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8 overflow-x-auto">
            <button
              onClick={() => setActiveTab('directivos')}
              className={`py-4 px-1 border-b-2 font-semibold text-sm whitespace-nowrap transition-all ${
                activeTab === 'directivos'
                  ? 'border-slate-900 text-slate-900'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              👔 Directivos
            </button>
            <button
              onClick={() => setActiveTab('docentes')}
              className={`py-4 px-1 border-b-2 font-semibold text-sm whitespace-nowrap transition-all ${
                activeTab === 'docentes'
                  ? 'border-slate-900 text-slate-900'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              👨‍🏫 Docentes
            </button>
            <button
              onClick={() => setActiveTab('estudiantes')}
              className={`py-4 px-1 border-b-2 font-semibold text-sm whitespace-nowrap transition-all ${
                activeTab === 'estudiantes'
                  ? 'border-slate-900 text-slate-900'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              🎓 Estudiantes
            </button>
            <button
              onClick={() => setActiveTab('padres')}
              className={`py-4 px-1 border-b-2 font-semibold text-sm whitespace-nowrap transition-all ${
                activeTab === 'padres'
                  ? 'border-slate-900 text-slate-900'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              👨‍👩‍👧‍👦 Padres de Familia
            </button>
          </nav>
        </div>
      </section>

      {/* CONTENIDO */}
      <section className="bg-slate-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* TAB DIRECTIVOS */}
          {activeTab === 'directivos' && (
            <div>
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-slate-900 mb-4">Equipo Directivo</h2>
                <p className="text-slate-600">
                  Conoce a quienes lideran nuestra institución educativa con pasión y compromiso
                </p>
              </div>

              {loading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-slate-300 border-t-slate-900"></div>
                </div>
              ) : directores.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {directores.map((director) => (
                    <div key={director.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1">
                      <div className="relative h-80 bg-gradient-to-br from-slate-200 to-slate-300">
                        {director.fotoUrl ? (
                          <Image
                            src={director.fotoUrl}
                            alt={director.nombre}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <svg className="w-24 h-24 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-slate-900 mb-1">
                          {director.nombre}
                        </h3>
                        <p className="text-slate-600 font-medium mb-3">
                          {director.cargo}
                        </p>
                        {director.descripcion && (
                          <p className="text-slate-600 text-sm leading-relaxed">
                            {director.descripcion}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
                  <p className="text-slate-600">No hay información disponible</p>
                </div>
              )}
            </div>
          )}

          {/* TAB DOCENTES */}
          {activeTab === 'docentes' && (
            <div>
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-slate-900 mb-4">Nuestros Docentes</h2>
                <p className="text-slate-600 max-w-2xl mx-auto">
                  Profesionales apasionados y comprometidos con la educación de excelencia
                </p>
              </div>

              {/* Introducción con imagen */}
              <div className="bg-white rounded-3xl overflow-hidden shadow-lg mb-12">
                <div className="grid md:grid-cols-2 gap-0">
                  <div className="relative h-80 md:h-auto">
                    <Image
                      src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800"
                      alt="Docentes"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-8 flex flex-col justify-center">
                    <h3 className="text-2xl font-bold text-slate-900 mb-4">Equipo Pedagógico de Excelencia</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start text-slate-600">
                        <svg className="w-6 h-6 text-green-600 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Maestros con vocación y experiencia
                      </li>
                      <li className="flex items-start text-slate-600">
                        <svg className="w-6 h-6 text-green-600 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Metodologías innovadoras de enseñanza
                      </li>
                      <li className="flex items-start text-slate-600">
                        <svg className="w-6 h-6 text-green-600 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Acompañamiento personalizado
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { nombre: 'Prof. María González', materia: 'Matemáticas', color: 'from-blue-100 to-blue-200' },
                  { nombre: 'Prof. Juan Pérez', materia: 'Comunicación', color: 'from-green-100 to-green-200' },
                  { nombre: 'Prof. Ana Torres', materia: 'Ciencias', color: 'from-purple-100 to-purple-200' },
                  { nombre: 'Prof. Carlos Ruiz', materia: 'Historia', color: 'from-orange-100 to-orange-200' },
                  { nombre: 'Prof. Laura Vega', materia: 'Arte', color: 'from-pink-100 to-pink-200' },
                  { nombre: 'Prof. Pedro Silva', materia: 'Educación Física', color: 'from-yellow-100 to-yellow-200' },
                  { nombre: 'Prof. Rosa Mendoza', materia: 'Inglés', color: 'from-red-100 to-red-200' },
                  { nombre: 'Prof. Miguel Castro', materia: 'Tecnología', color: 'from-indigo-100 to-indigo-200' },
                ].map((docente, i) => (
                  <div key={i} className="bg-white border border-slate-200 rounded-2xl p-6 text-center hover:shadow-lg transition-all hover:-translate-y-1">
                    <div className={`w-24 h-24 bg-gradient-to-br ${docente.color} rounded-full mx-auto mb-4 flex items-center justify-center`}>
                      <svg className="w-12 h-12 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-slate-900">{docente.nombre}</h3>
                    <p className="text-sm text-slate-600">{docente.materia}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 bg-blue-50 border border-blue-200 rounded-2xl p-6 text-center">
                <p className="text-slate-900 font-medium">
                  ✨ Contamos con más de 50 docentes calificados en diversas áreas del conocimiento ✨
                </p>
              </div>
            </div>
          )}

          {/* TAB ESTUDIANTES */}
          {activeTab === 'estudiantes' && (
            <div>
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-slate-900 mb-4">Comunidad Estudiantil</h2>
                <p className="text-slate-600 max-w-2xl mx-auto">
                  El corazón de nuestra institución
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8 mb-12">
                <div className="bg-white rounded-3xl overflow-hidden shadow-lg">
                  <div className="relative h-64">
                    <Image
                      src="https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800"
                      alt="Estudiantes"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-slate-900 mb-3">🎯 Más de 500 Estudiantes</h3>
                    <p className="text-slate-600">
                      Nuestra comunidad estudiantil está conformada por jóvenes talentosos con sueños únicos.
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-3xl overflow-hidden shadow-lg">
                  <div className="relative h-64">
                    <Image
                      src="https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800"
                      alt="Trabajo en equipo"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-slate-900 mb-3">🤝 Trabajo en Equipo</h3>
                    <p className="text-slate-600">
                      Fomentamos la colaboración a través de proyectos grupales y actividades deportivas.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB PADRES */}
          {activeTab === 'padres' && (
            <div>
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-slate-900 mb-4">Familia y Comunidad</h2>
                <p className="text-slate-600 max-w-2xl mx-auto">
                  Juntos formamos líderes
                </p>
              </div>

              <div className="relative h-96 rounded-3xl overflow-hidden mb-12 shadow-xl">
                <Image
                  src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=1200"
                  alt="Familias"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 to-slate-900/40 flex items-center">
                  <div className="max-w-2xl mx-auto px-8 text-center text-white">
                    <h3 className="text-4xl font-bold mb-4">Educación en Familia</h3>
                    <p className="text-xl text-slate-200">
                      Cuando las familias y la escuela trabajan juntas, los estudiantes tienen éxito
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white rounded-3xl overflow-hidden shadow-lg">
                  <div className="relative h-48">
                    <Image
                      src="https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800"
                      alt="Portal"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-8">
                    <h3 className="text-xl font-semibold text-slate-900 mb-4">💻 Portal de Padres</h3>
                    <p className="text-slate-600 mb-4">
                      Accede al portal digital para ver el progreso académico de tus hijos.
                    </p>
                    <button className="px-6 py-3 bg-slate-900 text-white rounded-full hover:bg-slate-800 transition-colors">
                      Acceder al Portal
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-3xl overflow-hidden shadow-lg">
                  <div className="relative h-48">
                    <Image
                      src="https://images.unsplash.com/photo-1491841573634-28140fc7ced7?w=800"
                      alt="Comunicación"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-8">
                    <h3 className="text-xl font-semibold text-slate-900 mb-4">📢 Comunicación Directa</h3>
                    <p className="text-slate-600 mb-4">
                      Mantente informado con nuestros canales de comunicación directa.
                    </p>
                    <button className="px-6 py-3 bg-slate-900 text-white rounded-full hover:bg-slate-800 transition-colors">
                      Más Información
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
