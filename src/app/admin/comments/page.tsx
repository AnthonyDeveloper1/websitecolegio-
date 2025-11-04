'use client'

import { useState, useEffect } from 'react'
import { getAuthHeaders } from '@/lib/client-auth'

interface Comment {
  id: number
  name: string
  email: string
  message: string
  isApproved: boolean
  createdAt: string
  publication: {
    title: string
  }
}

export default function CommentsPage() {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('pending')

  useEffect(() => {
    loadComments()
  }, [])

  const loadComments = async () => {
    try {
      const response = await fetch('/api/comments')
      if (response.ok) {
        const data = await response.json()
        setComments(Array.isArray(data) ? data : [])
      }
    } catch (error) {
      console.error('Error:', error)
      setComments([])
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (id: number, approve: boolean) => {
    try {
      const headers = getAuthHeaders()
      const response = await fetch(`/api/comments/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ isApproved: approve }),
      })

      if (!response.ok) {
        throw new Error('Error al actualizar')
      }

      setComments(comments.map(c => 
        c.id === id ? { ...c, isApproved: approve } : c
      ))
    } catch (error) {
      alert('Error al actualizar comentario')
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('¿Eliminar este comentario?')) return

    try {
      const headers = getAuthHeaders()
      const response = await fetch(`/api/comments/${id}`, {
        method: 'DELETE',
        headers,
      })

      if (response.ok) {
        setComments(comments.filter(c => c.id !== id))
      }
    } catch (error) {
      alert('Error al eliminar')
    }
  }

  const filteredComments = comments.filter(comment => {
    if (filter === 'all') return true
    if (filter === 'pending') return !comment.isApproved
    if (filter === 'approved') return comment.isApproved
    return true
  })

  if (loading) {
    return <div className="text-center py-8">Cargando...</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Comentarios</h2>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded ${
              filter === 'pending' ? 'bg-yellow-500 text-white' : 'bg-gray-200'
            }`}
          >
            ⏳ Pendientes ({comments.filter(c => !c.isApproved).length})
          </button>
          <button
            onClick={() => setFilter('approved')}
            className={`px-4 py-2 rounded ${
              filter === 'approved' ? 'bg-green-500 text-white' : 'bg-gray-200'
            }`}
          >
            ✅ Aprobados ({comments.filter(c => c.isApproved).length})
          </button>
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded ${
              filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            📋 Todos ({comments.length})
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {filteredComments.map((comment) => (
          <div
            key={comment.id}
            className={`bg-white rounded-lg shadow-md p-6 ${
              !comment.isApproved ? 'border-l-4 border-yellow-500' : 'border-l-4 border-green-500'
            }`}
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-bold text-lg">{comment.name}</h3>
                <p className="text-sm text-gray-500">{comment.email}</p>
                <p className="text-xs text-gray-400 mt-1">
                  En: {comment.publication.title}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-1 text-xs rounded-full ${
                    comment.isApproved
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {comment.isApproved ? 'Aprobado' : 'Pendiente'}
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            <p className="text-gray-700 mb-4">{comment.message}</p>

            <div className="flex gap-2">
              {!comment.isApproved && (
                <button
                  onClick={() => handleApprove(comment.id, true)}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded text-sm"
                >
                  ✅ Aprobar
                </button>
              )}
              {comment.isApproved && (
                <button
                  onClick={() => handleApprove(comment.id, false)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded text-sm"
                >
                  ⏸️ Desaprobar
                </button>
              )}
              <button
                onClick={() => handleDelete(comment.id)}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm"
              >
                🗑️ Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredComments.length === 0 && (
        <div className="text-center py-12 text-gray-500 bg-white rounded-lg">
          No hay comentarios {filter !== 'all' && `en estado "${filter}"`}
        </div>
      )}
    </div>
  )
}
