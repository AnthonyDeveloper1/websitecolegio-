'use client'

import { useState, useEffect } from 'react'
import { getAuthHeaders } from '@/lib/client-auth'

interface GalleryImage {
  id: number
  title: string
  description: string | null
  imageUrl: string
  type: string
  uploadedAt: string
  author?: {
    fullName: string
  }
}

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState<'all' | 'imagen' | 'video'>('all')

  useEffect(() => {
    loadImages()
  }, [typeFilter])

  const loadImages = async () => {
    try {
      const url = typeFilter === 'all' 
        ? '/api/gallery' 
        : `/api/gallery?type=${typeFilter}`
      
      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        setImages(Array.isArray(data) ? data : [])
      }
    } catch (error) {
      console.error('Error cargando galería:', error)
      setImages([])
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('¿Eliminar esta imagen de la galería?')) {
      return
    }

    try {
      const headers = getAuthHeaders()
      const response = await fetch(`/api/gallery/${id}`, {
        method: 'DELETE',
        headers,
      })

      if (response.ok) {
        setImages(images.filter(img => img.id !== id))
        alert('Imagen eliminada correctamente')
      } else {
        alert('Error al eliminar la imagen')
      }
    } catch (error) {
      alert('Error al eliminar la imagen')
    }
  }

  const filteredImages = images.filter(img =>
    img.title.toLowerCase().includes(filter.toLowerCase())
  )

  if (loading) {
    return <div className="text-center py-8">Cargando galería...</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Galería Multimedia</h2>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-blue-800">
          📷 Esta galería muestra todas las imágenes y videos subidos. 
          Las imágenes se suben automáticamente al crear/editar publicaciones.
        </p>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex gap-4 mb-4">
          <button
            onClick={() => setTypeFilter('all')}
            className={`px-4 py-2 rounded ${typeFilter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            📂 Todos ({images.length})
          </button>
          <button
            onClick={() => setTypeFilter('imagen')}
            className={`px-4 py-2 rounded ${typeFilter === 'imagen' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            🖼️ Imágenes
          </button>
          <button
            onClick={() => setTypeFilter('video')}
            className={`px-4 py-2 rounded ${typeFilter === 'video' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            🎥 Videos
          </button>
        </div>
        
        <input
          type="text"
          placeholder="🔍 Buscar por título..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">
          Archivos ({filteredImages.length})
        </h3>
        
        {filteredImages.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            {filter ? 'No se encontraron archivos' : 'No hay archivos en la galería'}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredImages.map((img) => (
              <div
                key={img.id}
                className="group relative rounded-lg overflow-hidden border hover:shadow-lg transition-shadow"
              >
                {img.type === 'imagen' ? (
                  <img
                    src={img.imageUrl}
                    alt={img.title}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-800 flex items-center justify-center">
                    <span className="text-white text-4xl">🎥</span>
                  </div>
                )}
                
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-opacity flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity space-x-2">
                    <a
                      href={img.imageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded text-sm inline-block"
                    >
                      👁️ Ver
                    </a>
                    <button
                      onClick={() => handleDelete(img.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded text-sm"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
                
                <div className="p-3 bg-white">
                  <p className="text-sm font-medium truncate">{img.title}</p>
                  {img.author && (
                    <p className="text-xs text-gray-500">{img.author.fullName}</p>
                  )}
                  <p className="text-xs text-gray-500">
                    {new Date(img.uploadedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
