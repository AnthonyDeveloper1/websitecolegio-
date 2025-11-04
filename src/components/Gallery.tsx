'use client'

import { useState } from 'react'
import Image from 'next/image'
import { getToken } from '@/lib/client-auth'

interface UploadedFile {
  url: string
  filename: string
  size: number
  mimetype: string
}

interface GalleryProps {
  images: UploadedFile[]
  onDelete?: (filename: string) => void
  selectable?: boolean
  onSelect?: (image: UploadedFile) => void
}

export default function Gallery({
  images,
  onDelete,
  selectable = false,
  onSelect,
}: GalleryProps) {
  const [deleting, setDeleting] = useState<string | null>(null)
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set())

  const handleDelete = async (filename: string) => {
    if (!confirm('¿Eliminar esta imagen?')) return

    setDeleting(filename)

    try {
      const token = getToken()
      const response = await fetch(`/api/upload?filename=${filename}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Error al eliminar')
      }

      onDelete?.(filename)
    } catch (error) {
      alert('Error al eliminar imagen')
    } finally {
      setDeleting(null)
    }
  }

  const formatSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  if (images.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No hay imágenes en la galería
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {images.map((image) => {
        const isVideo = image.mimetype.startsWith('video/')
        
        return (
          <div
            key={image.filename}
            className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow bg-white"
          >
            <div className="relative w-full h-48 bg-gray-100">
              {isVideo ? (
                <video
                  src={image.url}
                  controls
                  preload="metadata"
                  className="w-full h-full object-cover"
                />
              ) : (
                <Image
                  src={image.url}
                  alt={image.filename}
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                  className="object-cover"
                  loading="lazy"
                  onLoadingComplete={() => {
                    setLoadedImages(prev => new Set(prev).add(image.filename))
                  }}
                />
              )}
            </div>
            <div className="p-3">
              <p className="text-xs text-gray-500 truncate" title={image.filename}>
                {image.filename}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {formatSize(image.size)}
              </p>
              <div className="flex gap-2 mt-2">
                {selectable && onSelect && (
                  <button
                    onClick={() => onSelect(image)}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white text-xs px-3 py-1 rounded"
                  >
                    Seleccionar
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => handleDelete(image.filename)}
                    disabled={deleting === image.filename}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1 rounded disabled:opacity-50"
                  >
                    {deleting === image.filename ? 'Eliminando...' : 'Eliminar'}
                  </button>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
