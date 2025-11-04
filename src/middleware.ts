/**
 * Middleware de Next.js
 * Maneja autenticación y protección de rutas
 */

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from '@/lib/auth'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Solo aplicar middleware a rutas API protegidas
  if (!pathname.startsWith('/api/')) {
    return NextResponse.next()
  }

  // Rutas API públicas (GET) y rutas de auth públicas (POST)
  const publicApiPaths = [
    '/api/test',
    '/api/publications',
    '/api/tags',
    '/api/categories',
    '/api/comments',
    '/api/directors',
    '/api/contact-subjects',
    '/api/contact/subjects',
    '/api/roles',
  ]

  // Permitir GET en rutas públicas
  const isPublicApi = publicApiPaths.some(path => pathname.startsWith(path))
  if (isPublicApi && request.method === 'GET') {
    return NextResponse.next()
  }

  // Permitir POST para endpoints de autenticación (login / register)
  if ((pathname === '/api/auth/login' || pathname === '/api/auth/register') && request.method === 'POST') {
    return NextResponse.next()
  }

  // Permitir POST en contacto (formulario público)
  if (pathname === '/api/contact' && request.method === 'POST') {
    return NextResponse.next()
  }

  // Para rutas protegidas, verificar token
  const token = request.headers.get('authorization')?.replace('Bearer ', '')

  console.log('🔍 Middleware - Ruta:', pathname)
  console.log('🔍 Token recibido:', token ? token.substring(0, 20) + '...' : 'NO HAY TOKEN')

  if (!token) {
    console.log('❌ No hay token')
    return NextResponse.json(
      { error: 'No autorizado' },
      { status: 401 }
    )
  }

  // Verificar validez del token
  const payload = verifyToken(token)
  
  console.log('🔍 Payload:', payload)
  
  if (!payload) {
    console.log('❌ Token inválido')
    if (pathname.startsWith('/api/')) {
      return NextResponse.json(
        { error: 'Token inválido' },
        { status: 401 }
      )
    }
    
    const loginUrl = new URL('/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  // Verificar rutas de admin
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    if (payload.roleName !== 'Administrador') {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json(
          { error: 'Acceso denegado' },
          { status: 403 }
        )
      }
      
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  // Agregar información del usuario a los headers
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-user-id', payload.userId.toString())
  requestHeaders.set('x-user-email', payload.email)
  requestHeaders.set('x-user-username', payload.username)
  requestHeaders.set('x-user-role', payload.roleName || '')

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}

export const config = {
  matcher: [
    '/api/:path*',
  ],
}
