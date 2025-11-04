/**
 * Utilidades de autenticación para el cliente (browser)
 */

export interface AuthUser {
  id: number
  email: string
  username: string
  fullName: string
  roleId: number
  roleName: string
}

export interface AuthResponse {
  token: string
  user: AuthUser
}

// Guardar token en localStorage
export const saveToken = (token: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('auth_token', token)
  }
}

// Obtener token
export const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('auth_token')
  }
  return null
}

// Eliminar token
export const removeToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
  }
}

// Guardar usuario
export const saveUser = (user: AuthUser) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('auth_user', JSON.stringify(user))
  }
}

// Obtener usuario
export const getUser = (): AuthUser | null => {
  if (typeof window !== 'undefined') {
    const userStr = localStorage.getItem('auth_user')
    return userStr ? JSON.parse(userStr) : null
  }
  return null
}

// Verificar si está autenticado
export const isAuthenticated = (): boolean => {
  return !!getToken()
}

// Verificar si es Admin o Super Admin
export const isAdmin = (): boolean => {
  const user = getUser()
  return user?.roleName === 'Administrador' || user?.roleName === 'Super Administrador'
}

// Verificar si es Super Admin
export const isSuperAdmin = (): boolean => {
  const user = getUser()
  return user?.roleName === 'Super Administrador'
}

// Headers con autenticación
export const getAuthHeaders = () => {
  const token = getToken()
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  }
}

// Headers con autenticación para FormData (sin Content-Type)
export const getAuthHeadersForFormData = () => {
  const token = getToken()
  const headers: HeadersInit = {}
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  return headers
}

// Logout
export const logout = () => {
  removeToken()
  if (typeof window !== 'undefined') {
    window.location.href = '/login'
  }
}
