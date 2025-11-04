/**
 * API Route: Publicaciones
 * GET /api/publications - Listar publicaciones
 * POST /api/publications - Crear publicación
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createPublicationSchema } from '@/lib/validations'

// GET - Listar publicaciones
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status')
    const tagId = searchParams.get('tagId')
    const search = searchParams.get('search')
    
    const skip = (page - 1) * limit
    const where: any = {}
    
    if (status) {
      where.status = status
    }
    
    if (tagId) {
      where.tags = {
        some: { tagId: parseInt(tagId) },
      }
    }
    
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
        { content: { contains: search } },
      ]
    }
    
    const [publications, total] = await Promise.all([
      prisma.publication.findMany({
        where,
        include: {
          author: {
            select: {
              id: true,
              fullName: true,
              username: true,
            },
          },
          tags: {
            include: {
              tag: true,
            },
          },
          _count: {
            select: { 
              comments: true,
              visits: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.publication.count({ where }),
    ])
    
    return NextResponse.json({
      publications,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error al obtener publicaciones:', error)
    return NextResponse.json(
      { error: 'Error al obtener publicaciones' },
      { status: 500 }
    )
  }
}

// POST - Crear publicación
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
    const validatedData = createPublicationSchema.parse(body)
    
    // Crear publicación con tags
    const publication = await prisma.publication.create({
      data: {
        title: validatedData.title,
        slug: validatedData.slug,
        description: validatedData.description,
        content: validatedData.content,
        mainImage: validatedData.mainImage,
        status: validatedData.status || 'borrador',
        authorId: parseInt(userId),
        tags: {
          create: validatedData.tagIds?.map((tagId: number) => ({
            tag: { connect: { id: tagId } },
          })),
        },
      },
      include: {
        author: {
          select: {
            id: true,
            fullName: true,
            username: true,
          },
        },
        tags: {
          include: { tag: true },
        },
      },
    })
    
    return NextResponse.json(publication, { status: 201 })
  } catch (error) {
    console.error('Error al crear publicación:', error)
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Datos inválidos' },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Error al crear publicación' },
      { status: 500 }
    )
  }
}
