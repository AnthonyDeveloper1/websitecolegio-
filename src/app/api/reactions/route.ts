/**
 * API Route: Reacciones
 * POST /api/reactions - Crear reacción
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const { commentId, type } = body
    
    if (!commentId || !type) {
      return NextResponse.json(
        { error: 'commentId y type requeridos' },
        { status: 400 }
      )
    }
    
    if (!['me_gusta', 'no_me_gusta'].includes(type)) {
      return NextResponse.json(
        { error: 'Tipo de reacción inválido' },
        { status: 400 }
      )
    }
    
    const reaction = await prisma.reaction.create({
      data: {
        commentId: parseInt(commentId),
        reactionType: type,
      },
    })
    
    return NextResponse.json(reaction, { status: 201 })
  } catch (error) {
    console.error('Error al crear reacción:', error)
    return NextResponse.json(
      { error: 'Error al crear reacción' },
      { status: 500 }
    )
  }
}
