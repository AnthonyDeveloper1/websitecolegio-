/**
 * API Route: Directivo por ID
 * GET /api/directors/[id] - Obtener directivo
 * PUT /api/directors/[id] - Actualizar directivo
 * DELETE /api/directors/[id] - Eliminar directivo
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { updateDirectorSchema } from '@/lib/validations'

// GET
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const director = await prisma.director.findUnique({
      where: { id: parseInt(params.id) },
    })
    
    if (!director) {
      return NextResponse.json(
        { error: 'Directivo no encontrado' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(director)
  } catch (error) {
    console.error('Error al obtener directivo:', error)
    return NextResponse.json(
      { error: 'Error al obtener directivo' },
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
    const userRole = request.headers.get('x-user-role')
    
    if (userRole !== 'Administrador' && userRole !== 'Super Administrador') {
      return NextResponse.json(
        { error: 'Sin permisos' },
        { status: 403 }
      )
    }
    
    const body = await request.json()
    const validatedData = updateDirectorSchema.parse(body)
    
    const director = await prisma.director.update({
      where: { id: parseInt(params.id) },
      data: validatedData,
    })
    
    return NextResponse.json(director)
  } catch (error) {
    console.error('Error al actualizar directivo:', error)
    return NextResponse.json(
      { error: 'Error al actualizar directivo' },
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
    
    await prisma.director.delete({
      where: { id: parseInt(params.id) },
    })
    
    return NextResponse.json({ message: 'Directivo eliminado' })
  } catch (error) {
    console.error('Error al eliminar directivo:', error)
    return NextResponse.json(
      { error: 'Error al eliminar directivo' },
      { status: 500 }
    )
  }
}
