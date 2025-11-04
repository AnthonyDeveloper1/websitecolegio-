/**
 * API Route: Tag por ID
 * GET /api/tags/[id] - Obtener tag
 * PUT /api/tags/[id] - Actualizar tag
 * DELETE /api/tags/[id] - Eliminar tag
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createTagSchema } from '@/lib/validations'

// GET
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const tag = await prisma.tag.findUnique({
      where: { id: parseInt(params.id) },
      include: {
        _count: {
          select: { publications: true },
        },
      },
    })
    
    if (!tag) {
      return NextResponse.json(
        { error: 'Tag no encontrado' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(tag)
  } catch (error) {
    console.error('Error al obtener tag:', error)
    return NextResponse.json(
      { error: 'Error al obtener tag' },
      { status: 500 }
    )
  }
}

// PUT
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = request.headers.get('x-user-id')
    
    if (!userId) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }
    
    const body = await request.json()
    const validatedData = createTagSchema.parse(body)
    
    const tag = await prisma.tag.update({
      where: { id: parseInt(params.id) },
      data: validatedData,
    })
    
    return NextResponse.json(tag)
  } catch (error) {
    console.error('Error al actualizar tag:', error)
    return NextResponse.json(
      { error: 'Error al actualizar tag' },
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
    const userId = request.headers.get('x-user-id')
    const userRole = request.headers.get('x-user-role')
    
    if (!userId || (userRole !== 'Administrador' && userRole !== 'Super Administrador')) {
      return NextResponse.json(
        { error: 'Sin permisos' },
        { status: 403 }
      )
    }
    
    await prisma.tag.delete({
      where: { id: parseInt(params.id) },
    })
    
    return NextResponse.json({ message: 'Tag eliminado' })
  } catch (error) {
    console.error('Error al eliminar tag:', error)
    return NextResponse.json(
      { error: 'Error al eliminar tag' },
      { status: 500 }
    )
  }
}
