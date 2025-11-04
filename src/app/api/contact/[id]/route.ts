/**
 * API Route: Mensaje de contacto por ID
 * PUT /api/contact/[id] - Marcar como respondido
 * DELETE /api/contact/[id] - Eliminar mensaje
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// PUT - Marcar como respondido
export async function PUT(
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
    
    const body = await request.json()
    
    const message = await prisma.contactMessage.update({
      where: { id: parseInt(params.id) },
      data: {
        isReplied: body.isReplied ?? true,
        repliedAt: body.isReplied ? new Date() : null,
      },
    })
    
    return NextResponse.json(message)
  } catch (error) {
    console.error('Error al actualizar mensaje:', error)
    return NextResponse.json(
      { error: 'Error al actualizar mensaje' },
      { status: 500 }
    )
  }
}

// DELETE
export async function DELETE(
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
    
    await prisma.contactMessage.delete({
      where: { id: parseInt(params.id) },
    })
    
    return NextResponse.json({ message: 'Mensaje eliminado' })
  } catch (error) {
    console.error('Error al eliminar mensaje:', error)
    return NextResponse.json(
      { error: 'Error al eliminar mensaje' },
      { status: 500 }
    )
  }
}
