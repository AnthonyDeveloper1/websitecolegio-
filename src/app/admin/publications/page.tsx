'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getAuthHeaders } from '@/lib/client-auth'
import Link from 'next/link'

interface Publication {
  id: number
  title: string
  slug: string
  description: string | null
  imageUrl: string | null
  status: string
  createdAt: string
  author: {
    fullName: string
  }
  tags: Array<{
    tag: {
      name: string
    }
  }>
}

export default function PublicationsPage() {
  const router = useRouter()
  const [publications, setPublications] = useState<Publication[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all')

  useEffect(() => {
    loadPublications()
  }, [])

  const loadPublications = async () => {
    try {
      const headers = getAuthHeaders()
      const response = await fetch('/api/publications', { headers })
      
      if (response.ok) {
        const data = await response.json()
        setPublications(Array.isArray(data) ? data : [])
      }
    } catch (error) {
      console.error('Error cargando publicaciones:', error)
      setPublications([])
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('¿Eliminar esta publicación?')) return

    try {
      const headers = getAuthHeaders()
      const response = await fetch(`/api/publications/${id}`, {
        method: 'DELETE',
        headers,
      })

      if (response.ok) {
        setPublications(publications.filter(p => p.id !== id))
      } else {
        alert('Error al eliminar')
      }
    } catch (error) {
      alert('Error al eliminar publicación')
    }
  }

  const filteredPublications = publications.filter(pub => {
    if (filter === 'all') return true
    return pub.status === filter
  })

  if (loading) {
    return <div className="text-center py-8">Cargando publicaciones...</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Publicaciones</h2>
        <Link
          href="/admin/publications/new"
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg"
        >
          ➕ Nueva Publicación
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded ${filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Todas ({publications.length})
          </button>
          <button
            onClick={() => setFilter('published')}
            className={`px-4 py-2 rounded ${filter === 'published' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
          >
            Publicadas ({publications.filter(p => p.status === 'published').length})
          </button>
          <button
            onClick={() => setFilter('draft')}
            className={`px-4 py-2 rounded ${filter === 'draft' ? 'bg-yellow-500 text-white' : 'bg-gray-200'}`}
          >
            Borradores ({publications.filter(p => p.status === 'draft').length})
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Título</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Autor</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Etiquetas</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredPublications.map((pub) => (
              <tr key={pub.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">{pub.title}</div>
                  <div className="text-sm text-gray-500">{pub.slug}</div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {pub.author.fullName}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    pub.status === 'published' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {pub.status === 'published' ? 'Publicado' : 'Borrador'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {pub.tags.map(t => t.tag.name).join(', ')}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(pub.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right text-sm font-medium">
                  <Link
                    href={`/admin/publications/${pub.id}`}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    Editar
                  </Link>
                  <button
                    onClick={() => handleDelete(pub.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredPublications.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No hay publicaciones {filter !== 'all' && `en estado "${filter}"`}
          </div>
        )}
      </div>
    </div>
  )
}
