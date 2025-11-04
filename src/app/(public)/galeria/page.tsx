'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface Tag {
  id: number
  nombre: string
  slug: string
}

interface Publication {
  id: number
  titulo: string
  slug: string
  imagenUrl: string | null
  createdAt: string
  tags: {
    tag: Tag
  }[]
}

export default function GaleriaPage() {
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
        // Filtrar solo publicaciones con imágenes
        const withImages = Array.isArray(data) ? data.filter((pub: Publication) => pub.imagenUrl) : []
        setPublications(withImages)
      }
    } catch (error) {
      console.error('Error loading publications:', error)
      setPublications([])
    } finally {
      setLoading(false)
    }
  }

  const isVideo = (url: string | null) => {
    if (!url) return false
    return url.includes('/videos/') || url.match(/\.(mp4|webm|ogg|mov)$/i)
  }

  return (
    <div>
      {/* HERO */}
      <section className="bg-gray-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-4">Galería</h1>
          <p className="text-xl text-gray-300">
            Explora nuestras publicaciones multimedia organizadas por categoría
          </p>
        </div>
      </section>

      {/* FILTROS */}
      <section className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 overflow-x-auto">
            <span className="text-sm font-medium text-gray-700 whitespace-nowrap">Categorías:</span>
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

      {/* GALERÍA */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-gray-800"></div>
              <p className="mt-4 text-gray-600">Cargando galería...</p>
            </div>
          ) : publications.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {publications.map((pub) => (
                <Link
                  key={pub.id}
                  href={`/publicaciones/${pub.slug}`}
                  className="group bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all"
                >
                  {/* Media */}
                  <div className="relative aspect-square bg-gray-200">
                    {isVideo(pub.imagenUrl) ? (
                      <div className="relative w-full h-full">
                        <video
                          src={pub.imagenUrl || ''}
                          className="w-full h-full object-cover"
                          muted
                          loop
                          playsInline
                          onMouseEnter={(e) => e.currentTarget.play()}
                          onMouseLeave={(e) => {
                            e.currentTarget.pause()
                            e.currentTarget.currentTime = 0
                          }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="w-16 h-16 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z"/>
                            </svg>
                          </div>
                        </div>
                      </div>
                    ) : pub.imagenUrl ? (
                      <Image
                        src={pub.imagenUrl}
                        alt={pub.titulo}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                      />
                    ) : null}
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2 group-hover:text-gray-700 transition-colors">
                      {pub.titulo}
                    </h3>
                    
                    {/* Tags */}
                    {pub.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {pub.tags.slice(0, 2).map((t, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded"
                          >
                            {t.tag.nombre}
                          </span>
                        ))}
                        {pub.tags.length > 2 && (
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded">
                            +{pub.tags.length - 2}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-gray-600 mb-2">No hay contenido multimedia en esta categoría</p>
              {selectedTag && (
                <button
                  onClick={() => setSelectedTag(null)}
                  className="text-gray-700 underline hover:text-gray-900"
                >
                  Ver todo el contenido
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* INFO */}
      <section className="bg-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Comparte nuestros momentos
          </h2>
          <p className="text-gray-600 mb-6">
            Cada imagen y video representa parte de nuestra historia. Haz clic en cualquier elemento 
            para ver la publicación completa con todos los detalles.
          </p>
          <Link
            href="/publicaciones"
            className="inline-block px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Ver todas las publicaciones
          </Link>
        </div>
      </section>
    </div>
  )
}
