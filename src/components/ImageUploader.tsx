'use client'

import { useState, useRef, ChangeEvent } from 'react'
import { getToken } from '@/lib/client-auth'
import Image from 'next/image'

interface UploadedFile {
  url: string
  filename: string
  size: number
  mimetype: string
}

interface ImageUploaderProps {
  onUploadSuccess: (file: UploadedFile) => void
  onUploadError?: (error: string) => void
  maxSize?: number // en MB
  accept?: string
  allowVideo?: boolean
}

export default function ImageUploader({
  onUploadSuccess,
  onUploadError,
  maxSize = 10,
  accept = 'image/jpeg,image/jpg,image/png,image/gif,image/webp',
  allowVideo = false,
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [isVideo, setIsVideo] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const finalAccept = allowVideo 
    ? accept + ',video/mp4,video/webm,video/ogg,video/quicktime'
    : accept

  const finalMaxSize = allowVideo ? 100 : maxSize

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Verificar si es video
    const fileIsVideo = file.type.startsWith('video/')
    setIsVideo(fileIsVideo)

    // Validar tamaño
    const maxBytes = finalMaxSize * 1024 * 1024
    if (file.size > maxBytes) {
      const error = `El archivo es demasiado grande. Máximo ${finalMaxSize}MB`
      onUploadError?.(error)
      return
    }

    // Mostrar preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(file)

    // Subir archivo
    await uploadFile(file)
  }

  const uploadFile = async (file: File) => {
    setUploading(true)

    try {
      const token = getToken()
      if (!token) {
        throw new Error('No autenticado')
      }

      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Error al subir archivo')
      }

      const data: UploadedFile = await response.json()
      onUploadSuccess(data)
      setPreview(null)
      setIsVideo(false)
      
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Error al subir archivo'
      onUploadError?.(errorMsg)
      setPreview(null)
      setIsVideo(false)
    } finally {
      setUploading(false)
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
      <input
        ref={fileInputRef}
        type="file"
        accept={finalAccept}
        onChange={handleFileChange}
        className="hidden"
        disabled={uploading}
      />

      {preview ? (
        <div className="text-center">
          <div className="relative w-full h-48 mb-4">
            {isVideo ? (
              <video
                src={preview}
                controls
                className="w-full h-full object-contain"
              />
            ) : (
              <Image
                src={preview}
                alt="Preview"
                fill
                className="object-contain"
              />
            )}
          </div>
          {uploading && (
            <div className="text-blue-600 font-medium">Subiendo...</div>
          )}
        </div>
      ) : (
        <div className="text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <p className="mt-2 text-sm text-gray-600">
            <button
              type="button"
              onClick={handleClick}
              disabled={uploading}
              className="font-medium text-blue-600 hover:text-blue-500 focus:outline-none disabled:opacity-50"
            >
              Seleccionar {allowVideo ? 'archivo' : 'imagen'}
            </button>
            {' '}o arrastra y suelta
          </p>
          <p className="mt-1 text-xs text-gray-500">
            {allowVideo 
              ? `Imágenes (PNG, JPG, GIF, WEBP hasta 10MB) o Videos (MP4, WEBM hasta 100MB)`
              : `PNG, JPG, GIF, WEBP hasta ${finalMaxSize}MB`
            }
          </p>
        </div>
      )}
    </div>
  )
}
