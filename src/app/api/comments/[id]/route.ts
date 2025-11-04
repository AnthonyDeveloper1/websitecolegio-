/**
 * API Route: Comentario por ID
 * PUT /api/comments/[id] - Aprobar/Actualizar comentario
 * DELETE /api/comments/[id] - Eliminar comentario
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// PUT - Aprobar o editar comentario
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
    
    const comment = await prisma.comment.update({
      where: { id: parseInt(params.id) },
      data: {
        isApproved: body.isApproved ?? undefined,
        message: body.content ?? undefined,
      },
    })
    
    return NextResponse.json(comment)
  } catch (error) {
    console.error('Error al actualizar comentario:', error)
    return NextResponse.json(
      { error: 'Error al actualizar comentario' },
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
    
    await prisma.comment.delete({
      where: { id: parseInt(params.id) },
    })
    
    return NextResponse.json({ message: 'Comentario eliminado' })
  } catch (error) {
    console.error('Error al eliminar comentario:', error)
    return NextResponse.json(
      { error: 'Error al eliminar comentario' },
      { status: 500 }
    )
  }
}
