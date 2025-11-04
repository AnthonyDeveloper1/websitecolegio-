/**
 * API Route: Comentarios
 * GET /api/comments - Listar comentarios
 * POST /api/comments - Crear comentario
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createCommentSchema } from '@/lib/validations'

// GET - Listar comentarios
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const publicationId = searchParams.get('publicationId')
    const isApproved = searchParams.get('isApproved')
    
    const where: any = {}
    
    if (publicationId) {
      where.publicationId = parseInt(publicationId)
    }
    
    if (isApproved !== null) {
      where.isApproved = isApproved === 'true'
    }
    
    const comments = await prisma.comment.findMany({
      where,
      include: {
        publication: {
          select: {
            id: true,
            title: true,
          },
        },
        reactions: true,
      },
      orderBy: { createdAt: 'desc' },
    })
    
    return NextResponse.json({ comments })
  } catch (error) {
    console.error('Error al obtener comentarios:', error)
    return NextResponse.json(
      { error: 'Error al obtener comentarios' },
      { status: 500 }
    )
  }
}

// POST - Crear comentario
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createCommentSchema.parse(body)
    
    const comment = await prisma.comment.create({
      data: {
        message: validatedData.content,
        publicationId: validatedData.publicationId,
        name: validatedData.name,
        isApproved: false, // Requiere aprobación
      },
    })
    
    return NextResponse.json(comment, { status: 201 })
  } catch (error) {
    console.error('Error al crear comentario:', error)
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Datos inválidos' },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Error al crear comentario' },
      { status: 500 }
    )
  }
}
