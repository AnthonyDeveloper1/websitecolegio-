'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface Tag {
  id: number
  nombre: string
  slug: string
}

interface Publication {
  id: number
  titulo: string
  slug: string
  descripcion: string | null
  imagenUrl: string | null
  createdAt: string
  usuario: {
    fullName: string
  }
  tags: {
    tag: Tag
  }[]
}

export default function PublicacionesPage() {
  const [publications, setPublications] = useState<Publication[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadTags()
    loadPublications()
  }, [selectedTag])

  const loadTags = async () => {
    try {
      const response = await fetch('/api/tags')
      if (response.ok) {
        const data = await response.json()
        setTags(Array.isArray(data) ? data : [])
      }
    } catch (error) {
      console.error('Error loading tags:', error)
      setTags([])
    }
  }

  const loadPublications = async () => {
    setLoading(true)
    try {
      const url = selectedTag
        ? `/api/publications?status=published&tag=${selectedTag}`
        : '/api/publications?status=published'
      
      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        setPublications(Array.isArray(data) ? data : [])
      }
    } catch (error) {
      console.error('Error loading publications:', error)
      setPublications([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {/* HERO */}
      <section className="bg-gray-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-4">Publicaciones</h1>
          <p className="text-xl text-gray-300">
            Mantente al día con nuestras noticias, eventos y actividades
          </p>
        </div>
      </section>

      {/* FILTROS */}
      <section className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 overflow-x-auto">
            <span className="text-sm font-medium text-gray-700 whitespace-nowrap">Filtrar:</span>
            <button
              onClick={() => setSelectedTag(null)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                selectedTag === null
                  ? 'bg-gray-800 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Todas
            </button>
            {tags.map((tag) => (
              <button
                key={tag.id}
                onClick={() => setSelectedTag(tag.slug)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  selectedTag === tag.slug
                    ? 'bg-gray-800 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tag.nombre}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* PUBLICACIONES */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-gray-800"></div>
              <p className="mt-4 text-gray-600">Cargando publicaciones...</p>
            </div>
          ) : publications.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {publications.map((pub) => (
                <Link
                  key={pub.id}
                  href={`/publicaciones/${pub.slug}`}
                  className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow group"
                >
                  {/* Imagen */}
                  <div className="relative h-64 bg-gray-200">
                    {pub.imagenUrl ? (
                      <Image
                        src={pub.imagenUrl}
                        alt={pub.titulo}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Contenido */}
                  <div className="p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-gray-700 transition-colors">
                      {pub.titulo}
                    </h2>

                    {/* Meta info */}
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {new Date(pub.createdAt).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        {pub.usuario.fullName}
                      </span>
                    </div>

                    {/* Tags */}
                    {pub.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {pub.tags.map((t, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                          >
                            {t.tag.nombre}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Descripción */}
                    {pub.descripcion && (
                      <p className="text-gray-600 line-clamp-3 mb-4">
                        {pub.descripcion}
                      </p>
                    )}

                    {/* CTA */}
                    <div className="flex items-center text-gray-700 font-medium group-hover:text-gray-900">
                      Leer más
                      <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-gray-600">No hay publicaciones disponibles</p>
              {selectedTag && (
                <button
                  onClick={() => setSelectedTag(null)}
                  className="mt-4 text-gray-700 underline hover:text-gray-900"
                >
                  Ver todas las publicaciones
                </button>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
