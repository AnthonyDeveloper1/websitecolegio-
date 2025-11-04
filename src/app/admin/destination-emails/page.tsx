'use client'

import { useState, useEffect } from 'react'
import { getAuthHeaders } from '@/lib/client-auth'

interface DestinationEmail {
  id: number
  name: string
  email: string
  isActive: boolean
}

export default function DestinationEmailsPage() {
  const [emails, setEmails] = useState<DestinationEmail[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    isActive: true,
  })

  useEffect(() => {
    loadEmails()
  }, [])

  const loadEmails = async () => {
    try {
      const headers = getAuthHeaders()
      const response = await fetch('/api/destination-emails', { headers })
      
      if (response.ok) {
        const data = await response.json()
        setEmails(Array.isArray(data) ? data : [])
      }
    } catch (error) {
      console.error('Error:', error)
      setEmails([])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const headers = getAuthHeaders()
      const url = editingId
        ? `/api/destination-emails/${editingId}`
        : '/api/destination-emails'
      
      const response = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers,
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const error = await response.json()
        alert(error.error || 'Error al guardar')
        return
      }

      await loadEmails()
      resetForm()
    } catch (error) {
      alert('Error al guardar correo')
    }
  }

  const handleEdit = (email: DestinationEmail) => {
    setEditingId(email.id)
    setFormData({
      name: email.name,
      email: email.email,
      isActive: email.isActive,
    })
    setShowForm(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('¿Eliminar este correo de destino?')) return

    try {
      const headers = getAuthHeaders()
      const response = await fetch(`/api/destination-emails/${id}`, {
        method: 'DELETE',
        headers,
      })

      if (response.ok) {
        setEmails(emails.filter(e => e.id !== id))
      } else {
        alert('Error al eliminar')
      }
    } catch (error) {
      alert('Error al eliminar correo')
    }
  }

  const resetForm = () => {
    setFormData({ name: '', email: '', isActive: true })
    setEditingId(null)
    setShowForm(false)
  }

  const toggleActive = async (id: number, currentStatus: boolean) => {
    try {
      const headers = getAuthHeaders()
      const response = await fetch(`/api/destination-emails/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ isActive: !currentStatus }),
      })

      if (response.ok) {
        setEmails(emails.map(e =>
          e.id === id ? { ...e, isActive: !currentStatus } : e
        ))
      }
    } catch (error) {
      alert('Error al cambiar estado')
    }
  }

  if (loading) {
    return <div className="text-center py-8">Cargando...</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold">📧 Correos de Destino</h2>
          <p className="text-gray-600 mt-2">
            Gestiona los correos electrónicos que recibirán las notificaciones de contacto
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          {showForm ? '✖️ Cancelar' : '➕ Agregar Correo'}
        </button>
      </div>

      {/* Formulario */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="font-semibold text-lg mb-4">
            {editingId ? '✏️ Editar Correo' : '➕ Nuevo Correo de Destino'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Nombre / Descripción
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ej: Administración, Dirección, etc."
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Correo Electrónico
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="ejemplo@colegio.edu"
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-4 h-4"
              />
              <label htmlFor="isActive" className="text-sm">
                Activo (recibirá notificaciones)
              </label>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded"
              >
                💾 {editingId ? 'Actualizar' : 'Guardar'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-2 rounded"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de correos */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {emails.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg mb-2">📭 No hay correos de destino configurados</p>
            <p className="text-sm">Agrega al menos un correo para recibir notificaciones</p>
          </div>
        ) : (
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Nombre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Correo Electrónico
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Estado
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {emails.map((email) => (
                <tr key={email.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{email.name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600">{email.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleActive(email.id, email.isActive)}
                      className={`px-3 py-1 text-xs rounded-full font-medium ${
                        email.isActive
                          ? 'bg-green-100 text-green-800 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                    >
                      {email.isActive ? '✅ Activo' : '⏸️ Inactivo'}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleEdit(email)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        ✏️ Editar
                      </button>
                      <button
                        onClick={() => handleDelete(email.id)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        🗑️ Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Información adicional */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2">ℹ️ Información</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Los correos activos recibirán notificaciones cuando alguien envíe un mensaje de contacto</li>
          <li>• Puedes tener múltiples correos de destino activos</li>
          <li>• Los correos inactivos no recibirán notificaciones pero permanecerán guardados</li>
          <li>• Solo los administradores pueden gestionar los correos de destino</li>
        </ul>
      </div>
    </div>
  )
}
