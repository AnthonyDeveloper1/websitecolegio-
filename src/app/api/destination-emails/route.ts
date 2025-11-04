/**
 * API Route: Correos de destino para notificaciones
 * GET /api/destination-emails - Listar correos
 * POST /api/destination-emails - Crear correo de destino
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Listar correos de destino
export async function GET(request: NextRequest) {
  try {
    const userRole = request.headers.get('x-user-role')
    
    if (userRole !== 'Administrador' && userRole !== 'Super Administrador' && userRole !== 'Editor') {
      return NextResponse.json(
        { error: 'Sin permisos' },
        { status: 403 }
      )
    }
    
    const { searchParams } = new URL(request.url)
    const activeOnly = searchParams.get('active') === 'true'
    
    const where = activeOnly ? { isActive: true } : {}
    
    const emails = await prisma.destinationEmail.findMany({
      where,
      orderBy: { id: 'asc' },
    })
    
    return NextResponse.json(emails)
  } catch (error) {
    console.error('Error al obtener correos:', error)
    return NextResponse.json(
      { error: 'Error al obtener correos de destino' },
      { status: 500 }
    )
  }
}

// POST - Crear correo de destino
export async function POST(request: NextRequest) {
  try {
    const userRole = request.headers.get('x-user-role')
    
    if (userRole !== 'Administrador' && userRole !== 'Super Administrador') {
      return NextResponse.json(
        { error: 'Sin permisos' },
        { status: 403 }
      )
    }
    
    const body = await request.json()
    const { name, email, isActive } = body
    
    // Validaciones
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Nombre y correo son requeridos' },
        { status: 400 }
      )
    }
    
    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Formato de correo inválido' },
        { status: 400 }
      )
    }
    
    // Verificar si el email ya existe
    const existing = await prisma.destinationEmail.findUnique({
      where: { email },
    })
    
    if (existing) {
      return NextResponse.json(
        { error: 'Este correo ya está registrado' },
        { status: 409 }
      )
    }
    
    const destinationEmail = await prisma.destinationEmail.create({
      data: {
        name: name,
        email: email,
        isActive: isActive ?? true,
      } as any,
    })
    
    return NextResponse.json(destinationEmail, { status: 201 })
  } catch (error) {
    console.error('Error al crear correo:', error)
    return NextResponse.json(
      { error: 'Error al crear correo de destino' },
      { status: 500 }
    )
  }
}
