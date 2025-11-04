/**
 * API Route: Galería - Item individual
 * DELETE /api/gallery/[id] - Eliminar imagen (requiere auth)
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

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
    
    const id = parseInt(params.id)
    
    await prisma.galleryImage.delete({
      where: { id }
    })
    
    return NextResponse.json({ message: 'Imagen eliminada' })
  } catch (error) {
    console.error('Error al eliminar imagen:', error)
    return NextResponse.json(
      { error: 'Error al eliminar imagen' },
      { status: 500 }
    )
  }
}
