/**
 * API Route: Roles
 * GET /api/roles - Listar roles
 */

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const roles = await prisma.role.findMany({
      include: {
        _count: {
          select: { users: true },
        },
      },
      orderBy: { name: 'asc' },
    })
    
    return NextResponse.json({ roles })
  } catch (error) {
    console.error('Error al obtener roles:', error)
    return NextResponse.json(
      { error: 'Error al obtener roles' },
      { status: 500 }
    )
  }
}
