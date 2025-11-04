/**
 * API Route: Directivos
 * GET /api/directors - Listar directivos
 * POST /api/directors - Crear directivo (requiere auth)
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createDirectorSchema } from '@/lib/validations'

// GET - Listar directivos
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    
    const where: any = {}
    
    if (status) {
      where.status = status
    }
    
    const directors = await prisma.director.findMany({
      where,
      orderBy: { registeredAt: 'desc' },
    })
    
    return NextResponse.json({ directors })
  } catch (error) {
    console.error('Error al obtener directivos:', error)
    return NextResponse.json(
      { error: 'Error al obtener directivos' },
      { status: 500 }
    )
  }
}

// POST - Crear directivo
export async function POST(request: NextRequest) {
  try {
    const userRole = request.headers.get('x-user-role')
    
    if (userRole !== 'Administrador' && userRole !== 'Super Administrador') {
      return NextResponse.json(
        { error: 'Sin permisos' },
        { status: 403 }
      )
    }
    
    const body = await request.json()
    const validatedData = createDirectorSchema.parse(body)
    
    const director = await prisma.director.create({
      data: validatedData,
    })
    
    return NextResponse.json(director, { status: 201 })
  } catch (error) {
    console.error('Error al crear directivo:', error)
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Datos inválidos' },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Error al crear directivo' },
      { status: 500 }
    )
  }
}
