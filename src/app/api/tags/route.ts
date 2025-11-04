/**
 * API Route: Tags/Etiquetas
 * GET /api/tags - Listar tags
 * POST /api/tags - Crear tag (requiere auth)
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createTagSchema } from '@/lib/validations'

// GET - Listar tags
export async function GET() {
  try {
    const tags = await prisma.tag.findMany({
      include: {
        _count: {
          select: { publications: true },
        },
      },
      orderBy: { name: 'asc' },
    })
    
    return NextResponse.json({ tags })
  } catch (error) {
    console.error('Error al obtener tags:', error)
    return NextResponse.json(
      { error: 'Error al obtener tags' },
      { status: 500 }
    )
  }
}

// POST - Crear tag
export async function POST(request: NextRequest) {
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
    
    const tag = await prisma.tag.create({
      data: validatedData,
    })
    
    return NextResponse.json(tag, { status: 201 })
  } catch (error) {
    console.error('Error al crear tag:', error)
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Datos inválidos' },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Error al crear tag' },
      { status: 500 }
    )
  }
}
