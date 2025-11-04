/**
 * API Route: Asuntos de contacto
 * GET /api/contact-subjects - Listar asuntos
 * POST /api/contact-subjects - Crear asunto (admin)
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Listar asuntos
export async function GET() {
  try {
    const subjects = await prisma.contactSubject.findMany({
      orderBy: { name: 'asc' },
    })
    
    return NextResponse.json({ subjects })
  } catch (error) {
    console.error('Error al obtener asuntos:', error)
    return NextResponse.json(
      { error: 'Error al obtener asuntos' },
      { status: 500 }
    )
  }
}

// POST - Crear asunto
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
    
    const subject = await prisma.contactSubject.create({
      data: {
        name: body.name,
        description: body.description,
      },
    })
    
    return NextResponse.json(subject, { status: 201 })
  } catch (error) {
    console.error('Error al crear asunto:', error)
    return NextResponse.json(
      { error: 'Error al crear asunto' },
      { status: 500 }
    )
  }
}
