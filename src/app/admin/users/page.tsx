'use client'

import { useState, useEffect } from 'react'
import { getAuthHeaders, getUser } from '@/lib/client-auth'

interface User {
  id: number
  email: string
  username: string
  fullName: string
  isActive: boolean
  createdAt: string
  role: {
    id: number
    nombre: string
  } | null
}

interface Role {
  id: number
  nombre: string
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [roles, setRoles] = useState<Role[]>([])
  const [loading, setLoading] = useState(true)
  const currentUser = getUser()

  useEffect(() => {
    // Verificar permisos
    if (currentUser?.roleName !== 'Administrador' && currentUser?.roleName !== 'Super Administrador') {
      alert('No tienes permisos para ver esta sección')
      window.location.href = '/admin'
      return
    }

    loadUsers()
    loadRoles()
  }, [])

  const loadUsers = async () => {
    try {
      const headers = getAuthHeaders()
      const response = await fetch('/api/users', { headers })
      
      if (response.ok) {
        const data = await response.json()
        setUsers(Array.isArray(data) ? data : [])
      }
    } catch (error) {
      console.error('Error:', error)
      setUsers([])
    } finally {
      setLoading(false)
    }
  }

  const loadRoles = async () => {
    try {
      const response = await fetch('/api/roles')
      if (response.ok) {
        const data = await response.json()
        setRoles(Array.isArray(data) ? data : [])
      }
    } catch (error) {
      console.error('Error cargando roles:', error)
      setRoles([])
    }
  }

  const handleToggleActive = async (userId: number, isActive: boolean) => {
    if (userId === currentUser?.id) {
      alert('No puedes desactivar tu propia cuenta')
      return
    }

    try {
      const headers = getAuthHeaders()
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ isActive }),
      })

      if (!response.ok) {
        throw new Error('Error al actualizar')
      }

      setUsers(users.map(u => 
        u.id === userId ? { ...u, isActive } : u
      ))
    } catch (error) {
      alert('Error al actualizar usuario')
    }
  }

  const getRoleBadgeColor = (roleName: string | null) => {
    switch (roleName) {
      case 'Super Administrador':
        return 'bg-purple-100 text-purple-800'
      case 'Administrador':
        return 'bg-blue-100 text-blue-800'
      case 'Editor':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return <div className="text-center py-8">Cargando...</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Usuarios</h2>
        <div className="text-sm text-gray-600">
          Total: {users.length} usuarios
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usuario</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rol</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Registro</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div>
                      <div className="font-medium text-gray-900">{user.fullName}</div>
                      <div className="text-sm text-gray-500">@{user.username}</div>
                    </div>
                    {user.id === currentUser?.id && (
                      <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                        Tú
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {user.email}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${getRoleBadgeColor(user.role?.nombre || null)}`}>
                    {user.role?.nombre || 'Sin rol'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    user.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {user.isActive ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right text-sm">
                  {user.id !== currentUser?.id && (
                    <button
                      onClick={() => handleToggleActive(user.id, !user.isActive)}
                      className={`${
                        user.isActive
                          ? 'text-red-600 hover:text-red-900'
                          : 'text-green-600 hover:text-green-900'
                      }`}
                    >
                      {user.isActive ? 'Desactivar' : 'Activar'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">ℹ️ Información</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Solo Administradores y Super Administradores pueden ver esta sección</li>
          <li>• No puedes desactivar tu propia cuenta</li>
          <li>• Para crear usuarios, utiliza el endpoint de registro con credenciales de admin</li>
        </ul>
      </div>
    </div>
  )
}
