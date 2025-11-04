/**
 * API Route: Correo de destino individual
 * GET /api/destination-emails/[id] - Obtener correo
 * PUT /api/destination-emails/[id] - Actualizar correo
 * DELETE /api/destination-emails/[id] - Eliminar correo
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Obtener un correo de destino
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userRole = request.headers.get('x-user-role')
    
    if (userRole !== 'Administrador' && userRole !== 'Super Administrador' && userRole !== 'Editor') {
      return NextResponse.json(
        { error: 'Sin permisos' },
        { status: 403 }
      )
    }

    const id = parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'ID inválido' },
        { status: 400 }
      )
    }

    const email = await prisma.destinationEmail.findUnique({
      where: { id },
    })

    if (!email) {
      return NextResponse.json(
        { error: 'Correo no encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(email)
  } catch (error) {
    console.error('Error al obtener correo:', error)
    return NextResponse.json(
      { error: 'Error al obtener correo' },
      { status: 500 }
    )
  }
}

// PUT - Actualizar correo de destino
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userRole = request.headers.get('x-user-role')
    
    if (userRole !== 'Administrador' && userRole !== 'Super Administrador') {
      return NextResponse.json(
        { error: 'Sin permisos' },
        { status: 403 }
      )
    }

    const id = parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'ID inválido' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const { name, email, isActive } = body

    // Validaciones
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        return NextResponse.json(
          { error: 'Formato de correo inválido' },
          { status: 400 }
        )
      }

      // Verificar si el email ya existe en otro registro
      const existing = await prisma.destinationEmail.findFirst({
        where: {
          email,
          id: { not: id },
        },
      })

      if (existing) {
        return NextResponse.json(
          { error: 'Este correo ya está registrado' },
          { status: 409 }
        )
      }
    }

    const destinationEmail = await prisma.destinationEmail.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(email && { email }),
        ...(typeof isActive === 'boolean' && { isActive }),
      },
    })

    return NextResponse.json(destinationEmail)
  } catch (error) {
    console.error('Error al actualizar correo:', error)
    
    if (error instanceof Error && error.message.includes('Record to update not found')) {
      return NextResponse.json(
        { error: 'Correo no encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: 'Error al actualizar correo' },
      { status: 500 }
    )
  }
}

// DELETE - Eliminar correo de destino
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userRole = request.headers.get('x-user-role')
    
    if (userRole !== 'Administrador' && userRole !== 'Super Administrador') {
      return NextResponse.json(
        { error: 'Solo administradores pueden eliminar correos' },
        { status: 403 }
      )
    }

    const id = parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'ID inválido' },
        { status: 400 }
      )
    }

    await prisma.destinationEmail.delete({
      where: { id },
    })

    return NextResponse.json({ 
      success: true, 
      message: 'Correo eliminado correctamente' 
    })
  } catch (error) {
    console.error('Error al eliminar correo:', error)
    
    if (error instanceof Error && error.message.includes('Record to delete does not exist')) {
      return NextResponse.json(
        { error: 'Correo no encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: 'Error al eliminar correo' },
      { status: 500 }
    )
  }
}
