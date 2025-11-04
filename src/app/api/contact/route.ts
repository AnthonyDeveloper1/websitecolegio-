/**
 * API Route: Mensajes de contacto
 * GET /api/contact - Listar mensajes (requiere auth)
 * POST /api/contact - Crear mensaje (público)
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { contactMessageSchema } from '@/lib/validations'
import { sendContactNotification, sendContactConfirmation } from '@/lib/email'

// GET - Listar mensajes
export async function GET(request: NextRequest) {
  try {
    const userRole = request.headers.get('x-user-role')
    
    if (userRole !== 'Administrador' && userRole !== 'Super Administrador' && userRole !== 'Editor') {
      return NextResponse.json(
        { error: 'Sin permisos' },
        { status: 403 }
      )
    }
    
    const { searchParams } = new URL(request.url)
    const isReplied = searchParams.get('isReplied')
    
    const where: any = {}
    
    if (isReplied !== null) {
      where.isReplied = isReplied === 'true'
    }
    
    const messages = await prisma.contactMessage.findMany({
      where,
      include: {
        subject: true,
      },
      orderBy: { sentAt: 'desc' },
    })
    
    return NextResponse.json(messages)
  } catch (error) {
    console.error('Error al obtener mensajes:', error)
    return NextResponse.json(
      { error: 'Error al obtener mensajes' },
      { status: 500 }
    )
  }
}

// POST - Crear mensaje
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = contactMessageSchema.parse(body)
    
    const message = await prisma.contactMessage.create({
      data: validatedData,
      include: {
        subject: true,
      },
    })
    
    // Obtener correos de destino activos
    const destinationEmails = await prisma.destinationEmail.findMany({
      where: { isActive: true },
    })
    
    // Enviar confirmación al usuario
    sendContactConfirmation(message.email, message.name).catch(err =>
      console.error('Error al enviar confirmación:', err)
    )
    
    // Enviar notificación a cada correo de destino activo
    if (destinationEmails.length > 0) {
  const emailAddresses = destinationEmails.map((e: { email: string }) => e.email)
      
      sendContactNotification({
        name: message.name,
        email: message.email,
        subject: message.subject?.name || 'Sin asunto',
        message: message.message,
      }, emailAddresses).catch(err =>
        console.error('Error al enviar notificación:', err)
      )
    } else {
      console.warn('⚠️ No hay correos de destino activos configurados')
    }
    
    return NextResponse.json(message, { status: 201 })
  } catch (error) {
    console.error('Error al crear mensaje:', error)
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Datos inválidos' },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Error al crear mensaje' },
      { status: 500 }
    )
  }
}
