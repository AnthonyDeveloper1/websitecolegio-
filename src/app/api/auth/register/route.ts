/**
 * API Route: Registro de usuarios
 * POST /api/auth/register
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword, generateToken } from '@/lib/auth'
import { registerSchema } from '@/lib/validations'
import { sendWelcomeEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = registerSchema.parse(body)
    
    // Verificar email y username
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: validatedData.email },
          { username: validatedData.username },
        ],
      },
    })
    
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email o username ya registrado' },
        { status: 400 }
      )
    }
    
    // Obtener rol de Usuario
    const userRole = await prisma.role.findUnique({
      where: { name: 'Usuario' },
    })
    
    if (!userRole) {
      return NextResponse.json(
        { error: 'Rol no encontrado' },
        { status: 500 }
      )
    }
    
    const hashedPassword = await hashPassword(validatedData.password)
    
    // Crear usuario
    const user = await prisma.user.create({
      data: {
        email: validatedData.email,
        username: validatedData.username,
        fullName: validatedData.fullName,
        password: hashedPassword,
        roleId: userRole.id,
      },
      include: { role: true },
    })
    
    sendWelcomeEmail(user.email, user.fullName).catch(err =>
      console.error('Error al enviar email:', err)
    )
    
    const token = generateToken({
      userId: user.id,
      email: user.email,
      username: user.username,
      roleId: user.roleId,
      roleName: user.role?.name || null,
    })
    
    return NextResponse.json(
      {
        token,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          fullName: user.fullName,
          role: user.role?.name || null,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error en registro:', error)
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Datos inválidos' },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Error interno' },
      { status: 500 }
    )
  }
}
