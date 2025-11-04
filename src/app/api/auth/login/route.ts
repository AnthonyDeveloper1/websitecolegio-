/**
 * API Route: Login de usuarios
 * POST /api/auth/login
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyPassword, generateToken } from '@/lib/auth'
import { loginSchema } from '@/lib/validations'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = loginSchema.parse(body)
    
    // Buscar usuario con rol
    const user = await prisma.user.findUnique({
      where: { email: validatedData.correo },
      include: { role: true },
    })
    
    if (!user) {
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      )
    }
    
    // Verificar contraseña
    const isValidPassword = await verifyPassword(
      validatedData.clave,
      user.password
    )
    
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      )
    }
    
    if (!user.isActive) {
      return NextResponse.json(
        { error: 'Usuario desactivado' },
        { status: 403 }
      )
    }
    
    // Actualizar última conexión
    await prisma.user.update({
      where: { id: user.id },
      data: { lastConnection: new Date() },
    })
    
    // Generar token JWT
    const token = generateToken({
      userId: user.id,
      email: user.email,
      username: user.username,
      roleId: user.roleId,
      roleName: user.role?.name || null,
    })
    
    return NextResponse.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        fullName: user.fullName,
        role: user.role?.name || null,
      },
    })
  } catch (error) {
    console.error('Error en login:', error)
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Datos inválidos' },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
