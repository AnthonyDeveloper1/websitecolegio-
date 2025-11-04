'use client'

import { useState, useEffect } from 'react'
import { getAuthHeaders } from '@/lib/client-auth'
import Image from 'next/image'

interface Director {
  id: number
  nombre: string
  cargo: string
  descripcion: string | null
  fotoUrl: string | null
  orden: number
  fechaCreacion: string
}

export default function DirectorsPage() {
  const [directors, setDirectors] = useState<Director[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingDirector, setEditingDirector] = useState<Director | null>(null)
  const [formData, setFormData] = useState({
    nombre: '',
    cargo: '',
    descripcion: '',
    fotoUrl: '',
    orden: 0,
  })

  useEffect(() => {
    loadDirectors()
  }, [])

  const loadDirectors = async () => {
    try {
      const response = await fetch('/api/directors')
      if (response.ok) {
        const data = await response.json()
        setDirectors(Array.isArray(data) ? data : [])
      }
    } catch (error) {
      console.error('Error:', error)
      setDirectors([])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const headers = getAuthHeaders()
      const url = editingDirector ? `/api/directors/${editingDirector.id}` : '/api/directors'
      const method = editingDirector ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Error al guardar')
      }

      alert(editingDirector ? 'Directivo actualizado' : 'Directivo creado')
      setShowForm(false)
      setEditingDirector(null)
      setFormData({ nombre: '', cargo: '', descripcion: '', fotoUrl: '', orden: 0 })
      loadDirectors()
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Error al guardar')
    }
  }

  const handleEdit = (director: Director) => {
    setEditingDirector(director)
    setFormData({
      nombre: director.nombre,
      cargo: director.cargo,
      descripcion: director.descripcion || '',
      fotoUrl: director.fotoUrl || '',
      orden: director.orden,
    })
    setShowForm(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('¿Eliminar este directivo?')) return

    try {
      const headers = getAuthHeaders()
      const response = await fetch(`/api/directors/${id}`, {
        method: 'DELETE',
        headers,
      })

      if (response.ok) {
        setDirectors(directors.filter(d => d.id !== id))
      } else {
        throw new Error('Error al eliminar')
      }
    } catch (error) {
      alert('Error al eliminar directivo')
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingDirector(null)
    setFormData({ nombre: '', cargo: '', descripcion: '', fotoUrl: '', orden: 0 })
  }

  if (loading) {
    return <div className="text-center py-8">Cargando...</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Directivos</h2>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg"
          >
            ➕ Nuevo Directivo
          </button>
        )}
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-xl font-bold mb-4">
            {editingDirector ? 'Editar Directivo' : 'Nuevo Directivo'}
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-2">Nombre completo *</label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Cargo *</label>
                <input
                  type="text"
                  value={formData.cargo}
                  onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                  placeholder="Director General, Subdirector, etc."
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Descripción</label>
              <textarea
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
                rows={3}
                placeholder="Breve biografía o descripción profesional"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">URL de foto</label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={formData.fotoUrl}
                  onChange={(e) => setFormData({ ...formData, fotoUrl: e.target.value })}
                  className="flex-1 px-4 py-2 border rounded-lg"
                  placeholder="https://..."
                />
                <button
                  type="button"
                  onClick={() => window.open('/admin/gallery', '_blank')}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
                >
                  📁 Galería
                </button>
              </div>
              {formData.fotoUrl && (
                <div className="mt-2 relative w-32 h-32">
                  <Image
                    src={formData.fotoUrl}
                    alt="Preview"
                    fill
                    className="object-cover rounded"
                  />
                </div>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Orden de visualización</label>
              <input
                type="number"
                value={formData.orden}
                onChange={(e) => setFormData({ ...formData, orden: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 border rounded-lg"
                min="0"
              />
              <p className="text-xs text-gray-500 mt-1">
                Menor número aparece primero
              </p>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg"
              >
                {editingDirector ? 'Actualizar' : 'Crear'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-300 hover:bg-gray-400 px-6 py-2 rounded-lg"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {directors.map((director) => (
          <div key={director.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            {director.fotoUrl && (
              <div className="relative h-48 bg-gray-100">
                <Image
                  src={director.fotoUrl}
                  alt={director.nombre}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="p-4">
              <h3 className="font-bold text-lg">{director.nombre}</h3>
              <p className="text-blue-600 text-sm mb-2">{director.cargo}</p>
              {director.descripcion && (
                <p className="text-sm text-gray-600 mb-3">{director.descripcion}</p>
              )}
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>Orden: {director.orden}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(director)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(director.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {directors.length === 0 && !showForm && (
        <div className="text-center py-12 text-gray-500">
          No hay directivos registrados
        </div>
      )}
    </div>
  )
}
