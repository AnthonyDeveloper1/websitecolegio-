/**
 * Hook para manejar errores de autenticación
 * Redirige al login si el token es inválido (401)
 */

import { useRouter } from 'next/navigation'

export function useAuthCheck() {
  const router = useRouter()

  const checkAuthError = (response: Response) => {
    if (response.status === 401) {
      // Token inválido - limpiar y redirigir
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      router.push('/login')
      return true
    }
    return false
  }

  return { checkAuthError }
}
