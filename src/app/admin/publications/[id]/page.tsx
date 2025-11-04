'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { getAuthHeaders } from '@/lib/client-auth'
import dynamic from 'next/dynamic'
import 'react-quill/dist/quill.snow.css'

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })

interface Tag {
  id: number
  name: string
}

interface Publication {
  id: number
  title: string
  slug: string
  description: string | null
  content: string
  imageUrl: string | null
  status: string
  tags: Array<{
    tag: {
      id: number
      name: string
    }
  }>
}

export default function EditPublicationPage() {
  const router = useRouter()
  const params = useParams()
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const [tags, setTags] = useState<Tag[]>([])
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    content: '',
    imageUrl: '',
    status: 'draft' as 'draft' | 'published',
    tagIds: [] as number[],
  })

  useEffect(() => {
    loadTags()
    loadPublication()
  }, [])

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

  const loadPublication = async () => {
    try {
      const headers = getAuthHeaders()
      const response = await fetch(`/api/publications/${params.id}`, { headers })
      
      if (response.ok) {
        const pub: Publication = await response.json()
        setFormData({
          title: pub.title,
          slug: pub.slug,
          description: pub.description || '',
          content: pub.content,
          imageUrl: pub.imageUrl || '',
          status: pub.status as 'draft' | 'published',
          tagIds: pub.tags.map(t => t.tag.id),
        })
      } else {
        alert('Error al cargar publicación')
        router.push('/admin/publications')
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoadingData(false)
    }
  }

  const handleTagToggle = (tagId: number) => {
    const tagIds = formData.tagIds.includes(tagId)
      ? formData.tagIds.filter(id => id !== tagId)
      : [...formData.tagIds, tagId]
    setFormData({ ...formData, tagIds })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const headers = getAuthHeaders()
      const response = await fetch(`/api/publications/${params.id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Error al actualizar')
      }

      alert('Publicación actualizada exitosamente')
      router.push('/admin/publications')
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Error al actualizar')
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

  if (loadingData) {
    return <div className="text-center py-8">Cargando...</div>
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-3xl font-bold">Editar Publicación</h2>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Título *</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Slug</label>
          <input
            type="text"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg"
            rows={3}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Imagen destacada</label>
          <div className="flex gap-2">
            <input
              type="url"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              className="flex-1 px-4 py-2 border rounded-lg"
            />
            <button
              type="button"
              onClick={() => window.open('/admin/gallery', '_blank')}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
            >
              📁 Galería
            </button>
          </div>
          {formData.imageUrl && (
            <img src={formData.imageUrl} alt="Preview" className="mt-2 h-32 object-cover rounded" />
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Contenido *</label>
          <ReactQuill
            theme="snow"
            value={formData.content}
            onChange={(content) => setFormData({ ...formData, content })}
            modules={modules}
            className="h-64 mb-12"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Etiquetas</label>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button
                key={tag.id}
                type="button"
                onClick={() => handleTagToggle(tag.id)}
                className={`px-4 py-2 rounded-full text-sm ${
                  formData.tagIds.includes(tag.id)
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                {tag.name}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
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

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg disabled:opacity-50"
          >
            {loading ? 'Guardando...' : 'Guardar Cambios'}
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
