/**
 * API Route: Galería
 * GET /api/gallery - Listar imágenes de galería
 * POST /api/gallery - Subir imagen a galería (requiere auth)
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Listar imágenes
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') // imagen | video
    
    const where: any = {}
    if (type) {
      where.type = type
    }
    
    const images = await prisma.galleryImage.findMany({
      where,
      include: {
        author: {
          select: {
            id: true,
            fullName: true,
            username: true
          }
        }
      },
      orderBy: { uploadedAt: 'desc' }
    })
    
    return NextResponse.json(images)
  } catch (error) {
    console.error('Error al obtener galería:', error)
    return NextResponse.json(
      { error: 'Error al obtener galería' },
      { status: 500 }
    )
  }
}

// POST - Subir imagen
export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id')
    const userRole = request.headers.get('x-user-role')
    
    if (!userId || (userRole !== 'Administrador' && userRole !== 'Super Administrador' && userRole !== 'Editor')) {
      return NextResponse.json(
        { error: 'Sin permisos' },
        { status: 403 }
      )
    }
    
    const body = await request.json()
    
    const image = await prisma.galleryImage.create({
      data: {
        ...body,
        authorId: parseInt(userId)
      },
      include: {
        author: {
          select: {
            id: true,
            fullName: true,
            username: true
          }
        }
      }
    })
    
    return NextResponse.json(image, { status: 201 })
  } catch (error) {
    console.error('Error al subir imagen:', error)
    return NextResponse.json(
      { error: 'Error al subir imagen' },
      { status: 500 }
    )
  }
}
