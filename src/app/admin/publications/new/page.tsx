'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { getAuthHeaders, getAuthHeadersForFormData, getUser } from '@/lib/client-auth'
import dynamic from 'next/dynamic'
import 'react-quill/dist/quill.snow.css'

// Cargar Quill dinámicamente (solo cliente)
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })

interface Tag {
  id: number
  name: string
}

interface Category {
  id: number
  name: string
  icon?: string
  color?: string
}

interface PublicationFormData {
  title: string
  slug: string
  description: string
  content: string
  imageUrl: string
  status: 'draft' | 'published'
  categoryId: number | null
  tagIds: number[]
}

export default function NewPublicationPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [tags, setTags] = useState<Tag[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [formData, setFormData] = useState<PublicationFormData>({
    title: '',
    slug: '',
    description: '',
    content: '',
    imageUrl: '',
    status: 'draft',
    categoryId: null,
    tagIds: [],
  })

  useEffect(() => {
    loadTags()
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      if (response.ok) {
        const data = await response.json()
        setCategories(Array.isArray(data) ? data : [])
      }
    } catch (error) {
      console.error('Error cargando categorías:', error)
      setCategories([])
    }
  }

  const loadTags = async () => {
    try {
      const response = await fetch('/api/tags')
      if (response.ok) {
        const data = await response.json()
        setTags(Array.isArray(data) ? data : [])
      }
    } catch (error) {
      console.error('Error cargando etiquetas:', error)
      setTags([])
    }
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
  }

  const handleTitleChange = (title: string) => {
    setFormData({
      ...formData,
      title,
      slug: generateSlug(title),
    })
  }

  const handleTagToggle = (tagId: number) => {
    const tagIds = formData.tagIds.includes(tagId)
      ? formData.tagIds.filter((id) => id !== tagId)
      : [...formData.tagIds, tagId]
    setFormData({ ...formData, tagIds })
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validar tipo
    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona una imagen válida')
      return
    }

    // Validar tamaño (10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('La imagen es muy grande. Máximo 10MB')
      return
    }

    setUploading(true)
    try {
      const formDataUpload = new FormData()
      formDataUpload.append('file', file)
      formDataUpload.append('folder', 'colegio/publications')

      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: getAuthHeadersForFormData(),
        body: formDataUpload,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Error al subir imagen')
      }

      const data = await response.json()
      setFormData({ ...formData, imageUrl: data.url })
      alert('✅ Imagen subida exitosamente')
    } catch (error) {
      console.error('Error:', error)
      alert('Error al subir imagen: ' + (error instanceof Error ? error.message : 'Error desconocido'))
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const headers = getAuthHeaders()
      const response = await fetch('/api/publications', {
        method: 'POST',
        headers,
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Error al crear publicación')
      }

      alert('Publicación creada exitosamente')
      router.push('/admin/publications')
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Error al crear publicación')
    } finally {
      setLoading(false)
    }
  }

  const modules = useMemo(() => ({
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'align': [] }],
      ['link', 'image', 'video'],
      ['clean']
    ],
  }), [])

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-3xl font-bold">Nueva Publicación</h2>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
        {/* Título */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Título *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        {/* Slug */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Slug (URL amigable)
          </label>
          <input
            type="text"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg bg-gray-50"
            placeholder="se-genera-automaticamente"
          />
          <p className="text-xs text-gray-500 mt-1">
            URL: /noticias/{formData.slug || 'slug'}
          </p>
        </div>

        {/* Descripción */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Descripción breve
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            rows={3}
            placeholder="Resumen que aparecerá en listados y compartir en redes"
          />
        </div>

        {/* Categoría */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Categoría
          </label>
          <select
            value={formData.categoryId || ''}
            onChange={(e) => setFormData({ ...formData, categoryId: e.target.value ? parseInt(e.target.value) : null })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Sin categoría</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.icon} {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Imagen destacada */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Imagen destacada
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="url"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              className="flex-1 px-4 py-2 border rounded-lg"
              placeholder="https://... o sube una imagen"
            />
            <label className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer flex items-center gap-2">
              {uploading ? '⏳ Subiendo...' : '📤 Subir'}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
                className="hidden"
              />
            </label>
          </div>
          {formData.imageUrl && (
            <img
              src={formData.imageUrl}
              alt="Preview"
              className="mt-2 h-32 object-cover rounded"
            />
          )}
          <p className="text-xs text-gray-500 mt-1">
            Sube una imagen o pega una URL. Formatos: JPG, PNG, GIF, WEBP (máx 10MB)
          </p>
        </div>

        {/* Contenido (Editor) */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contenido *
          </label>
          <div className="bg-white">
            <ReactQuill
              theme="snow"
              value={formData.content}
              onChange={(content) => setFormData({ ...formData, content })}
              modules={modules}
              className="h-64 mb-12"
            />
          </div>
        </div>

        {/* Etiquetas */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Etiquetas
          </label>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button
                key={tag.id}
                type="button"
                onClick={() => handleTagToggle(tag.id)}
                className={`px-4 py-2 rounded-full text-sm transition-colors ${
                  formData.tagIds.includes(tag.id)
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {tag.name}
              </button>
            ))}
          </div>
        </div>

        {/* Estado */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Estado
          </label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="draft"
                checked={formData.status === 'draft'}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as 'draft' })}
                className="mr-2"
              />
              📝 Borrador
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="published"
                checked={formData.status === 'published'}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as 'published' })}
                className="mr-2"
              />
              ✅ Publicado
            </label>
          </div>
        </div>

        {/* Botones */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg disabled:opacity-50"
          >
            {loading ? 'Creando...' : 'Crear Publicación'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-2 rounded-lg"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}
