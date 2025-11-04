'use client'

import { useState, useEffect } from 'react'
import { getAuthHeaders } from '@/lib/client-auth'

interface ContactMessage {
  id: number
  name: string
  email: string
  phone: string | null
  message: string
  isReplied: boolean
  repliedAt: string | null
  createdAt: string
  subject: {
    nombre: string
  }
}

export default function ContactPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'replied'>('pending')
  const [destinationEmails, setDestinationEmails] = useState<any[]>([])

  useEffect(() => {
    loadMessages()
    loadDestinationEmails()
  }, [])

  const loadDestinationEmails = async () => {
    try {
      const headers = getAuthHeaders()
      const response = await fetch('/api/destination-emails?active=true', { headers })
      
      if (response.status === 401) {
        // Token inválido - forzar logout
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        window.location.href = '/login'
        return
      }
      
      if (response.ok) {
        const data = await response.json()
        setDestinationEmails(Array.isArray(data) ? data : [])
      }
    } catch (error) {
      console.error('Error al cargar correos:', error)
    }
  }

  const loadMessages = async () => {
    try {
      const headers = getAuthHeaders()
      const response = await fetch('/api/contact', { headers })
      
      if (response.status === 401) {
        // Token inválido - forzar logout
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        window.location.href = '/login'
        return
      }
      
      if (response.ok) {
        const data = await response.json()
        setMessages(Array.isArray(data) ? data : [])
      }
    } catch (error) {
      console.error('Error:', error)
      setMessages([])
    } finally {
      setLoading(false)
    }
  }

  const handleMarkReplied = async (id: number, replied: boolean) => {
    try {
      const headers = getAuthHeaders()
      const response = await fetch(`/api/contact/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ isReplied: replied }),
      })

      if (!response.ok) {
        throw new Error('Error al actualizar')
      }

      setMessages(messages.map(m =>
        m.id === id ? { ...m, isReplied: replied, repliedAt: replied ? new Date().toISOString() : null } : m
      ))
    } catch (error) {
      alert('Error al actualizar mensaje')
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('¿Eliminar este mensaje?')) return

    try {
      const headers = getAuthHeaders()
      const response = await fetch(`/api/contact/${id}`, {
        method: 'DELETE',
        headers,
      })

      if (response.ok) {
        setMessages(messages.filter(m => m.id !== id))
      }
    } catch (error) {
      alert('Error al eliminar')
    }
  }

  const filteredMessages = messages.filter(msg => {
    if (filter === 'all') return true
    if (filter === 'pending') return !msg.isReplied
    if (filter === 'replied') return msg.isReplied
    return true
  })

  if (loading) {
    return <div className="text-center py-8">Cargando...</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Mensajes de Contacto</h2>
        <a
          href="/admin/destination-emails"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          ⚙️ Configurar Correos de Notificación
        </a>
      </div>

      {/* Correos de destino configurados */}
      {destinationEmails.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-blue-900 mb-2">📧 Correos que reciben notificaciones:</h3>
          <div className="flex flex-wrap gap-2">
            {destinationEmails.map((email) => (
              <span 
                key={email.id}
                className="inline-flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
              >
                <span className="mr-1">✉️</span>
                {email.name}: {email.email}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Advertencia si no hay correos configurados */}
      {destinationEmails.length === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-yellow-800">
            ⚠️ No hay correos de destino configurados. 
            <a 
              href="/admin/destination-emails" 
              className="underline ml-1 font-semibold hover:text-yellow-900"
            >
              Configurar ahora
            </a>
          </p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded ${
              filter === 'pending' ? 'bg-red-500 text-white' : 'bg-gray-200'
            }`}
          >
            📬 Pendientes ({messages.filter(m => !m.isReplied).length})
          </button>
          <button
            onClick={() => setFilter('replied')}
            className={`px-4 py-2 rounded ${
              filter === 'replied' ? 'bg-green-500 text-white' : 'bg-gray-200'
            }`}
          >
            ✅ Respondidos ({messages.filter(m => m.isReplied).length})
          </button>
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded ${
              filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            📋 Todos ({messages.length})
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {filteredMessages.map((msg) => (
          <div
            key={msg.id}
            className={`bg-white rounded-lg shadow-md p-6 ${
              !msg.isReplied ? 'border-l-4 border-red-500' : 'border-l-4 border-green-500'
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-lg">{msg.name}</h3>
                <p className="text-sm text-gray-600">{msg.email}</p>
                {msg.phone && (
                  <p className="text-sm text-gray-600">📞 {msg.phone}</p>
                )}
                <p className="text-xs text-blue-600 mt-1">
                  Asunto: {msg.subject.nombre}
                </p>
              </div>
              <div className="text-right">
                <span
                  className={`px-3 py-1 text-xs rounded-full inline-block ${
                    msg.isReplied
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {msg.isReplied ? 'Respondido' : 'Pendiente'}
                </span>
                <p className="text-xs text-gray-500 mt-2">
                  {new Date(msg.createdAt).toLocaleString()}
                </p>
                {msg.repliedAt && (
                  <p className="text-xs text-gray-400">
                    Respondido: {new Date(msg.repliedAt).toLocaleString()}
                  </p>
                )}
              </div>
            </div>

            <div className="bg-gray-50 rounded p-4 mb-4">
              <p className="text-gray-700 whitespace-pre-wrap">{msg.message}</p>
            </div>

            <div className="flex gap-2">
              <a
                href={`mailto:${msg.email}?subject=Re: ${msg.subject.nombre}`}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm inline-block"
              >
                📧 Responder por Email
              </a>
              {!msg.isReplied && (
                <button
                  onClick={() => handleMarkReplied(msg.id, true)}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded text-sm"
                >
                  ✅ Marcar como Respondido
                </button>
              )}
              {msg.isReplied && (
                <button
                  onClick={() => handleMarkReplied(msg.id, false)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded text-sm"
                >
                  ↩️ Marcar como Pendiente
                </button>
              )}
              <button
                onClick={() => handleDelete(msg.id)}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm ml-auto"
              >
                🗑️ Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredMessages.length === 0 && (
        <div className="text-center py-12 text-gray-500 bg-white rounded-lg">
          No hay mensajes {filter !== 'all' && `en estado "${filter}"`}
        </div>
      )}
    </div>
  )
}
